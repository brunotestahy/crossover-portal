import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';

import { LinkedInService } from 'app/core/services/linkedin/linkedin.service';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { environment } from 'environments/environment';

describe('LinkedInService', () => {
  let linkedinService: LinkedInService;
  let targetWindow: Window;
  let httpMock: HttpTestingController;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
        ],
        providers: [
          LinkedInService,
          {provide: WINDOW_TOKEN, useValue: {
            location: {},
          }},
        ],
      })
      .compileComponents()
      .then(() => {
        linkedinService = TestBed.get(LinkedInService);
        targetWindow = TestBed.get(WINDOW_TOKEN);
        httpMock = TestBed.get(HttpTestingController);
      });
    })
  );

  it('should be created', () =>
    expect(linkedinService).toBeTruthy()
  );

  it('should redirect the request successfully when a port is defined for the server', () => {
    const importProfileType = 'SAMPLE_IMPORT';
    const linkedInTargetPage = 'assets';
    const targetLocation = {
      port: '80',
      protocol: 'http:',
      hostname: 'hostname',
    };
    Object.assign(targetWindow.location, targetLocation);
    const targetUrl = linkedinService.generateAuthorizationUrl(importProfileType, linkedInTargetPage);
    expect(targetUrl.indexOf(targetLocation.protocol + '//' +
      targetLocation.hostname + ':' + targetLocation.port +
      '/assets/linkedin.html'
    )).not.toBe(-1);
  });

  it('should redirect the request successfully when a port is not defined for the server', () => {
    const importProfileType = 'SAMPLE_IMPORT';
    const targetLocation = {
      port: '',
      protocol: 'http:',
      hostname: 'hostname',
    };
    Object.assign(targetWindow.location, targetLocation);
    const linkedInTargetPage = 'assets';
    const targetUrl = linkedinService.generateAuthorizationUrl(importProfileType, linkedInTargetPage);
    expect(targetUrl.indexOf(targetLocation.protocol + '//' +
      targetLocation.hostname + '/assets/linkedin.html'
    )).not.toBe(-1);
  });

  it(`should authenticate a LinkedIn request successfully when 'assets' is defined as the v2ui destination`, () => {
    const inputToken = 'MyLinkedInAccountToken';
    const outputToken = {
      token: 'MyLinkedInAccountToken',
      agreementNotAccepted: false,
    };
    const v2ui = 'assets';

    linkedinService.authenticate(inputToken, v2ui).subscribe(token => {
      expect(token.token).toBe(outputToken.token);
      expect(token.agreementNotAccepted).toBe(outputToken.agreementNotAccepted);
    });

    const http = httpMock.expectOne(`${environment.apiPath}/identity/authentication/linkedin?v2ui=${v2ui}`);
    expect(http.request.method).toBe('POST');
    http.flush(outputToken);
    httpMock.verify();
  });

  it(`should authenticate a LinkedIn request successfully when 'auth' is defined as the v2ui destination`, () => {
    const inputToken = 'MyLinkedInAccountToken';
    const outputToken = {
      token: 'MyLinkedInAccountToken',
      agreementNotAccepted: false,
    };
    const v2ui = 'auth';

    linkedinService.authenticate(inputToken, v2ui).subscribe(token => {
      expect(token.token).toBe(outputToken.token);
      expect(token.agreementNotAccepted).toBe(outputToken.agreementNotAccepted);
    });

    const http = httpMock.expectOne(`${environment.apiPath}/identity/authentication/linkedin?v2ui=${v2ui}`);
    expect(http.request.method).toBe('POST');
    http.flush(outputToken);
    httpMock.verify();
  });

});
