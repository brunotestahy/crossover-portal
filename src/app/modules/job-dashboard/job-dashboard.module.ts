import { NgModule } from '@angular/core';

import { JobDashboardRoutingModule } from 'app/modules/job-dashboard/job-dashboard-routing.module';
import {
  JobDashboardIndexPageComponent,
} from 'app/modules/job-dashboard/pages/job-dashboard-index-page/job-dashboard-index-page.component';
import {
  MarketplaceMembersComponent,
} from 'app/modules/job-dashboard/pages/marketplace-members/marketplace-members.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    JobDashboardRoutingModule,
  ],
  declarations: [JobDashboardIndexPageComponent, MarketplaceMembersComponent],
})
export class JobDashboardModule { }
