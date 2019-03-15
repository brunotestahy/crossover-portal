import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DfFile } from '@devfactory/ngx-df';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/map';
import { of } from 'rxjs/observable/of';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { sprintf } from 'sprintf-js';

import { APPLICATION_FLOW_STEPS } from 'app/core/constants/application-process/application-flow-steps';
import * as AvatarTypes from 'app/core/constants/avatar-types';
import {
  ApplicationFlowStep,
  JobApplication,
  ProjectEvaluationAssignment,
  ProjectEvaluationInvitation,
  WrittenAssignationTest,
} from 'app/core/models/application';
import { Candidate, ExtendAssignmentRequest } from 'app/core/models/candidate';
import { PaginatedApi } from 'app/core/models/paginated-api';

import { CandidateServiceMock } from './candidate.service.mock';

export const CANDIDATE_URLS = {
  baseURI: `${environment.apiPath}/hire/applications`,
  candidateById: `${environment.apiPath}/`,
  application: `${environment.apiPath}/hire/applications/search`,
  createBasicProfileHead: `${environment.apiPath}/hire/applications`,
  candidate: `${environment.apiPath}/candidates/`,
  createBasicProfileTail: `candidates/actions?action=provideContactInformation`,
  message: `${environment.apiPath}/messages`,
  uploadAssignment: `${environment.apiPath}/hire/applications`,
  sendQuestions: `${environment.apiPath}/messages`,
  importProfile: `${environment.apiPath}/candidates/%(candidateId)s/social/linkedin?v2ui=assets`,
  uploadAssignmentTail: `tests/assignment/files`,
  projectEvaluation: `${environment.apiPath}/hire/applications/`,
};

@Injectable()
export class CandidateService extends CandidateServiceMock {

  constructor(http: HttpClient) {
    super(http);
  }

  public static arrayBufferToBase64(buffer: Iterable<number>): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  public getCurrentApplication(): Observable<JobApplication> {
    const options = {
      page: '0',
      avatarType: AvatarTypes.Candidate,
    };
    return this.http.post<PaginatedApi<JobApplication>>(CANDIDATE_URLS.application, {}, {params: options})
      .pipe(
        map(res => res.content[0]),
        shareReplay(1)
      );
  }

  public importProfile(candidateId: number, token: string): Observable<Candidate> {
    return this.http
      .put<Candidate>(
        sprintf(CANDIDATE_URLS.importProfile, { candidateId }),
        { token }
      );
  }

  public cancelApplication(id: number): Observable<void> {
    const url = `${CANDIDATE_URLS.baseURI}/${id}/cancellations`;
    return this.http.post<void>(url, {});
  }

  public getSteps(flowId: number): Observable<ApplicationFlowStep[]> {
    const filteredSteps = APPLICATION_FLOW_STEPS.filter(step => {
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

  public createBasicProfile(basicProfile: Partial<Candidate>, applicationId: number): Observable<boolean> {
    const url = `${CANDIDATE_URLS.baseURI}/${applicationId}/${CANDIDATE_URLS.createBasicProfileTail}`;
    return this.http.post<boolean>(url, basicProfile);
  }

  public downloadFile(url: string): Observable<HttpResponse<ArrayBuffer>> {
    return this.http.get(url, {
      observe: 'response',
      responseType: 'arraybuffer',
    });
  }

  public extendAssignment(data: ExtendAssignmentRequest): Observable<boolean> {
    const url = `${CANDIDATE_URLS.projectEvaluation}${data.id}/tests/assignment?action=extend`;
    return this.http.post<void>(url, data).pipe(map(() => true));
  }

  public submitAssignment(id: number): Observable<boolean> {
    const url = `${CANDIDATE_URLS.projectEvaluation}${id}/tests/assignment`;
    return this.http.delete<void>(url).pipe(map(() => true));
  }

  public uploadAssignment(applicationId: number, file: DfFile): Observable<void> {
    const url = `${CANDIDATE_URLS.uploadAssignment}/${applicationId}/${CANDIDATE_URLS.uploadAssignmentTail}`;
    const fd = new FormData();
    const blackboxes = Object.assign({ bbx1: null, bbx2: null }) as { bbx1: string, bbx2: string };

    fd.append('assignment', new Blob([file.file]), file.file.name);
    fd.append('blackbox', blackboxes.bbx1);
    fd.append('blackbox2', blackboxes.bbx1);

    const req = new HttpRequest('POST', url, fd, {
      reportProgress: true,
      responseType: 'text',
    });

    return Object.assign(this.http.request(req)) as Observable<void>;
  }

  public getWrittenEvaluationAssignment(id: number): Observable<WrittenAssignationTest> {
    const url = `${
      CANDIDATE_URLS.baseURI
      }/${id}/candidates/actions?action=start5qTest`;
    return this.http.post<WrittenAssignationTest>(url, {
      id: id,
    });
  }

  public saveWrittenEvaluationAssignmentDraft(
    id: number,
    data: WrittenAssignationTest
  ): Observable<WrittenAssignationTest> {
    const url = `${CANDIDATE_URLS.baseURI}/${id}/candidates/actions?action=save5qTest`;
    return this.http.post<WrittenAssignationTest>(url, { ...data });
  }

  public submitWrittenEvaluationAssignment(
    id: number,
    data: WrittenAssignationTest
  ): Observable<WrittenAssignationTest> {
    const url = `${
      CANDIDATE_URLS.baseURI
      }/${id}/candidates/actions?action=submit5qTest`;
    return this.http.post<WrittenAssignationTest>(url, { ...data });
  }

  public getProjectEvaluationInvitation(
    id: number
  ): Observable<ProjectEvaluationInvitation> {
    const url = `${CANDIDATE_URLS.baseURI}/${id}/tests/assignment/invitation`;
    return this.http.get<ProjectEvaluationInvitation>(url);
  }

  public getProjectEvaluationAssignment(
    id: number
  ): Observable<ProjectEvaluationAssignment> {
    const url = `${CANDIDATE_URLS.projectEvaluation}${id}/tests/assignment`;
    return this.http.get<ProjectEvaluationAssignment>(url);
  }

  public startProjectEvaluation(id: number): Observable<void> {
    const url = `${CANDIDATE_URLS.baseURI}/${id}/tests/assignment`;
    return this.http.post<void>(url, { id });
  }

  public updateCandidate(candidate: Candidate): Observable<Candidate> {
    const url = `${CANDIDATE_URLS.candidate}${candidate.id}`;
    return this.http.put<Candidate>(url, candidate).pipe(map(() => candidate));
  }

  public sendQuestions(
    id: number,
    jobId: number,
    message: string
  ): Observable<boolean> {
    const url = `${CANDIDATE_URLS.message}?type=candidateQuestion&id=${id}`;
    return this.http
      .post<Candidate>(url, { jobId, message })
      .pipe(map(() => true));
  }
}
