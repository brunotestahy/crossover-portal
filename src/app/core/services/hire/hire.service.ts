import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as AvatarTypes from 'app/core/constants/avatar-types';
import { ApplicationNote, JobApplication } from 'app/core/models/application';
import { Assignment } from 'app/core/models/assignment';
import { TestEvaluationRecord } from 'app/core/models/grading';
import {
  Applicant,
  ApplicantBody,
  ApplicantQuery,
  ApplicationFileUploadResponse,
  ApplicationTest,
  ApplyToJobData,
  GetJobsOptions,
  Job,
  JobDetails,
  JobSearchResponse,
  RubricScore,
  TalentAvocateTest,
  VisibleCorePipeline,
  VisiblePipelineVariants,
} from 'app/core/models/hire';
import { CurrentUserDetail } from 'app/core/models/identity';
import { UserLocationData } from 'app/core/models/identity';
import {
  JobSourcingDetailsResponse,
  JobSourcingResponse,
  UpdateJobSourcingForm,
} from 'app/core/models/job-sourcing';
import { AllJobStatistic, JobStatistic } from 'app/core/models/job-statistic';
import { PaginatedApi } from 'app/core/models/paginated-api';
import { HireServiceMock } from 'app/core/services/hire/hire.service.mock';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { sprintf } from 'sprintf-js';

const URLs = {
  jobs: `${environment.apiPath}/hire/jobs`,
  jobStatisticsById: `${environment.apiPath}/hire/jobs/%(jobId)s/statistics`,
  jobSubscriptions: `${environment.apiPath}/hire/jobs/%(jobId)s/subscriptions`,
  jobStatistics: `${environment.apiPath}/hire/jobs/statistics`,
  labels: `${environment.apiPath}/hire/jobs/labels`,
  applyForJob: `${environment.apiPath}/hire/applications`,
  applicationNote: `${environment.apiPath}/hire/applications/%(id)s/notes`,
  applicationSearch: `${environment.apiPath}/hire/applications/search`,
  applicationByIdFiles: `${environment.apiPath}/hire/applications/%(applicationId)s/files`,
  applicationUploadFile: `${environment.apiPath}/hire/applications/%(applicationId)s/files/%(fileId)s`,
  campaigns: `${environment.apiPath}/hire/campaigns`,
  getJobsSourcing: `${environment.apiPath}/hire/jobs/sourcing`,
  getJobSourcingDetails: `${environment.apiPath}/hire/jobs/%(id)s/sourcing`,
  searchApplicants: `${environment.apiPath}/hire/applications/search`,
  searchApplicantsV2: `${environment.apiPath}/v2/hire/applications/search`,
  testTalentAdvocate: `${environment.apiPath}/hire/applications/%(applicationId)s/tests/talent-advocate`,
  visibleCorePipelines: `${environment.apiPath}/v2/hire/pipelines/visible`,
  visiblePipelineVariants: `${environment.apiPath}/v2/hire/pipelines/visible/{id}/variants`,
  companies: `${environment.apiPath}hire/companies`,
  prerequisitesForJob: `${environment.apiPath}/hire/applications/prerequisites?jobId=`,
  prerequisites: `${environment.apiPath}/hire/applications/prerequisites`,
  previews: `${environment.apiPath}/hire/applications/previews`,
  putjobsSourcing: `${environment.apiPath}/hire/jobs/%(id)s/sourcing`,
  acceptRejectTalentAdvocateAnswers: `${environment.apiPath}/hire/applications/%(applicationId)s/tests/talent-advocate?accept=%(accept)s`,
  uploadTournamentCandidateFiles: `${environment.apiPath}/hire/applications/bulk`,
  scoreResumes: `${environment.apiPath}/hire/applications/scores/resumes`,
  rejectApplicant: `${environment.apiPath}/hire/applications/%(applicantId)s?type=%(rejectionType)s`,
  applicationTest: `${environment.apiPath}/applications/tests/%(testId)s`,
  scoreOther: `${environment.apiPath}/hire/applications/scores/other`,
  scoreResumeRubrics: `${environment.apiPath}/hire/applications/scores/resume-rubrics`,
  endContract: `${environment.apiPath}/teams/assignments/%(assignmentId)s/actions/manager`,
  saveEvaluations: `${environment.apiPath}/hire/applications/scores/written-evaluations`,
  finalizeFiveQEvaluation: `${environment.apiPath}/hire/applications/%(applicationId)s/recruitment-analysts/actions?action=grade5qTest`
};

@Injectable()
export class HireService extends HireServiceMock {

  constructor(
    protected httpClient: HttpClient
  ) {
    super(httpClient);
  }

  public getJobs(options: GetJobsOptions): Observable<Job[]> {
    // normalize options to the correct names required by the API
    const httpParams = this.getApiParams(options);
    return this.httpClient.get<Job[]>(URLs.jobs, { params: httpParams })
      .pipe(
        map(jobs => {
          const hostUrl = 'https://s3.amazonaws.com/';
          return jobs.map(job => ({
            ...job,
            ...job.imageUrl && { imageUrl: `${hostUrl}${job.imageUrl}` },
          }));
        })
      );
  }

  public getPrerequisitesForJob(jobId: number): Observable<boolean> {
    return this.httpClient.get<boolean>(URLs.prerequisitesForJob + jobId);
  }

  public getJobStatistics(): Observable<AllJobStatistic[]> {
    return this.httpClient.get<AllJobStatistic[]>(URLs.jobStatistics);
  }

  public getJobStatisticsById(
    jobId: string | number,
    params: { [key: string]: string }
  ): Observable<JobStatistic[]> {
    return this.httpClient.get<JobStatistic[]>(
      sprintf(URLs.jobStatisticsById, { jobId }),
      { params }
    );
  }

  public subscribeToJobPipeline(jobId: string | number): Observable<void> {
    return this.httpClient.post<void>(
      sprintf(URLs.jobSubscriptions, { jobId }),
      {id: jobId}
    );
  }

  public getCampaigns(): Observable<string[]> {
    return this.httpClient.get<string[]>(URLs.campaigns);
  }

  public searchCurrentUserApplications(avatarType: string): Observable<JobSearchResponse> {
    return this.httpClient
      .post<JobSearchResponse>(URLs.applicationSearch, {
        params: { avatarType },
      });
  }

  public saveEvaluations(records: TestEvaluationRecord[]): Observable<void> {
    return this.httpClient.put<void>(URLs.saveEvaluations, records);
  }

  public finalizeFiveQEvaluation(applicationId: number): Observable<void> {
    return this.httpClient.post<void>(sprintf(URLs.finalizeFiveQEvaluation, { applicationId }), {
      id: applicationId
    }, {
      headers: new HttpHeaders().set('Content-Type', 'text/plain;charset=UTF-8')
    });
  }

  public getJob(
    jobId: string | number,
    avatarType: string = ''
  ): Observable<JobDetails> {
    if (avatarType) {
      avatarType = `?avatarType=${avatarType}`;
    }
    return this.httpClient.get<JobDetails>(`${URLs.jobs}/${jobId}${avatarType}`);
  }

  public applyToJob(data: ApplyToJobData): Observable<JobApplication> {
    // this involves file upload, so we need to use form data here
    const formData = new FormData();
    // add resume as plain file
    formData.append('resume', data.resume);
    formData.append('blackbox', '');
    formData.append('blackbox2', '');
    formData.append('application', JSON.stringify(data.application));
    return this.httpClient.post<JobApplication>(URLs.applyForJob, formData);
  }

  // tslint:disable-next-line:no-any
  public applyToJobAsAnonymousUser(data: any, jobId: number): Observable<JobApplication> {
    const applicationData = {
      application: {
        candidate: {
          'email': data.value.email,
          'type': 'CANDIDATE',
          'firstName': data.value.name.split(' ')[0],
          'lastName': data.value.name.split(' ')[1],
          'userSecurity': { 'rawPassword': data.value.password },
          'location': { country: data.value.country },
          'recaptchaResponse': data.value.recaptcha,
          'jobId': jobId,
        },
        'job': { 'id': jobId },
        'campaign': 'AvailableJobs',
      },
    };
    // this involves file upload, so we need to use form data here
    const formData = new FormData();
    // add resume as plain file
    formData.append('resume', data.value.resume);
    formData.append('blackbox', '');
    formData.append('blackbox2', '');
    formData.append('application', JSON.stringify(applicationData.application));

    return this.httpClient.post<JobApplication>(URLs.applyForJob, formData);
  }

  // tslint:disable-next-line:no-any
  public applyToJobAsAuthenticatedUser(data: any, jobId: number, resume: File): Observable<JobApplication> {
    const applicationData = {
      application: {
        candidate: data,
        'job': { 'id': jobId },
        'campaign': 'AvailableJobs',
      },
    };
    applicationData.application.candidate.type = 'CANDIDATE';
    // this involves file upload, so we need to use form data here
    const formData = new FormData();
    // add resume as plain file
    formData.append('resume', resume);
    formData.append('blackbox', '');
    formData.append('blackbox2', '');
    formData.append('application', JSON.stringify(applicationData.application));

    return this.httpClient.post<JobApplication>(URLs.applyForJob, formData);
  }

  public rejectCandidateWithReason(applicantId: string, rejectionType: string, encodedReason: string): Observable<void> {
    return this.httpClient.delete<void>(
      `${sprintf(URLs.rejectApplicant, { applicantId, rejectionType })}&reason=${encodedReason}`
    );
  }

  public rejectCandidateWithoutReason(applicantId: string, rejectionType: string): Observable<void> {
    return this.httpClient.delete<void>(
      sprintf(URLs.rejectApplicant, { applicantId, rejectionType })
    );
  }

  public applyToPipelineAsAuthenticatedUser(
    user: CurrentUserDetail,
    jobId: number,
    resume: File,
    variants: VisiblePipelineVariants[]): Observable<JobApplication> {
    const applicationData = {
      application: {
        candidate: user as CurrentUserDetail,
        'job': { 'id': jobId },
        variants,
      },
    };
    applicationData.application.candidate.type = 'CANDIDATE';
    // this involves file upload, so we need to use form data here
    const formData = new FormData();
    // add resume as plain file
    formData.append('resume', resume);
    formData.append('blackbox', '');
    formData.append('blackbox2', '');
    formData.append('application', JSON.stringify(applicationData.application));

    return this.httpClient.post<JobApplication>(URLs.applyForJob, formData);
  }

  public applyToPipelineAsAnonymousUser(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    country: UserLocationData,
    recaptcha: string,
    jobId: number,
    resume: File,
    variants: VisiblePipelineVariants[]): Observable<JobApplication> {
    const applicationData = {
      application: {
        candidate: {
          email,
          type: 'CANDIDATE',
          firstName,
          lastName,
          userSecurity: { rawPassword: password },
          location: { country },
          recaptchaResponse: recaptcha,
          jobId: jobId,
        },
        job: { id: jobId },
        variants,
      },
    };
    // this involves file upload, so we need to use form data here
    const formData = new FormData();
    // add resume as plain file
    formData.append('resume', resume);
    formData.append('blackbox', '');
    formData.append('blackbox2', '');
    formData.append('application', JSON.stringify(applicationData.application));

    return this.httpClient.post<JobApplication>(URLs.applyForJob, formData);
  }

  public getVisibleCorePipelines(options: GetJobsOptions): Observable<VisibleCorePipeline[]> {
    const httpParams = this.getApiParams(options);
    return this.httpClient
      .get<PaginatedApi<VisibleCorePipeline>>(URLs.visibleCorePipelines, {
        params: httpParams,
      })
      .pipe(map(res => res.content));
  }

  public getVisiblePipelineVariants(id: string): Observable<VisiblePipelineVariants[]> {
    return this.httpClient.get<VisiblePipelineVariants[]>(URLs.visiblePipelineVariants.replace('{id}', id));
  }

  public getApplicationFile(applicationId: string, fileId: string): Observable<string> {
    return this.httpClient
      .get<string>(sprintf(URLs.applicationByIdFiles, { applicationId }), {
        params: { fileId },
      });
  }

  public putApplicationFile(applicationId: number, fileId: number, content: File): Observable<ApplicationFileUploadResponse> {
    const formData = new FormData();
    const formFieldName = 'file';
    formData.append(formFieldName, content, content.name);
    return this.httpClient
      .post<ApplicationFileUploadResponse>(
        sprintf(URLs.applicationUploadFile, { applicationId, fileId }), formData, {}
      );
  }

  public searchApplicants(
    query: {
      avatarType?: string;
      orderBy?: string;
      sortDir?: 'ASC' | 'DESC';
      pageSize?: number;
      page?: number;
      jobId?: number;
      withPercentiles?: boolean;
    } = {},
    body: {
      applicationStatus?: string;
      applicationType?: string;
      searchWord?: string;
      showDisabled?: boolean;
      tasks?: string[];
    } = {}
  ): Observable<PaginatedApi<JobApplication>> {
    return this.httpClient.post<PaginatedApi<JobApplication>>(
      URLs.searchApplicants,
      body,
      {
        params: new HttpParams({
          fromObject: Object.assign(query),
        }),
      }
    );
  }

  public searchApplicantsV2(
    query: ApplicantQuery = {},
    body: ApplicantBody
  ): Observable<PaginatedApi<Applicant>> {
    return this.httpClient.post<PaginatedApi<Applicant>>(
      URLs.searchApplicantsV2,
      body,
      {
        params: new HttpParams({
          fromObject: query as { param: string },
        }),
      }
    );
  }

  public getApplicationTest(id: number): Observable<ApplicationTest> {
    return this.httpClient.get<ApplicationTest>(sprintf(URLs.applicationTest, { testId: id }));
  }

  public scoreResume(applicants: { applicationId: number[] }): Observable<Object> {
    const query: string[] = [];
    applicants.applicationId.map(id => query.push(`applicationId=${id}`));
    return this.httpClient.post<Object>(`${URLs.scoreResumes}?${query.join('&')}`, applicants);
  }

  public getJobsSourcing(): Observable<JobSourcingResponse> {
    return this.httpClient.get<JobSourcingResponse>(URLs.getJobsSourcing);
  }

  public getJobSourcingDetails(id: number): Observable<JobSourcingDetailsResponse> {
    return this.httpClient.get<JobSourcingDetailsResponse>(sprintf(URLs.getJobSourcingDetails, { id }));
  }

  public updateJobSourcing(id: number, data: UpdateJobSourcingForm): Observable<void> {
    return this.httpClient.put<void>(sprintf(URLs.putjobsSourcing, { id }), data);
  }

  public getApplicationNotes(id: number, avatarType: string, type: string): Observable<ApplicationNote[]> {
    const url = sprintf(`${URLs.applicationNote}?avatarType=${avatarType}&type=${type}`, { id });
    return this.httpClient.get<ApplicationNote[]>(url);
  }

  public postApplicationNote(id: number, avatarType: string, type: string, content: string): Observable<ApplicationNote> {
    const url = sprintf(`${URLs.applicationNote}?avatarType=${avatarType}`, { id });
    return this.httpClient.post<ApplicationNote>(url, { content, type });
  }

  public getApplicationComment(id: number, avatarType: string, type: string): Observable<ApplicationNote[]> {
    const url = sprintf(`${URLs.applicationNote}?avatarType=${avatarType}&type=${type}`, { id });
    return this.httpClient.get<ApplicationNote[]>(url);
  }

  public postApplicationComment(id: number, avatarType: string, content: string, recipient: string, type: string)
    : Observable<ApplicationNote> {
    const url = sprintf(`${URLs.applicationNote}?avatarType=${avatarType}`, { id });
    return this.httpClient.post<ApplicationNote>(url, {
      content,
      type,
      recipient,
    });
  }

  public acceptRejectTalentAdvocateAnswers(applicationId: number, accept: boolean): Observable<{}> {
    return this.httpClient.post<{}>(sprintf(URLs.testTalentAdvocate, { applicationId, accept }),
      { accept, id: applicationId },
      {
        params: new HttpParams({
          fromObject: Object.assign({ accept }),
        }),
      });
  }

  public getPreHireApplicationTest(applicationId: number): Observable<TalentAvocateTest> {
    return this.httpClient.get<TalentAvocateTest>(
      sprintf(URLs.testTalentAdvocate, { applicationId })
    );
  }

  public updateHireApplicationTest(applicationId: number, formData: TalentAvocateTest): Observable<TalentAvocateTest> {
    return this.httpClient.put<TalentAvocateTest>(
      sprintf(URLs.testTalentAdvocate, { applicationId }), formData
    );
  }

  public uploadCandidatesFile(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('csvFile', file, file.name);

    return this.httpClient.post<void>(URLs.uploadTournamentCandidateFiles, formData);
  }

  public endContract(scheduledDate: string, reason: string, comments: string, rating: string, assignment: Assignment): Observable<void> {
    const avatarType = AvatarTypes.Manager;
    const action = 'terminate';
    const assignmentId = assignment.id;
    const data = {
      assignment,
      reason,
      comments,
      rating,
    };
    return this.httpClient.post<void>(sprintf(URLs.endContract, { assignmentId }), data, {
      params: {
        avatarType,
        action,
        scheduledDate,
      },
    });
  }

  public addNewPreview(applicationsIds: number[], type: string): Observable<void> {
    let queryParameters = applicationsIds.reduce((carry, id, currentIndex) =>
      carry.concat(`applicationsIds=${id}${currentIndex === (applicationsIds.length - 1) ? '' : '&'}`),
      '?'
    );
    if (type === 'applications') {
      queryParameters = queryParameters + `&type=${type}`;
    }
    return this.httpClient.post<void>(URLs.previews + queryParameters, { applicationsIds });
  }

  public removePreview(applicationsIds: string[]): Observable<void> {
    return this.httpClient.delete<void>(URLs.previews, { params: { applicationsIds } });
  }

  public updateResumeRubricScore(resumeRubricsScores: RubricScore[]): Observable<void> {
    return this.httpClient.put<void>(URLs.scoreResumeRubrics, resumeRubricsScores);
  }

}
