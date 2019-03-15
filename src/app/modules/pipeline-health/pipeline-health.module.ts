import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { PipelineHealthDetailsPageComponent } from './pages/pipeline-health-details-page/pipeline-health-details-page.component';
import { PipelineHealthIndexPageComponent } from './pages/pipeline-health-index-page/pipeline-health-index-page.component';
import { PipelineHealthRoutingModule } from './pipeline-health-routing.module';

@NgModule({
  imports: [SharedModule, PipelineHealthRoutingModule],
  declarations: [PipelineHealthIndexPageComponent, PipelineHealthDetailsPageComponent],
})
export class PipelineHealthModule {}
