import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotificationsIndexPageComponent } from './pages/notifications-index-page/notifications-index-page.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationsIndexPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsRoutingModule {}
