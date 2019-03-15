import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mapTo } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';


import {
  GetApplicationOptions,
  GetJobsOptions,
  JobLabel,
} from 'app/core/models/hire';
import {
  GET_APPLICATION_RESPONSE,
  JOB_LABELS_MOCK,
} from 'app/core/services/mocks/hire.mock';
import { isDefined } from 'app/core/type-guards/is-defined';
import { environment } from 'environments/environment';

const URLs = {
  jobStatistics: environment.apiPath + '/hire/jobs/statistics',
  labels: environment.apiPath + '/hire/jobs/labels',
  applyForJob: environment.apiPath + '/hire/applications',
  applicationById: environment.apiPath + '/hire/applications/%(id)s',
  campaigns: environment.apiPath + '/hire/campaigns',
  visibleCorePipelines: environment.apiPath + '/v2/hire/pipelines/visible',
};

@Injectable()
export class HireServiceMock {
  constructor(
    protected httpClient: HttpClient
  ) {
  }

  public getJobLabels(): Observable<JobLabel[]> {
    return this.httpClient.get(URLs.labels).pipe(mapTo(JOB_LABELS_MOCK));
  }

  public getApplication(applicationId: string, options: GetApplicationOptions): Observable<typeof GET_APPLICATION_RESPONSE> {
    return this.httpClient
      .get(URLs.applicationById.replace('{id}', applicationId), {
        params: new HttpParams({ fromObject: Object.assign(options) }),
      })
      .pipe(mapTo(GET_APPLICATION_RESPONSE));
  }

  protected getApiParams(options: GetJobsOptions): HttpParams {
    const apiParams: Record<string, string | string[]> = {};
    if (options.avatarType) {
      apiParams.avatarType = options.avatarType;
    }
    if (options.categoryId) {
      apiParams.label = options.categoryId.toString();
    }
    if (options.title) {
      apiParams.title = options.title;
    }
    if (options.applicationType) {
      apiParams.applicationType = options.applicationType;
    }
    if (isDefined(options.page)) {
      apiParams.page = options.page.toString();
    }
    if (isDefined(options.pageSize)) {
      apiParams.pageSize = options.pageSize.toString();
    }

    return new HttpParams({
      fromObject: apiParams,
    });
  }
}
