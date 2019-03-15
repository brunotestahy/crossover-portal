import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from 'app/containers/main/main.component';
import { AuthGuard } from 'app/core/guards/auth-guard.service';
import { InitialLoginGuard } from 'app/core/guards/initial-login.guard';
import { TimezoneCheckGuard } from 'app/core/guards/timezone-check.guard';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [InitialLoginGuard],
    children: [
      {
        path: '',
        loadChildren: 'app/modules/home/home.module#HomeModule',
      },
      {
        path: 'auth',
        loadChildren: 'app/modules/auth/auth.module#AuthModule',
      },
      {
        path: 'linkedin',
        loadChildren: 'app/modules/linkedin/linkedin.module#LinkedinModule',
      },
      {
        path: '',
        component: MainComponent,
        children: [
          // Routes that do not required user to be logged in
          {
            path: 'documents',
            loadChildren:
              'app/modules/privacy-policy/privacy-policy.module#PrivacyPolicyModule',
          },
          {
            path: 'candidate-terms',
            loadChildren:
              'app/modules/candidate-terms/candidate-terms.module#CandidateTermsModule',
          },
          {
            path: 'support',
            loadChildren: 'app/modules/support/support.module#SupportModule',
          },
          {
            path: 'marketplace',
            loadChildren:
              'app/modules/marketplace/marketplace.module#MarketplaceModule',
          },
          {
            path: 'signup',
            loadChildren: 'app/modules/signup/signup.module#SignupModule',
          },
          // Routes that require user to be logged in
          {
            path: '',
            canActivate: [AuthGuard, TimezoneCheckGuard],
            children: [
              {
                path: '',
                children: [
                  {
                    path: 'resources',
                    loadChildren:
                      'app/modules/resources/resources.module#ResourcesModule',
                  },
                  {
                    path: 'settings',
                    loadChildren:
                      'app/modules/settings/settings.module#SettingsModule',
                  },
                  {
                    path: 'worksmart',
                    loadChildren:
                      'app/modules/worksmart/worksmart.module#WorksmartModule',
                  },
                  {
                    path: 'notifications',
                    loadChildren:
                      'app/modules/notifications/notifications.module#NotificationsModule',
                  },
                  {
                    path: 'candidate',
                    loadChildren:
                      'app/modules/candidate/candidate.module#CandidateModule',
                  },
                  {
                    path: 'grading',
                    loadChildren:
                      'app/modules/grading/grading.module#GradingModule',
                  },
                  {
                    path: 'profile',
                    loadChildren:
                      'app/modules/profile/profile.module#ProfileModule',
                  },
                  {
                    path: 'contractor',
                    loadChildren: 'app/modules/contractor/contractor.module#ContractorModule',
                  },
                  {
                    path: 'contract',
                    loadChildren:
                      'app/modules/contract/contract.module#ContractModule',
                  },
                  {
                    path: 'interview',
                    loadChildren:
                      'app/modules/interview/interview.module#InterviewModule',
                  },
                  {
                    path: 'job-dashboard',
                    loadChildren:
                      'app/modules/job-dashboard/job-dashboard.module#JobDashboardModule',
                  },
                  {
                    path: 'applicants',
                    loadChildren:
                      'app/modules/applicants/applicants.module#ApplicantsModule',
                  },
                  {
                    path: 'talent-advocacy',
                    loadChildren:
                      'app/modules/talent-advocacy/talent-advocacy.module#TalentAdvocacyModule',
                  },
                  {
                    path: 'pipeline-tracker',
                    loadChildren:
                      'app/modules/pipeline-tracker/pipeline-tracker.module#PipelineTrackerModule',
                  },
                  {
                    path: 'pipeline-sourcing',
                    loadChildren:
                      'app/modules/pipeline-sourcing/pipeline-sourcing.module#PipelineSourcingModule',
                  },
                  {
                    path: 'pipeline-health',
                    loadChildren:
                      'app/modules/pipeline-health/pipeline-health.module#PipelineHealthModule',
                  },
                  {
                    path: 'report',
                    loadChildren:
                      'app/modules/report/report.module#ReportModule',
                  },
                  {
                    path: 'account-manager',
                    loadChildren:
                      'app/modules/account-manager/account-manager.module#AccountManagerModule',
                  },
                  {
                    path: 'enforcer',
                    loadChildren: 'app/modules/enforcer/enforcer.module#EnforcerModule',
                  },
                  {
                    path: 'campaign-sourcing',
                    loadChildren: 'app/modules/campaign-sourcing/campaign-sourcing.module#CampaignSourcingModule',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // flag to enable/disable route logs
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
