import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { PrivacyPolicyPageComponent } from './containers/privacy-policy-page/privacy-policy-page.component';
import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';

@NgModule({
  imports: [
    PrivacyPolicyRoutingModule,
    SharedModule,
  ],
  providers: [
  ],
  declarations: [PrivacyPolicyPageComponent],
})
export class PrivacyPolicyModule { }
