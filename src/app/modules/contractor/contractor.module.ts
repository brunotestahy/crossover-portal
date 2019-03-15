import { CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { DfAccordionModule, DfAlertModule, DfIconModule } from '@devfactory/ngx-df';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { CheckInChatsMemberComponent } from 'app/modules/contractor/components/check-in-chats/member/check-in-chats-member.component';
import { CheckInChatsSummaryComponent } from 'app/modules/contractor/components/check-in-chats/summary/check-in-chats-summary.component';
import { ContractorScreenCardComponent } from 'app/modules/contractor/components/contractor-screen-card/contractor-screen-card.component';
import { ActivitiesChartComponent } from 'app/modules/contractor/components/dashboard/activities-chart/activities-chart.component';
import { ContractorActivityComponent } from 'app/modules/contractor/components/dashboard/contractor-activity/contractor-activity.component';
import { ContractorsDesksComponent } from 'app/modules/contractor/components/dashboard/contractors-desks/contractors-desks.component';
import { WorkflowsWizardComponent } from 'app/modules/contractor/components/dashboard/workflows-wizard/workflows-wizard.component';
import { WorkflowsWidgetComponent } from 'app/modules/contractor/components/dashboard/workflows/widget/workflows-widget.component';
import { TeamSettingsComponent } from 'app/modules/contractor/components/organization/team-settings/team-settings.component';
import { MetricChartComponent } from 'app/modules/contractor/components/team-metrics/metric-chart-view/metric-chart.component';
import { MetricTableComponent } from 'app/modules/contractor/components/team-metrics/metric-table-view/metric-table.component';
import {
  TeamSummaryChartComponent,
} from 'app/modules/contractor/components/team-summary-chart/team-summary-chart.component';
import {
  TeamSummarySelectorComponent,
} from 'app/modules/contractor/components/team-summary-selector/team-summary-selector.component';
import { ContractorRoutingModule } from 'app/modules/contractor/contractor-routing.module';
import { AssignmentsPageComponent } from 'app/modules/contractor/pages/assignments-page/assignments-page.component';
import { CheckInChatsComponent } from 'app/modules/contractor/pages/check-in-chats/check-in-chats.component';
import { DashboardComponent } from 'app/modules/contractor/pages/dashboard/dashboard.component';
import { EarningsComponent } from 'app/modules/contractor/pages/earnings/earnings.component';
import { HireComponent } from 'app/modules/contractor/pages/hire/hire.component';
import {
  DataFetchingService as HiringDataFetchingService,
} from 'app/modules/contractor/pages/hire/services/data-fetching.service';
import { OrganizationComponent } from 'app/modules/contractor/pages/organization/organization.component';
import { RankAndReviewComponent } from 'app/modules/contractor/pages/rank-and-review/rank-and-review.component';
import { TeamActivitiesComponent } from 'app/modules/contractor/pages/team-activities/team-activities.component';
import { TeamHistoryComponent } from 'app/modules/contractor/pages/team-history/team-history.component';
import {
  DeskDotComSettingsComponent,
} from 'app/modules/contractor/pages/team-metrics/settings/desk-dot-com/desk-dot-com-settings.component';
import {
  DeskDotComServerSettingsComponent,
} from 'app/modules/contractor/pages/team-metrics/settings/desk-dot-com/server/desk-dot-com-server-settings.component';
import { GoogleSheetsComponent } from 'app/modules/contractor/pages/team-metrics/settings/google-sheets/google-sheets-settings.component';
import { JiraSettingsComponent } from 'app/modules/contractor/pages/team-metrics/settings/jira/jira-settings.component';
import { JiraServerSettingsComponent } from 'app/modules/contractor/pages/team-metrics/settings/jira/server/jira-server-settings.component';
import { ManualSettingsComponent } from 'app/modules/contractor/pages/team-metrics/settings/manual/manual-settings.component';
import { SalesforceSettingsComponent } from 'app/modules/contractor/pages/team-metrics/settings/salesforce/salesforce-settings.component';
import { SettingsSourcesComponent } from 'app/modules/contractor/pages/team-metrics/settings/sources/settings-sources.component';
import { TeamMetricsSettingsComponent } from 'app/modules/contractor/pages/team-metrics/settings/team-metrics-settings.component';
import {
  ZendeskServerSettingsComponent,
} from 'app/modules/contractor/pages/team-metrics/settings/zendesk/server/zendesk-server-settings.component';
import { ZendeskSettingsComponent } from 'app/modules/contractor/pages/team-metrics/settings/zendesk/zendesk-settings.component';
import { TeamMetricsComponent } from 'app/modules/contractor/pages/team-metrics/team-metrics.component';
import {
  DataFetchingService as TeamSummaryDataFetchingService,
} from 'app/modules/contractor/pages/team-summary/services/data-fetching.service';
import {
  DataFormattingService as TeamSummaryDataFormattingService,
} from 'app/modules/contractor/pages/team-summary/services/data-formatting.service';
import {
  DataRenderingService as TeamSummaryDataRenderingService,
} from 'app/modules/contractor/pages/team-summary/services/data-rendering.service';
import {
  NavigationService as TeamSummaryNavigationService,
} from 'app/modules/contractor/pages/team-summary/services/navigation.service';
import {
  PerformanceDataService as TeamSummaryPerformanceDataService,
} from 'app/modules/contractor/pages/team-summary/services/performance-data.service';
import { TeamSummaryComponent } from 'app/modules/contractor/pages/team-summary/team-summary.component';
import { TimesheetComponent } from 'app/modules/contractor/pages/timesheet/timesheet.component';
import { TimezonesComponent } from 'app/modules/contractor/pages/timezones/timezones.component';
import { MyDashboardModule } from 'app/modules/my-dashboard/my-dashboard.module';
import { SharedModule } from 'app/shared/shared.module';

import { TeamsSelectorComponent } from './components/teams-selector/teams-selector.component';
import { ScrollRangeDirective } from './directives/scroll-range.directive';
import { ReportsComponent } from './pages/reports/reports.component';

@NgModule({
  imports: [
    SharedModule,
    MyDashboardModule,
    ContractorRoutingModule,
    DfAccordionModule.forRoot(),
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    DfIconModule.forRoot(),
    DfAlertModule.forRoot(),
  ],
  declarations: [
    AssignmentsPageComponent,
    CheckInChatsComponent,
    CheckInChatsMemberComponent,
    CheckInChatsSummaryComponent,
    EarningsComponent,
    TimezonesComponent,
    TimesheetComponent,
    TeamSummaryComponent,
    RankAndReviewComponent,
    TeamActivitiesComponent,
    TeamMetricsComponent,
    JiraSettingsComponent,
    JiraServerSettingsComponent,
    SettingsSourcesComponent,
    TeamMetricsSettingsComponent,
    ZendeskSettingsComponent,
    ZendeskServerSettingsComponent,
    SalesforceSettingsComponent,
    DeskDotComServerSettingsComponent,
    DeskDotComSettingsComponent,
    GoogleSheetsComponent,
    ManualSettingsComponent,
    TeamSettingsComponent,
    OrganizationComponent,
    DashboardComponent,
    ContractorScreenCardComponent,
    TeamSummaryChartComponent,
    TeamSummarySelectorComponent,
    ContractorsDesksComponent,
    HireComponent,
    MetricTableComponent,
    MetricChartComponent,
    ReportsComponent,
    TeamsSelectorComponent,
    ContractorActivityComponent,
    WorkflowsWizardComponent,
    TeamHistoryComponent,
    ScrollRangeDirective,
    ActivitiesChartComponent,
    WorkflowsWidgetComponent,
  ],
  providers: [
    CurrencyPipe,
    HiringDataFetchingService,
    TeamSummaryDataFetchingService,
    TeamSummaryDataFormattingService,
    TeamSummaryDataRenderingService,
    TeamSummaryNavigationService,
    TeamSummaryPerformanceDataService,
  ],
})
export class ContractorModule {}
