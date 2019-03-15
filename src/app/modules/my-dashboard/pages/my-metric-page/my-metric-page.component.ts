import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DfCheckboxChange, DfGroupToggleItem } from '@devfactory/ngx-df';
import { addDays, endOfWeek, format, startOfWeek, subWeeks } from 'date-fns';
import { finalize } from 'rxjs/operators';

import * as AvatarTypes from 'app/core/constants/avatar-types';
import { AssignmentHistory } from 'app/core/models/assignment';
import { CurrentUserDetail } from 'app/core/models/identity';
import { MetricChart, MetricGrid, MetricsSummaryParam } from 'app/core/models/metric';
import { Team } from 'app/core/models/team';
import { DownloadService } from 'app/core/services/download/download.service';
import { MetricService } from 'app/core/services/metric/metric.service';
import { isApiError } from 'app/core/type-guards/is-api-error';

@Component({
  selector: 'app-my-metric-page',
  templateUrl: './my-metric-page.component.html',
  styleUrls: ['./my-metric-page.component.scss'],
})
export class MyMetricPageComponent implements OnInit {
  private readonly todaysDate = new Date();
  public readonly CHART = 'chart';
  public readonly GRID = 'grid';
  public readonly items: DfGroupToggleItem[] = [
    {
      text: '',
      id: this.CHART,
      icon: 'fa fa-bar-chart fa-lg',
    },
    {
      text: '',
      id: this.GRID,
      icon: 'fa fa-table fa-lg',
    },
  ];

  @Input()
  public assignmentId: number;

  @Input()
  public userDetail: CurrentUserDetail;

  @Input()
  public managerControl = false;

  public avatarType: string;
  public view = this.CHART;
  public isLoading = false;
  public showCurrentWeek = false;
  public isMetricSet = false;

  public form: FormGroup;
  public weekHeaders: string[] = [];
  public metricSetups: string[];
  public metricGrid: MetricGrid[] = [];
  public managers: Team[] = [];
  public teams: Team[] = [];
  public metrics: number[];
  public teamTotal: number[];
  public avgContractor: number[];
  public metricsChartData: MetricChart[] = [];
  public metricDesc: string;
  public error: string | null = null;

  constructor(
    private metricService: MetricService,
    private downloadService: DownloadService,
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.isLoading = true;
    this.avatarType = this.managerControl ? AvatarTypes.Manager : AvatarTypes.Candidate;
    this.form = this.formBuilder.group({
      teams: [1],
      managers: ['all'],
      range: ['4'],
    });
    const weekStartOn = startOfWeek(this.todaysDate, { weekStartsOn: 1 });
    const weekEndOn = endOfWeek(this.todaysDate, { weekStartsOn: 1 });
    const from = format(subWeeks(weekStartOn, Number(this.form.value.range)), 'YYYY-MM-DD');
    const to = format(addDays(weekEndOn, 1), 'YYYY-MM-DD');
    this.metricService.getTeamAssignmentHistories(
      this.assignmentId,
      this.avatarType,
      from,
      to
    )
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(histories => {
        this.metricSetups = this.getMetricDescription(histories);
        this.managers = this.getManagers(histories);
        this.teams = this.getTeams(histories);
        this.form.controls.teams.setValue(this.teams[0].id);
        this.metricDesc = this.metricSetups[0];
        this.ismetricSetups(0);
        this.getTeamAssignmentMetricsSummary();
        this.form.valueChanges.subscribe(() => this.getTeamAssignmentMetricsSummary());
      },
        error => {
          if (isApiError(error)) {
            this.error = error.error.text;
          } else {
            this.error = 'Error fetching team assignment history.';
          }
        });
  }

  public handleTeamChange(teamId: number): void {
    const index = this.teams.findIndex(team => team.id === teamId);
    this.metricDesc = this.metricSetups[index];
    this.ismetricSetups(index);
  }

  public getTeamAssignmentMetricsSummary(): void {
    this.isLoading = true;
    this.error = '';
    this.buildGridWeeklyHeaders(Number(this.form.value.range));
    const managerId = this.form.value.managers;
    const metricParam: MetricsSummaryParam = {
      assignmentId: this.assignmentId,
      avatarType: this.avatarType,
      date: format(endOfWeek(this.todaysDate, { weekStartsOn: 1 }), 'YYYY-MM-DD'),
      exclude: 'activities',
      ...managerId !== 'all' && { managerId },
      from: format(subWeeks(startOfWeek(this.todaysDate, { weekStartsOn: 1 }), Number(this.form.value.range)), 'YYYY-MM-DD'),
      fullTeam: 'true',
      teamId: this.form.value.teams,
      to: format(addDays(endOfWeek(this.todaysDate, { weekStartsOn: 1 }), 1), 'YYYY-MM-DD'),
      weeksCount: Number(this.form.value.range) + 1,
    };
    const fullName = `${this.userDetail.firstName} ${this.userDetail.lastName}`;
    this.metricService.getTeamAssignmentMetricsSummary(metricParam)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(summary => {
        this.metrics = summary.stats.map(stat => stat.ticketsResolved).reverse();
        this.avgContractor = summary.metricAvg.weeksMetric ?
          summary.metricAvg.weeksMetric.map(weeksMetric => weeksMetric.average).reverse() : [0];
        this.teamTotal = summary.metricAvg.weeksMetric ?
          summary.metricAvg.weeksMetric.map(weeksMetric => weeksMetric.total) : [0];
        this.metricGrid = [{
          activity: `${fullName}`,
          name: `${fullName}`,
          weekly: this.getAverage(this.metrics),
          weeks: this.metrics,
        },
        {
          activity: 'Average per Contractor',
          name: 'Team',
          weekly: this.getAverage(this.avgContractor),
          weeks: this.teamTotal,
        }];
        this.buildLineChart();
      },
        error => {
          if (isApiError(error)) {
            this.error = error.error.text;
          } else {
            this.error = 'Error fetching team assignment metrics summary';
          }
        });
  }

  public buildGridWeeklyHeaders(length: number): void {
    this.weekHeaders = [];
    let week = subWeeks(endOfWeek(this.todaysDate, { weekStartsOn: 1 }), length + 1);
    for (let i = 0; i < length; i++) {
      this.weekHeaders.push(this.getWeeklyFormat(week));
      week = addDays(endOfWeek(week), 1);
    }
  }

  public exportCsv(): void {
    this.isLoading = true;
    const assignmentId = this.assignmentId;
    const teamId = this.form.value.teams;
    const fullName = `${this.userDetail.firstName}_${this.userDetail.lastName}`;
    const from = format(subWeeks(startOfWeek(this.todaysDate, { weekStartsOn: 1 }), Number(this.form.value.range)), 'YYYY-MM-DD');
    const to = format(addDays(endOfWeek(this.todaysDate, { weekStartsOn: 1 }), 1), 'YYYY-MM-DD');
    this.metricService.exportMetricReport(assignmentId, teamId, from, to).subscribe(data => {
      this.isLoading = false;
      const fileName = `${fullName}_Metric_${format(new Date(), 'MM-DD-YYYY')}.csv`;
      const blob = new Blob([data], { type: 'text/csv' });
      this.downloadService.download(blob, fileName);
    },
      error => {
        if (isApiError(error)) {
          this.error = error.error.text;
        } else {
          this.error = 'Error exporting matric summary';
        }
      });
  }

  public buildLineChart(): void {
    let week = subWeeks(endOfWeek(this.todaysDate, { weekStartsOn: 1 }), 1);
    const metricsChartData: MetricChart[] = [];
    for (let i = 1; i <= Number(this.form.value.range); i++) {
      metricsChartData.unshift({
        date: week,
        value: this.metrics[i],
      });
      week = subWeeks(week, 1);
    }
    setTimeout(() => this.metricsChartData = metricsChartData);
  }

  public getAverage(metrics: number[]): string {
    const range = this.form.value.range;
    let average = 0;
    average = metrics.reduce((accumulator, currentValue) => accumulator + currentValue);
    return (average / range).toFixed(1);
  }

  public getWeekCellContent(weeks: string[], i: number): string {
    return weeks[Number(this.form.value.range) - i];
  }

  public onViewChange(item: DfGroupToggleItem): void {
    this.view = item.id || this.CHART;
  }

  public toggleCurrentWeek(check: DfCheckboxChange): void {
    if (check.checked) {
      const date = endOfWeek(this.todaysDate, { weekStartsOn: 1 });
      const metrics = this.metricsChartData.slice();
      metrics.push({
        date: date,
        value: this.metrics[0],
      });

      this.metricsChartData = [];
      this.metricsChartData = metrics;
    } else if (this.metrics.length) {
      const metrics = this.metricsChartData.slice();
      metrics.pop();

      this.metricsChartData = [];
      this.metricsChartData = metrics;
    }
  }

  private ismetricSetups(index: number): void {
    this.isMetricSet = this.metricSetups[index] !== '';
  }

  private getManagers(histories: AssignmentHistory[]): Team[] {
    const managers: Team[] = [];
    histories.map(history => {
      const index = managers.findIndex(manager => manager.id === history.manager.id);
      if (index < 0) {
        managers.push({ name: history.manager.name ? history.manager.name : '', id: history.manager.id });
      }
    });
    return managers;
  }

  private getTeams(histories: AssignmentHistory[]): Team[] {
    const teams: Team[] = [];
    histories.map(history => {
      teams.push({
        name: (history.team as Team).name as string,
        id: (history.team as Team).id,
      });
    });
    return teams;
  }

  private getMetricDescription(histories: AssignmentHistory[]): string[] {
    const metricSetups: string[] = [];
    histories.map(history => {
      const team = history.team as Team;
      const metricName = team.metricSetups && team.metricSetups.length > 0 ? (team.metricSetups)[0].name : '';
      metricSetups.push(metricName);
    });
    return metricSetups;
  }

  private getWeeklyFormat(date: Date): string {
    const start = addDays(startOfWeek(date), 1);
    const end = addDays(endOfWeek(date), 1);
    return `${format(start, 'MMM DD')} - ${format(end, 'MMM DD')}`;
  }
}
