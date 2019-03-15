import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TalentAdvocacyIndexPageComponent } from './pages/talent-advocacy-index-page/talent-advocacy-index-page.component';

const routes: Routes = [{
  path: '',
  component: TalentAdvocacyIndexPageComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TalentAdvocacyRoutingModule { }
