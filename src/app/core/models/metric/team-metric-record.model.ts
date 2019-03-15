import { WeekMetrics } from 'app/core/models/metric/week-metrics.model';

export interface TeamMetricRecord {
  name: string;
  assignmentId: number;
  contractorId?: number;
  metric: number;
  metricScoreClass?: string;
  cost: number;
  hoursLogged: number;
  username?: string;
  server?: string;
  teamRecord?: boolean;
  isActiveAssignment: boolean;
  photoUrl?: string;
  effectiveDateEndInTeam?: Date;
  weeks: { [key: string]: WeekMetrics };
  color?: string;
}
