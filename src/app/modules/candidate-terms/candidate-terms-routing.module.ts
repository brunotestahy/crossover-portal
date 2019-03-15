import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CandidateTermsComponent } from './pages/candidate-terms/candidate-terms.component';

const routes: Routes = [{
  path: '',
  component: CandidateTermsComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateTermsRoutingModule { }
