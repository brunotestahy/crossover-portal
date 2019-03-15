import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, getTestBed, TestBed } from '@angular/core/testing';
import { environment } from 'environments/environment';
import { of } from 'rxjs/observable/of';

import { WrittenAssignationTest } from 'app/core/models/application';
import { APPLICATION_DATA_MOCK } from 'app/core/services/mocks/application-data.mock';
import { PROJECT_EVALUATION_INVITATION_MOCK } from 'app/core/services/mocks/project-evaluation.mock';

import { CandidateService } from './candidate.service';

describe('CandidateService', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let candidateService: CandidateService;

  const mockApplicationId = 12345;
  const mockData: WrittenAssignationTest = {
    id: 914497,
    type: 'FIVEQ_ANSWER',
    test: {
      id: 5015,
      type: 'FIVEQ',
      description: 'Q1 Description',
      questions: [
        {
          sequenceNumber: 1,
          question: 'Question 1',
        },
        {
          sequenceNumber: 2,
          question: 'Question 2',
        },
        {
          sequenceNumber: 3,
          question: 'Question 3',
        },
      ],
    },
    answers: [
      {
        sequenceNumber: 1,
        answer: 'Answer 1',
      },
      {
        sequenceNumber: 2,
        answer: 'Answer 2',
      },
      {
        sequenceNumber: 3,
      },
    ],
  };

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          CandidateService,
        ],
      });
    })
  );

  beforeEach(() => {
    httpMock = getTestBed().get(HttpTestingController);
    httpClient = getTestBed().get(HttpClient);
    candidateService = getTestBed().get(CandidateService);
  });

  it('should be created', () => {
    expect(candidateService).toBeTruthy();
  });

  it('[getCurrentApplication] should call correct API and return defined response', () => {
    candidateService.getCurrentApplication().subscribe();
    const request = httpMock.expectOne(
      environment.apiPath
      + '/hire/applications/search?page=0&avatarType=CANDIDATE'
    );
    expect(request.request.method).toBe('POST');
    request.flush({content: [{}]});
    httpMock.verify();

    const responseContent = {content: [{}]};
    spyOn(httpClient, 'post').and.returnValue(
      of(responseContent)
    );
    candidateService.getCurrentApplication().subscribe(res => {
      expect(res).toBeDefined();
    });
  });

  it('[cancelApplication] should call correct API', () => {
    candidateService.cancelApplication(1).subscribe();
    const request = httpMock.expectOne(
      environment.apiPath
      + '/hire/applications/1/cancellations'
    );
    expect(request.request.method).toBe('POST');
    request.flush({});
    httpMock.verify();
  });

  it('[sendQuestions] should call correct API', () => {
    candidateService.sendQuestions(1, 2, 'somemsg').subscribe();
    const request = httpMock.expectOne(
      environment.apiPath
      + '/messages?type=candidateQuestion&id=1'
    );
    expect(request.request.method).toBe('POST');
    request.flush({});
  });
  it('[updateCandidate] should call correct API and return defined response', () => {
    const RESPONSE = [{ title: 'test title 1' }];
    candidateService.updateCandidate(APPLICATION_DATA_MOCK.candidate).subscribe(res => {
      expect(res).toBeTruthy(RESPONSE);
    });
    const request = httpMock.expectOne(`${environment.apiPath}/candidates/1426764`);
    expect(request.request.method).toBe('PUT');
    request.flush(RESPONSE);
    httpMock.verify();
  });

  it('[getSteps] should return correct steps', () => {
    expect(candidateService.getSteps(5)).toBeDefined();
  });

  it('should get written evaluation assignment', () => {
    candidateService.getWrittenEvaluationAssignment(mockApplicationId)
      .subscribe(res => expect(res.id).toBe(mockData.id));

    const request = httpMock.expectOne(`${environment.apiPath}/hire` +
      `/applications/${mockApplicationId}/candidates/actions?action=start5qTest`);
    request.flush(mockData);

    expect(request.request.method).toBe('POST');
    httpMock.verify();
  });

  it('should save written evaluation assignment draft', () => {
    candidateService.saveWrittenEvaluationAssignmentDraft(mockApplicationId, mockData)
      .subscribe(res => expect(res.id).toBe(mockData.id));

    const request = httpMock.expectOne(`${environment.apiPath}/hire` +
      `/applications/${mockApplicationId}/candidates/actions?action=save5qTest`);
    request.flush(mockData);

    expect(request.request.method).toBe('POST');
    httpMock.verify();
  });


  it('should submit written evaluation assignment', () => {
    candidateService
      .submitWrittenEvaluationAssignment(mockApplicationId, mockData)
      .subscribe(res => expect(res.id).toBe(mockData.id));

    const request = httpMock.expectOne(`${environment.apiPath}/hire` +
      `/applications/${mockApplicationId}/candidates/actions?action=submit5qTest`);
    request.flush(mockData);

    expect(request.request.method).toBe('POST');
    httpMock.verify();
  });

  it('should get project evaluation assignment invitation', () => {
    candidateService.getProjectEvaluationInvitation(mockApplicationId)
      .subscribe(res => {
        expect(res.assignmentDaysCount).toBe(PROJECT_EVALUATION_INVITATION_MOCK.assignmentDaysCount);
        expect(res.pipelineName).toBe(PROJECT_EVALUATION_INVITATION_MOCK.pipelineName);
        expect(res.prerequisites).toBe(PROJECT_EVALUATION_INVITATION_MOCK.prerequisites);
        expect(res.status).toBe(PROJECT_EVALUATION_INVITATION_MOCK.status);
      });

    const request = httpMock.expectOne(`${environment.apiPath}/hire` +
      `/applications/${mockApplicationId}/tests/assignment/invitation`);
    request.flush(PROJECT_EVALUATION_INVITATION_MOCK);

    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });

  it('should start project evaluation assignment', () => {
    candidateService.startProjectEvaluation(mockApplicationId)
      .subscribe();

    const request = httpMock.expectOne(`${environment.apiPath}/hire` +
      `/applications/${mockApplicationId}/tests/assignment`);
    request.flush(PROJECT_EVALUATION_INVITATION_MOCK);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({id: mockApplicationId});
    httpMock.verify();
  });
});
