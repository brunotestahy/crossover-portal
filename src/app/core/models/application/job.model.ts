import { ApplicationFlow, Label } from 'app/core/models/application';
import { Candidate } from 'app/core/models/candidate';

export interface Job {
  id: number;
  imageUrl?: string;
  title: string;
  trackerRequired: boolean;
  applicationFlow: ApplicationFlow;
  jbpEnabled: boolean;
  outboundEnabled: boolean;
  activationDate: string;
  workingHoursPerWeek: number;
  label?: Label;
  autoEndorse: boolean;
  flowType: string;
  testSetupCompleted: boolean;
  recruiter?: Candidate;
}
