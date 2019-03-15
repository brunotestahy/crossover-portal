import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationFlowStep, JobApplication } from 'app/core/models/application';
import { PaginatedApi } from 'app/core/models/paginated-api';
import { environment } from 'environments/environment';
import { of } from 'rxjs/observable/of';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { STEPS } from '../mocks/candidate.mock';

const URLs = {
  application: `${environment.apiPath}/hire/applications/search`,
  createBasicProfile: `${
    environment.apiPath
  }/hire/applications/create-basic-profile`,
  projectEvaluation: `${environment.apiPath}/hire/applications/`,
  message: `${environment.apiPath}/messages`,
};

/**
 * @deprecated This class must be removed once all the methods get fully implemented on CandidateService.
 */
@Injectable()
export class CandidateServiceMock {
  private candidateId: number;
  private application$: Observable<JobApplication> | null;

  constructor(protected http: HttpClient) {}

  public getCurrentApplication(candidateId?: number): Observable<JobApplication> {
    this.candidateId = candidateId ? candidateId : this.candidateId;

    const body = {
      candidateId: this.candidateId,
    };

    if (!this.application$) {
      this.application$ = this.http
        .post<PaginatedApi<JobApplication>>(URLs.application, body)
        .pipe(map(res => res.content[0]), shareReplay(1));
    }

    return this.application$;
  }

  public removeCurrentApplication(): void {
    this.application$ = null;
  }

  public getSteps(flowId: number): Observable<ApplicationFlowStep[]> {
    const filteredSteps = STEPS.filter(step => {
      const f = step.allowedFlowTypes.filter(type => {
        let match = false;
        for (const prop in type) {
          if (!match) {
            match = type[prop] === flowId;
          }
        }
        return match;
      });
      return f.length > 0;
    });
    return of(filteredSteps);
  }
}
