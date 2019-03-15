import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';

import { SignInResponse } from 'app/core/models/google';
import { GoogleService } from 'app/core/services/google/google.service';
import { environment } from 'environments/environment';

describe('GoogleService', () => {
  let service: GoogleService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ GoogleService ],
    });
  }));

  beforeEach(() => {
    service = TestBed.get(GoogleService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should disconnect', () => {
    const RESPONSE = {};
    service.disconnect().subscribe(res => {
      expect(res).toBe(RESPONSE);
    });

    const request = httpMock.expectOne(
      `${environment.apiPath}/google/userdata`
    );
    expect(request.request.method).toBe('DELETE');
    request.flush(RESPONSE);
    httpMock.verify();
  });

  it('should get user data', () => {
    const RESPONSE = Object.assign({}) as SignInResponse;
    service.getUserData().subscribe(res => {
      expect(res).toBe(RESPONSE);
    });

    const request = httpMock.expectOne(
      `${environment.apiPath}/google/userdata`
    );
    expect(request.request.method).toBe('GET');
    request.flush(RESPONSE);
    httpMock.verify();
  });

  it('should test connection', () => {
    const RESPONSE = {};
    service.testConnection().subscribe(res => {
      expect(res).toBe(RESPONSE);
    });

    const request = httpMock.expectOne(
      `${environment.apiPath}/google/test`
    );
    expect(request.request.method).toBe('GET');
    request.flush(RESPONSE);
    httpMock.verify();
  });

  it('should sign in', () => {
    const RESPONSE = { };

    const googleCode = 'google-code';
    service.signIn(googleCode).subscribe(() => expect(true).toBeTruthy());

    const request = httpMock.expectOne(
      `${environment.apiPath}/google/signin?code=${googleCode}`
    );
    expect(request.request.method).toBe('GET');
    request.flush(RESPONSE);
    httpMock.verify();
  });
});
