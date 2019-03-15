import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { environment } from 'environments/environment';
import { mock } from 'ts-mockito/lib/ts-mockito';

import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { FinanceService } from 'app/core/services/finance/finance.service';

describe('FinanceService', () => {
  let httpMock: HttpTestingController;
  let service: FinanceService;
  let authTokenService: AuthTokenService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          FinanceService,
          { provide: AuthTokenService, useFactory: () => mock(AuthTokenService) },
        ],
      });
    })
  );

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(FinanceService);
    authTokenService = TestBed.get(AuthTokenService);

  });

  it('should be created', () => {
    expect(FinanceService).toBeTruthy();
  });

  it('[getPaymentsCount] should get payments count', () => {
    const platforms = ['PAYONEER'];
    const types = ['WEEKLY'];
    const units = ['HOUR'];
    const statuses = ['APPROVED'];
    const weekStartDate = '2018-01-01';
    service.getPaymentsCount(platforms, types, units, statuses, weekStartDate)
    .subscribe(response => expect(response).toEqual({count: 1}));
    const request = httpMock.expectOne(
      `${environment.apiPath}/finance/payments/reports/entries/count?consolidated=false&` +
      `platforms=PAYONEER&types=WEEKLY&units=HOUR&statuses=APPROVED&weekStartDate=2018-01-01`
    );
    expect(request.request.method).toBe('GET');
    request.flush({count: 1});
    httpMock.verify();
  });

  it('[exportMetricReport] should export metric report', () => {
    const platforms = ['PAYONEER'];
    const types = ['WEEKLY'];
    const units = ['HOUR'];
    const statuses = ['APPROVED'];
    const weekStartDate = '2018-01-01';
    const token = 'sample_token';
    spyOn(authTokenService, 'getToken').and.returnValue(token);
    expect(service.downloadPaymentsReport(platforms, types, units, statuses, weekStartDate)).toBeDefined();
  });
});
