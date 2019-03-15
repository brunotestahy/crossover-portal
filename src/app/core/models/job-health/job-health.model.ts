import { JobHealthJob } from 'app/core/models/job-health';

export interface JobHealth {
  id?: number;
  test1Count: number;
  test2Count: number;
  applicationsCount: number;
  marketplaceCount: number;
  interviewsCount: number;
  hiresCount: number;
  hiresPercentage: number;
  weekStartDate: string;
  lastInterviewDate?: string;
  lastArriveInMP?: string;
  applicationsIndicator: string;
  hiresIndicator: string;
  interviewsIndicator: string;
  marketplaceIndicator: string;
  job: JobHealthJob;
  test1Indicator?: string;
  test2Indicator?: string;
}
