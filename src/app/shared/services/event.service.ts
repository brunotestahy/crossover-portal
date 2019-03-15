import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EventService {
  private refreshNotificationsSubject: Subject<Object> = new Subject();
  public refreshNotifications$: Observable<Object> = this.refreshNotificationsSubject.asObservable();

  public refreshNotifications(todo: Object): void {
    this.refreshNotificationsSubject.next(todo);
  }
}
