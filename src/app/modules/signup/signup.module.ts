import { NgModule } from '@angular/core';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { LocationDataPageComponent } from 'app/modules/signup/pages/location-data-page/location-data-page.component';
import { SignupRoutingModule } from 'app/modules/signup/signup-routing.module';
import { VerifyEmailComponent } from 'app/modules/signup/verify-email/verify-email.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    GooglePlaceModule,
    SharedModule,
    SignupRoutingModule,
  ],
  declarations: [
    VerifyEmailComponent,
    LocationDataPageComponent,
  ],
})
export class SignupModule {
}
