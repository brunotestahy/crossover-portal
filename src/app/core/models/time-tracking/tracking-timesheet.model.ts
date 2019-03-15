import { Candidate } from 'app/core/models/candidate/candidate.model';
import { DailyStats } from 'app/core/models/time-tracking/daily-stats.model';

export interface TrackingTimesheet {
  assignmentId: number;
  averageHoursPerDay: number;
  candidate: Candidate;
  candidateId: number;
  dfcUserId: number;
  hourWorked: string;
  manualHourWorked: string;
  stats: Array<DailyStats>;
  totalHours: number;
  userName: string;
  name: string;
  country: string;
  weekStartDate: Date;
  weekEndDate: Date;
  printableTime: string;
}
