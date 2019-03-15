import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InterviewDetailsResponse } from 'app/core/models/interview';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-schedule-interview',
  templateUrl: './schedule-interview.component.html',
  styleUrls: ['./schedule-interview.component.scss'],
})
export class ScheduleInterviewComponent {
  public selectedSlot: {};
  public error: string | null = null;
  public pendingReschedule = false;
  public rescheduleEnabled = false;
  public interview: InterviewDetailsResponse;
  public isLoading = false;

  public viewDate: Date = new Date();
  public events = [];
  public slots = [];

  public hoursDiff = 0;

  public interviewForm: FormGroup;
  public rescheduleForm: FormGroup;

  public interviewSlots: Date[];
  public selectedDay: Date | null = null;
  public selectedDaySlots: Date[] = [];

  public yourTime$: Observable<Date>;
  public managerTime$: Observable<Date>;

  public readonly today = new Date();
}
