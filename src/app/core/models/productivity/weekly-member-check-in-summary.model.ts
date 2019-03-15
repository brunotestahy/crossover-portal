import { CheckInStatus } from 'app/core/models/productivity';

export interface WeeklyMemberCheckInSummary {
  contractorId: number;
  fullName?: string;
  localTime?: string;
  metric?: string;
  metricLastWeek?: string;
  metricCurrentWeek?: string;
  hours?: string;
  hoursLastWeek?: string;
  hoursCurrentWeek?: string;
  blockStreak?: number;
  photoUrl?: string;
  monday?: CheckInStatus | undefined;
  tuesday?: CheckInStatus | undefined;
  wednesday?: CheckInStatus | undefined;
  thursday?: CheckInStatus | undefined;
  friday?: CheckInStatus | undefined;
  today?: CheckInStatus | undefined;
  monthDaysStatuses?: CheckInStatus[];
  comments?: string;
  blockage?: string;
  assignmentId?: number;
  skypeId?: string;
}
