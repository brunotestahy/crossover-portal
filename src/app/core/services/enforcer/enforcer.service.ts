import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';

export const API = {
  generateReports: `${environment.apiPath}/timetracking/timesheets/report`,
};

@Injectable()
export class EnforcerService {

  constructor(
    protected http: HttpClient
  ) { }

  public generateReports(reportType: string, teamId: string, date: string): Observable<string> {
    return this.http.get<string>(
      API.generateReports,
      {
        params: {
          date,
          isCacheAccess: 'false',
          period: 'WEEK',
          reportType,
          teamId,
        },
      }
    );
  }
}
