import { Activity } from 'app/core/models/productivity/activity.model';

export interface DaySlot {
  actTimeLong: number;
  activity?: Activity;
  endTime: string;
  id: number;
  startTime: string;
}
