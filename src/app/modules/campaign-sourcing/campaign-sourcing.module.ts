import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CampaignSourcingRoutingModule } from './campaign-sourcing-routing.module';
import { CampaignSourcingIndexComponent } from './pages/campaign-sourcing-index/campaign-sourcing-index.component';

@NgModule({
  imports: [
    CommonModule,
    CampaignSourcingRoutingModule,
  ],
  declarations: [CampaignSourcingIndexComponent],
})
export class CampaignSourcingModule { }
