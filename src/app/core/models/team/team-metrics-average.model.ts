import { WeeksMetric } from 'app/core/models/team/weeks-metric.model';
export interface TeamMetricsAverage {
  hasMetricsSetup?: boolean;
  metricName?: string;
  metricTarget?: string;
  weeksMetric?: WeeksMetric[];
}
