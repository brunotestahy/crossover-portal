import { NgModule } from '@angular/core';
import { MyActivityPageComponent } from 'app/modules/my-dashboard/pages/my-activity-page/my-activity-page.component';
import { MyMetricPageComponent } from 'app/modules/my-dashboard/pages/my-metric-page/my-metric-page.component';
import { MyUserProfileComponent } from 'app/modules/my-dashboard/pages/my-user-profile/my-user-profile.component';
import { ProfileModule } from 'app/modules/profile/profile.module';
import { SharedModule } from 'app/shared/shared.module';

import { MyDashboardRoutingModule } from './my-dashboard-routing.module';
import { MyDashboardPageComponent } from './pages/my-dashboard-page/my-dashboard-page.component';
import { MyLogbookPageComponent } from './pages/my-logbook-page/my-logbook-page.component';
import { MySummaryPageComponent } from './pages/my-summary-page/my-summary-page.component';

@NgModule({
  imports: [
    SharedModule,
    MyDashboardRoutingModule,
    ProfileModule,
  ],
  exports: [
    MyDashboardPageComponent,
  ],
  declarations: [
    MyDashboardPageComponent,
    MySummaryPageComponent,
    MyLogbookPageComponent,
    MyActivityPageComponent,
    MyMetricPageComponent,
    MyUserProfileComponent,
  ],
})
export class MyDashboardModule { }
