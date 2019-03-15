import { NgModule } from '@angular/core';
import { AvailableJobsComponent } from 'app/modules/marketplace/pages/available-jobs/available-jobs.component';
import { SharedModule } from 'app/shared/shared.module';

import { JobApplyFormComponent } from './components/job-apply-form/job-apply-form.component';
import { PipelineApplyFormComponent } from './components/pipeline-apply-form/pipeline-apply-form.component';
import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { JobDescriptionComponent } from './pages/job-description/job-description.component';
import { PipelineDescriptionComponent } from './pages/pipeline-description/pipeline-description.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';

@NgModule({
  imports: [SharedModule, MarketplaceRoutingModule],
  declarations: [
    AvailableJobsComponent,
    JobDescriptionComponent,
    JobApplyFormComponent,
    PipelineApplyFormComponent,
    VerifyEmailComponent,
    PipelineDescriptionComponent,
  ],
})
export class MarketplaceModule {}
