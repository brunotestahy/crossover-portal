import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnforcerReportsComponent } from 'app/modules/enforcer/pages/enforcer-reports.component';
import { PaymentsComponent } from 'app/modules/enforcer/pages/payments/payments.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'reports',
  },
  {
    path: 'reports',
    component: EnforcerReportsComponent,
  },
  {
    path: 'payments',
    component: PaymentsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnforcerRoutingModule { }
