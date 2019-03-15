import { Country } from 'app/core/models/country';

export interface AnonymousCandidateData {
  email: string;
  type: string;
  firstName: string;
  lastName: string;
  userSecurity?: {
    rawPassword: string;
  };
  location: { country: Country };
  recaptchaResponse?: string;
  jobId: number;
}
