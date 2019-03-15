import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  JobDashboardIndexPageComponent,
} from 'app/modules/job-dashboard/pages/job-dashboard-index-page/job-dashboard-index-page.component';
import {
  MarketplaceMembersComponent,
} from 'app/modules/job-dashboard/pages/marketplace-members/marketplace-members.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: JobDashboardIndexPageComponent,
  },
  {
    path: 'marketplace-members',
    component: MarketplaceMembersComponent,
  },
  {
    path: ':id/marketplace-members',
    component: MarketplaceMembersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobDashboardRoutingModule { }
