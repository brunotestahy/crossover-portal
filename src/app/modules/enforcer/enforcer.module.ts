import { NgModule } from '@angular/core';
import {
  DfButtonModule,
  DfCheckboxModule,
  DfGridModule,
} from '@devfactory/ngx-df';
import { EnforcerRoutingModule } from 'app/modules/enforcer/enforcer-routing.module';
import { EnforcerReportsComponent } from 'app/modules/enforcer/pages/enforcer-reports.component';
import { SharedModule } from 'app/shared/shared.module';

import { PaymentsComponent } from './pages/payments/payments.component';

@NgModule({
  imports: [
    SharedModule,
    EnforcerRoutingModule,
    DfCheckboxModule,
    DfButtonModule,
    DfGridModule,
  ],
  declarations: [EnforcerReportsComponent, PaymentsComponent],
})
export class EnforcerModule {}
