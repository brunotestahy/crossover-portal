import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HiringComponent } from './pages/hiring/hiring.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'application-process',
        loadChildren: 'app/modules/application-process/application-process.module#ApplicationProcessModule',
      },
      {
        path: 'onboarding-process',
        loadChildren: 'app/modules/onboarding/onboarding.module#OnboardingModule',
      },
      {
        path: 'dashboard/hiring',
        component: HiringComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateRoutingModule { }
