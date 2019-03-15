import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { CandidateTermsRoutingModule } from './candidate-terms-routing.module';
import { CandidateTermsComponent } from './pages/candidate-terms/candidate-terms.component';

@NgModule({
  imports: [
    SharedModule,
    CandidateTermsRoutingModule,
  ],
  declarations: [CandidateTermsComponent],
})
export class CandidateTermsModule { }
