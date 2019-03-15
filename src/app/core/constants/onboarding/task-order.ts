import { PaymentSetupSteps } from 'app/core/constants/onboarding-process';
import { TaskStep } from 'app/core/models/task';

export const TASKS_ORDER = {
  candidateProvidesTrackerPassword: 1,
  candidateProvidesResidenceInfo: 2,
  [PaymentSetupSteps.Payoneer]: 3,
  [PaymentSetupSteps.Paychex]: 3,
  candidateStartsBackgroundCheck: 4,
} as TaskStep;
