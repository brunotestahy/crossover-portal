import { Component, Input, OnInit } from '@angular/core';
import { DfPieChartConfiguration } from '@devfactory/ngx-df';
import * as _ from 'lodash';
import * as moment from 'moment';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { finalize } from 'rxjs/operators';

import * as OverdueChartColors from 'app/core/constants/contractor/dashboard/workflows/overdue-chart-color';
import * as WIPChartColors from 'app/core/constants/contractor/dashboard/workflows/wip-chart-colors';
import { JiraChartItem } from 'app/core/models/dashboard';
import { TeamStatistics } from 'app/core/models/dashboard/team-statistics.model';
import { CurrentUserDetail } from 'app/core/models/identity';
import { JiraWorkflowGoals, WorkflowStateMapping } from 'app/core/models/workflow';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { TeamService } from 'app/core/services/team/team.service';
import { WorkflowsService } from 'app/core/services/workflows/workflows.service';
import { decodeErrorMessage } from 'app/utils/api-utilities';

@Component({
  selector: 'app-workflows-widget',
  templateUrl: './workflows-widget.component.html',
  styleUrls: ['./workflows-widget.component.scss'],
})
export class WorkflowsWidgetComponent implements OnInit {
  public readonly PRE = 'PRE';
  public readonly PRE_WORK = 'Pre-Work';
  public readonly WORKING = 'Working';

  public readonly pieData = [
    {
      title: '',
      value: 1
    }
  ];

  @Input()
  public teamId: number;

  public wipSize: number;
  public wipSizeGoal: number;
  public wipColors: string[] = [];

  public overdueIssues: number;
  public leadTime: string;
  public overdueIssuesColors: string[] = [];

  public headerColumns: JiraChartItem[] = [
    {
      name: this.PRE_WORK,
      shortName: this.PRE,
      count: 0
    }
  ];
  public currentUser: CurrentUserDetail | null;
  public chartOptions = new DfPieChartConfiguration();
  public isLoading = true;

  public error: string;

  constructor(
    private teamService: TeamService,
    private identityService: IdentityService,
    private workflowsService: WorkflowsService
  ) { }

  public ngOnInit(): void {
    this.currentUser = this.identityService.getCurrentUserValue();

    if (this.currentUser) {
      this.chartOptions.animationDelay = 0;
      this.chartOptions.animationDuration = 0;
      this.chartOptions.defaultOpacity = 1;
      this.chartOptions.innerRadius = 30;

      const currentTeam = this.identityService.getTeamManagerGroupSelectionValue();
      const teamOwnerId = currentTeam && currentTeam.team.teamOwner
        ? currentTeam.team.teamOwner.id
        : this.currentUser.managerAvatar.id;

      forkJoin(
        this.teamService.getTeamStatistics(this.teamId.toString(), teamOwnerId.toString()),
        this.workflowsService.getWorkflowGoals(this.teamId.toString()),
        this.workflowsService.getWorkflowStates(this.teamId.toString()),
      )
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(([teamStatistics, workflowGoals, workflowStates]) => {
          this.buildWIPData(teamStatistics, workflowGoals);
          this.buildOverdueData(teamStatistics, workflowGoals);
          this.buildWorkflowStageBreakdown(teamStatistics, workflowStates);
        },
        error => {
          this.error = decodeErrorMessage(error, 'Error loading workflows for selected team.');
        });
    }
  }

  public getBars(headerColumn: JiraChartItem): number[] {
    return [].constructor(Math.min(headerColumn.count, 6));
  }

  private buildOverdueData(teamStatistics: TeamStatistics, workflowGoals: JiraWorkflowGoals): void {
    this.overdueIssues = teamStatistics.overdueIssuesCount;

    const leadTime = _.defaultTo(workflowGoals, {leadTime: 0}).leadTime;
    this.leadTime = this.minutesToDaysAndHours(leadTime * 60);

    const totalPreWorkValue = this.getNumberOfTotalGroupItemsByStatus(teamStatistics, this.PRE_WORK);
    const totalWipMarkerValue = this.getNumberOfTotalGroupItemsByStatus(teamStatistics, this.WORKING);
    const total = totalPreWorkValue + totalWipMarkerValue;
    this.overdueIssuesColors = [
      this.getOverdueColor(leadTime, teamStatistics.overdueIssuesCount , total)
    ];
  }

  private buildWIPData(teamStatistics: TeamStatistics, workflowGoals: JiraWorkflowGoals): void {
    this.wipSize = this.getNumberOfTotalGroupItemsByStatus(teamStatistics, this.WORKING);

    const wipGoal = _.defaultTo(workflowGoals, {wipPerPerson: 0}).wipPerPerson || 0;
    this.wipSizeGoal = teamStatistics.workflowAssignmentStatistics.length * wipGoal

    this.wipColors = [
      this.getWIPColor(this.wipSize, this.wipSizeGoal)
    ];
  }

  private minutesToDaysAndHours(minutes: number): string {
    return moment.duration(minutes, 'minutes').format('D[d]h[h]');
  }

  private getNumberOfTotalGroupItemsByStatus(teamStatistics: TeamStatistics, status: string): number {
    const items = _.defaultTo(teamStatistics.totalGroupItems, []);
    const statusObject = _.find(items, (item) => item.status === status);
    return _.get(statusObject, 'count', 0);
  }

  private getWIPColor(value: number , goal: number): string {
    const types = Object.keys(WIPChartColors)
      .map(key => WIPChartColors[key as keyof typeof WIPChartColors]);
    return types.filter(entry => entry.threshold(value, goal))[0].chartColor;
  }

  private getOverdueColor(leadTime: number, overdueIssues: number , totalIssues: number): string {
    const types = Object.keys(OverdueChartColors)
      .map(key => OverdueChartColors[key as keyof typeof OverdueChartColors]);
    return types.filter(entry => entry.threshold(leadTime, overdueIssues, totalIssues))[0].chartColor;
  }

  private buildWorkflowStageBreakdown(teamStatistics: TeamStatistics, stateMapping: WorkflowStateMapping[]): void {
    const totalPreWorkValue = this.getNumberOfTotalGroupItemsByStatus(teamStatistics, this.PRE_WORK);
    this.headerColumns[0].count = totalPreWorkValue;

    const workingStates = _.filter(_.defaultTo(stateMapping, []),
      (mapping) => _.get(mapping, 'workflowState.name') === this.WORKING);
    const assignmentStatistics = this.getAssignmentStatistics(teamStatistics);
    const columns = _.map(workingStates, state => this.getColumnItemForWorkingState(state, assignmentStatistics))
      .filter(item => item.count > 0);
    this.headerColumns.push(...columns);
  }

  private getColumnItemForWorkingState(state: WorkflowStateMapping, assignmentStatistics: {status: string, count:number}[]):JiraChartItem {
    const item:JiraChartItem = {
      name: _.defaultTo(state.jiraStatusName, ''),
      shortName: this.getShortName(state.jiraStatusName),
      count: this.getAssignmentsCountByStatus(assignmentStatistics, state.jiraStatusName)
    };
    return item;
  }

  private getAssignmentStatistics(teamStatistics: TeamStatistics): {status: string, count:number}[] {
    const statistics = _.union(teamStatistics.workflowAssignmentStatistics,
      teamStatistics.workflowNonAssignmentStatistics);

    return _.flatMap(statistics, item => item.workflowStatusStatistics);
  }

  private getAssignmentsCountByStatus(
    assignmentStatistics: {status: string, count:number}[],
    statusName: string | undefined
  ): number {
    const assignmentStatisticsByStatus = _.filter(assignmentStatistics, item => item.status === statusName);
    return _.sumBy(assignmentStatisticsByStatus, 'count');
  }

  private getShortName(status: string | undefined): string {
    if (!status) {
      return '';
    }
    const parts = status.toUpperCase().split(' ');
    const maxLengthOfSingleWordShortName = 3;
    return parts.length > 1
      ? parts.map(name => name.charAt(0)).join('')
      : parts[0].substr(0, maxLengthOfSingleWordShortName);
  }
}
