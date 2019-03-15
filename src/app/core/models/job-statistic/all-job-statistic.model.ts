import { Job } from 'app/core/models/hire';
import { JobStatistic } from 'app/core/models/job-statistic';

export interface AllJobStatistic extends JobStatistic {
  job: Job;
}
