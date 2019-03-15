import { PipelineStatistic } from 'app/core/models/job-sourcing';

export interface JobSourcingResponse {
  pipelineStatistics: PipelineStatistic[];
  total: number;
  totalDay: number;
  totalWeek: number;
  totalDemand: number;
}
