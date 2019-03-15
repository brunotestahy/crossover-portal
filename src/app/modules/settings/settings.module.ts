import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DfTopbarModule } from '@devfactory/ngx-df';
import { SharedModule } from 'app/shared/shared.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { AccountInfoPageComponent } from './pages/account-info-page/account-info-page.component';
import { LocationInfoPageComponent } from './pages/location-info-page/location-info-page.component';
import { PasswordPageComponent } from './pages/password-page/password-page.component';
import { PrivacySettingsPageComponent } from './pages/privacy-settings-page/privacy-settings-page.component';
import { SecurityQuestionPageComponent } from './pages/security-question-page/security-question-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    DfTopbarModule,
    GooglePlaceModule,
  ],
  declarations: [
    SettingsPageComponent,
    AccountInfoPageComponent,
    LocationInfoPageComponent,
    PasswordPageComponent,
    SecurityQuestionPageComponent,
    PrivacySettingsPageComponent,
  ],
  exports: [
  ],
  entryComponents: [
  ],
})
export class SettingsModule {}
