
import { WeekMetrics } from 'app/core/models/metric/week-metrics.model';
export interface ManualMetricRecord {
  name?: string;
  contractorId?: number;
  weeks: { [key: string]: WeekMetrics };
}

