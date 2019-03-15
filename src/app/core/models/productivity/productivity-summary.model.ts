import { AssignmentSummary } from 'app/core/models/productivity/assignment-summary.model';

export interface ProductivitySummary {
  activeAssignmentsCount: number[];
  activityMetricsAvg: number[];
  activityMetricsPastWeeksAvg: number;
  assignments: AssignmentSummary[];
  averageBottomPerformer: number;
  averageTopPerformer: number;
  bottomPerformers: number[];
  focusScoreAvg: number[];
  focusScorePastWeeksAvg: number;
  id: number;
  intensityScoreAvg: number[];
  intensityScorePastWeeksAvg: number;
  metricName: string;
  metricSetupPresent: boolean;
  metricTarget: number;
  metricsStatsAvg: number[];
  metricsStatsPastWeeksAvg: number;
  teamName: string;
  topPerformers: number[];
  weeklyHoursAvg: number[];
  weeklyHoursPastWeeksAvg: number;
}
