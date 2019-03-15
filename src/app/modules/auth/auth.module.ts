import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AuthRoutingModule } from 'app/modules/auth/auth-routing.module';
import { AuthIndexPageComponent } from 'app/modules/auth/pages/auth-index-page/auth-index-page.component';
import { ForgotPasswordPageComponent } from 'app/modules/auth/pages/forgot-password-page/forgot-password-page.component';
import { LoginPageComponent } from 'app/modules/auth/pages/login-page/login-page.component';
import { UpdatePasswordPageComponent } from 'app/modules/auth/pages/update-password-page/update-password-page.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule,
  ],
  declarations: [
    LoginPageComponent,
    ForgotPasswordPageComponent,
    AuthIndexPageComponent,
    UpdatePasswordPageComponent,
  ],
})
export class AuthModule {}
