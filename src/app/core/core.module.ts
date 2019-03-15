import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import * as showdown from 'showdown';

import { AuthGuard } from 'app/core/guards/auth-guard.service';
import { CanDeactivateGuard } from 'app/core/guards/can-deactivate.guard';
import { InitialLoginGuard } from 'app/core/guards/initial-login.guard';
import { TimezoneCheckGuard } from 'app/core/guards/timezone-check.guard';
import { AuthTokenInterceptor } from 'app/core/interceptors/auth-token.interceptor';
import { IeCachePreventerInterceptor } from 'app/core/interceptors/ie-cache-preventer.interceptor';
import { AppsService } from 'app/core/services/apps/apps.service';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { CommonService } from 'app/core/services/common/common.service';
import { DocumentsService } from 'app/core/services/documents/documents.service';
import { DownloadService } from 'app/core/services/download/download.service';
import { EnforcerService } from 'app/core/services/enforcer/enforcer.service';
import { EnumsService } from 'app/core/services/enums/enums.service';
import { FinanceService } from 'app/core/services/finance/finance.service';
import { GoogleService } from 'app/core/services/google/google.service';
import { HireService } from 'app/core/services/hire/hire.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { InterviewService } from 'app/core/services/interview/interview.service';
import { JobApplicationService } from 'app/core/services/job-application/job-application.service';
import { LinkedInService } from 'app/core/services/linkedin/';
import { MetricService } from 'app/core/services/metric/metric.service';
import { NotificationService } from 'app/core/services/notification/notification.service';
import { PaymentInfoService } from 'app/core/services/payment-info/payment-info.service';
import { PipelineHealthService } from 'app/core/services/pipeline-health/pipeline-health.service';
import { PipelineSourcingService } from 'app/core/services/pipeline-sourcing/pipeline-sourcing.service';
import { ActivityInfoMapService } from 'app/core/services/productivity/activity-info-map.service';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import { TopBottomPerformerCalculatorService } from 'app/core/services/productivity/top-bottom-performer-calculator.service';
import { PublicService } from 'app/core/services/public/public.service';
import { ReportService } from 'app/core/services/report/report.service';
import { ReportsService } from 'app/core/services/reports/reports.service';
import { SlackService } from 'app/core/services/slack/slack.service';
import { TeamService } from 'app/core/services/team/team.service';
import { TestService } from 'app/core/services/test/test.service';
import { OnlineStatusService } from 'app/core/services/timetracking/online-status.service';
import { TimetrackingService } from 'app/core/services/timetracking/timetracking.service';
import { WorkflowsService } from 'app/core/services/workflows/workflows.service';
import { DOCUMENT_TOKEN, documentFactory } from 'app/core/tokens/document.token';
import { LOCAL_STORAGE_TOKEN, localStorageFactory } from 'app/core/tokens/local-storage.token';
import { SHOWDOWN_CONVERTER_TOKEN } from 'app/core/tokens/showdown.token';
import { WINDOW_TOKEN, windowFactory } from 'app/core/tokens/window.token';
import { TeamMetricsService } from 'app/shared/services/team-metrics/team-metrics.service';
import { UserDashboardService } from 'app/shared/services/user-dashboard/user-dashboard.service';

export function showdownFactory(): showdown.Converter {
  return new showdown.Converter({});
}

@NgModule({
  providers: [
    {
      provide: SHOWDOWN_CONVERTER_TOKEN,
      useFactory: showdownFactory,
    },
    {
      provide: WINDOW_TOKEN,
      useFactory: windowFactory,
    },
    {
      provide: DOCUMENT_TOKEN,
      useFactory: documentFactory,
    },
    {
      provide: LOCAL_STORAGE_TOKEN,
      useFactory: localStorageFactory,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: IeCachePreventerInterceptor,
      multi: true,
    },
    AppsService,
    AuthTokenService,
    IdentityService,
    DocumentsService,
    CommonService,
    EnumsService,
    GoogleService,
    LinkedInService,
    PublicService,
    SlackService,
    HireService,
    NotificationService,
    JobApplicationService,
    AuthGuard,
    InitialLoginGuard,
    TimezoneCheckGuard,
    AssignmentService,
    CandidateService,
    PaymentInfoService,
    InterviewService,
    TeamService,
    TestService,
    ReportService,
    PipelineHealthService,
    PipelineSourcingService,
    TimetrackingService,
    OnlineStatusService,
    TopBottomPerformerCalculatorService,
    ActivityInfoMapService,
    ProductivityService,
    DownloadService,
    UserDashboardService,
    MetricService,
    EnforcerService,
    FinanceService,
    TeamMetricsService,
    ReportsService,
    WorkflowsService,
    CanDeactivateGuard,
  ],
})
export class CoreModule {}
