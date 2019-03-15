import { States } from 'app/core/models/metric';
import { TeamMetricsAverage } from 'app/core/models/team';

export interface MetricSummary {
  assignmentId: number;
  managerName: string;
  metricAvg: TeamMetricsAverage;
  name: string;
  stats: States[];
  teamId: number;
}
