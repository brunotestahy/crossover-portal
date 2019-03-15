import { NgModule } from '@angular/core';
import { EndorsementService } from 'app/modules/account-manager/shared/endorsement.service';
import { SharedModule } from 'app/shared/shared.module';

import { AccountManagerRoutingModule } from './account-manager-routing.module';
import { EndorsementComponent } from './pages/endorsement/endorsement.component';

@NgModule({
  imports: [
    SharedModule,
    AccountManagerRoutingModule,
  ],
  declarations: [
    EndorsementComponent,
  ],
  providers: [
    EndorsementService,
  ],
})
export class AccountManagerModule { }
