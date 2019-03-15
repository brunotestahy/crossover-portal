import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EndorsementComponent } from './pages/endorsement/endorsement.component';

const routes: Routes = [
  {
    path: 'applicants-endorsement',
    component: EndorsementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountManagerRoutingModule { }
