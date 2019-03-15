import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvailableJobsComponent } from 'app/modules/marketplace/pages/available-jobs/available-jobs.component';
import { JobDescriptionComponent } from 'app/modules/marketplace/pages/job-description/job-description.component';
import { PipelineDescriptionComponent } from 'app/modules/marketplace/pages/pipeline-description/pipeline-description.component';
import { VerifyEmailComponent } from 'app/modules/marketplace/pages/verify-email/verify-email.component';

const routes: Routes = [
  {
    path: 'available-jobs',
    component: AvailableJobsComponent,
  },
  {
    path: 'job/:id',
    component: JobDescriptionComponent,
  },
  {
    path: 'pipeline/:id',
    component: PipelineDescriptionComponent,
  },
  {
    path: 'verify/:applicationId',
    component: VerifyEmailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketplaceRoutingModule {}
