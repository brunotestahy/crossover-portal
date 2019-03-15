import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { environment } from 'environments/environment';
import { mock } from 'ts-mockito/lib/ts-mockito';

import { PaymentSetupSteps } from 'app/core/constants/onboarding-process';
import { PayoneerPaymentType } from 'app/core/models/payments';
import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { PaymentInfoService } from 'app/core/services/payment-info/payment-info.service';

describe('PaymentInfoService', () => {
  let httpMock: HttpTestingController;
  let service: PaymentInfoService;
  let authTokenService: AuthTokenService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          PaymentInfoService,
          { provide: AuthTokenService, useFactory: () => mock(AuthTokenService) },
        ],
      });
    })
  );

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(PaymentInfoService);
    authTokenService = TestBed.get(AuthTokenService);
  });

  it('should be created successfully', () => expect(service).toBeTruthy());

  it('[getPaymentType] should retrieve a payment type when an expected task type is provided', () => {
    const validTask = { taskType: PaymentSetupSteps.Payoneer };
    const paymentType = service.getPaymentType(validTask);

    expect(paymentType).toEqual(jasmine.any(PayoneerPaymentType));
  });

  it('[getPaymentType] should retrieve null when an unexpected task type is provided', () => {
    const validTask = { taskType: 'unknownTaskStep' };
    const paymentType = service.getPaymentType(validTask);

    expect(paymentType).toEqual(null);
  });

  it('[getPaymentReport] should delegate call the endpoint for response', () => {
    const token = 'SAMPLETOKEN';
    spyOn(authTokenService, 'getToken').and.returnValue(token);
    const filter = { from: '2018-02-08', to: '2018-04-05' };
    service.getPaymentReport(filter).subscribe(res => {
      expect(res).toBeDefined();
    });
    const url = `${environment.apiPath}` +
      `/identity/users/current/payments/report?from=${filter.from}&to=${filter.to}&downloadFormat=CSV&token=${token}`;
    const request = httpMock.expectOne(url);
    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });

  it('[getPaymentInfo] should delegate call the endpoint for response', () => {
    const paymentType = new PayoneerPaymentType();
    service.getPaymentInfo(paymentType).subscribe(res => res);
    const request = httpMock.expectOne(
      `${environment.apiPath}/finance/payments/info/${paymentType.method}`
    );
    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });

  it('[savePaymentInfo] should delegate call the endpoint for response', () => {
    const paymentType = new PayoneerPaymentType();
    service.savePaymentInfo(paymentType).subscribe(res => res);
    const request = httpMock.expectOne(
      `${environment.apiPath}/finance/payments/info/${paymentType.method}?v2ui=true`
    );
    expect(request.request.method).toBe('POST');
    httpMock.verify();
  });

  it('[getIncomeStatement] should delegate call the endpoint for response', () => {
    const filter = { from: '2018-02-08', to: '2018-04-05' };
    service.getIncomeStatement(filter).subscribe(res => {
      expect(res).toBeDefined();
    });
    const request = httpMock.expectOne(
      `${environment.apiPath}/payments/getPaymentReport?from=${filter.from}&to=${filter.to}`
    );
    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });

  it('[activatePaymentInfo] should delegate call the endpoint for response', () => {
    const paymentType = new PayoneerPaymentType();
    service.activatePaymentInfo(paymentType).subscribe(res => res);
    const request = httpMock.expectOne(
      `${environment.apiPath}/finance/payments/info/${paymentType.method}/activate`
    );
    expect(request.request.method).toBe('PUT');
    httpMock.verify();
  });

  describe('getPaymentReport', () => {
    it('should delegate call the endpoint for response', () => {
      const token = 'SAMPLETOKEN';
      spyOn(authTokenService, 'getToken').and.returnValue(token);
      const filter = { from: '2018-02-08', to: '2018-04-05' };
      service.getPaymentReport(filter).subscribe(res => {
        expect(res).toBeDefined();
      });
      const url = `${environment.apiPath}` +
        `/identity/users/current/payments/report?from=${filter.from}&to=${filter.to}&downloadFormat=CSV&token=${token}`;
      const request = httpMock.expectOne(url);
      expect(request.request.method).toBe('GET');
      httpMock.verify();
    });
  });
  it('should get current user payments successfully', () => {
    const from = '2018-01-01';
    const to = '2018-01-30';
    service.getCurrentUserPayments(from, to).subscribe(() => { });

    const request = httpMock.expectOne(
      `${environment.apiPath}/v2/payments?from=${from}&to=${to}`
    );
    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });
});
