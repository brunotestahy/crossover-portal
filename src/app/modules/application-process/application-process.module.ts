import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DfGroupToggleModule } from '@devfactory/ngx-df';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SharedModule } from 'app/shared/shared.module';

import { ApplicationProcessRoutingModule } from './application-process-routing.module';
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
import { ApplicationProcessService } from './shared/application-process.service';

@NgModule({
  imports: [
    CommonModule,
    ApplicationProcessRoutingModule,
    SharedModule,
    DfGroupToggleModule,
    FroalaEditorModule,
    FroalaViewModule,
  ],
  declarations: [
    WelcomeComponent,
    CreateBasicProfileComponent,
    ApplicationProcessComponent,
    TechnicalScreenComponent,
    WrittenEvaluationWelcomeComponent,
    WrittenEvaluationAssignmentComponent,
    WrittenEvaluationSubmittedComponent,
    ProjectEvaluationWelcomeComponent,
    ProjectEvaluationInstructionsComponent,
    ProjectEvaluationAssignmentComponent,
    ProjectEvaluationSubmittedComponent,
    MeetYourAdvocateComponent,
    MarketplaceComponent,
    TestingInvitePendingComponent,
    ApplicationProcessRejectedComponent,
    CancelApplicationPageComponent,
  ],
  providers: [ApplicationProcessService],
})
export class ApplicationProcessModule {
}
