import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { SupportPageComponent } from './pages/support-page/support-page.component';
import { SupportRoutingModule } from './support-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SupportRoutingModule,
    SharedModule,
  ],
  declarations: [SupportPageComponent],
})
export class SupportModule { }
