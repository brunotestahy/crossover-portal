import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, getTestBed, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';

import { ApplicationTest, TalentAvocateTest, VisiblePipelineVariants } from 'app/core/models/hire';
import { HireService } from 'app/core/services/hire/hire.service';
import { CANDIDATE_MOCK } from 'app/core/services/mocks/candidate.mock';
import { environment } from 'environments/environment';

describe('HireService', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let hireService: HireService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          HireService,
        ],
      });
    })
  );

  beforeEach(() => {
    httpMock = getTestBed().get(HttpTestingController);
    httpClient = getTestBed().get(HttpClient);
    hireService = getTestBed().get(HireService);
  });

  it('should be created', () => {
    expect(hireService).toBeTruthy();
  });

  describe('getVisibleCorePipelines', () => {

    it('should call correct API and return defined response', () => {
      const options = {
        title: 'sometitle',
        avatarType: 'someavatar',
        categoryId: 1,
        page: 0,
        pageSize: 25,
      };
      hireService.getVisibleCorePipelines(options).subscribe();
      const request = httpMock.expectOne(
        environment.apiPath
        + '/v2/hire/pipelines/visible?avatarType=someavatar&label=1&title=sometitle&page=0&pageSize=25'
      );
      expect(request.request.method).toBe('GET');
      request.flush({});
      httpMock.verify();

      const responseContent = { content: [{}] };
      spyOn(httpClient, 'get').and.returnValue(
        of(responseContent)
      );
      hireService.getVisibleCorePipelines(options).subscribe(res => {
        expect(res).toBeDefined();
      });
    });
  });

  describe('getPrerequisitesForJob', () => {

    it('should call correct API and return defined response', () => {
      const RESPONSE = {};
      hireService.getPrerequisitesForJob(1).subscribe(res => {
        expect(res).toBeTruthy(RESPONSE);
      });
      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/applications/prerequisites?jobId=1`
      );
      expect(request.request.method).toBe('GET');
      request.flush(RESPONSE);
      httpMock.verify();
    });
  });

  describe('subscribeToJobPipeline', () => {

    it('should call correct API and return defined response', () => {
      const RESPONSE = {};
      hireService.subscribeToJobPipeline(123).subscribe();
      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/jobs/123/subscriptions`
      );
      expect(request.request.body).toEqual({id: 123});
      expect(request.request.method).toBe('POST');
      request.flush(RESPONSE);
      httpMock.verify();
    });
  });

  describe('getVisiblePipelineVariants', () => {

    it('should call correct API and return defined response', () => {
      const RESPONSE = [] as VisiblePipelineVariants[];
      hireService.getVisiblePipelineVariants('3').subscribe(res => {
        expect(res).toBeTruthy(RESPONSE);
      });
      const request = httpMock.expectOne(
        `${environment.apiPath}/v2/hire/pipelines/visible/3/variants`
      );
      expect(request.request.method).toBe('GET');
      request.flush(RESPONSE);
      httpMock.verify();
    });
  });

  describe('getJobLabels', () => {

    it('should call correct API and return defined response', () => {
      const RESPONSE = {};
      hireService.getJobLabels().subscribe(res => {
        expect(res).toBeTruthy(RESPONSE);
      });
      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/jobs/labels`
      );
      expect(request.request.method).toBe('GET');
      request.flush(RESPONSE);
      httpMock.verify();
    });
  });

  describe('getJob', () => {

    it('should call correct API and return defined response', () => {
      const RESPONSE = {};
      hireService.getJob(1).subscribe(res => {
        expect(res).toBeTruthy(RESPONSE);
      });
      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/jobs/1`
      );
      expect(request.request.method).toBe('GET');
      request.flush(RESPONSE);
      httpMock.verify();
    });

    it('should call the correct API and return defined response when the request also contains the avatar type', () => {
      const RESPONSE = {};
      const avatarType = 'SampleAvatarType';
      const jobId = 1;
      hireService.getJob(1, avatarType).subscribe(res => {
        expect(res).toBeTruthy(RESPONSE);
      });
      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/jobs/${jobId}?avatarType=${avatarType}`
      );
      expect(request.request.method).toBe('GET');
      request.flush(RESPONSE);
      httpMock.verify();
    });
  });

  describe('getJobs', () => {

    it('should call correct API and return defined response', () => {
      const RESPONSE = [{ title: 'test title 1' }];
      const jobOptions = {
        title: 'test title',
        avatarType: 'CANDIDATE',
        page: 0,
      };
      hireService.getJobs(jobOptions).subscribe(res => {
        expect(res).toBeTruthy(RESPONSE);
      });
      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/jobs?avatarType=CANDIDATE&title=test%20title&page=0`
      );
      expect(request.request.method).toBe('GET');
      request.flush(RESPONSE);
      httpMock.verify();
    });
  });

  describe('applyToJob', () => {

    it('should call correct API and return defined response', () => {
      const RESPONSE = [{ title: 'test title 1' }];
      const options = {
        application: {
          candidate: {
            email: 'test@test.com',
            type: 'type',
            firstName: 'rashmi',
            lastName: 'kumari',
            userSecurity: {
              rawPassword: '12345test',
            },
            location: {
              country: {
                'id': 1,
                'timezones': [
                  {
                    'id': 234,
                    'name': 'Asia/Kabul',
                    'offset': 16200000,
                    'standardOffset': 16200000,
                    'hourlyOffset': '+04:30',
                  },
                ], 'name': 'Afghanistan',
                'code': 'af',
                'allowed': true,
              },
            },
            recaptchaResponse: 'test',
            jobId: 1,
          },
          job: { id: 1 },
          campaign: 'test',
        },
        resume: 'test',
      };
      hireService.applyToJob(options).subscribe(res => {
        expect(res).toBeTruthy(RESPONSE);
      });
      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/applications`
      );
      expect(request.request.method).toBe('POST');
      request.flush(RESPONSE);
      httpMock.verify();
    });
  });

  describe('applyToPipelineAsAuthenticatedUser', () => {

    it('should call correct API and return defined response', () => {
      const RESPONSE = [{ title: 'test title 1' }];
      const file = Object.assign({}) as File;
      hireService.applyToPipelineAsAuthenticatedUser(Object.assign(CANDIDATE_MOCK), 335, file, []).subscribe(res => {
        expect(res).toBeTruthy(RESPONSE);
      });
      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/applications`
      );
      expect(request.request.method).toBe('POST');
      request.flush(RESPONSE);
      httpMock.verify();
    });
  });

  describe('applyToPipelineAsAnonymousUser', () => {

    it('should call correct API and return defined response', () => {
      const RESPONSE = [{ title: 'test title 1' }];
      const file = Object.assign({}) as File;
      hireService.applyToPipelineAsAnonymousUser(
        'john.doe@crossover.com',
        'John',
        'Doe',
        'test123',
        {},
        'aeefaeaeeojj',
        123,
        file,
        []).subscribe(res => {
        expect(res).toBeTruthy(RESPONSE);
      });
      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/applications`
      );
      expect(request.request.method).toBe('POST');
      request.flush(RESPONSE);
      httpMock.verify();
    });
  });

  describe('applyToJobAsAuthenticatedUser', () => {

    it('should call correct API and return defined response', () => {
      const RESPONSE = [{ title: 'test title 1' }];
      const file = Object.assign({}) as File;
      hireService.applyToJobAsAuthenticatedUser({
        candidate: {},
        'job': { 'id': 123 },
        'campaign': 'AvailableJobs',
      }, 335, file).subscribe(res => {
        expect(res).toBeTruthy(RESPONSE);
      });
      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/applications`
      );
      expect(request.request.method).toBe('POST');
      request.flush(RESPONSE);
      httpMock.verify();
    });
  });

  describe('applyToJobAsAnonymousUser', () => {

    it('should call correct API and return defined response', () => {
      const RESPONSE = [{ title: 'test title 1' }];
      hireService.applyToJobAsAnonymousUser({
        value: {
          name: 'John Doe',
          email: 'john.doe@crossover.com',
          password: 'test123',
          country: 'Canada',
          recaptcha: 'aeefaeaeeojj',
        },
        'job': { 'id': 123 },
        'campaign': 'AvailableJobs',
      }, 335).subscribe(res => {
        expect(res).toBeTruthy(RESPONSE);
      });
      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/applications`
      );
      expect(request.request.method).toBe('POST');
      request.flush(RESPONSE);
      httpMock.verify();
    });
  });

  describe('applyToJobAsAnonymousUser', () => {

    it('should call correct API and return defined response', () => {
      const RESPONSE = [{ title: 'test title 1' }];
      const data = { value: { name: 'test test' } };
      const jobId = 1;
      hireService.applyToJobAsAnonymousUser(data, jobId).subscribe(res => {
        expect(res).toBeTruthy(RESPONSE);
      });
      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/applications`
      );
      expect(request.request.method).toBe('POST');
      request.flush(RESPONSE);
      httpMock.verify();
    });
  });

  describe('applyToJobAsAuthenticatedUser', () => {

    it('should call correct API and return defined response', () => {
      const RESPONSE = [{ title: 'test title 1' }];
      const data = { value: { name: 'test test' } };
      const jobId = 1;
      const resume = Object.assign({}) as File;
      hireService.applyToJobAsAuthenticatedUser(data, jobId, resume).subscribe(res => {
        expect(res).toBeTruthy(RESPONSE);
      });
      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/applications`
      );
      expect(request.request.method).toBe('POST');
      request.flush(RESPONSE);
      httpMock.verify();
    });
  });

  describe('searchApplicants', () => {

    it('should call correct API and return defined response', () => {
      const RESPONSE = [{ title: 'test title 1' }];
      hireService
        .searchApplicants(
          {
            avatarType: 'RECRUITER',
            orderBy: '',
            sortDir: 'ASC',
            pageSize: 1000,
          },
          {
            applicationStatus: '',
            applicationType: '',
            searchWord: '',
            showDisabled: false,
            tasks: [],
          }
        )
        .subscribe(res => expect(res).toBeTruthy(RESPONSE));
    });
  });

  describe('searchApplicantsV2', () => {

    it('should call correct API and return defined response', () => {
      const RESPONSE = [{ title: 'test title 1' }];
      hireService.searchApplicantsV2({
          avatarType: 'RECRUITER',
          orderBy: '',
          sortDir: 'ASC',
          pageSize: 1000,
        },
        {
          applicationStatus: '',
          applicationType: '',
          jobId: 123,
          searchWord: '',
          showDisabled: false,
          tasks: [],
        })
        .subscribe(res => expect(res).toBeTruthy(RESPONSE));
    });
  });

  describe('acceptRejectTalentAdvocateAnswers', () => {

    it('should call correct API and return defined response', () => {
      const RESPONSE = [{ title: 'test title 1' }];
      const applicationId = 123;
      const accept = true;
      hireService
        .acceptRejectTalentAdvocateAnswers(applicationId, accept)
        .subscribe(res => expect(res).toBe(RESPONSE));
    });
  });

  describe('getPreHireApplicationTest', () => {

    it('should call correct API and return defined response', () => {
      const RESPONSE = Object.assign([{ title: 'test title 1' }]);
      const applicationId = 234;
      hireService.getPreHireApplicationTest(applicationId).subscribe(res => {
        expect(res).toBe(RESPONSE);
      });
      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/applications/${applicationId}/tests/talent-advocate`
      );
      expect(request.request.method).toBe('GET');
      request.flush(RESPONSE);
      httpMock.verify();
    });
  });

  describe('updateHireApplicationTest', () => {

    it('should call correct API and return defined response', () => {
      const RESPONSE = Object.assign([{ title: 'test title 1' }]);
      const applicationId = 234;
      const formData = Object.assign({}) as TalentAvocateTest;
      hireService
        .updateHireApplicationTest(applicationId, formData)
        .subscribe(res => expect(res).toBe(RESPONSE));
      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/applications/${applicationId}/tests/talent-advocate`
      );
      expect(request.request.method).toBe('PUT');
      request.flush(RESPONSE);
      httpMock.verify();
    });
  });

  describe('uploadCandidatesFile', () => {

    it('should call correct API and return defined response', () => {
      const RESPONSE = Object.assign([{ title: 'test title 1' }]);
      const file = Object.assign({ name: 'File' }) as File;
      hireService
        .uploadCandidatesFile(file)
        .subscribe(res => expect(res).toBe(RESPONSE));
      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/applications/bulk`
      );
      expect(request.request.method).toBe('POST');
      request.flush(RESPONSE);
      httpMock.verify();
    });
  });

  describe('applicantsTest', () => {
    it('should call reject applicants when reason is provided', () => {
      const APPLICANT_ID = '123';
      const TYPE = 'REJECT';
      const REASON = 'Thereason';
      hireService.rejectCandidateWithReason(APPLICANT_ID, TYPE, REASON)
        .subscribe();
      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/applications/${APPLICANT_ID}?type=${TYPE}&reason=${REASON}`
      );

      expect(request.request.method).toBe('DELETE');
      httpMock.verify();
    });

    it('should call reject applicants when no reason is provided', () => {
      const APPLICANT_ID = '123';
      const TYPE = 'REJECT';
      hireService.rejectCandidateWithoutReason(APPLICANT_ID, TYPE)
        .subscribe();
      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/applications/${APPLICANT_ID}?type=${TYPE}`
      );

      expect(request.request.method).toBe('DELETE');
      httpMock.verify();
    });

    it('should score resume', () => {
      const RESPONSE = {};
      const APPLICANT_ID = { applicationId: [123] };
      hireService.scoreResume(APPLICANT_ID)
        .subscribe(res => expect(res).toBe(RESPONSE));

      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/applications/scores/resumes?applicationId=123`
      );
      expect(request.request.method).toBe('POST');
      request.flush(RESPONSE);
      httpMock.verify();
    });

    it('should grab application notes successfully', () => {
      const RESPONSE = Object.assign([]);
      const params = {  id: 1, avatarType: 'SAMPLE', type: 'ANOTHER_SAMPLE' };

      hireService
        .getApplicationNotes(params.id, params.avatarType, params.type)
        .subscribe(res => expect(res).toBe(RESPONSE));

      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/applications/${params.id}/notes?avatarType=${params.avatarType}&type=${params.type}`
      );
      expect(request.request.method).toBe('GET');
      request.flush(RESPONSE);
      httpMock.verify();
    });

    it('should store application notes successfully', () => {
      const RESPONSE = Object.assign({});
      const params = {  id: 1, avatarType: 'SAMPLE', type: 'ANOTHER_SAMPLE', content: 'Sample content' };

      hireService
        .postApplicationNote(params.id, params.avatarType, params.type, params.content)
        .subscribe(res => expect(res).toBe(RESPONSE));

      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/applications/${params.id}/notes?avatarType=${params.avatarType}`
      );
      expect(request.request.method).toBe('POST');
      request.flush(RESPONSE);
      httpMock.verify();
    });

    it('should grab HM notes successfully', () => {
      const RESPONSE = Object.assign([]);
      const params = {  id: 1, avatarType: 'SAMPLE', type: 'ANOTHER_SAMPLE' };

      hireService
        .getApplicationComment(params.id, params.avatarType, params.type)
        .subscribe(res => expect(res).toBe(RESPONSE));

      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/applications/${params.id}/notes?avatarType=${params.avatarType}&type=${params.type}`
      );
      expect(request.request.method).toBe('GET');
      request.flush(RESPONSE);
      httpMock.verify();
    });

    it('should store HM notes successfully', () => {
      const RESPONSE = Object.assign({});
      const params = {  id: 1, avatarType: 'SAMPLE', type: 'ANOTHER_SAMPLE', content: 'Sample content' };

      hireService
        .postApplicationComment(params.id, params.avatarType, params.content, Object.assign({}), params.type)
        .subscribe(res => expect(res).toBe(RESPONSE));

      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/applications/${params.id}/notes?avatarType=${params.avatarType}`
      );
      expect(request.request.method).toBe('POST');
      request.flush(RESPONSE);
      httpMock.verify();
    });

    it('should get applicant file', () => {
      const RESPONSE = '';
      const APPLICANT_ID = '123';
      const FILE_ID = '321';
      hireService.getApplicationFile(APPLICANT_ID, FILE_ID)
        .subscribe(res => expect(res).toBe(RESPONSE));

      const request = httpMock.expectOne(
        `${environment.apiPath}/hire/applications/123/files?fileId=321`
      );
      expect(request.request.method).toBe('GET');
      request.flush(RESPONSE);
      httpMock.verify();
    });

    it('should get application test', () => {
      const RESPONSE = {} as ApplicationTest;
      const TEST_ID = 1;
      hireService.getApplicationTest(TEST_ID)
        .subscribe(res => expect(res).toBe(RESPONSE));

      const request = httpMock.expectOne(
        `${environment.apiPath}/applications/tests/${TEST_ID}`
      );
      expect(request.request.method).toBe('GET');
      request.flush(RESPONSE);
      httpMock.verify();
    });

  });

  it('[addNewPreview] should add a new applicant preview with applications type successfully', () => {
    const ids = [1, 2];
    const type = 'applications';
    hireService.addNewPreview(ids, type)
      .subscribe(() => {});
    const request = httpMock.expectOne(
      `${environment.apiPath}/hire/applications/previews?applicationsIds=${ids[0]}&applicationsIds=${ids[1]}&type=${type}`
    );
    expect(request.request.method).toBe('POST');
    httpMock.verify();
  });

  it('[addNewPreview] should add a new applicant preview with testPassers type successfully', () => {
    const ids = [1, 2];
    const type = 'testPassers';
    hireService.addNewPreview(ids, type)
      .subscribe(() => {});
    const request = httpMock.expectOne(
      `${environment.apiPath}/hire/applications/previews?applicationsIds=${ids[0]}&applicationsIds=${ids[1]}`
    );
    expect(request.request.method).toBe('POST');
    httpMock.verify();
  });

  it('[removePreview] should remove the applicant review successfully', () => {
    const applicantIds = ['1', '2'];
    hireService.removePreview(applicantIds)
      .subscribe(() => {});
    const request = httpMock.expectOne(
      `${environment.apiPath}/hire/applications/previews?applicationsIds=${applicantIds[0]}&applicationsIds=${applicantIds[1]}`
    );
    expect(request.request.method).toBe('DELETE');
    httpMock.verify();
  });

  it('[updateResumeRubricScore] should update the resume rubric scores successfully', () => {
    const resumeRubrics = Object.assign([]);
    hireService.updateResumeRubricScore(resumeRubrics)
      .subscribe(() => {});
    const request = httpMock.expectOne(
      `${environment.apiPath}/hire/applications/scores/resume-rubrics`
    );
    expect(request.request.method).toBe('PUT');
    httpMock.verify();
  });

  it('should save evaluations', () => {
    const evaluations = [
      {
        id: 1,
        testsEvaluations: [],
      }
    ];
    hireService.saveEvaluations(evaluations).subscribe(() => {});
    const request = httpMock.expectOne(
      `${environment.apiPath}/hire/applications/scores/written-evaluations`
    );
    expect(request.request.method).toBe('PUT');
    httpMock.verify();
  });

  it('should finalize five q evaluation', () => {
    const evaluationId = 3;
    hireService.finalizeFiveQEvaluation(evaluationId).subscribe(() => {});
    const request = httpMock.expectOne(
      `${environment.apiPath}/hire/applications/${evaluationId}/recruitment-analysts/actions?action=grade5qTest`
    );
    expect(request.request.method).toBe('POST');
    httpMock.verify(); 
  });
});
