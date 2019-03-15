import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { addHours, addMinutes, addMonths, endOfMonth, isSameDay, parse, startOfWeek } from 'date-fns';
import { interval } from 'rxjs/observable/interval';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { InterviewDetailsResponse } from 'app/core/models/interview';
import { Timezone } from 'app/core/models/timezone';
import { InterviewService } from 'app/core/services/interview/interview.service';
import { isApiError } from 'app/core/type-guards/is-api-error';

@Component({
  selector: 'app-accept-interview',
  templateUrl: './accept-interview.component.html',
  styleUrls: ['./accept-interview.component.scss'],
})
export class AcceptInterviewComponent implements OnInit {
  private readonly today = new Date();

  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  @ViewChild('reschedule', { read: ElementRef })
  public rescheduleElement: ElementRef;

  public selectedSlot: string | null;
  public error: string | null = null;
  public pendingReschedule = false;
  public rescheduleEnabled = false;
  public interview: InterviewDetailsResponse;
  public isLoading = false;

  public viewDate: Date = new Date();
  public events = [] as {}[];
  public slots = [] as {}[];

  public hoursDiff: number;

  public rescheduleForm: FormGroup;

  public interviewSlots: Date[];
  public selectedDay: Date | null = null;
  public selectedDaySlots: Date[] = [];

  public yourTime$: Observable<Date>;
  public managerTime$: Observable<Date>;



  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private interviewService: InterviewService
  ) { }

  public ngOnInit(): void {
    this.setupCalendarInitialMonth();
    this.rescheduleForm = new FormGroup({
      message: new FormControl(null, Validators.required),
    });
    this.isLoading = true;
    this.activatedRoute.params.pipe(
      tap(() => this.isLoading = true),
      map(params => params.id),
      finalize(() => this.isLoading = false),
      switchMap((interviewId: number) =>
        this.interviewService.getInterviewDetails(interviewId)
      )
    ).subscribe(interview => {
      this.interview = interview;
      this.getHourDiff();
      this.getInteviewSlot();
      const intervieweeTimeZone = this.interview.interviewee.location.timeZone as Timezone;
      const managerTimeZone = this.interview.selection.manager.location.timeZone as Timezone;
      const deltaMiliseconds = intervieweeTimeZone.offset - managerTimeZone.offset;
      this.yourTime$ = interval(1000).pipe(map(() => new Date()));
      this.managerTime$ = this.yourTime$.pipe(
        map((date: Date) => addHours(date, deltaMiliseconds / 3600000))
      );
    }, (error) => {
      if (isApiError(error)) {
        this.error = error.error.text;
      } else {
        this.error = 'Error fetching interview detail.';
      }
    });
  }

  public selectSlot(slot: string): void {
    this.selectedSlot = slot;
  }

  public onDayClicked(day: Date): void {
    /* istanbul ignore else */
    if (this.isDateAvailable(day)) {
      this.selectedSlot = null;
      this.selectedDay = day;
      this.selectedDaySlots = this.interviewSlots.filter(slot =>
        isSameDay(day, slot)
      );
    }
  }

  public isDateAvailable(day: Date): boolean {
    return !!this.interviewSlots.find(slot => {
      const date = parse(slot);
      return isSameDay(date, day);
    });
  }

  public isDateSelected(day: Date): boolean | null {
    if (this.isDateAvailable(day)) {
      return this.selectedDay && isSameDay(day, this.selectedDay);
    } else {
      return false;
    }
  }

  public isSameMonth(): boolean {
    return this.viewDate.getMonth() === this.today.getMonth();
  }

  public enableReschedule(): void {
    this.rescheduleEnabled = true;
    this.rescheduleElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  public disableReschedule(): void {
    this.rescheduleEnabled = false;
  }

  public saveInterviewSchedule(): void {
    this.isLoading = true;
    this.interviewService
      .saveInterviewSchedule(this.selectedSlot as string, this.interview)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe(
        () => this.router.navigateByUrl('candidate/dashboard/hiring'),
        (error) => {
          if (isApiError(error)) {
            this.error = error.error.text;
          } else {
            this.error = 'Error scheduling interview.';
          }
        });
  }

  public submitReschedule(): void {
    /* istanbul ignore else */
    if (this.rescheduleForm.valid && !this.pendingReschedule) {
      this.pendingReschedule = true;
      this.error = null;
      this.interviewService.submitReschedule(
        this.rescheduleForm.value,
        this.interview
      )
      .pipe(
        finalize(() => this.pendingReschedule = false)
      )
      .subscribe(
        () => this.router.navigateByUrl('candidate/dashboard/hiring'),
        error => {
          if (isApiError(error)) {
            this.error = error.error.text;
          } else {
            this.error = 'Error rescheduling interview.';
          }
        }
        );
    }
  }

  public nextMonth(): void {
    this.viewDate = addMonths(this.viewDate, 1);
  }

  public prevMonth(): void {
    this.viewDate = addMonths(this.viewDate, -1);
  }

  private getHourDiff(): void {
    const intervieweeTimeZone = this.interview.interviewee.location.timeZone as Timezone;
    const managerTimeZone = this.interview.selection.manager.location.timeZone as Timezone;
    const deltaMiliseconds = intervieweeTimeZone.offset - managerTimeZone.offset;
    this.hoursDiff = deltaMiliseconds / 3600000;
  }

  private getInteviewSlot(): void {
    this.interviewSlots = [];
    this.interview.interviewSlots.forEach(s => {
      const start = parse(s.startDateTime);
      const end = parse(s.endDateTime);
      let currentDate = start;
      while (currentDate < end) {
        // check if manager is busy
        /* istanbul ignore else */
        if (!this.isManagerBusy(s.startDateTime)) {
          this.interviewSlots.push(currentDate);
        }
        currentDate = addMinutes(currentDate, this.interview.durationInMinutes);
      }
    });
    // sort interview slots
    this.interviewSlots.sort((a, b) => {
      if (a < b) {
        return -1;
      }
      /* istanbul ignore else */
      if (a > b) {
        return 1;
      }
      return 0;
    });
    // select first interview date
    this.onDayClicked(this.interviewSlots[0]);
  }

  private isManagerBusy(slot: string): boolean {
    let isBusy = false;
    this.interview.managerBusySlots.forEach(m => {
      if (m.startDateTime !== slot) {
        isBusy = false;
      } else {
        isBusy = true;
      }
    });
    return isBusy;
  }

  /**
   * Checks if we can start the calendar in the next month to avoid too many past dates being displayed
   */
  private setupCalendarInitialMonth(): void {
    const lastDayOfMonth = endOfMonth(this.today).getDate();
    const firstDayOfWeek = startOfWeek(this.today).getDate();
    /* istanbul ignore else */
    if ((lastDayOfMonth - firstDayOfWeek) < 6) {
      this.viewDate = addMonths(this.today, 1);
    }
  }
}
