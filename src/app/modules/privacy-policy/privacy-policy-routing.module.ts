import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PrivacyPolicyPageComponent } from './containers/privacy-policy-page/privacy-policy-page.component';

const routes: Routes = [{
  path: 'privacy-policy',
  component: PrivacyPolicyPageComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivacyPolicyRoutingModule { }
