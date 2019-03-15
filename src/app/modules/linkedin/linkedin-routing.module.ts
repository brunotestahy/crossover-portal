import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LinkedinIndexPageComponent } from 'app/modules/linkedin/pages/linkedin-index-page/linkedin-index-page.component';

const routes: Routes = [
  {
    path: '',
    component: LinkedinIndexPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LinkedinRoutingModule { }
