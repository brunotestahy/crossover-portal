import { WeekMetrics } from 'app/core/models/metric/week-metrics.model';

export interface RawMetrics {
  name: string;
  assignmentId: number;
  stats: WeekMetrics[];
}
