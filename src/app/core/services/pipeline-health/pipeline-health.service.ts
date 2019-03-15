import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { environment } from 'environments/environment';
import { of } from 'rxjs/observable/of';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import {
  JobHealth,
  JobHealthDetails,
  PipelineCache,
  PipelineHealthFilters,
  PipelineHealthWeekFilters,
} from 'app/core/models/job-health/index';

const URLs = {
  getJobsHealth: `${environment.apiPath}/hire/jobs/health`,
  getJobsHealthWeek: `${environment.apiPath}/hire/jobs/health/week/%(start)s`,
  getJobHealthDetails: `${environment.apiPath}/hire/jobs/health/%(id)s`,
};

@Injectable()
export class PipelineHealthService {

  private cache: PipelineCache = { };

  constructor(private httpClient: HttpClient) { }

  public getJobHealthDetail(jobId: number): Observable<JobHealthDetails> {
    const id: string = jobId.toString(10);
    return this.httpClient.get<JobHealthDetails>(sprintf(URLs.getJobHealthDetails,  { id }));
  }

  public getJobsHealth(params: PipelineHealthFilters): Observable<JobHealth[]> {
    let queryParams = new HttpParams().set('jobType', params.options.jobType);
    if (params.options.searchQuery) {
      queryParams = queryParams.set('searchQuery', params.options.searchQuery);
    }
    const serializedParams = JSON.stringify(params);
    const cachedResult = this.cache[serializedParams];
    if (cachedResult) {
      return of(cachedResult);
    } else {
      return this.httpClient.get<JobHealth[]>(URLs.getJobsHealth, {
        params: queryParams,
      })
        .pipe(tap(response => this.cache[serializedParams] = response));
    }
  }

  public getJobsHealthWeek(params: PipelineHealthWeekFilters): Observable<JobHealth[]> {
    let queryParams = new HttpParams().set('jobType', params.options.jobType);
    if (params.options.searchQuery) {
      queryParams = queryParams.set('searchQuery', params.options.searchQuery);
    }
    const serializedParams = JSON.stringify(params);
    const cachedResult = this.cache[serializedParams];
    if (cachedResult) {
      return of(cachedResult);
    } else {
      const start: string = format(params.startOfWeek, 'YYYY-MM-DD');
      const url = sprintf(URLs.getJobsHealthWeek, { start });
      return this.httpClient.get<JobHealth[]>(url, {
        params: queryParams,
      })
        .pipe(tap(response => this.cache[serializedParams] = response));
    }
  }
}
