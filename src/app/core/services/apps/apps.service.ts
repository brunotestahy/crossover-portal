import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { sprintf } from 'sprintf-js';

import { environment } from 'environments/environment';

const URLs = {
  storeStatisticsForManagers: `${environment.apiPath}/apps/statistics/usage/managers?appType=%(appType)s`,
};

@Injectable()
export class AppsService {
  constructor (
    private http: HttpClient
  ) {
  }

  public storeStatisticsFormManagers(appType: string): Observable<void> {
    return this.http.post<void>(sprintf(URLs.storeStatisticsForManagers, { appType }), { appType });
  }
}
