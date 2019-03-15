import { NgModule } from '@angular/core';

import { PendingInterviewOffersComponent } from 'app/modules/report/pages/pending-interview-offers/pending-interview-offers.component';
import { ReportPageIndexComponent } from 'app/modules/report/pages/report-page-index/report-page-index.component';
import { TeamPerformanceComponent } from 'app/modules/report/pages/team-performance/team-performance.component';
import { UpcomingInterviewsComponent } from 'app/modules/report/pages/upcoming-interviews/upcoming-interviews.component';
import { ReportRoutingModule } from 'app/modules/report/report-routing.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [ReportRoutingModule, SharedModule],
  declarations: [
    UpcomingInterviewsComponent,
    PendingInterviewOffersComponent,
    ReportPageIndexComponent,
    TeamPerformanceComponent,
  ],
})
export class ReportModule { }
