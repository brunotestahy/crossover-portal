import { Component, Input, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { addDays, addWeeks, endOfWeek, format, startOfWeek, subWeeks } from 'date-fns';
import * as _ from 'lodash';

import * as MetricsConstants from 'app/core/constants/metrics';
import * as PeriodConstants from 'app/core/constants/period';
import { MetricInputData } from 'app/core/models/metric';
import { TeamMetricRecord } from 'app/core/models/metric/team-metric-record.model';
import { TeamMetricsService } from 'app/shared/services/team-metrics/team-metrics.service';

@Component({
  selector: 'app-metric-table',
  templateUrl: './metric-table.component.html',
  styleUrls: ['./metric-table.component.scss'],
})
export class MetricTableComponent implements OnChanges {

  private static readonly MAX_WEEKS = 37;

  @Input()
  public metricInputData: MetricInputData;

  public normalizeCheck: FormControl = new FormControl(false);
  public metricsTableData: TeamMetricRecord[] = [];
  public metricsConstants = MetricsConstants;
  public filteredHeaders: string[] = [];
  public weekHeaders: string[] = [];

  constructor(
    private teamMetricsService: TeamMetricsService
  ) { }

  public ngOnChanges(): void {
    this.normalizeCheck.valueChanges.subscribe(checked => this.populateTable(checked));
    this.buildWeeklyHeaders();
    this.populateTable(this.normalizeCheck.value);
  }

  public getLastUpdate(): string {
    if (this.metricInputData.lastUpdate) {
      return `Updated on ${PeriodConstants.YEAR_MONTHS[this.metricInputData.lastUpdate.getMonth()]}
      ${this.metricInputData.lastUpdate.getDate()} at ${format(this.metricInputData.lastUpdate, 'hh:mm aa')}`;
    }
    return '';
  }

  public openJira(queryUsed?: string): void {
    if (queryUsed && queryUsed !== '') {
      window.open(queryUsed, '_blank');
    }
  }

  public getContractorTerminationTooltip(endDate: Date): string {
    const formattedDate = `${format(endDate, 'MMMM, DD, YYYY')}`;
    return `This person left the team on ${formattedDate}`;
  }

  public getCostPerUnitTooltip(cost: number): string {
    return `Cost per Unit: $${(cost).toFixed(2)}`;
  }

  public getMetricTargetTooltip(): string {
    return `Metric Target: ${this.metricInputData.metricTarget}`;
  }

  public getMetricPercentage(metric: number): number {
    return this.metricInputData.metricTarget && this.metricInputData.metricTarget > 0
      ? Math.round(metric / this.metricInputData.metricTarget * 100) : 0;
  }


  public getUnitsPerWeekTooltip(item: TeamMetricRecord): string {
    return `Units per Week: ${this.formatMetric(item.metric)}`;
  }

  public getCostAndTotalsTooltip(item: TeamMetricRecord, weekHeader: string): string {
    const ticketsResolved = item.weeks[weekHeader].ticketsResolved as number;
    return `Total Units: ${ticketsResolved.toFixed(2)}<br>Salary: $${item.weeks[weekHeader].weekSalary.toFixed(2)}`;
  }

  public formatMetric(metric?: number): string {
    return metric ? metric.toFixed(2) : '0.00';
  }

  public getTooltipPlacement(index: number): string {
    return index / this.filteredHeaders.length > 0.5 ? 'left' : 'right';
  }

  public columnSortName(data: TeamMetricRecord[], _fieldName: string, sortOrder: number): void {
    data.sort((a, b) => {
      if (a.teamRecord) {
        return -1;
      } else if (b.teamRecord) {
        return 1;
      } else if (a.name > b.name) {
        return sortOrder;
      } else {
        return -sortOrder;
      }
    });
  }

  public columnSortMetric(data: TeamMetricRecord[], _fieldName: string, sortOrder: number): void {
    data.sort((a, b) => {
      if (a.teamRecord) {
        return -1;
      } else if (b.teamRecord) {
        return 1;
      } else if (a.metric > b.metric) {
        return sortOrder;
      } else {
        return -sortOrder;
      }
    });
  }

  public columnSortTicketsResolved(data: TeamMetricRecord[], fieldName: string, sortOrder: number): void {
    data.sort((a, b) => {
      if (a.teamRecord) {
        return -1;
      } else if (b.teamRecord) {
        return 1;
      } else if (a.weeks[fieldName].ticketsResolved > b.weeks[fieldName].ticketsResolved) {
        return sortOrder;
      } else {
        return -sortOrder;
      }
    });
  }

  public columnSortWeekSalary(data: TeamMetricRecord[], fieldName: string, sortOrder: number): void {
    data.sort((a, b) => {
      if (a.teamRecord) {
        return -1;
      } else if (b.teamRecord) {
        return 1;
      } else if (a.weeks[fieldName].cost > b.weeks[fieldName].cost) {
        return sortOrder;
      } else {
        return -sortOrder;
      }
    });
  }

  public columnSortCost(data: TeamMetricRecord[], _fieldName: string, sortOrder: number): void {
    data.sort((a, b) => {
      if (a.teamRecord) {
        return -1;
      } else if (b.teamRecord) {
        return 1;
      } else if (a.cost > b.cost) {
        return sortOrder;
      } else {
        return -sortOrder;
      }
    });
  }

  private populateTable(normalize: boolean): void {
    this.metricsTableData = [];
    const weeklyTeamMetrics = this.teamMetricsService.calculateWeeklyTeamMetrics(
      this.metricInputData.metricsValues,
      this.metricInputData.metricTarget,
      normalize
    );
    let weeklyIndividualMetrics = this.teamMetricsService.calculateStatsPerAssignments(
      this.metricInputData.assignments,
      this.metricInputData.metricsValues,
      this.metricInputData.metricTarget,
      normalize,
      this.metricInputData.managerId,
      this.metricInputData.team.id
    );
    this.metricsTableData.push(weeklyTeamMetrics);
    if (this.metricInputData.unitsCostMode === MetricsConstants.UNITS) {
      weeklyIndividualMetrics = _.orderBy(weeklyIndividualMetrics, [ 'metric', 'cost' ], [ 'desc', 'desc' ]);
    } else {
      weeklyIndividualMetrics = _.orderBy(weeklyIndividualMetrics, 'cost');
    }

    this.metricsTableData.push(...weeklyIndividualMetrics);
  }

  private buildWeeklyHeaders(): void {
    this.weekHeaders = Array.from({ length: MetricTableComponent.MAX_WEEKS });
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

  private getWeeklyFormat(date: Date): string {
    const start = addDays(startOfWeek(date), 1);
    const end = addDays(endOfWeek(date), 1);

    return `${format(start, 'MMM DD')} - ${format(end, 'MMM DD')}`;
  }
}
