import { JobLabel } from 'app/core/models/hire/job-label.model';
import { JobSkill } from 'app/core/models/hire/job-skill.model';
import { Job } from 'app/core/models/hire/job.model';
import { TestDetails } from 'app/core/models/hire/test-details.model';

export interface JobDetails extends Job {
  candidateDescription?: string;
  managerDescription?: string;
  rate?: number;
  label?: JobLabel;
  skills?: JobSkill[];
  rubricTest?: TestDetails;
  tests?: TestDetails[];
}
