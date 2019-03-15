import { WeekStats } from 'app/core/models/metric/week-stats.model';

export interface IndividualStat {
  activeWeek?: boolean;
  assignmentHistoryId?: number;
  assignmentId?: number;
  hoursWorked?: number;
  id?: number;
  queryUsed?: string;
  startDate?: string;
  ticketsResolved?: number;
  type?: string;
  weekSalary?: number;
  name?: string;
  photoUrl?: string;
  effectiveDateEndInTeam?: string;
  stats: WeekStats[];
}
