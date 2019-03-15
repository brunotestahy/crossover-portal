import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DfModalService, DfModalSize } from '@devfactory/ngx-df';
import { endOfWeek, format, startOfWeek, subWeeks } from 'date-fns';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import * as ReportTypes from 'app/core/constants/reports/report-types';
import { TeamSelectorStrategy } from 'app/core/decorators/team-selector-strategy';
import { ReportsActivityDescription } from 'app/core/models/reports/reports-activity-description.model';
import { Team } from 'app/core/models/team';
import { DisabledSelectorForReportsApp } from 'app/core/models/team-selector-strategy';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { DownloadService } from 'app/core/services/download/download.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { ReportsService } from 'app/core/services/reports/reports.service';
import { ReportsActivityModalComponent } from 'app/modules/contractor/components/reports-activity-modal/reports-activity-modal.component';
import {
  TeamSelectorStrategyService,
} from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';
import { decodeErrorMessage } from 'app/utils/api-utilities';
import { sortBy } from 'app/utils/sorting';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
@TeamSelectorStrategy(DisabledSelectorForReportsApp)
export class ReportsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();

  public availableReports = ReportTypes.insightTypes.map(type => type.name);
  public activities = ReportTypes.activityTypes.map(type => type.name);
  public reportsTypes = ReportTypes;

  public form = new FormBuilder().group({
    type: [ReportTypes.teamReportOrder],
    activity: ['Meetings'],
    date: [subWeeks(startOfWeek(new Date(), { weekStartsOn: 1}), 1)],
    selectedTeams: [[]],
  });

  public activitiesDescription: { [key: string]: ReportsActivityDescription } = {};
  public activeTeams: Team[] = [];
  public isTeamsLoading = false;
  public managerId: number | undefined;
  public error: string | null;

  constructor(
    protected reportsService: ReportsService,
    protected identityService: IdentityService,
    protected assignmentService: AssignmentService,
    protected modalService: DfModalService,
    protected downloadService: DownloadService,
    public teamSelectorStrategyService: TeamSelectorStrategyService
  ) { }

  public ngOnInit(): void {
    const currentUserDetail = this.identityService.getCurrentUserValue();
    this.managerId = _.get(currentUserDetail, `managerAvatar.id`);
    this.getActivitiesDescription();
    this.getTeams();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getActivitiesDescription(): void {
    this.reportsService
      .getActivitiesDescription()
      .subscribe(activitiesDescriptionData => (this.activitiesDescription = activitiesDescriptionData));
  }

  public getTeams(): void {
    if (this.managerId) {
      this.isTeamsLoading = true;
      this.assignmentService.getDashboard(this.managerId, '', false)
        .pipe(finalize(() => this.isTeamsLoading = false))
        .subscribe(dashboardData => {
          const teams = dashboardData.teams;
          teams.sort(sortBy('name'));
          teams.forEach(team => {
            team.activeAssignments = dashboardData.assignments.filter(assignment => assignment.team.id === team.id);
          });
          this.activeTeams = Object.assign(teams.filter(team => team.activeAssignments && team.activeAssignments.length > 0), {});
        });
    } else {
      this.error = 'Reports app is not available for this user';
    }
  }

  public weekFormatFn = (date: Date): string => {
    const start = startOfWeek(date, { weekStartsOn: 1 })
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return `${format(start, 'MMM DD')} - ${format(end, 'MMM DD, YYYY')}`;
  }

  public openActivityInfoModal(activityDescription: ReportsActivityDescription): void {
    this.modalService.open(ReportsActivityModalComponent, {
      data: activityDescription,
      size: DfModalSize.Large,
    });
  }

  public downloadReports(): void {
    this.isTeamsLoading = true;
    this.error = null;
    const weekStart = startOfWeek(this.form.controls['date'].value, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(this.form.controls['date'].value, { weekStartsOn: 1 });
    const startDate = format(weekStart, 'YYYY-MM-DD');
    const endDate = format(weekEnd, 'YYYY-MM-DD');
    const currentActivity = ReportTypes.activityTypes.find(type => type.name === this.form.controls['activity'].value);
    const activityType = _.get(currentActivity, `identifier`, 'MEETING');
    const downloadReportStrategies = [
      {
        condition: () => this.form.controls['type'].value === ReportTypes.individualReportOrder,
        get: () => this.downloadIndividualReport(activityType, startDate),
      },
      {
        condition: () => this.form.controls['type'].value === ReportTypes.teamReportOrder,
        get: () => this.downloadTeamReport(activityType, startDate),
      },
      {
        condition: () => this.form.controls['type'].value === ReportTypes.loggedHoursReportOrder,
        get: () => this.downloadLoggedHoursReport(startDate, endDate),
      }
    ];
    downloadReportStrategies.filter(entry => entry.condition())[0].get();
  }

  private downloadIndividualReport(activityType: string, startDate: string): void {
    this.reportsService.downloadIndividualReport(activityType, startDate)
      .pipe(finalize(() => this.isTeamsLoading = false))
      .subscribe(data => {
        const fileName = `${this.capitalizeFirstLetter(activityType)}_InsightsReport_${startDate}.xls`;
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
        this.downloadService.download(blob, fileName);
      },
      error => this.error = decodeErrorMessage(error, 'Error exporting insights report'));
  }

  private downloadTeamReport(activityType: string, startDate: string): void {
    const teams = this.form.controls['selectedTeams'].value;
    this.reportsService.downloadTeamReport(activityType, startDate, teams)
      .pipe(finalize(() => this.isTeamsLoading = false))
      .subscribe(data => {
        const fileName = `${this.capitalizeFirstLetter(activityType)}_InsightsReport_${startDate}.xls`;
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
        this.downloadService.download(blob, fileName);
      },
      error => this.error = decodeErrorMessage(error, 'Error exporting insights report'));
  }

  private downloadLoggedHoursReport(startDate: string, endDate: string): void {
    const teams = this.form.controls['selectedTeams'].value;
    this.reportsService.downloadLoggedHoursReport(startDate, teams)
      .pipe(finalize(() => this.isTeamsLoading = false))
      .subscribe(data => {
        const fileName = `Hours Logged - ${startDate} to ${endDate}.xls`;
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
        this.downloadService.download(blob, fileName);
      },
      error => this.error = decodeErrorMessage(error, 'Error exporting insights report'));
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  }
}
