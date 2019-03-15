import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ReadableTask } from 'app/core/models/task';

@Component({
  selector: 'app-notification-badge',
  templateUrl: './notification-badge.component.html',
  styleUrls: ['./notification-badge.component.scss'],
})
export class NotificationBadgeComponent {
  @Input()
  public maxEntries: number = 3;

  @Input()
  public notifications: ReadableTask[] = [];

  @Output()
  public navigation = new EventEmitter<string>();

  public getNotificationCount(): number {
    let count = 0;
    if (this.notifications) {
      count = this.notifications.filter(x => x.updated).length;
    }
    return count;
  }

  public checkNavigation(event: string): void {
    this.navigation.emit(event);
  }
}
