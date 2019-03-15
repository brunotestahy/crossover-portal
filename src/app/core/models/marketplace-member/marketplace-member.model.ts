import { Application } from 'app/core/models/application';

export interface MarketplaceMember {
  application: Application;
  createdOn?: string;
  id: number;
  inactivationReason?: string;
  status?: string;
  updatedOn?: string;
}
