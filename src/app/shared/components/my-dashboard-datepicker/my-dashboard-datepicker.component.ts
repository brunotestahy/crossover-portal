import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { addDays, addWeeks, endOfWeek, format, startOfDay, startOfWeek, subDays, subWeeks  } from 'date-fns';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-my-dashboard-datepicker',
  templateUrl: './my-dashboard-datepicker.component.html',
  styleUrls: ['./my-dashboard-datepicker.component.scss'],
})
export class MyDashboardDatepickerComponent implements OnInit, OnDestroy {
  private readonly DAILY = 'daily';
  private readonly WEEK = 'week';
  private destroy$ = new Subject();

  @Input()
  public view: 'daily' | 'week' = 'daily';

  @Input()
  public date: Date;

  @Output()
  public update = new EventEmitter<string>();

  public dateControl = new FormControl();
  public today = new Date();
  public startOfThisWeek: Date;
  public endOfThisWeek: Date;

  constructor() { }

  public ngOnInit(): void {
    // weekStartsOn stand for the index of the first day of the week (0 - Sunday)
    this.startOfThisWeek = startOfWeek(this.today, { weekStartsOn: 1 });
    this.endOfThisWeek = endOfWeek(this.today, { weekStartsOn: 1 });
    this.dateControl.patchValue(this.date);
    this.dateControl.valueChanges.pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(
      () => this.update.emit(this.dateControl.value)
    );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public next(): void {
    if (this.view === this.DAILY) {
      this.dateControl.setValue(addDays(this.dateControl.value, 1));
    } else {
      this.dateControl.setValue(addWeeks(this.dateControl.value, 1));
    }
  }

  public previous(): void {
    if (this.view === this.DAILY) {
      this.dateControl.setValue(subDays(this.dateControl.value, 1));
    } else {
      this.dateControl.setValue(subWeeks(this.dateControl.value, 1));
    }
  }

  public setDate(date: Date): void {
    this.dateControl.setValue(date);
  }

  public showNext(): boolean {
    let isNext = false;
    if (this.view === this.DAILY) {
      isNext = startOfDay(this.dateControl.value) < startOfDay(this.today);
    } else if (this.view === this.WEEK) {
      isNext = this.dateControl.value < this.startOfThisWeek;
    }
    return isNext;
  }

  public dateFormatFn = (date: Date): string => {
    let dateFormat = format(date, 'MMM DD, YYYY');
    if (this.view === this.WEEK) {
      const start = addDays(startOfWeek(date), 1);
      const end = addDays(endOfWeek(date), 1);
      dateFormat = `${format(start, 'MMM DD')} - ${format(end, 'MMM DD, YYYY')}`;
    }
    return dateFormat;
  }

}
