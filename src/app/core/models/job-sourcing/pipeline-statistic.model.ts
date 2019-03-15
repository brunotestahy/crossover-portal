import { Job } from 'app/core/models/hire';

export interface PipelineStatistic {
  id: number;
  job: Job;
  applicationsCount: number;
  applicationsCountDay: number;
  applicationsCountWeek: number;
  avgResumeScore: number;
  avgResumeScoreDay: number;
  avgResumeScoreWeek: number;
  qualityCount: number;
  qualityCountDay: number;
  qualityCountWeek: number;
}
