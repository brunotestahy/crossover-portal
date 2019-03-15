import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountInfoPageComponent } from 'app/modules/settings/pages/account-info-page/account-info-page.component';
import { LocationInfoPageComponent } from 'app/modules/settings/pages/location-info-page/location-info-page.component';
import { PasswordPageComponent } from 'app/modules/settings/pages/password-page/password-page.component';
import { PrivacySettingsPageComponent } from 'app/modules/settings/pages/privacy-settings-page/privacy-settings-page.component';
import { SecurityQuestionPageComponent } from 'app/modules/settings/pages/security-question-page/security-question-page.component';
import { SettingsPageComponent } from 'app/modules/settings/pages/settings-page/settings-page.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsPageComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/settings/account-info',
      },
      {
        path: 'account-info',
        component: AccountInfoPageComponent,
      },
      {
        path: 'location-info',
        component: LocationInfoPageComponent,
      },
      {
        path: 'password',
        component: PasswordPageComponent,
      },
      {
        path: 'security-question',
        component: SecurityQuestionPageComponent,
      },
      {
        path: 'privacy',
        component: PrivacySettingsPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule { }
