import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PipelineHealthDetailsPageComponent } from './pages/pipeline-health-details-page/pipeline-health-details-page.component';
import { PipelineHealthIndexPageComponent } from './pages/pipeline-health-index-page/pipeline-health-index-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PipelineHealthIndexPageComponent,
  },
  {
    path: ':id',
    component: PipelineHealthDetailsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PipelineHealthRoutingModule {}
