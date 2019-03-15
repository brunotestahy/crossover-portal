import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PipelineTrackerIndexPageComponent } from './pages/pipeline-tracker-index-page/pipeline-tracker-index-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PipelineTrackerIndexPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PipelineTrackerRoutingModule {}
