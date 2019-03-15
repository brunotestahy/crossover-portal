import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PendingInterviewOffersComponent } from 'app/modules/report/pages/pending-interview-offers/pending-interview-offers.component';
import { ReportPageIndexComponent } from 'app/modules/report/pages/report-page-index/report-page-index.component';
import { TeamPerformanceComponent } from 'app/modules/report/pages/team-performance/team-performance.component';
import { UpcomingInterviewsComponent } from 'app/modules/report/pages/upcoming-interviews/upcoming-interviews.component';

const routes: Routes = [
  {
    path: '',
    component: ReportPageIndexComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/report/team-performance',
      },
      {
        path: 'upcoming-interviews',
        component: UpcomingInterviewsComponent,
      },
      {
        path: 'pending-interviews',
        component: PendingInterviewOffersComponent,
      },
      {
        path: 'team-performance',
        component: TeamPerformanceComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule { }
