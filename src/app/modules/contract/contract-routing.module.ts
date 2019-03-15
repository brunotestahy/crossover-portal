import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewContractComponent } from './pages/view-contract/view-contract.component';

const routes: Routes = [
  {
    path: ':id/view',
    component: ViewContractComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractRoutingModule { }
