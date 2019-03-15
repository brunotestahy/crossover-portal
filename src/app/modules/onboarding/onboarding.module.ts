import { NgModule } from '@angular/core';

import { OnboardingRoutingModule } from 'app/modules/onboarding/onboarding-routing.module';
import {
  BackgroundCheckComponent,
  FinishingUpComponent,
  PaychexCompleteComponent,
  PayoneerCompleteComponent,
  SetupPaymentComponent,
  SetupResidenceComponent,
  SetupTrackerComponent,
  WelcomeComponent,
} from 'app/modules/onboarding/pages';
import { OnboardingIndexComponent } from 'app/modules/onboarding/pages/onboarding-index/onboarding-index.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    OnboardingRoutingModule,
  ],
  declarations: [
    WelcomeComponent,
    SetupTrackerComponent,
    SetupResidenceComponent,
    SetupPaymentComponent,
    BackgroundCheckComponent,
    FinishingUpComponent,
    OnboardingIndexComponent,
    PaychexCompleteComponent,
    PayoneerCompleteComponent,
  ],
})
export class OnboardingModule {}
