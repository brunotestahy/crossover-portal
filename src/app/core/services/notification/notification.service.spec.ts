import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';


import { ReadableTask } from 'app/core/models/task';
import {
  CURRENT_USER_TASKS_MOCK,
} from 'app/core/services/mocks/notification.mock';
import { NotificationService } from 'app/core/services/notification/notification.service';
import { environment } from 'environments/environment';

describe('NotificationService', () => {
  let httpMock: HttpTestingController;
  let notificationService: NotificationService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          NotificationService,
        ],
      });
    })
  );

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    notificationService = TestBed.get(NotificationService);
  });

  it('should be created', () => {
    expect(NotificationService).toBeTruthy();
  });

  it('should getTasks', () => {
    const RESPONSE = [
      {
        processType: 'test',
        taskType: 'test',
        object: {},
      },
    ];
    notificationService.getTasks().subscribe(res => {
      expect(res).toBeTruthy(RESPONSE);
    });

    const request = httpMock.expectOne(
      `${environment.apiPath}/identity/users/current/tasks`
    );
    expect(request.request.method).toBe('GET');
    request.flush(RESPONSE);
    httpMock.verify();
  });

  it('getReadableTaskList', () => {
    spyOn(notificationService, 'getTasks').and.returnValue(Observable.of(CURRENT_USER_TASKS_MOCK));
    notificationService.getReadableTaskList().subscribe(res => {
      expect(res).toEqual([
        Object.assign({
          updated: '2016-12-14T16:09:57.000+0000',
          message: 'Please follow <a href="manager/candidates">this link</a> to setup the team for Saurabh Singh Chauhan.',
        }) as ReadableTask,
        Object.assign({
          updated: '2016-12-21T10:14:19.000+0000',
          message: 'Please follow <a href="interview/5732/view">this link</a> to make a decision about Anil Lakhagoudar.',
        }) as ReadableTask,
        Object.assign({ message: '' }) as ReadableTask,
      ]);
    });
  });
});
