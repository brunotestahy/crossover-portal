import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorksmartDownloadPageComponent } from 'app/modules/worksmart/pages/worksmart-download-page/worksmart-download-page.component';

const routes: Routes = [
  {
    path: '',
    component: WorksmartDownloadPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorksmartRoutingModule { }
