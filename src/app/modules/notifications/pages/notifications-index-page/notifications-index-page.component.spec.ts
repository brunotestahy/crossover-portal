import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { ReadableTask } from 'app/core/models/task';
import { NotificationService } from 'app/core/services/notification/notification.service';
import {
  NotificationsIndexPageComponent,
} from 'app/modules/notifications/pages/notifications-index-page/notifications-index-page.component';

class NotificationServiceMock implements Partial<NotificationService> {
  public getReadableTaskList(): Observable<ReadableTask[]> {
    return Observable.of([{
      updated: 'test',
      message: 'test',
    },
    {
      updated: 'test1',
      message: 'test2',
    },
    {
      updated: 'test1',
      message: 'test2',
    },
    {
      updated: 'test0',
      message: 'test2',
    }]);
  }
}

describe('NotificationsIndexPageComponent', () => {
  let component: NotificationsIndexPageComponent;
  let fixture: ComponentFixture<NotificationsIndexPageComponent>;
  let notificationService: Partial<NotificationService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [NotificationsIndexPageComponent],
      imports: [],
      providers: [
        { provide: NotificationService, useClass: NotificationServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsIndexPageComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.get(NotificationService);
  });

  it('check if the component has been created', () => {
    expect(component).toBeTruthy();
  });

  it('should call required funtion on ngOninit', () => {
    spyOn(notificationService, 'getReadableTaskList').and.callThrough();
    component.ngOnInit();
    expect(notificationService.getReadableTaskList).toHaveBeenCalled();
  });

  it('should call required funtion on ngOninit', () => {
    component.list = [{
      updated: 'test',
      message: 'test',
    },
    {
      updated: 'test1',
      message: 'test2',
    }];
    const list = component.filterUpdated();
    expect(list.length).toBe(2);
  });
});
