import { JobHealthJob } from 'app/core/models/job-health/job-health-job.model';
import { Indicator } from 'app/core/models/job-health/pipeline-health-indicator.model';
import { VisibleManager } from 'app/core/models/job-health/visible-manager.model';

export interface PipelineHealthRow {
  jobId: number;
  jobTitle: string;
  job: JobHealthJob;
  payband: string;
  daysSinceOpen: number | string;
  applications: string | number;
  technicalScreen: string | number;
  projectWrittenEvaluation: string | number;
  marketplace: string | number;
  marketplaceTimeAgo: string;
  interviews: string | number;
  interviewsTimeAgo: string;
  hires: number;
  hiresPercent: number;
  demand: number;
  demandIsAuto: boolean;
  managers: VisibleManager[];
  applicationsIndicator: Indicator;
  technicalScreenIndicator?: Indicator;
  projectWrittenEvaluationIndicator?: Indicator;
  marketplaceIndicator: Indicator;
  interviewsIndicator: Indicator;
  hiresIndicator: Indicator;
  daysSinceOpenSort: number;
  technicalScreenSort: number;
}
