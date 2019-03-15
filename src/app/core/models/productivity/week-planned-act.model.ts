import { Activity } from 'app/core/models/productivity/activity.model';

export interface WeekPlannedAct {
  id: number;
  activity: Activity;
  actTimeLong: number;
}
