import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PipelineSourcingDetailsComponent } from './pages/pipeline-sourcing-details/pipeline-sourcing-details.component';
import { PipelineSourcingIndexPageComponent } from './pages/pipeline-sourcing-index-page/pipeline-sourcing-index-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PipelineSourcingIndexPageComponent,
  },
  {
    path: ':id',
    component: PipelineSourcingDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PipelineSourcingRoutingModule {}
