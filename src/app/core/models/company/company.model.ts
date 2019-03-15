import { AccountManager } from 'app/core/models/account-manager/account-manager.model';
import { App } from 'app/core/models/app/app.model';
import { UserLocationData } from 'app/core/models/identity/user-location-data.model';
import { Manager } from 'app/core/models/manager/manager.model';

export interface Company {
  accountManager?: AccountManager;
  administrators?: Array<Manager>;
  apps?: Array<App>;
  bdcCustomerId?: string;
  createdOn?: string;
  currentBalance?: number;
  dfcCompanyId?: number;
  id: number;
  internal?: boolean;
  location?: UserLocationData;
  name?: string;
  updatedOn?: string;
  website?: string;
  xoPercentage?: number;
}
