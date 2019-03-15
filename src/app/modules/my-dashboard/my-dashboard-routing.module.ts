import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyActivityPageComponent } from 'app/modules/my-dashboard/pages/my-activity-page/my-activity-page.component';
import { MyLogbookPageComponent } from 'app/modules/my-dashboard/pages/my-logbook-page/my-logbook-page.component';
import { MyMetricPageComponent } from 'app/modules/my-dashboard/pages/my-metric-page/my-metric-page.component';
import { MyUserProfileComponent } from 'app/modules/my-dashboard/pages/my-user-profile/my-user-profile.component';

import { MyDashboardPageComponent } from './pages/my-dashboard-page/my-dashboard-page.component';
import { MySummaryPageComponent } from './pages/my-summary-page/my-summary-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'summary',
  },
  {
    path: '',
    component: MyDashboardPageComponent,
    children: [
      {
        path: 'summary',
        component: MySummaryPageComponent,
      },
      {
        path: 'activity',
        component: MyActivityPageComponent,
      },
      {
        path: 'logbook',
        component: MyLogbookPageComponent,
      },
      {
        path: 'metric',
        component: MyMetricPageComponent,
      },
      {
        path: 'profile',
        component: MyUserProfileComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyDashboardRoutingModule {}
