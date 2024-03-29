import { AppFeature } from 'app/core/models/app/app-feature.model';
import { CandidateLanguage } from 'app/core/models/candidate/candidate-language.model';
import { Industry } from 'app/core/models/candidate/industry.model';
import { LinkedinConnection } from 'app/core/models/candidate/linkedin-connection.model';
import { UserAvatar } from 'app/core/models/current-user/user-avatar.model';
import { UserSecurity } from 'app/core/models/current-user/user-security.model';
import { UserLocationData } from 'app/core/models/identity/user-location-data.model';
import { BusySlot } from 'app/core/models/slot/busy-slot.model';

export interface Interviewee {
  type: string;
  userAvatars: UserAvatar[];
  id: number;
  averageRatings: number;
  workedHours: number;
  billedHours: number;
  industry?: Industry;
  languages?: CandidateLanguage[];
  connections: LinkedinConnection[];
  skypeId: string;
  agreementAccepted: boolean;
  intercomId: string;
  email: string;
  printableName: string;
  userSecurity: UserSecurity;
  candidate: boolean;
  personal: boolean;
  location: UserLocationData;
  avatarTypes: string[];
  headline: string;
  photoUrl: string;
  busySlots: BusySlot[];
  manager: boolean;
  companyAdmin: boolean;
  firstName: string;
  lastName: string;
  userId: number;
  availability?: string;
  appFeatures: AppFeature[];
}
