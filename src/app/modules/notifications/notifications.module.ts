import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsIndexPageComponent } from './pages/notifications-index-page/notifications-index-page.component';

@NgModule({
  imports: [SharedModule, NotificationsRoutingModule],
  declarations: [NotificationsIndexPageComponent],
})
export class NotificationsModule {}
