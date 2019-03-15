import { AppFeature } from 'app/core/models/app/app-feature.model';
import { BusySlot } from 'app/core/models/avatar/busy-slot.model';
import { UserAvatar } from 'app/core/models/current-user/user-avatar.model';
import { UserSecurity } from 'app/core/models/current-user/user-security.model';
import { UserLocationData } from 'app/core/models/identity/user-location-data.model';

export interface GenericAvatar {
  type: string;
  userAvatars: UserAvatar[];
  id: number;
  manager: boolean;
  userSecurity: UserSecurity;
  candidate: boolean;
  companyAdmin: boolean;
  avatarTypes: string[];
  email: string;
  firstName: string;
  lastName: string;
  userId: number;
  personal: boolean;
  headline: string;
  summary: string;
  printableName: string;
  photoUrl: string;
  busySlots: BusySlot[];
  appFeatures: AppFeature[];
  location: UserLocationData;
}
