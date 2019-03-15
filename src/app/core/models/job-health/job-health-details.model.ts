import { JobHealthCurrentState } from 'app/core/models/job-health';

export interface JobHealthDetails {
  createdOn: string;
  jobTitle: string;
  jobOpeningDate: string;
  yearSalary: number;
  currentStates: JobHealthCurrentState[];
  totalApplicants: number;
}
