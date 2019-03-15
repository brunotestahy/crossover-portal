import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { PipelineTrackerIndexPageComponent } from './pages/pipeline-tracker-index-page/pipeline-tracker-index-page.component';
import { PipelineTrackerRoutingModule } from './pipeline-tracker-routing.module';

@NgModule({
  imports: [
    SharedModule,
    PipelineTrackerRoutingModule,
  ],
  declarations: [PipelineTrackerIndexPageComponent],
})
export class PipelineTrackerModule { }
