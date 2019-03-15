import { Component, Input, OnInit } from '@angular/core';
import { format } from 'date-fns';

import { CurrentUserDetail } from 'app/core/models/identity';
import { ProductivityGroup } from 'app/core/models/productivity';
import { TrackingTimesheet } from 'app/core/models/time-tracking';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import { TimetrackingService } from 'app/core/services/timetracking/timetracking.service';
import { UserDashboardService } from 'app/shared/services/user-dashboard/user-dashboard.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-my-summary-page',
  templateUrl: './my-summary-page.component.html',
  styleUrls: ['./my-summary-page.component.scss'],
})
export class MySummaryPageComponent implements OnInit {
  @Input()
  public assignmentId: number;

  @Input()
  public managerId: number;

  @Input()
  public teamId: number;

  @Input()
  public userId: number;

  @Input()
  public userDetail: CurrentUserDetail;

  public productivityGroups: ProductivityGroup[];
  public weeklyTimesheets: TrackingTimesheet[];
  public isTopActivitiesLoading: boolean = true;
  public isTimeLoggedLoading: boolean = true;

  public error: string | null = null;

  constructor(
    private dashboardService: UserDashboardService,
    private productivityService: ProductivityService,
    private timetrackingService: TimetrackingService
  ) { }

  public ngOnInit(): void {
    this.dashboardService.getDateStream().subscribe(date => {
      this.isTopActivitiesLoading = true;
      this.isTimeLoggedLoading = true;
      this.getData(date);
    });
  }

  public getData(date: Date): void {
    this.getWeeklyTimesheets(date);
    this.getGroupedAssignments(date);
  }

  private getGroupedAssignments(date: Date): void {
    this.productivityService.getProductivityGroups({
      assignmentId: this.assignmentId.toString(),
      date: format(date, 'YYYY-MM-DD'),
      weekly: 'true',
    })
      .pipe(finalize(() => this.isTopActivitiesLoading = false))
      .subscribe(productivityGroups => {
        this.productivityGroups = productivityGroups;
      }, () => this.error = 'Error loading group assignments.');
  }

  private getWeeklyTimesheets(date: Date): void {
    this.timetrackingService.getTimesheets({
      teamId: this.teamId,
      managerId: this.managerId,
      userId: this.userId,
      date: format(date, 'YYYY-MM-DD'),
      period: 'WEEK',
    })
      .subscribe(timesheets => {
        this.weeklyTimesheets = this.handleWeeklyTimesheets(timesheets, date);
        this.isTimeLoggedLoading = false;
      });
  }

  private handleWeeklyTimesheets(timesheets: TrackingTimesheet[], date: Date): TrackingTimesheet[] {
    const loggedTime = Math.round(timesheets[0].totalHours * 60);
    timesheets[0].printableTime = Math.floor(loggedTime / 60) + ' hours ';
    const minutes = loggedTime % 60;
    if (minutes > 0) {
      timesheets[0].printableTime += minutes + ' minutes';
    }
    timesheets[0].weekStartDate = date;
    return timesheets;
  }
}
