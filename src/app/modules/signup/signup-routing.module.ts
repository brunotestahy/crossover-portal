import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyEmailComponent } from 'app/modules/signup/verify-email/verify-email.component';

import { LocationDataPageComponent } from './pages/location-data-page/location-data-page.component';

const routes: Routes = [
  {
    path: 'verify-email/token/:token',
    component: VerifyEmailComponent,
  },
  {
    path: 'location',
    component: LocationDataPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupRoutingModule {}
