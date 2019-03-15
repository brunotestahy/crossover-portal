import { NgModule } from '@angular/core';

import { FiveQGradingComponent } from 'app/modules/grading/components/five-q/grading/five-q-grading.component';
import { FiveQRubricComponent } from 'app/modules/grading/components/five-q/rubric/five-q-rubric.component';
import { GradingRoutingModule } from 'app/modules/grading/grading-routing.module';
import { GradingPageComponent } from 'app/modules/grading/pages/grading-page/grading-page.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    GradingRoutingModule
  ],
  declarations: [
    FiveQRubricComponent,
    GradingPageComponent,
    FiveQGradingComponent,
  ],
})
export class GradingModule { }
