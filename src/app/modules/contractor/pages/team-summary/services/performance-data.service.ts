import { Injectable } from '@angular/core';

import { WeekModes } from 'app/core/constants/team-summary/week-modes';
import {
  ProductivitySummaryWithMappedActivities,
} from 'app/core/models/productivity';
import { TeamSummaryComponent } from 'app/modules/contractor/pages/team-summary/team-summary.component';

@Injectable()
export class PerformanceDataService {
  public mapPerformerDetails(
    summary: ProductivitySummaryWithMappedActivities,
    weeksCount: string
  ): ProductivitySummaryWithMappedActivities {
      if (weeksCount === WeekModes.Single) {
        summary.productivitySummary.averageTopPerformer = summary.productivitySummary.topPerformers[0];
        summary.productivitySummary.averageBottomPerformer = summary.productivitySummary.bottomPerformers[0];

        summary.productivitySummary.activityMetricsPastWeeksAvg =
          summary.productivitySummary.activityMetricsAvg[0];
        summary.productivitySummary.metricsStatsPastWeeksAvg =
          summary.productivitySummary.metricsStatsAvg[0];
        summary.productivitySummary.intensityScorePastWeeksAvg =
          summary.productivitySummary.intensityScoreAvg[0];
        summary.productivitySummary.focusScorePastWeeksAvg =
          summary.productivitySummary.focusScoreAvg[0];
        summary.productivitySummary.weeklyHoursPastWeeksAvg =
          summary.productivitySummary.weeklyHoursAvg[0];

        summary.productivitySummary.assignments = summary.productivitySummary.assignments.map(
          assignment => {
            assignment.activityMetricsPastWeeksAvg = assignment.activityMetrics[0];
            assignment.metricsStatsPastWeeksAvg = assignment.metricsStats[0];
            assignment.intensityScorePastWeeksAvg = assignment.intensityScores[0];
            assignment.focusScorePastWeeksAvg = assignment.focusScores[0];
            assignment.recordedHoursPastWeeksAvg = assignment.recordedHours[0];
            return assignment;
          }
        );
      }
      return summary;
  }

  public buildStats(
    instance: TeamSummaryComponent,
    summary: ProductivitySummaryWithMappedActivities,
    date: Date,
    weeksCount: string
  ): void {
    instance.endDate = date;
    if (weeksCount === WeekModes.FourPreviousWeeks) {
      const chunkSize = parseInt(WeekModes.FourPreviousWeeks, 10);

      instance.metricInfo.target = summary.productivitySummary.metricTarget;
      instance.metricInfo.description = summary.productivitySummary.metricName;
      instance.metricInfo.hoursLogged = this.getReverseSlice(summary.productivitySummary.weeklyHoursAvg, chunkSize);
      instance.metricInfo.metrics = this.getReverseSlice(summary.productivitySummary.metricsStatsAvg, chunkSize);
      instance.metricInfo.alignment = this.getReverseSlice(summary.productivitySummary.activityMetricsAvg, chunkSize);
      instance.metricInfo.focus = this.getReverseSlice(summary.productivitySummary.focusScoreAvg, chunkSize);
      instance.metricInfo.intensity = this.getReverseSlice(summary.productivitySummary.intensityScoreAvg, chunkSize);

      instance.productivitySummary = summary;
      instance.teamSummaryCount = summary.productivitySummary.activeAssignmentsCount[0];
    }
  }

  private getReverseSlice<T>(input: T[], chunkSize: number): T[] {
    return input.slice().reverse().slice(0, chunkSize);
  }
}
