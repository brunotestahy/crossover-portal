import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamSettingsComponent } from 'app/modules/contractor/components/organization/team-settings/team-settings.component';
import { AssignmentsPageComponent } from 'app/modules/contractor/pages/assignments-page/assignments-page.component';
import { CheckInChatsComponent } from 'app/modules/contractor/pages/check-in-chats/check-in-chats.component';
import { DashboardComponent } from 'app/modules/contractor/pages/dashboard/dashboard.component';
import { EarningsComponent } from 'app/modules/contractor/pages/earnings/earnings.component';
import { HireComponent } from 'app/modules/contractor/pages/hire/hire.component';
import { OrganizationComponent } from 'app/modules/contractor/pages/organization/organization.component';
import { RankAndReviewComponent } from 'app/modules/contractor/pages/rank-and-review/rank-and-review.component';
import { ReportsComponent } from 'app/modules/contractor/pages/reports/reports.component';
import { TeamActivitiesComponent } from 'app/modules/contractor/pages/team-activities/team-activities.component';
import { TeamHistoryComponent } from 'app/modules/contractor/pages/team-history/team-history.component';
import { TeamMetricsComponent } from 'app/modules/contractor/pages/team-metrics/team-metrics.component';
import { DataFetchingService } from 'app/modules/contractor/pages/team-summary/services/data-fetching.service';
import { DataFormattingService } from 'app/modules/contractor/pages/team-summary/services/data-formatting.service';
import { DataRenderingService } from 'app/modules/contractor/pages/team-summary/services/data-rendering.service';
import { NavigationService } from 'app/modules/contractor/pages/team-summary/services/navigation.service';
import { PerformanceDataService } from 'app/modules/contractor/pages/team-summary/services/performance-data.service';
import { TeamSummaryComponent } from 'app/modules/contractor/pages/team-summary/team-summary.component';
import { TimesheetComponent } from 'app/modules/contractor/pages/timesheet/timesheet.component';
import { TimezonesComponent } from 'app/modules/contractor/pages/timezones/timezones.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'my-dashboard',
  },
  {
    path: 'assignments',
    component: AssignmentsPageComponent,
  },
  {
    path: 'check-in-chats',
    component: CheckInChatsComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'earnings',
    component: EarningsComponent,
  },
  {
    path: 'my-dashboard',
    loadChildren: 'app/modules/my-dashboard/my-dashboard.module#MyDashboardModule',
  },
  {
    path: 'team-activities',
    component: TeamActivitiesComponent,
  },
  {
    path: 'team-history',
    component: TeamHistoryComponent,
  },
  {
    path: 'timezones',
    component: TimezonesComponent,
  },
  {
    path: 'timesheet',
    component: TimesheetComponent,
  },
  {
    path: 'team-summary',
    component: TeamSummaryComponent,
  },
  {
    path: 'rank-and-review',
    component: RankAndReviewComponent,
  },
  {
    path: 'team-metrics',
    component: TeamMetricsComponent,
  },
  {
    path: 'reports',
    component: ReportsComponent,
  },
  {
    path: 'team-organization',
    component: OrganizationComponent,
  },
  {
    path: 'team-hire',
    component: HireComponent,
  },
  {
    path: 'team-settings',
    component: TeamSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [DataFetchingService, DataFormattingService, DataRenderingService, NavigationService, PerformanceDataService],
  exports: [RouterModule],
})
export class ContractorRoutingModule {}
