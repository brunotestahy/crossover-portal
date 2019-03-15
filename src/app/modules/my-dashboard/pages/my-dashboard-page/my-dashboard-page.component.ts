import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DfGroupToggleItem } from '@devfactory/ngx-df';
import { addDays, addWeeks, endOfWeek, format, startOfToday, startOfWeek, subDays, subWeeks } from 'date-fns';
import 'rxjs/add/observable/throw';
import { filter, takeUntil } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import * as PERIOD_LABELS from 'app/core/constants/my-dashboard/activity-button-labels';
import * as DASHBOARD_ITEMS from 'app/core/constants/my-dashboard/dashboard-items';
import { Assignment } from 'app/core/models/assignment';
import { CurrentUserDetail } from 'app/core/models/identity';
import { Manager } from 'app/core/models/manager';
import { Team } from 'app/core/models/team';
import { TrackingTimesheet } from 'app/core/models/time-tracking';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { TimetrackingService } from 'app/core/services/timetracking/timetracking.service';
import { UserDashboardService } from 'app/shared/services/user-dashboard/user-dashboard.service';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

@Component({
  selector: 'app-my-dashboard-page',
  templateUrl: './my-dashboard-page.component.html',
  styleUrls: ['./my-dashboard-page.component.scss'],
  providers: [
    UserDashboardService,
  ],
})
export class MyDashboardPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  private endOfThisWeek = endOfWeek(new Date(), { weekStartsOn: 1 });
  private startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });

  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';
  public readonly dashboardItems = DASHBOARD_ITEMS;
  public readonly periodLabels = PERIOD_LABELS;

  @Input()
  public includeProfile = false;

  @Input()
  public userDetail: CurrentUserDetail | null = null;

  @Input()
  public managerControl = false;

  @Input()
  public option = this.dashboardItems.SUMMARY;

  @Input()
  public assignmentId: number | null = null;

  @Input()
  public teamId: number | null = null;

  @Input()
  public manager: Manager | null = null;

  @Output()
  public close = new EventEmitter<void>();

  public userId: number;
  public assignment: Assignment | null = null;
  public timesheets: TrackingTimesheet[];
  public error: string | null = null;
  public isLoading = true;
  public items = [
    this.dashboardItems.SUMMARY,
    this.dashboardItems.ACTIVITY,
    this.dashboardItems.LOGBOOK,
    this.dashboardItems.METRIC,
  ];
  public dateControl = new FormControl(this.startOfThisWeek);
  public period = this.periodLabels.WEEKLY;
  public today = startOfToday();

  constructor(
    private assignmentService: AssignmentService,
    private identityService: IdentityService,
    private dashboardService: UserDashboardService,
    private timetrackingService: TimetrackingService
  ) { }

  public ngOnInit(): void {
    this.dashboardService.isTimesheetsUpdated()
      .pipe(filter(update => update === true))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getAssignment());
    this.dashboardService.updateDate(this.dateControl.value);

    this.dashboardService.getActivityPeriod()
      .pipe(takeUntil(this.destroy$))
      .subscribe((period) => this.period = period);

    this.dateControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(date => {
        this.dashboardService.updateDate(date);
      });

    if (!this.managerControl) {
      this.identityService
        .getCurrentUserDetail()
        .pipe(takeUntil(this.destroy$))
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(userDetail => {
          this.userDetail = userDetail;
          this.userId = userDetail.assignment.selection.marketplaceMember.application.candidate.id as number;
          this.manager = userDetail.assignment.manager;
          if (!this.manager) {
            this.manager = userDetail.assignment.manager;
          }
          if (!this.teamId) {
            this.teamId = userDetail.assignment.team.id;
          }
          this.getAssignment();
        },
          () => {
            this.error = 'Error loading user detail';
          });
    } else {
      const userDetail = this.userDetail as CurrentUserDetail;
      this.userId = userDetail.id;
      this.getAssignment();
    }
  }

  public onClose(): void {
    this.close.emit();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public weekFormatFn = (date: Date): string => {
    const start = addDays(startOfWeek(date), 1);
    const end = addDays(endOfWeek(date), 1);
    return `${format(start, 'MMM DD')} - ${format(end, 'MMM DD, YYYY')}`;
  }

  public getDailyFormat(date: Date): string {
    return `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  public getItems(): string[] {
    if (this.includeProfile) {
      return this.items.concat(['Profile']);
    } else {
      return this.items;
    }
  }

  public getAssignment(): void {
    if (this.userDetail && this.userDetail.assignment) {
      this.assignmentId = this.userDetail.assignment.id;
    }
    const assignmentId = (this.assignmentId || '').toString();
    this.assignmentService.getAssignmentById(assignmentId)
      .pipe(finalize(() => this.isLoading = false))
      .pipe(takeUntil(this.destroy$))
      .subscribe(assignment => {
        this.assignment = assignment;
        this.getTimesheets();
      }, () => {
        this.error = 'Error loading assignment';
      });

  }

  public getTimesheets(): void {
    if (this.userDetail && this.assignment) {
      const currentAssignment = this.assignment.currentAssignmentHistory;
      const team = currentAssignment.team as Team;
      this.timetrackingService.getTimesheets({
        teamId: team.id,
        managerId: this.assignment.manager.id,
        userId: this.assignment.selection.marketplaceMember.application.candidate.id as number,
        date: format(this.startOfThisWeek, 'YYYY-MM-DD'),
        period: 'MONTH',
      })
        .pipe(finalize(() => this.isLoading = false))
        .pipe(takeUntil(this.destroy$))
        .subscribe(timesheets => {
          this.timesheets = this.addTimeData(timesheets);
        }, () => {
          this.error = 'Error loading timesheets';
        });
    }
  }

  public previousDay(): void {
    this.dateControl.setValue(subDays(this.dateControl.value, 1));
  }

  public nextDay(): void {
    this.dateControl.setValue(addDays(this.dateControl.value, 1));
  }

  public previousWeek(): void {
    this.dateControl.setValue(subWeeks(this.dateControl.value, 1));
  }

  public nextWeek(): void {
    this.dateControl.setValue(addWeeks(this.dateControl.value, 1));
  }

  public onToggleChange(_event: DfGroupToggleItem): void {
    if (this.option !== this.dashboardItems.ACTIVITY) {
      this.period = this.periodLabels.WEEKLY;
    } else {
      this.period = this.periodLabels.DAILY;
    }
  }

  private addTimeData(timesheets: TrackingTimesheet[]): TrackingTimesheet[] {
    timesheets.forEach((timesheet, index) => {
      timesheet.weekStartDate = subWeeks(this.startOfThisWeek, index);
      timesheet.weekEndDate = subWeeks(this.endOfThisWeek, index);
    });
    return timesheets;
  }
}
