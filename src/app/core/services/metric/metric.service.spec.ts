import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { environment } from 'environments/environment';
import { mock } from 'ts-mockito/lib/ts-mockito';

import { AssignmentHistory } from 'app/core/models/assignment';
import { MetricSetup, MetricSummary, RawMetrics, TeamMetricSetting, TeamOverview } from 'app/core/models/metric';
import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { MetricService } from 'app/core/services/metric/metric.service';
import { METRICS_SUMMARY } from 'app/core/services/mocks/metrics-summary.mock';
import { TEAM_ASSIGNMENT_HISTORIES } from 'app/core/services/mocks/team-assignment-histories.mock';

describe('MetricService', () => {
  let httpMock: HttpTestingController;
  let metricService: MetricService;
  let authTokenService: AuthTokenService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          MetricService,
          { provide: AuthTokenService, useFactory: () => mock(AuthTokenService) },
        ],
      });
    })
  );

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    metricService = TestBed.get(MetricService);
    authTokenService = TestBed.get(AuthTokenService);

  });

  it('should be created', () => {
    expect(MetricService).toBeTruthy();
  });

  it('[getTeamStatistics] should get team statistics successfully', () => {
    const teamId = '1';
    const from = '2018-01-01';
    const to = '2018-10-01';
    const period = 'SAMPLE';
    const data = Object.assign({});
    metricService.getTeamStatistics(
      teamId,
      from,
      to,
      period
    )
    .subscribe(response => expect(response).toEqual(data));
    const request = httpMock.expectOne(
      `${environment.apiPath}/teams/${teamId}/statistics?from=${from}&to=${to}&period=${period}`
    );
    expect(request.request.method).toBe('GET');
    request.flush(data);
    httpMock.verify();
  });

  it('[downloadTeamStatisticsUrl] should retrieve the download URL successfully', () => {
    const teamId = '1';
    const from = '2018-01-01';
    const to = '2018-10-01';
    const period = 'SAMPLE';
    const token = 'abcdef1234567890';
    spyOn(authTokenService, 'getToken').and.returnValue(token);
    const result = metricService.downloadTeamStatisticsUrl(teamId, from, to, period);

    expect(result).toBe(
      `${environment.apiPath}/teams/${teamId}/statistics?from=${from}&to=${to}&period=${period}` +
      `&token=${token}&downloadFormat=CSV`
    );
  });

  it('[getTeamAssignmentHistories] should get team assignment histories', () => {
    const assignmentId = 1;
    const avatarType = 'CANDIDATE';
    const from = '2018-04-16';
    const to = '2018-05-21';
    metricService.getTeamAssignmentHistories(assignmentId, avatarType, from, to)
      .subscribe(response => expect(response).toEqual(<AssignmentHistory[]>TEAM_ASSIGNMENT_HISTORIES));
    const request = httpMock.expectOne(
      `${environment.apiPath}/teams/assignments/${assignmentId}/histories?avatarType=${avatarType}&from=${from}&to=${to}`
    );
    expect(request.request.method).toBe('GET');
    request.flush(TEAM_ASSIGNMENT_HISTORIES);
    httpMock.verify();
  });

  it('[getTeamAssignmentMetricsSummary] should get team assignment metrics summary', () => {
    const param = {
      assignmentId: 1,
      avatarType: 'CANDIDATE',
      date: '2018-04-16',
      exclude: 'activities',
      from: '2018-04-16',
      managerId: '1',
      fullTeam: 'true',
      teamId: '11',
      to: '2018-05-21',
      weeksCount: 5,
    };
    metricService.getTeamAssignmentMetricsSummary(param)
      .subscribe(response => expect(response).toEqual(<MetricSummary>METRICS_SUMMARY));
    const request = httpMock.expectOne(
      `${environment.apiPath}/teams/assignments/${param.assignmentId}/metrics/summary?` +
      `avatarType=${param.avatarType}&date=${param.date}&exclude=${param.exclude}` +
      `&from=${param.from}&managerId=${param.managerId}&fullTeam=${param.fullTeam}` +
      `&teamId=${param.teamId}&to=${param.to}&weeksCount=${param.weeksCount}`
    );
    expect(request.request.method).toBe('GET');
    request.flush(METRICS_SUMMARY);
    httpMock.verify();
  });

  it('[getTeamAssignmentMetricsSummary] should get team assignment metrics summary when managerId is undefined', () => {
    const param = {
      assignmentId: 1,
      avatarType: 'CANDIDATE',
      date: '2018-04-16',
      exclude: 'activities',
      from: '2018-04-16',
      fullTeam: 'true',
      teamId: '11',
      to: '2018-05-21',
      weeksCount: 5,
    };
    metricService.getTeamAssignmentMetricsSummary(param)
      .subscribe(response => expect(response).toEqual(<MetricSummary>METRICS_SUMMARY));
    const request = httpMock.expectOne(
      `${environment.apiPath}/teams/assignments/${param.assignmentId}/metrics/summary?` +
      `avatarType=${param.avatarType}&date=${param.date}&exclude=${param.exclude}` +
      `&from=${param.from}&fullTeam=${param.fullTeam}&teamId=${param.teamId}&to=${param.to}&weeksCount=${param.weeksCount}`
    );
    expect(request.request.method).toBe('GET');
    request.flush(METRICS_SUMMARY);
    httpMock.verify();
  });

  it('[exportMetricReport] should export metric report', () => {
    const response = 'sample response';
    const assignmentId = 1;
    const teamId = '1';
    const from = '2018-04-16';
    const to = '2018-05-21';
    const token = 'sample_token';
    spyOn(authTokenService, 'getToken').and.returnValue(token);
    metricService.exportMetricReport(assignmentId, teamId, from, to)
      .subscribe(res => expect(res).toEqual(<string>response));
    const request = httpMock.expectOne(
      `${environment.apiPath}/teams/assignments/${assignmentId}/metrics/values.csv` +
      `?token=${token}&downloadFormat=CSV&teamId=${teamId}&from=${from}&to=${to}`
    );
    expect(request.request.method).toBe('GET');
    request.flush(response);
    httpMock.verify();
  });

  it('[getTeamMetricsValues] should get metric values', () => {
    const response = [] as RawMetrics[];
    metricService.getTeamMetricsValues(1, 'from', 'to', true, true, 'type', 1)
      .subscribe(res => expect(res).toEqual([]));
    const request = httpMock.expectOne(
      `${environment.apiPath}/teams/1/metrics/values` +
      `?from=from&to=to&costInclusive=true&refresh=true&type=type&managerId=1`
    );
    expect(request.request.method).toBe('GET');
    request.flush(response);
    httpMock.verify();
  });

  it('[getTeamOverview] should get team overview', () => {
    const response = {} as TeamOverview;
    const teamId = 1;
    metricService.getTeamOverview(teamId)
      .subscribe(res => expect(res).toEqual(response));
    const request = httpMock.expectOne(
      `${environment.apiPath}/teams/${teamId}`
    );
    expect(request.request.method).toBe('GET');
    request.flush(response);
    httpMock.verify();
  });

  it('[getMetricsSetup] should get metrics setup', () => {
    const response = [] as MetricSetup[];
    const teamId = 1;
    metricService.getMetricsSetup(teamId)
      .subscribe(res => expect(res).toEqual([]));
    const request = httpMock.expectOne(
      `${environment.apiPath}/teams/${teamId}/metrics/setups`
    );
    expect(request.request.method).toBe('GET');
    request.flush(response);
    httpMock.verify();
  });

  it('[getTeamMetricSetting] should get team metric setting', () => {
    const response = [] as TeamMetricSetting[];
    const teamId = 1;
    const managerId = 1;
    metricService.getTeamMetricSetting(teamId, managerId)
      .subscribe(res => expect(res).toEqual([]));
    const request = httpMock.expectOne(
      `${environment.apiPath}/teams/assignments?format=metric-setting&fullTeam=false&managerId=${managerId}&status=ACTIVE&teamId=${teamId}`
    );
    expect(request.request.method).toBe('GET');
    request.flush(response);
    httpMock.verify();
  });

  it('[getTeamMetricsValuesV2] should get team metrics values', () => {
    const response = [] as RawMetrics[];
    const params = {
      teamId: 1,
      from: 'test',
      to: 'test',
      costInclusive: true,
      refresh: true,
      type: 'jira',
      managerId: 1,
    };
    metricService.getTeamMetricsValuesV2(params)
      .subscribe(res => expect(res).toEqual(response));
    const request = httpMock.expectOne(
      `${environment.apiPath}/teams/${params.teamId}/metrics/values` +
      `?from=${params.from}&to=${params.to}&costInclusive=${params.costInclusive}` +
      `&refresh=${params.refresh}&type=${params.type}&managerId=${params.managerId}`
    );
    expect(request.request.method).toBe('GET');
    request.flush(response);
    httpMock.verify();
  });

  it('[checkServerSetupInfo] should check server setup info', () => {
    const serverSetup = {
      host: 'test',
      id: 1,
      type: 'test',
      userName: 'test',
    };
    const teamId = 1;
    const response = [] as MetricSetup[];
    metricService.checkServerSetupInfo(serverSetup, teamId)
      .subscribe(res => expect(res).toEqual(response));
    const request = httpMock.expectOne(
      `${environment.apiPath}/teams/${teamId}/metrics/setups/servers`
    );
    expect(request.request.method).toBe('POST');
    request.flush(response);
    httpMock.verify();
  });
});
