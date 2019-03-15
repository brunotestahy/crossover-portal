import { AppFeature } from 'app/core/models/app/app-feature.model';
import { UserAvatar } from 'app/core/models/current-user/user-avatar.model';
import { UserSecurity } from 'app/core/models/current-user/user-security.model';
import { UserLocationData } from 'app/core/models/identity/user-location-data.model';
import { BusySlot } from 'app/core/models/slot/busy-slot.model';

export interface CurrentUserResponse {
  headline: string;
  summary: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdOn: string;
  updatedOn: string;
  busySlots: BusySlot[];
  photoUrl: string;
  appFeatures: AppFeature[];
  avatarTypes: string[];
  userAvatars: UserAvatar[];
  userSecurity: UserSecurity;
  location: UserLocationData;
  infoShared: boolean;
  printableName: string;
}
