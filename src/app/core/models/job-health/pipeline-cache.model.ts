import { JobHealth } from 'app/core/models/job-health/job-health.model';

export type PipelineCache = Record<string, JobHealth[] | undefined>;
