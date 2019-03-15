import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReportsActivityDescription } from 'app/core/models/reports/reports-activity-description.model';
import { REPORTS_ACTIVITIES_MOCK } from 'app/core/services/mocks/reports-activities.mock';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';

export const REPORT_URLS = {
  downLoadIndividualReport: `${environment.apiPath}/teams/assignments/insights/%(activityType)s`,
  downLoadTeamReport: `${environment.apiPath}/teams/insights/%(activityType)s`,
  downLoadLoggedHoursReport: `${environment.apiPath}/teams/assignments/reports/LOGGED_HOURS`
};

@Injectable()
export class ReportsService {
  constructor(
    protected http: HttpClient,
  ) {}

  public getActivitiesDescription(): Observable<{ [key: string]: ReportsActivityDescription }> {
    return Observable.of(REPORTS_ACTIVITIES_MOCK);
  }

  public downloadIndividualReport(activityType: string, startDate: string): Observable<ArrayBuffer> {
    return this.http
    .get(sprintf(REPORT_URLS.downLoadIndividualReport, { activityType }), {
      responseType: 'arraybuffer',
      params: {
        startDate,
      },
    });
  }

  public downloadTeamReport(activityType: string, startDate: string, teams: number[]): Observable<ArrayBuffer> {
    const query = teams.map(id => `teams=${id}`);
    const url = `${sprintf(REPORT_URLS.downLoadTeamReport, { activityType })}?startDate=${startDate}&${query.join('&')}`;
    return this.http.get(url, {
      responseType: 'arraybuffer'
    });
  }

  public downloadLoggedHoursReport(startDate: string, teams: number[]): Observable<ArrayBuffer> {
    const query = teams.map(id => `teams=${id}`);
    const url = `${REPORT_URLS.downLoadLoggedHoursReport}?startDate=${startDate}&${query.join('&')}`;
    return this.http.get(url, {
      responseType: 'arraybuffer'
    });
  }
}
