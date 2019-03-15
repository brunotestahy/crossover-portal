import { Assignment } from 'app/core/models/assignment';

export class AssignmentSummary {
  active: boolean;
  activityMetrics: number[];
  activityMetricsPastWeeksAvg: number;
  assignment: Assignment;
  id: number;
  candidateId: number;
  focusScorePastWeeksAvg: number;
  focusScores: number[];
  intensityScorePastWeeksAvg: number;
  intensityScores: number[];
  metricsStats: number[];
  metricsStatsPastWeeksAvg: number;
  recordedHours: number[];
  recordedHoursPastWeeksAvg: number;
  statusPerWeek: boolean[];
  weeklyCost: number[];
  effectiveDateEnd?: string;
}
