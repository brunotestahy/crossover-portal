import { AppFeature } from 'app/core/models/app/app-feature.model';
import { App } from 'app/core/models/app/app.model';
import { Assignment } from 'app/core/models/assignment/assignment.model';
import { UserAvatar } from 'app/core/models/current-user/user-avatar.model';
import { UserSecurity } from 'app/core/models/current-user/user-security.model';
import { UserLocationData } from 'app/core/models/identity/user-location-data.model';
import { Manager } from 'app/core/models/manager/manager.model';

export interface CurrentUserDetail {
  appFeatures: AppFeature[];
  applications: { [key: string]: App[] };
  assignment: Assignment;
  avatarTypes: string[];
  communicationStatus: string;
  email: string;
  firstName: string;
  fullName: string;
  headline: string;
  id: number;
  infoShared: boolean;
  lastName: string;
  location: UserLocationData;
  managerAvatar: Manager;
  photoUrl: string;
  summary: string;
  userAvatars: UserAvatar[];
  userSecurity: UserSecurity;
  type?: string;
}
