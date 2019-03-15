import { PaymentSetupSteps } from 'app/core/constants/onboarding-process/payment-setup-steps';
import { StepDefinition } from 'app/core/models/assignment';

export const ONBOARDING_PROCESS_STEP_DEF: StepDefinition[] = [
  {
    names: ['candidateProvidesTrackerPassword'],
    state: 'setup-tracker',
    order: 1,
  },
  {
    names: ['candidateProvidesResidenceInfo'],
    state: 'setup-residence',
    order: 2,
  },
  {
    names: [PaymentSetupSteps.Payoneer, PaymentSetupSteps.Paychex],
    state: 'setup-payment',
    order: 3,
  },
  {
    names: ['candidateStartsBackgroundCheck'],
    state: 'background-check',
    order: 4,
  },
  {
    names: [],
    state: 'finishing-up',
    order: 5,
  },
];
