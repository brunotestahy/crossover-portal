
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, getTestBed, TestBed } from '@angular/core/testing';
import { environment } from 'environments/environment';
import { mock } from 'ts-mockito/lib/ts-mockito';

import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { COMPANIES_MOCK } from 'app/core/services/mocks/companies.mock';
import { TEAMS } from 'app/core/services/mocks/team.mock';
import { ReportService } from 'app/core/services/report/report.service';

describe('ReportService', () => {
  let httpMock: HttpTestingController;
  let service: ReportService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          ReportService,
          { provide: AuthTokenService, useFactory: () => mock(AuthTokenService) },
        ],
      });
    })
  );

  beforeEach(() => {
    httpMock = getTestBed().get(HttpTestingController);
    service = getTestBed().get(ReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTeamPerformanceReportFile', () => {

    it('should retrieve data for all teams successfully', () => {
      const SAMPLE_RESPONSE = '';
      const params = {
        option: 'test',
        pastWeeks: '52',
        period: 'week',
      };
      service.getTeamPerformanceReportFile(params).subscribe((res: string) => {
        expect(res).toBeDefined();
        expect(res).toBe(SAMPLE_RESPONSE);
      });
      const request = httpMock.expectOne(
        `${environment.apiPath}/reports/teamPerformance?option=${params.option}` +
        `&pastWeeks=${params.pastWeeks}&period=${params.period}`
      );
      expect(request.request.method).toBe('GET');
      request.flush(SAMPLE_RESPONSE);
      httpMock.verify();
    });

    it('should retrieve data for a specific team successfully', () => {
      const SAMPLE_RESPONSE = '';
      const params = {
        option: 'test',
        pastWeeks: '52',
        period: 'week',
        teamId: '1',
      };
      service.getTeamPerformanceReportFile(params).subscribe((res: string) => {
        expect(res).toBeDefined();
        expect(res).toBe(SAMPLE_RESPONSE);
      });
      const request = httpMock.expectOne(
        `${environment.apiPath}/reports/teamPerformance?option=${params.option}` +
        `&pastWeeks=${params.pastWeeks}&period=${params.period}&teamId=${params.teamId}`
      );
      expect(request.request.method).toBe('GET');
      request.flush(SAMPLE_RESPONSE);
      httpMock.verify();
    });

  });

  describe('getCompanyPerformanceReportFile', () => {

    it('should retrieve data for all companies successfully', () => {
      const SAMPLE_RESPONSE = '';
      const params = {
        option: 'test',
        pastWeeks: '52',
        period: 'week',
      };
      service.getCompanyPerformanceReportFile(params).subscribe((res: string) => {
        expect(res).toBeDefined();
        expect(res).toBe(SAMPLE_RESPONSE);
      });
      const request = httpMock.expectOne(
        `${environment.apiPath}/reports/teamPerformance?option=${params.option}` +
        `&pastWeeks=${params.pastWeeks}&period=${params.period}`
      );
      expect(request.request.method).toBe('GET');
      request.flush(SAMPLE_RESPONSE);
      httpMock.verify();
    });

    it('should retrieve data for a specific company successfully', () => {
      const SAMPLE_RESPONSE = '';
      const params = {
        option: 'test',
        pastWeeks: '52',
        period: 'week',
        companyId: '1',
      };
      service.getCompanyPerformanceReportFile(params).subscribe((res: string) => {
        expect(res).toBeDefined();
        expect(res).toBe(SAMPLE_RESPONSE);
      });
      const request = httpMock.expectOne(
        `${environment.apiPath}/reports/teamPerformance?option=${params.option}` +
        `&pastWeeks=${params.pastWeeks}&period=${params.period}&companyId=${params.companyId}`
      );
      expect(request.request.method).toBe('GET');
      request.flush(SAMPLE_RESPONSE);
      httpMock.verify();
    });

  });

  it('should get company list successfully', () => {
    service.getCompanies(1).subscribe(res => {
      expect(res).toBeDefined();
      expect(res).toBe(COMPANIES_MOCK);
    });
    const request = httpMock.expectOne(
      `${environment.apiPath}/hire/companies?page=1`
    );
    expect(request.request.method).toBe('GET');
    request.flush(COMPANIES_MOCK);
    httpMock.verify();
  });

  it('should get team list successfully', () => {
    service.getTeams('test', true, 'CANDIDATE' , true).subscribe(res => {
      expect(res).toBeDefined();
      expect(res).toBe(TEAMS);
    });
    const request = httpMock.expectOne(
      `${environment.apiPath}/v2/teams?direct=true&projection=test&avatarType=CANDIDATE&activeAssignments=true`
    );
    expect(request.request.method).toBe('GET');
    request.flush(TEAMS);
    httpMock.verify();
  });

  it('should get interview report successfully when type is upcoming', () => {
    const param = {
      reportType: 'upcoming',
      avatarType: 'CANDIDATE',
      page: 0,
      pageSize: 10,
    };
    service.getInterviewReport(param).subscribe(res => {
      expect(res).toBeDefined();
    });
  });

  it('should get interview report successfully when type is not upcoming', () => {
    const param = {
      reportType: 'other',
      avatarType: 'CANDIDATE',
      page: 0,
      pageSize: 10,
    };
    service.getInterviewReport(param).subscribe(res => {
      expect(res).toBeDefined();
    });
  });
});
