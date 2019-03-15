import { VisibleManager } from 'app/core/models/job-health';

export interface JobHealthJob {
  id: number;
  title: string;
  activationDate: string;
  visibleManagers: VisibleManager[];
  flowType: string;
  yearSalary: number;
  demand?: number;
}
