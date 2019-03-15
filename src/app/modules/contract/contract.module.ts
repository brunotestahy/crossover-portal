import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { ContractRoutingModule } from './contract-routing.module';
import { ViewContractComponent } from './pages/view-contract/view-contract.component';

@NgModule({
  imports: [
    SharedModule,
    ContractRoutingModule,
  ],
  declarations: [ViewContractComponent],
})
export class ContractModule { }
