import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanDeactivateGuard } from 'app/core/guards/can-deactivate.guard';
import { FiveQRubricComponent } from 'app/modules/grading/components/five-q/rubric/five-q-rubric.component';
import { GradingPageComponent } from 'app/modules/grading/pages/grading-page/grading-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canDeactivate: [CanDeactivateGuard],
    component: GradingPageComponent
  },
  {
    path: 'rubric/:pipelineId',
    component: FiveQRubricComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GradingRoutingModule { }
