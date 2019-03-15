import { AnonymousCandidateData } from 'app/core/models/hire';
import { CurrentUserDetail } from 'app/core/models/identity';

export interface ApplyToJobUserData {
  application: {
    candidate: AnonymousCandidateData | CurrentUserDetail;
    job: { id: number };
    campaign: string;
  };
  resume: File;
}
