import {Component, Input, OnChanges, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DfBar } from '@devfactory/ngx-df';
import { addDays, addWeeks, endOfWeek, format, isBefore, isMonday, parse, startOfDay, startOfToday, startOfWeek, subWeeks } from 'date-fns';
import * as _ from 'lodash';

import * as ColorConstants from 'app/core/constants/colors';
import * as MetricsConstants from 'app/core/constants/metrics';
import * as PeriodConstants from 'app/core/constants/period';
import {
  MetricInputData, TeamMetricBar, TeamMetricLineChartPoint, TeamMetricRecord, WeekMetrics, WeekTeamData
} from 'app/core/models/metric';
import { TeamMetricsService } from 'app/shared/services/team-metrics/team-metrics.service';

let tableData: TeamMetricRecord[] = [];

@Component({
  selector: 'app-metric-chart',
  templateUrl: './metric-chart.component.html',
  styleUrls: ['./metric-chart.component.scss'],
})
export class MetricChartComponent implements OnChanges {

  private static readonly MAX_WEEKS = 37;

  @Input()
  public metricInputData: MetricInputData;
  @Input()
  public teamIndividualMode: string;

  @ViewChild('teamCostBarChart') teamCostBarChart: DfBar;

  public today = startOfToday();
  public normalizeChartCheck: FormControl = new FormControl(false);
  public metricsTableData: TeamMetricRecord[] = [];
  public filteredHeaders: string[] = [];
  public weekHeaders: string[] = [];
  public currentWeekCheck: FormControl = new FormControl(false);
  public weekTeamData: WeekTeamData[] = [];
  public individualUnitsChartData: TeamMetricLineChartPoint[] = [];
  public individualCostChartData: TeamMetricLineChartPoint[] = [];
  public teamUnitsChartData: TeamMetricBar[] = [];
  public teamCostChartData: TeamMetricBar[] = [];
  public barChartColor = MetricsConstants.BAR_CHART_COLOR.hexCode;
  public selectedContractors: TeamMetricRecord[] = [];
  public teamAverageCostCheck: FormControl = new FormControl(true);
  public teamAverageUnitsCheck: FormControl = new FormControl(true);
  public teamRecord: TeamMetricRecord;
  public metricsConstants = MetricsConstants;
  public weeklyTeamAverage: string;
  public weeklyTeamAveragePercentage: number;
  public isMonday: boolean = isMonday(this.today);

  public readonly queryOptions = MetricsConstants.QUERY_OPTIONS;
  public chartColors = ColorConstants.CHART_COLOR_PALETTE.map(color => color.hexCode);

  constructor(
    private teamMetricsService: TeamMetricsService
  ) { }

  public ngOnChanges(): void {
    this.currentWeekCheck.setValue(false);
    this.currentWeekCheck.valueChanges.subscribe(() => this.updateChartData());
    this.normalizeChartCheck.valueChanges.subscribe(checked => this.populateData(checked));
    this.teamAverageCostCheck.valueChanges.subscribe(() => this.updateChartData());
    this.teamAverageUnitsCheck.valueChanges.subscribe(() => this.updateChartData());
    this.buildWeeklyHeaders();
    this.populateData(this.normalizeChartCheck.value);
  }

  public showTooltip(week: string): void {
    this.teamCostBarChart.showTooltip(week);
  }

  public hideTooltip(week: string): void {
    this.teamCostBarChart.hideTooltip(week);
  }

  public updateChartData(): void {
    this.buildTeamChartData();
    this.buildIndividualChartData();
  }

  public getContractorWeekData(name: string, weekDate: Date): WeekMetrics | null {
    const contractor = this.metricsTableData.find(metric => metric.name === name);
    return _.get(contractor, `weeks.${this.getWeeklyFormat(weekDate)}`, null);
  }

  public getWeekTeamWeekData(weekDate: Date): WeekMetrics {
    return this.teamRecord.weeks[this.getWeeklyFormat(weekDate)];
  }

  public colorFn(dataKey: string): string {
    if (dataKey === MetricsConstants.TEAM_AVERAGE) {
      return MetricsConstants.TEAM_RECORD_COLOR.hexCode;
    }

    if (dataKey === MetricsConstants.METRIC_TARGET) {
      return MetricsConstants.METRIC_TARGET_COLOR;
    }

    const contractorRecord = tableData.find(record => record.name === dataKey);
    if (contractorRecord) {
      return contractorRecord.color || '';
    } else {
      return '';
    }
  }

  public getTeamMetricPercentage(metric: number): number {
    return this.metricInputData.metricTarget * this.metricInputData.activeTeamMembers !== 0 ?
      Math.round(metric / (this.metricInputData.metricTarget * this.metricInputData.activeTeamMembers) * 100) : 0;
  }

  public getMetricPercentage(metric: number): number {
    return this.metricInputData.metricTarget && this.metricInputData.metricTarget > 0
      ? Math.round(metric / this.metricInputData.metricTarget * 100) : 0;
  }

  public formatMetric(metric?: number): string {
    return metric ? metric.toFixed(2) : '0.00';
  }

  public getTeamScoreClass(metric: number): string {
    return this.teamMetricsService.getScoreClass(metric / 100);
  }

  public getWeeklyTeamScoreClass(metric: number): string {
    const score = this.getTeamMetricPercentage(metric);
    return this.teamMetricsService.getScoreClass(score / 100);
  }

  public getWeeklyFormat(date: Date): string {
    const start = addDays(startOfWeek(date), 1);
    const end = addDays(endOfWeek(date), 1);

    return `${format(start, 'MMM DD')} - ${format(end, 'MMM DD')}`;
  }

  public getSelectedQuery(): string {
    const option = this.queryOptions.find(opt => opt.value === this.metricInputData.queryOption);
    return _.get(option, 'altText', '');
  }

  public getPeriodFormat(): string {
    this.filterHeaders();
    const start = this.filteredHeaders[0].split('-')[0];
    const end = this.filteredHeaders[this.filteredHeaders.length - 1].split('-')[1];
    return `${start} until ${end}`;
  }

  public getTooltipPeriodFormat(): string {
    this.filterHeaders();
    const start = this.filteredHeaders[0].split('-')[0];
    const end = this.filteredHeaders[this.filteredHeaders.length - 2].split('-')[1];
    return `${start} until ${end}`;
  }

  public getMetricPerTeamMember(metric: number, teamSize: number): string {
    return teamSize !== 0 ? (metric / teamSize).toFixed(2) : '0.00';
  }

  public getTeamAverageCostTooltip(): string {
    return `The average is total number of units from ${this.getTooltipPeriodFormat()}, ` +
      `divided by the amount paid to the team members in the same period`;
  }

  public getLastUpdate(): string {
    if (this.metricInputData.lastUpdate) {
      const updatedText = `Updated on ${PeriodConstants.YEAR_MONTHS[this.metricInputData.lastUpdate.getMonth()]} `;
      const dateText = `${this.metricInputData.lastUpdate.getDate()} at ${format(this.metricInputData.lastUpdate, 'hh:mm aa')}`;
      return updatedText + dateText;
    }
    return '';
  }

  public getContractorTerminationTooltip(endDate: Date): string {
    const terminationDate = endDate ? endDate : new Date();
    const formattedDate = `${format(terminationDate, 'MMMM, DD, YYYY')}`;
    return `This person left the team on ${formattedDate}`;
  }

  private populateData(normalize: boolean): void {
    this.metricsTableData = [];
    tableData = this.metricsTableData;
    this.buildTeamMetrics(normalize);
    this.buildIndividualMetrics(normalize);
    this.buildIndividualChartData();
  }

  private buildTeamMetrics(normalize: boolean): void {
    this.teamRecord = this.teamMetricsService.calculateWeeklyTeamMetrics(
      this.metricInputData.metricsValues,
      this.metricInputData.metricTarget,
      normalize
    );
    this.buildTeamChartData();
  }

  private buildIndividualMetrics(normalize: boolean): void {
    let weeklyIndividualMetrics = this.teamMetricsService.calculateStatsPerAssignments(
      this.metricInputData.assignments,
      this.metricInputData.metricsValues,
      this.metricInputData.metricTarget,
      normalize,
      this.metricInputData.managerId,
      this.metricInputData.team.id
    );
    if (this.metricInputData.unitsCostMode === MetricsConstants.UNITS) {
      weeklyIndividualMetrics = _.orderBy(weeklyIndividualMetrics, ['metric', 'cost'], ['desc', 'desc']);
    } else {
      weeklyIndividualMetrics = _.orderBy(weeklyIndividualMetrics, 'cost');
    }
    weeklyIndividualMetrics.map((metric, index) => metric.color = this.chartColors[index % this.chartColors.length]);

    this.metricsTableData.push(...weeklyIndividualMetrics);
  }

  private buildIndividualChartData(): void {
    const lineChartData: TeamMetricLineChartPoint[] = [];
    const unitsLineChartData: TeamMetricLineChartPoint[] = [];
    const teamRec = Object.assign(this.teamRecord, {});
    teamRec.name = MetricsConstants.TEAM_AVERAGE;
    teamRec.color = MetricsConstants.TEAM_RECORD_COLOR.hexCode;
    teamRec.assignmentId = 0;

    if (this.teamAverageUnitsCheck.value) {
      this.buildTeamUnitAverageLines(teamRec, unitsLineChartData);
    }
    if (this.teamAverageCostCheck.value) {
      this.buildTeamCostAverageLines(teamRec, lineChartData);
    }
    this.buildTeamMetricLine(unitsLineChartData);
    this.buildIndividualUnitLines(unitsLineChartData, lineChartData);
    const thisMonday = startOfDay(startOfWeek(this.today, {weekStartsOn: 1}));
    if (!this.currentWeekCheck.value) {
      this.individualUnitsChartData = unitsLineChartData.filter(data => isBefore(data.date, thisMonday));
    }
    else {
      this.individualUnitsChartData = unitsLineChartData;
    }
    this.individualCostChartData = lineChartData.filter(data => isBefore(data.date, thisMonday));
  }

  private buildTeamMetricLine(lineChartData: TeamMetricLineChartPoint[]): void {
    _.each(this.teamRecord.weeks, week => {
      this.setLineChartDateContractorPoint(
        parse(week.startDate),
        this.metricInputData.metricTarget,
        lineChartData,
        MetricsConstants.METRIC_TARGET,
      );
    });
  }

  private buildTeamUnitAverageLines(teamRec: TeamMetricRecord, lineChartData: TeamMetricLineChartPoint[]): void {
    _.each(teamRec.weeks, (week) => {
      const metricPerUnit =
        !week.teamSize || week.teamSize === 0 ? 0 : week.ticketsResolved as number / week.teamSize;
      this.setLineChartDateContractorPoint(
        parse(week.startDate),
        +metricPerUnit.toFixed(2),
        lineChartData,
        MetricsConstants.TEAM_AVERAGE
      );
    });
  }

  private buildTeamCostAverageLines(teamRec: TeamMetricRecord, lineChartData: TeamMetricLineChartPoint[]): void {
    _.each(teamRec.weeks, (week) => {
      this.setLineChartDateContractorPoint(
        parse(week.startDate),
        week.cost,
        lineChartData,
        MetricsConstants.TEAM_AVERAGE
      );
    });
  }

  private setLineChartDateContractorPoint(date: Date, value: number, lineChartData: TeamMetricLineChartPoint[], name: string): void {
    const point = {
      date: date,
    } as TeamMetricLineChartPoint;
    point[name] = value;
    lineChartData.push(point);
  }

  private buildIndividualUnitLines(unitsLineChartData: TeamMetricLineChartPoint[], lineChartData: TeamMetricLineChartPoint[]): void {
    this.metricsTableData.filter(metric => !metric.teamRecord).forEach(metric => {
      _.each(metric.weeks, (week) => {
        if (this.selectedContractors.some(contractor => contractor.assignmentId === metric.assignmentId)) {
          this.setLineChartDateContractorPoint(
            parse(week.startDate),
            week.ticketsResolved as number,
            unitsLineChartData,
            metric.name
          );

          this.setLineChartDateContractorPoint(
            parse(week.startDate),
            week.cost,
            lineChartData,
            metric.name,
          );

        }
      });
    });
  }

  private buildTeamChartData(): void {
    this.weekTeamData = [];
    this.teamUnitsChartData = [];
    this.teamCostChartData = [];
    const lastMonday = subWeeks(startOfDay(startOfWeek(this.today, {weekStartsOn: 1})), 1);

    _.each(this.teamRecord.weeks, (week, index) => {
      this.weekTeamData.push({
        week: index,
        weekSalary: week.weekSalary,
        ticketsResolved: week.ticketsResolved as number,
        cost: week.cost,
        isLastWeek: !isBefore(week.startDate, lastMonday)
      });

      this.teamCostChartData.unshift({
        xKey: index,
        yKey: week.cost,
        metric: week.ticketsResolved as number,
        cost: week.cost,
        teamSize: week.teamSize
      });

      this.teamUnitsChartData.unshift({
        xKey: index,
        yKey: week.ticketsResolved as number,
        zKey: this.metricInputData.metricTarget * this.metricInputData.activeTeamMembers,
        cost: week.cost,
        teamSize: week.teamSize
      });
    });
    this.setupWeekTeamData();
    this.setupUnitsChartData();
    this.setupCostChartData();
    this.setWeeklyTeamAverage();
  }

  private setupWeekTeamData(): void {
    // reversing dates and removing last week to show data properly
    this.weekTeamData.reverse().shift();
  }

  private setupUnitsChartData(): void {
    // removing last week if select last week option is unselected and reversing dates
    if (!this.currentWeekCheck.value) {
      this.teamUnitsChartData.shift();
    }
    this.teamUnitsChartData.reverse();
  }

  private setupCostChartData(): void {
    // reversing dates and removing last week to show data properly
    this.teamCostChartData.shift();
    this.teamCostChartData.reverse();
  }

  private buildWeeklyHeaders(): void {
    this.weekHeaders = Array.from({ length: MetricChartComponent.MAX_WEEKS });
    let date = addWeeks(new Date(), 1);
    this.weekHeaders = this.weekHeaders.map(() => {
      date = subWeeks(date, 1);
      return this.getWeeklyFormat(date);
    }).reverse();
    this.filterHeaders();
  }

  private filterHeaders(): void {
    const length = this.weekHeaders.length;
    this.filteredHeaders = this.weekHeaders.slice(length - this.metricInputData.queryOption - 1);
  }

  private setWeeklyTeamAverage(): void {
    const totalUnit = _.chain(this.weekTeamData)
    .map('ticketsResolved')
    .reduce((allUnit, value) => allUnit + value, 0).value();
    const totalUnitPercentage = _.chain(this.weekTeamData)
    .map('ticketsResolved')
    .reduce((allUnit, value) => allUnit + this.getTeamMetricPercentage(value), 0).value();
    const allWeeks = this.weekTeamData.length;
    const teamAverage = allWeeks === 0 ? totalUnit : totalUnit / allWeeks;
    this.weeklyTeamAverage = this.formatMetric(teamAverage);
    this.weeklyTeamAveragePercentage = allWeeks === 0 ? 0 : Math.round((totalUnitPercentage / allWeeks));
  };
}

