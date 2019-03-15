import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { SlackService } from 'app/core/services/slack/slack.service';
import { environment } from 'environments/environment';

describe('SlackService', () => {
  let service: SlackService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ SlackService ],
    });
  }));

  beforeEach(() => {
    service = TestBed.get(SlackService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should disconnect', () => {
    const RESPONSE = Object.assign({});
    service.disconnect()
      .subscribe(res => expect(res).toBe(RESPONSE));

    const request = httpMock.expectOne(
      `${environment.apiPath}/slack/userdata`
    );
    expect(request.request.method).toBe('DELETE');
    request.flush(RESPONSE);
    httpMock.verify();
  });

  it('should get user data', () => {
    const RESPONSE = Object.assign({});
    service.getUserData()
      .subscribe(res => expect(res).toBe(RESPONSE));

    const request = httpMock.expectOne(
      `${environment.apiPath}/slack/userdata`
    );
    expect(request.request.method).toBe('GET');
    request.flush(RESPONSE);
    httpMock.verify();
  });

  it('should test connection', () => {
    const RESPONSE = {};
    service.testConnection().subscribe(res => {
      expect(res).toBeTruthy(RESPONSE);
    });

    const request = httpMock.expectOne(
      `${environment.apiPath}/slack/test`
    );
    expect(request.request.method).toBe('GET');
    request.flush(RESPONSE);
    httpMock.verify();
  });
});
