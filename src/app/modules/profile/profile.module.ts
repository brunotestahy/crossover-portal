import { NgModule } from '@angular/core';
import { DfAlertModule } from '@devfactory/ngx-df';

import { UserProfilePageComponent } from 'app/modules/profile/pages/user-profile-page/user-profile-page.component';
import { ProfileRoutingModule } from 'app/modules/profile/profile-routing.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    DfAlertModule.forRoot(),
    SharedModule,
    ProfileRoutingModule,
  ],
  exports: [
    UserProfilePageComponent,
  ],
  declarations: [UserProfilePageComponent],
})
export class ProfileModule { }
