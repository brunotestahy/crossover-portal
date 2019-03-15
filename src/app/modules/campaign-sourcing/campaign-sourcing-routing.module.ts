import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CampaignSourcingIndexComponent } from './pages/campaign-sourcing-index/campaign-sourcing-index.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CampaignSourcingIndexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignSourcingRoutingModule { }
