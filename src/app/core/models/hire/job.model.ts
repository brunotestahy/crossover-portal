import { ApplicationFlow } from 'app/core/models/application/application-flow.model';
import { JobCalibration } from 'app/core/models/hire/job-calibration.model';
import { JobLabel } from 'app/core/models/hire/job-label.model';
import { TestDetails } from 'app/core/models/hire/test-details.model';
import { Manager } from 'app/core/models/manager/manager.model';

export interface Job {
  id: number;
  variantName?: string;
  title: string;
  salary?: number;
  salaryType?: string;
  salaryUnit?: string;
  trackerRequired: boolean;
  status?: string;
  applicationFlow: ApplicationFlow;
  jbpEnabled: boolean;
  outboundEnabled: boolean;
  activationDate: string;
  workingHoursPerWeek: number;
  autoEndorse: boolean;
  flowType: string;
  yearSalary?: number;
  testSetupCompleted: boolean;
  imageUrl?: string;
  applicationType?: string;
  label?: JobLabel;
  type?: 'GENERIC' | 'CUSTOM';
  visibleManagers?: Manager[];
  tests?: TestDetails[];
  calibration?: JobCalibration;
  priority?: number;
  demand?: number;
  sourcingInstructions?: string;
  jbpInstructions?: string;
  outboundInstructions?: string;
  // tslint:disable-next-line:no-any
  recruiter?: any;
}
