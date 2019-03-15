import { Component, ElementRef, HostBinding, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DfModalService } from '@devfactory/ngx-df';
import { format, isFuture } from 'date-fns';
import { finalize } from 'rxjs/operators';

import { SHORTDAYS } from 'app/core/constants/period';
import { ALL_MANAGERS_ID } from 'app/core/constants/team-selector';
import { CurrentUserDetail } from 'app/core/models/identity';
import { Manager } from 'app/core/models/manager';
import { TrackingTimesheet } from 'app/core/models/time-tracking';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { TimesheetFilters, TimetrackingService } from 'app/core/services/timetracking/timetracking.service';
import { isApiError } from 'app/core/type-guards/is-api-error';
import { UserDashboardService } from 'app/shared/services/user-dashboard/user-dashboard.service';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss'],
})
export class TimesheetComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';
  public readonly days = SHORTDAYS;
  public readonly forbiddenStatus = 403;
  public currentDate = new Date();
  public teamId: number | null;
  public managerId: number | null;
  public teamTimesheet: TrackingTimesheet[] = [];
  public loadState = {
    component: false,
    model: false,
  };

  public currentUserDetail: CurrentUserDetail;

  public teamName: string;
  public error: string | null = null;
  public isTimeSheetAvailable = true;

  public preselectedTab: string;

  public currentContractor: CurrentUserDetail;
  public currentUserAssignmentId: number;
  public currentUserManager: Manager;
  public currentUserTeamId: number;

  @ViewChild('profileModal') profileModal: TemplateRef<{}>;

  constructor(
    private timetrackingService: TimetrackingService,
    private identityService: IdentityService,
    private assignmentService: AssignmentService,
    private dashboardService: UserDashboardService,
    private modalService: DfModalService
  ) { }

  public ngOnInit(): void {
    this.loadState.component = true;
    this.getTeamAndMangerSelection();
  }

  public getTeamAndMangerSelection(): void {
    this.identityService.getTeamManagerGroupSelection()
    .subscribe((teamManagerGroupSelection) => {
      this.isTimeSheetAvailable = true;
      this.error = null;
      this.teamTimesheet = [];
      this.loadState.component = true;
      this.teamId = teamManagerGroupSelection ? teamManagerGroupSelection.team.id : null;
      this.managerId = teamManagerGroupSelection ? teamManagerGroupSelection.managerId as number : null;
      this.getTeamDashboard();
    }, () => this.error = 'Error loading selected team and manager.');
  }

  public getTeamDashboard(): void {
    const directOnly = false;
    const managerId = this.managerId as number;
    const teamId = this.teamId as number;
    this.dashboardService.getTeamDashboard(directOnly, managerId, teamId)
      .subscribe(teamDashboard => {
        this.teamName = teamDashboard.teams[0].name as string;
        this.getTeamTimesheet();
      },
        error => {
          if (isApiError(error)) {
            this.isTimeSheetAvailable = error.error.httpStatus === this.forbiddenStatus ? false : true;
            this.error = error.error.httpStatus === this.forbiddenStatus ?
              'Time Sheet is not available for this team, please change team from team selector' : error.error.text;
          } else {
            this.error = 'Error fetching timesheet.';
          }
        });
  }

  public getTeamTimesheet(): void {
    this.teamTimesheet = [];
    const WEEKLY_PERIOD = 'WEEK';
    this.loadState.component = true;
    this.error = null;
    const params: TimesheetFilters = {};

    params.date = format(this.currentDate, 'YYYY-MM-DD');
    params.period = WEEKLY_PERIOD;
    params.managerId = this.managerId as number;
    params.teamId = this.teamId as number;
    params.fullTeam = this.managerId === ALL_MANAGERS_ID;

    this.timetrackingService.getTeamsTimesheet(params)
      .pipe(finalize(() => this.loadState.component = false))
      .subscribe(timeSheets =>
        this.teamTimesheet = timeSheets.sort((currentTimeSheet, nextTimeSheet) => currentTimeSheet.name.localeCompare(nextTimeSheet.name))
        , error => {
          if (isApiError(error)) {
            this.error = error.error.text;
          } else {
            this.error = 'Error fetching timesheet.';
          }
        });
  }

  public onDateChange(date: Date): void {
    this.currentDate = date;
    this.getTeamTimesheet();
  }

  public showContractorModal(item: TrackingTimesheet, template: ElementRef, tab: string): void {
    this.loadState.model = true;
    this.currentUserAssignmentId = item.assignmentId;

    this.preselectedTab = tab;
    this.modalService.open(template, { customClass: 'x-large-modal' });
    this.assignmentService.getContractorAssignment(item.assignmentId)
      .pipe(finalize(() => this.loadState.model = false))
      .subscribe(assignment => {
        this.currentUserManager = Object.assign(assignment.manager);
        this.currentUserTeamId = assignment.team.id;
        this.currentContractor = assignment.candidate as CurrentUserDetail;
      }, error => {
        if (isApiError(error)) {
          this.error = error.error.text;
        } else {
          this.error = 'Error fetching contractor assignment.';
        }
      });
  }

  public getHoursClassification(hours: number): string {
    const classifications = [
      { condition: () => hours >= 6, value: 'above-average' },
      { condition: () => hours >= 4, value: 'matches-average' },
      { condition: () => true, value: 'below-average' },
    ];
    return classifications.filter(entry => entry.condition())[0].value;
  }

  public isFutureDate(date: Date): boolean {
    return isFuture(date);
  }

  public getTooltipText(lastDay: Date): string {
    return `The person left the team on ${format(lastDay, 'MMM D, YYYY')}`;
  }
}
