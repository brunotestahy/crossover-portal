import { CurrentUserDetail } from 'app/core/models/identity';

export interface JobApplicationDataForLoggedUser {
  candidate: CurrentUserDetail;
  job: { id: number };
  campaign: string;
  resume: File;
  type?: string;
}
