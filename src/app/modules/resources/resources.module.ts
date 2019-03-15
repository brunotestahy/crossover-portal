import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { FaqPageComponent } from './pages/faq-page/faq-page.component';
import { GuidelinesForSuccessPageComponent } from './pages/guidelines-for-success-page/guidelines-for-success-page.component';
import { ResourcesPageComponent } from './pages/resources-page/resources-page.component';
import { ResourcesRoutingModule } from './resources-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ResourcesRoutingModule,
    SharedModule,
  ],
  declarations: [ ResourcesPageComponent, GuidelinesForSuccessPageComponent, FaqPageComponent ],
})
export class ResourcesModule { }
