import { AppFeature } from 'app/core/models/app/app-feature.model';
import { UserAvatar } from 'app/core/models/current-user/user-avatar.model';
import { UserSecurity } from 'app/core/models/current-user/user-security.model';
import { UserLocationData } from 'app/core/models/identity/user-location-data.model';
import { Manager } from 'app/core/models/manager/manager.model';
import { BusySlot } from 'app/core/models/slot/busy-slot.model';

export interface AccountManager {
  appFeatures?: Array<AppFeature>;
  avatarTypes?: Array<string>;
  busySlots?: Array<BusySlot>;
  candidate?: boolean;
  companyAdmin?: boolean;
  createdOn?: string;
  demand?: number;
  email?: string;
  firstName?: string;
  gender?: string;
  headline?: string;
  id: number;
  lastActive?: string;
  lastName?: string;
  location?: UserLocationData;
  manager?: boolean;
  managers?: Array<Manager>;
  personal?: boolean;
  photoUrl?: string;
  printableName?: string;
  summary?: string;
  type?: string;
  updatedOn?: string;
  userAvatars?: Array<UserAvatar>;
  userId: number;
  userSecurity?: UserSecurity;
}
