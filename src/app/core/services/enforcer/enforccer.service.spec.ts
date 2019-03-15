import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';

import { EnforcerService } from 'app/core/services/enforcer/enforcer.service';
import { environment } from 'environments/environment';

describe('EnforcerService', () => {
  let httpMock: HttpTestingController;
  let enforcerService: EnforcerService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          EnforcerService,
        ],
      });
    })
  );

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    enforcerService = TestBed.get(EnforcerService);
  });

  it('should be created', () => {
    expect(EnforcerService).toBeTruthy();
  });

  describe('[generateReports]', () => {

    it('should call correct API and return defined response', () => {
      const reportType = 'HOURS_WORKED';
      const teamId = '';
      const date = '2018-05-24';
      const SAMPLE_RESPONSE = '';
      enforcerService.generateReports(reportType, teamId, date).subscribe((res: string) => {
        expect(res).toBeDefined();
        expect(res).toBe(SAMPLE_RESPONSE);
      });
      const request = httpMock.expectOne(
        `${environment.apiPath}` +
        `/timetracking/timesheets/report?date=${date}&isCacheAccess=false&period=WEEK&reportType=${reportType}&teamId=${teamId}`
      );
      expect(request.request.method).toBe('GET');
      request.flush(SAMPLE_RESPONSE);
      httpMock.verify();
    });
  });
});
