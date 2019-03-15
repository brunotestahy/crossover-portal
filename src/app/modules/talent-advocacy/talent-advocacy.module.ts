import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { TalentAdvocacyIndexPageComponent } from './pages/talent-advocacy-index-page/talent-advocacy-index-page.component';
import { TalentAdvocacyRoutingModule } from './talent-advocacy-routing.module';

@NgModule({
  imports: [
    SharedModule,
    TalentAdvocacyRoutingModule,
  ],
  declarations: [TalentAdvocacyIndexPageComponent],
})
export class TalentAdvocacyModule { }
