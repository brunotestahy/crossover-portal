import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ApplicationProcessService } from '../application-process/shared/application-process.service';

import { CandidateRoutingModule } from './candidate-routing.module';
import { HiringComponent } from './pages/hiring/hiring.component';

@NgModule({
  imports: [
    SharedModule,
    CandidateRoutingModule,
  ],
  declarations: [
    HiringComponent,
  ],
  providers: [
    ApplicationProcessService,
  ],
})
export class CandidateModule { }
