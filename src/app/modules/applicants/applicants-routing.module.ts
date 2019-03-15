import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApplicantsTrackingPageComponent } from './pages/applicants-tracking-page/applicants-tracking-page.component';

const routes: Routes = [{
  path: 'tracking',
  component: ApplicantsTrackingPageComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicantsRoutingModule { }
