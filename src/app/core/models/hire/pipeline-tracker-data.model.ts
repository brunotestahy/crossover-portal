import { Metric } from 'app/core/models/hire';

export interface PipelineTrackerData {
  metric: Metric;
  tasks: Record<string, number>;
}
