import { UserAvatar } from 'app/core/models/current-user/user-avatar.model';
import { UserSecurity } from 'app/core/models/current-user/user-security.model';
import { UserLocationData } from 'app/core/models/identity/user-location-data.model';
import { BusySlot } from 'app/core/models/slot/busy-slot.model';

export interface CurrentUser {
  headline: string;
  summary: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdOn: string;
  busySlots: BusySlot[];
  photoUrl: string;
  appFeatures: string[];
  avatarTypes: string[];
  userAvatars: UserAvatar[];
  userSecurity: UserSecurity;
  location: UserLocationData;
  infoShared: boolean;
  printableName: string;
  type?: string;
}
