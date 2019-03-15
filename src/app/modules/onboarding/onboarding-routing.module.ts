import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  BackgroundCheckComponent,
  FinishingUpComponent,
  OnboardingIndexComponent,
  PaychexCompleteComponent,
  PayoneerCompleteComponent,
  SetupPaymentComponent,
  SetupResidenceComponent,
  SetupTrackerComponent,
  WelcomeComponent,
} from 'app/modules/onboarding/pages';

const routes: Routes = [
  {
    path: 'payoneer-complete',
    component: PayoneerCompleteComponent,
  },
  {
    path: 'paychex-complete',
    component: PaychexCompleteComponent,
  },
  {
    path: ':id',
    component: OnboardingIndexComponent,
    children: [
      {
        path: 'welcome',
        component: WelcomeComponent,
      },
      {
        path: 'setup-tracker',
        component: SetupTrackerComponent,
      },
      {
        path: 'setup-residence',
        component: SetupResidenceComponent,
      },
      {
        path: 'setup-payment',
        component: SetupPaymentComponent,
      },
      {
        path: 'background-check',
        component: BackgroundCheckComponent,
      },
      {
        path: 'finishing-up',
        component: FinishingUpComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardingRoutingModule {
}
