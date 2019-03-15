import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { PipelineSourcingDetailsComponent } from './pages/pipeline-sourcing-details/pipeline-sourcing-details.component';
import { PipelineSourcingIndexPageComponent } from './pages/pipeline-sourcing-index-page/pipeline-sourcing-index-page.component';
import { PipelineSourcingRoutingModule } from './pipeline-sourcing-routing.module';

@NgModule({
  imports: [SharedModule, PipelineSourcingRoutingModule],
  declarations: [PipelineSourcingIndexPageComponent, PipelineSourcingDetailsComponent],
})
export class PipelineSourcingModule {}
