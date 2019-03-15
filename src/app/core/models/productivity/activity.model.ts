import { ProductivityApplication } from 'app/core/models/productivity/productivity-application.model';

export interface Activity {
  color: string;
  id: number;
  name: string;
  productivityApplications?: ProductivityApplication[];
  timeUsed: number;
}
