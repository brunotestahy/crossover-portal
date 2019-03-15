import { Job } from 'app/core/models/hire';
import { CampaignStatistic } from 'app/core/models/job-sourcing';

export interface JobSourcingDetailsResponse {
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
  campaignsStatistics: CampaignStatistic[];
}
