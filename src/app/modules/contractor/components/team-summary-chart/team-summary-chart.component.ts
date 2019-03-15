import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { format, subWeeks } from 'date-fns';

import * as GridTrends from 'app/core/constants/team-summary/grid-trends';
import {
  ProductivitySummaryWithMappedActivities,
  TeamSummaryChartEntry,
} from 'app/core/models/productivity';
import { SummaryBaseMetrics } from 'app/core/models/team';

@Component({
  selector: 'app-team-summary-chart',
  templateUrl: './team-summary-chart.component.html',
  styleUrls: ['./team-summary-chart.component.scss'],
})
export class TeamSummaryChartComponent implements OnInit {
  @Input()
  public chunkSize = 4;

  @Input()
  public teamId: number | null = null;

  @Input()
  public summary: ProductivitySummaryWithMappedActivities;

  @Input()
  public endDate: Date;

  @Input()
  public metricName = '';

  @Output()
  public clickOnChart: EventEmitter<number> = new EventEmitter();

  public membersCount = 0;
  public chartEntries = [] as TeamSummaryChartEntry[];
  public chartGroups = [] as TeamSummaryChartEntry[];

  public static getTrendClass(value: number, maxValue: number): { cssClass: string, barColor: string } {
    const types = Object.keys(GridTrends)
      .map(key => GridTrends[key as keyof typeof GridTrends]);
    return types.filter(entry => entry.threshold(value, maxValue))[0];
  }

  public static normalizeBarValue(score: number, maxValue: number): number {
    return score / 100 * maxValue;
  }

  public tickFormatter = (value: number) => value.toString();

  public ngOnInit(): void {
    const baseMetrics = SummaryBaseMetrics.fromProductivitySummary(
      this.summary.productivitySummary,
      this.chunkSize
    );
    this.membersCount = this.summary.productivitySummary.activeAssignmentsCount[0];
    this.setChartEntries(baseMetrics);
  }

  public onChartClick(): void {
    if (this.teamId) {
      this.clickOnChart.emit(this.teamId);
    }
  }

  protected setChartEntries(metrics: SummaryBaseMetrics): void {
    this.chartGroups = Array.from({ length: this.chunkSize })
    .map((_item, index: number) => (
      TeamSummaryChartEntry.from({
        group: format(subWeeks(this.endDate, this.chunkSize - index - 1), 'MMM DD'),
        value: metrics.metric[index].toFixed(2),
      })
    ));
    const maxValue = Math.max(...this.chartGroups.map(entry => entry.value as number)) + 1;
    this.chartEntries = this.chartGroups
      .reduce((carry, item, index) => carry.concat([
        new TeamSummaryChartEntry(
          item.group,
          'Intensity',
          TeamSummaryChartComponent.normalizeBarValue(metrics.intensity[index], maxValue),
          metrics.intensity[index].toFixed(0),
          undefined,
          TeamSummaryChartComponent.getTrendClass(metrics.intensity[index], 100).barColor
        ),
        new TeamSummaryChartEntry(
          item.group,
          'Focus',
          TeamSummaryChartComponent.normalizeBarValue(metrics.focus[index], maxValue),
          metrics.focus[index].toFixed(0),
          undefined,
          TeamSummaryChartComponent.getTrendClass(metrics.focus[index], 100).barColor
        ),
        new TeamSummaryChartEntry(
          item.group,
          'Alignment',
          TeamSummaryChartComponent.normalizeBarValue(metrics.alignment[index], maxValue),
          metrics.alignment[index].toFixed(0),
          undefined,
          TeamSummaryChartComponent.getTrendClass(metrics.alignment[index], 100).barColor
        ),
      ]), [] as TeamSummaryChartEntry[]);
  }
}
