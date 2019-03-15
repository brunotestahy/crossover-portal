import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { ApplicantsRoutingModule } from './applicants-routing.module';
import { ApplicantsTrackingPageComponent } from './pages/applicants-tracking-page/applicants-tracking-page.component';

@NgModule({
  imports: [SharedModule, ApplicantsRoutingModule],
  declarations: [ApplicantsTrackingPageComponent],
})
export class ApplicantsModule {}
