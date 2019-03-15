import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LinkedinRoutingModule } from 'app/modules/linkedin/linkedin-routing.module';
import { LinkedinIndexPageComponent } from 'app/modules/linkedin/pages/linkedin-index-page/linkedin-index-page.component';

@NgModule({
  imports: [
    CommonModule,
    LinkedinRoutingModule,
  ],
  declarations: [
    LinkedinIndexPageComponent,
  ],
})
export class LinkedinModule {
}
