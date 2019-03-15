import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JobApplication } from 'app/core/models/application';
import { AvatarType } from 'app/core/models/avatar';
import { PaginatedApi } from 'app/core/models/paginated-api';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';

export interface GetApplicationsOptions {
  avatarType: AvatarType;
  [key: string]: string;
}

const URLs = {
  applications: `${environment.apiPath}/hire/applications`,
  list: `${environment.apiPath}/hire/applications/search`,
};

@Injectable()
export class JobApplicationService {

  constructor(
    private http: HttpClient
  ) {
  }

  public getApplications(params: GetApplicationsOptions): Observable<PaginatedApi<JobApplication>> {
    return this.http.get<PaginatedApi<JobApplication>>(URLs.applications, { params });
  }

  public list(
    params: GetApplicationsOptions
  ): Observable<PaginatedApi<JobApplication>> {
    return this.http.post<PaginatedApi<JobApplication>>(URLs.list, { params });
  }
}
