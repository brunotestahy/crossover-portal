import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as momentTz from 'moment-timezone';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';

import { Company, CompanyResponse } from 'app/core/models/company';
import { Job } from 'app/core/models/hire';
import {
  GetInterviewReportParam,
  InterviewReport,
  InterviewReportWithSelection,
} from 'app/core/models/interview-report';
import { PaginatedApi } from 'app/core/models/paginated-api';
import {
  CompanyPerformanceReportFileParams,
  TeamPerformanceReportFileParams,
} from 'app/core/models/report';
import { Team } from 'app/core/models/team';
import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { DeepPartial } from 'app/core/type-guards/deep-partial';
import { environment } from 'environments/environment';

const API = {
  companies: `${environment.apiPath}/hire/companies`,
  interview: `${environment.apiPath}/interview/interviews`,
  teamPerformance: `${environment.apiPath}/reports/teamPerformance`,
  team: `${environment.apiPath}/v2/teams`,
};

@Injectable()
export class ReportService {

  constructor(
    private http: HttpClient,
    private token: AuthTokenService
  ) {
  }

  public getInterviewReport(param: GetInterviewReportParam):
    Observable<PaginatedApi<InterviewReport>> {
    const queryStartDate = param.reportType === 'upcoming' ? new Date().toJSON().slice(0, 10) : '';
    const status = param.reportType === 'upcoming' ? 'CANDIDATE_ACCEPTED' : 'INITIAL';

    return this.http.get<PaginatedApi<InterviewReport>>(API.interview, {
      params: {
        status: status,
        page: param.page.toString(),
        avatarType: param.avatarType,
        startdate: queryStartDate,
        sortBy: 'startDateTime',
        direction: 'ASC',
        selectionStatus: 'IN_PROGRESS, REINTERVIEW',
      },
    }).pipe(
      map(data => Object.assign(data) as PaginatedApi<InterviewReportWithSelection>),
      map(data => {
        const reportData: InterviewReport[] = [];
        data.content.forEach((item, i) => {
          const date = param.reportType === 'upcoming' ? item.startDateTime : item.createdOn;
          reportData.push({
            id: (param.page * data.size) + (i + 1),
            company: (item.selection.manager.company as Company).name as string,
            hm: item.selection.manager.printableName as string,
            hmEmail: item.selection.manager.email as string,
            candidateName: `${item.interviewee.firstName} ${item.interviewee.lastName}`,
            candidateEmail: item.interviewee.email,
            jobRole: (item.selection.marketplaceMember.application.job as Job).title,
            startDateTime: momentTz(date).tz('US/Eastern').format('MMM D, YYYY'),
            interviewTime: momentTz(date).tz('US/Eastern').format('hh:mm a'),
          });
        });
        return {
          content: reportData,
          last: data.last,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          numberOfElements: data.numberOfElements,
          first: data.first,
          size: data.size,
          number: data.number,
        };
      })
    );
  }

  public getInterviewReportFile(reportType: string, avatarType: string): Observable<string> {
    const status = reportType === 'upcoming' ? 'CANDIDATE_ACCEPTED' : 'INITIAL';
    const token = this.token.getToken() as string;
    return this.http.get(API.interview, {
      responseType: 'text',
      params: {
        avatarType: avatarType,
        selectionStatus: 'IN_PROGRESS, REINTERVIEW',
        status: status,
        downloadFormat: 'CSV',
        token: token,
      },
    });
  }

  public getTeamPerformanceReportFile(params: TeamPerformanceReportFileParams): Observable<string> {
    return this.http.get<string>(API.teamPerformance, { params });
  }

  public getCompanyPerformanceReportFile(params: CompanyPerformanceReportFileParams): Observable<string> {
    return this.http.get<string>(API.teamPerformance, { params });
  }

  public getCompanies(pageNumber: number): Observable<CompanyResponse> {
    return this.http.get<CompanyResponse>(API.companies, {
      params: {
        page: pageNumber.toString(),
      },
    });
  }

  public getTeams(projection: string, direct?: boolean, avatarType?: string, activeAssignments?: boolean): Observable<DeepPartial<Team>[]> {
    return this.http.get<DeepPartial<Team>[]>(API.team, {
      params: {
        ...direct !== undefined && { direct: direct.toString() },
        projection,
        ...avatarType !== undefined && { avatarType },
        ...activeAssignments !== undefined && { activeAssignments: activeAssignments.toString() },
      },
    });
  }
}
