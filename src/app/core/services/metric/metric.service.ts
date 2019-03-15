import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { sprintf } from 'sprintf-js';

import * as TeamConstants from 'app/core/constants/team-selector';
import { AssignmentHistory } from 'app/core/models/assignment';
import {
  ContractorMetric,
  MetricSetup,
  MetricsSummaryParam,
  MetricSummary,
  RawMetrics,
  ServerSetup,
  TeamMetricSetting,
  TeamMetricValuesParam,
  TeamOverview,
  TeamSetup,
  WeekMetrics,
} from 'app/core/models/metric';
import { TeamHistoryRecord } from 'app/core/models/team';
import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { environment } from 'environments/environment';

export const API = {
  teamAssignmentHistories: `${environment.apiPath}/teams/assignments/%(assignmentId)s/histories`,
  teamAssignmentMetricsSummary: `${environment.apiPath}/teams/assignments/%(assignmentId)s/metrics/summary`,
  metricReport: `${environment.apiPath}/teams/assignments/%(assignmentId)s/metrics/values.csv`,
  metricValues: `${environment.apiPath}/teams/%(teamId)s/metrics/values`,
  teamOverview: `${environment.apiPath}/teams/%(teamId)s`,
  setupMetrics: `${environment.apiPath}/teams/%(teamId)s/metrics/setups`,
  teamMetricsSetting: `${environment.apiPath}/teams/assignments`,
  serverSetupInfo: `${environment.apiPath}/teams/%(teamId)s/metrics/setups/servers`,
  teamStatistics: `${environment.apiPath}/teams/%(teamId)s/statistics`,
  updateMetricSetup: `${environment.apiPath}/teams/%(teamId)s/metrics/setups/%(setupId)s`,
  updateMetricValues: `${environment.apiPath}/teams/assignments/%(assignmentId)s/metrics/values`,
  contractorMetricConfig: `${environment.apiPath}/teams/assignments/%(assignmentId)s/metrics/config`,
  refreshMetrics: `${environment.apiPath}/teams/%(teamId)s/metrics/setups/%(setupId)s/values`,
  qAuthUrl: `${environment.apiPath}/teams/metrics/spreadsheets`,
};

@Injectable()
export class MetricService {
  constructor(
    protected http: HttpClient,
    private token: AuthTokenService
  ) { }

  public getTeamStatistics(
    teamId: string,
    from: string,
    to: string,
    period: string
  ): Observable<TeamHistoryRecord[]> {
    const params = { from, to, period };
    return this.http.get<TeamHistoryRecord[]>(sprintf(API.teamStatistics, { teamId }), { params });
  }

  public downloadTeamStatisticsUrl(
    teamId: string,
    from: string,
    to: string,
    period: string
  ): string {
    const token = this.token.getToken() as string;
    const params = { from, to, period, token, downloadFormat: 'CSV' } as {[key: string]: string };
    const queryString = Object.keys(params)
      .map(data => `${data}=${params[data]}`);
    return `${environment.apiPath}/teams/${teamId}/statistics?${queryString.join('&')}`;
  }

  public getTeamAssignmentHistories(
    assignmentId: number,
    avatarType: string,
    from: string,
    to: string
  ): Observable<AssignmentHistory[]> {
    return this.http
      .get<AssignmentHistory[]>(sprintf(API.teamAssignmentHistories, { assignmentId }), {
        params: {
          avatarType,
          from,
          to,
        },
      });
  }

  public getTeamAssignmentMetricsSummary(param: MetricsSummaryParam): Observable<MetricSummary> {
    const managerId = param.managerId;
    return this.http
      .get<MetricSummary>(sprintf(API.teamAssignmentMetricsSummary, { assignmentId: param.assignmentId }), {
        params: {
          avatarType: param.avatarType,
          date: param.date,
          exclude: param.exclude,
          from: param.from,
          ...managerId !== undefined && { managerId },
          fullTeam: param.fullTeam.toString(),
          teamId: param.teamId,
          to: param.to,
          weeksCount: param.weeksCount.toString(),
        },
      });
  }

  public exportMetricReport(assignmentId: number, teamId: string, from: string, to: string): Observable<string> {
    const token = this.token.getToken() as string;
    return this.http.get(sprintf(API.metricReport, { assignmentId: assignmentId }), {
      responseType: 'text',
      params: {
        token,
        downloadFormat: 'CSV',
        teamId,
        from,
        to,
      },
    });
  }

  public getTeamOverview(teamId: number): Observable<TeamOverview> {
    return this.http
      .get<TeamOverview>(sprintf(API.teamOverview, { teamId }));
  }

  public getTeamMetricsReport(
    teamId: number,
    from: string,
    to: string,
    type: string,
    managerId?: number
  ): Observable<string> {
    const token = this.token.getToken() as string;
    return this.http
      .get(sprintf(API.metricValues, { teamId }), {
        responseType: 'text',
        params: {
          token,
          downloadFormat: 'CSV',
          from,
          to,
          type,
          ...managerId && !TeamConstants.isAllManagers(managerId) && { managerId: managerId.toString() },
        },
      });
  }

  public getTeamMetricsValues(
    teamId: number,
    from: string,
    to: string,
    costInclusive: boolean,
    refresh: boolean,
    type: string,
    managerId?: number
  ): Observable<RawMetrics[]> {
    return this.http
      .get<RawMetrics[]>(sprintf(API.metricValues, { teamId }), {
        params: {
          from,
          to,
          costInclusive: costInclusive.toString(),
          refresh: refresh.toString(),
          type,
          ...managerId && !TeamConstants.isAllManagers(managerId) && { managerId: managerId.toString() },
        },
      });
  }

  // TODO once metric page - AWORK-34727 is done merge these getTeamMetricsValues, getTeamMetricsValuesv2 in one class
  public getTeamMetricsValuesV2(param: TeamMetricValuesParam): Observable<RawMetrics[]> {
    const teamId = param.teamId;
    const from = param.from;
    const to = param.to;
    const costInclusive = param.costInclusive.toString();
    const refresh = _.defaultTo(param.refresh, '').toString();
    const type = param.type;
    const managerId = _.defaultTo(param.managerId, '').toString();
    return this.http
      .get<RawMetrics[]>(sprintf(API.metricValues, { teamId }), {
        params: {
          from,
          to,
          costInclusive: costInclusive.toString(),
          ...refresh && { refresh: refresh.toString() },
          ...type && { type },
          ...managerId && { managerId: managerId.toString() },
        },
      });
  }

  public setupOrUpdateMetrics(teamId: number, teamSetup: TeamSetup): Observable<void> {
    const setupId = teamSetup.id;
    if (setupId) {
      return this.http
        .put<void>(sprintf(API.updateMetricSetup, { teamId, setupId }), teamSetup);
    } else {
      return this.http
        .post<void>(`${sprintf(API.setupMetrics, { teamId })}`, teamSetup);
    }
  }

  public refreshMetrics(teamId: number, setupId: number): Observable<void> {
    return this.http
      .put<void>(sprintf(API.refreshMetrics, { teamId, setupId }), {
        id: teamId,
        setupId
      });
  }

  public saveContractorManualMetric(contractorMetric: WeekMetrics[], assignmentId?: number): Observable<void> {
    return this.http
      .put<void>(sprintf(API.updateMetricValues, { assignmentId }), contractorMetric);
  }

  public updateContractorMetricConfig(contractorMetric: ContractorMetric, assignmentId: number): Observable<void> {
    return this.http
      .put<void>(sprintf(API.contractorMetricConfig, { assignmentId }), contractorMetric);
  }

  public checkServerSetupInfo(serverSetup: ServerSetup, teamId: number): Observable<MetricSetup[]> {
    const data = {
      host: serverSetup.host,
      id: serverSetup.id,
      type: serverSetup.type,
      userName: serverSetup.username,
    };
    return this.http
      .post<MetricSetup[]>(sprintf(API.serverSetupInfo, { teamId }), data);
  }

  public getMetricsSetup(teamId: number): Observable<MetricSetup[]> {
    return this.http
      .get<MetricSetup[]>(sprintf(API.setupMetrics, { teamId }));
  }

  public getTeamMetricSetting(teamId: number, managerId: number): Observable<TeamMetricSetting[]> {
    const params = {
      format: 'metric-setting',
      fullTeam: 'false',
      managerId: managerId.toString(),
      status: 'ACTIVE',
      teamId: teamId.toString(),
    };
    return this.http
      .get<TeamMetricSetting[]>(API.teamMetricsSetting, {
        params,
      });
  }

  public getQAuthUrl(): Observable<string> {
    return this.http
      .get<string>(API.qAuthUrl);
  }
}
