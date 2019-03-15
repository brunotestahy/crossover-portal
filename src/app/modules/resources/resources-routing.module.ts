import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FaqPageComponent } from './pages/faq-page/faq-page.component';
import { GuidelinesForSuccessPageComponent } from './pages/guidelines-for-success-page/guidelines-for-success-page.component';
import { ResourcesPageComponent } from './pages/resources-page/resources-page.component';

const routes: Routes = [
  {
    path: '',
    component: ResourcesPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'guidelines-for-success',
    component: GuidelinesForSuccessPageComponent,
  },
  {
    path: 'faq/:type',
    component: FaqPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourcesRoutingModule {}
