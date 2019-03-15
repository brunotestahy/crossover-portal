import { Activity } from 'app/core/models/productivity/activity.model';

export interface ProductivityGroupList {
  activity: Activity;
  plannedTime: number;
}
