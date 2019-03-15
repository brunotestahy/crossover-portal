import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthIndexPageComponent } from 'app/modules/auth/pages/auth-index-page/auth-index-page.component';
import { ForgotPasswordPageComponent } from 'app/modules/auth/pages/forgot-password-page/forgot-password-page.component';
import { LoginPageComponent } from 'app/modules/auth/pages/login-page/login-page.component';
import { UpdatePasswordPageComponent } from 'app/modules/auth/pages/update-password-page/update-password-page.component';

const routes: Routes = [
  {
    path: '',
    component: AuthIndexPageComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordPageComponent,
      },
    ],
  },
  {
    path: 'reset',
    component: AuthIndexPageComponent,
    children: [
      {
        path: 'update-password/:token',
        component: UpdatePasswordPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
