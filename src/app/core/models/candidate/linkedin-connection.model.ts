import { Industry } from 'app/core/models/candidate/industry.model';
import { UserLocationData } from 'app/core/models/identity/user-location-data.model';

export interface LinkedinConnection {
  id: number;
  firstName: string;
  lastName: string;
  headline: string;
  pictureUrl: string;
  industry: Industry;
  location: UserLocationData;
}
