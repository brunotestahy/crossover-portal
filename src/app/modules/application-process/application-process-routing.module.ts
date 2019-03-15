import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApplicationProcessRejectedComponent } from './pages/application-process-rejected/application-process-rejected.component';
import { ApplicationProcessComponent } from './pages/application-process/application-process.component';
import { CancelApplicationPageComponent } from './pages/cancel-application-page/cancel-application-page.component';
import { CreateBasicProfileComponent } from './pages/create-basic-profile/create-basic-profile.component';
import { MarketplaceComponent } from './pages/marketplace/marketplace.component';
import { MeetYourAdvocateComponent } from './pages/meet-your-advocate/meet-your-advocate.component';
import { ProjectEvaluationAssignmentComponent } from './pages/project-evaluation-assignment/project-evaluation-assignment.component';
import { ProjectEvaluationInstructionsComponent } from './pages/project-evaluation-instructions/project-evaluation-instructions.component';
import { ProjectEvaluationSubmittedComponent } from './pages/project-evaluation-submitted/project-evaluation-submitted.component';
import { ProjectEvaluationWelcomeComponent } from './pages/project-evaluation-welcome/project-evaluation-welcome.component';
import { TechnicalScreenComponent } from './pages/technical-screen/technical-screen.component';
import { TestingInvitePendingComponent } from './pages/testing-invite-pending/testing-invite-pending.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { WrittenEvaluationAssignmentComponent } from './pages/written-evaluation-assignment/written-evaluation-assignment.component';
import { WrittenEvaluationSubmittedComponent } from './pages/written-evaluation-submitted/written-evaluation-submitted.component';
import { WrittenEvaluationWelcomeComponent } from './pages/written-evaluation-welcome/written-evaluation-welcome.component';

const routes: Routes = [
  {
    path: 'cancel',
    component: CancelApplicationPageComponent,
  },
  {
    path: '',
    component: ApplicationProcessComponent,
    children: [
      {
        path: ':jobId',
        component: WelcomeComponent,
      },
      {
        path: ':jobId/job/:id',
        children: [
          {
            path: 'create-basic-profile',
            component: CreateBasicProfileComponent,
          },
          {
            path: 'technical-screen',
            component: TechnicalScreenComponent,
          },
          {
            path: 'written-evaluation-welcome',
            component: WrittenEvaluationWelcomeComponent,
          },
          {
            path: 'written-evaluation-assignment',
            component: WrittenEvaluationAssignmentComponent,
          },
          {
            path: 'written-evaluation-submitted',
            component: WrittenEvaluationSubmittedComponent,
          },
          {
            path: 'project-evaluation-welcome',
            component: ProjectEvaluationWelcomeComponent,
          },
          {
            path: 'project-evaluation-instructions',
            component: ProjectEvaluationInstructionsComponent,
          },
          {
            path: 'project-evaluation-assignment',
            component: ProjectEvaluationAssignmentComponent,
          },
          {
            path: 'project-evaluation-submitted',
            component: ProjectEvaluationSubmittedComponent,
          },
          {
            path: 'meet-your-advocate',
            component: MeetYourAdvocateComponent,
          },
          {
            path: 'marketplace',
            component: MarketplaceComponent,
          },
          {
            path: 'testing-invite-pending',
            component: TestingInvitePendingComponent,
          },
          {
            path: 'rejected',
            component: ApplicationProcessRejectedComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationProcessRoutingModule { }
