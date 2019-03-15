import { Manager } from 'app/core/models/manager';
import { Team } from 'app/core/models/team';

export interface AssignmentHistory {
  id: number;
  effectiveDateBegin?: string;
  effectiveDateEnd?: string;
  assignmentHistoryStatus?: string;
  team?: Team;
  manager: Manager;
  salary?: number;
  salaryType?: string;
  salaryUnit?: string;
  paymentPlatform?: string;
  weeklyLimit?: number;
  createdOn?: string;
  status?: string;
  activeMetricType?: string;
  activeMetricName?: string;
  name?: string;
  jobTitle?: string;
}
