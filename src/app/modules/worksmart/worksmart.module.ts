import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { WorksmartDownloadPageComponent } from './pages/worksmart-download-page/worksmart-download-page.component';
import { WorksmartRoutingModule } from './worksmart-routing.module';

@NgModule({
  imports: [
    SharedModule,
    WorksmartRoutingModule,
  ],
  declarations: [WorksmartDownloadPageComponent],
})
export class WorksmartModule { }
