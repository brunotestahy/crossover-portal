import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';

import { JobApplication } from 'app/core/models/application/job-application.model';
import { Assignment } from 'app/core/models/assignment';
import { InterviewDetailsResponse } from 'app/core/models/interview/interview-details-response.model';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { environment } from 'environments/environment';

describe('AssignmentService', () => {
  let httpMock: HttpTestingController;
  let assignmentService: AssignmentService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          AssignmentService,
        ],
      });
    })
  );

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    assignmentService = TestBed.get(AssignmentService);
  });

  it('should be created', () => expect(assignmentService).toBeTruthy());

  it('[getCurrentUserAssignment] should delegate call the endpoint for response', () => {
    const responseContent = { content: [Object.assign({}) as Assignment] };
    assignmentService.getCurrentUserAssignment()
      .pipe(take(1))
      .subscribe(res => expect(res).toEqual(responseContent.content[0]));

    const request = httpMock.expectOne(
      `${environment.apiPath}/teams/assignments?status=ACTIVE&page=0&avatarType=CANDIDATE`
    );
    expect(request.request.method).toBe('GET');
    request.flush(responseContent);
    httpMock.verify();
  });

  it('[getAssignmentsForTeam] should delegate call the endpoint for response', () => {
    const teamId = '1118'
    const params = {
      status: 'ACTIVE,MANAGER_SETUP',
      limit: '1000',
    };
    const responseContent = Object.assign({});
    assignmentService.getAssignmentsForTeam(teamId, params)
      .pipe(take(1))
      .subscribe(res => expect(res).toEqual(responseContent));

    const request = httpMock.expectOne(
      `${environment.apiPath}/teams/assignments?status=${params.status}&limit=${params.limit}&teamId=${teamId}`
    );
    expect(request.request.method).toBe('GET');
    request.flush(responseContent);
    httpMock.verify();
  });

  it('[candidateProvidesResidenceInfo] should delegate call the endpoint for response', () => {
    const assignmentId = 123;
    assignmentService.candidateProvidesResidenceInfo(assignmentId)
      .pipe(take(1))
      .subscribe(res => expect(res).toEqual(true));

    const request = httpMock.expectOne(
      `${environment.apiPath}/teams/assignments/${assignmentId}/actions/candidate?action=provideResidenceInfo`
    );
    expect(request.request.method).toBe('POST');
    request.flush({});
    httpMock.verify();
  });

  it('[saveContractorAvatar] should delegate call the endpoint for response', () => {
    const assignmentId = '123';
    const avatarId = '1';
    assignmentService.saveContractorAvatar(assignmentId, avatarId)
      .pipe(take(1))
      .subscribe(() => {});

    const request = httpMock.expectOne(
      `${environment.apiPath}/teams/assignments/${assignmentId}/avatar?avatarId=${avatarId}`
    );
    expect(request.request.method).toBe('PUT');
    request.flush({});
    httpMock.verify();
  });

  it('[getTeamAssignmentsAsManager] should delegate call the endpoint for response', () => {
    const responseContent = { content: [Object.assign({}) as Assignment] };
    assignmentService.getTeamAssignmentsAsManager(true, 1, 1, 'status', 1, 'from', 'to')
    .pipe(take(1))
    .subscribe(res => expect(res).toEqual(responseContent.content));
  });

  it('[getRedirectionState] should redirect to /candidate/dashboard/applications', () => {
    const assignments = Object.assign([{
      status: 'OTHER',
    }] , {}) as Assignment[];
    expect(assignmentService.getRedirectionState(assignments, {} as JobApplication[], undefined))
    .toBe('/candidate/dashboard/applications');
  });

  it('[getRedirectionState] no assignment - should redirect to /candidate/dashboard/applications', () => {
    const assignments = Object.assign([{}] , {}) as Assignment[];
    expect(assignmentService.getRedirectionState(assignments, {} as JobApplication[], undefined))
    .toBe('/candidate/dashboard/applications');
  });

  it('[getRedirectionState] no applications - should redirect to /interviews', () => {
    const assignments = Object.assign([{}] , {}) as Assignment[];
    const interviews = Object.assign([{
      id: 1,
    }] , {}) as InterviewDetailsResponse[];
    expect(assignmentService.getRedirectionState(assignments, {} as JobApplication[], interviews))
    .toBe('/interviews/1/view');
  });

  it('[getRedirectionState] with applications - should redirect to /interviews', () => {
    const assignments = Object.assign([{}] , {}) as Assignment[];
    const applications = Object.assign([{}] , {}) as JobApplication[];
    const interviews = Object.assign([{
      id: 1,
    }] , {}) as InterviewDetailsResponse[];
    expect(assignmentService.getRedirectionState(assignments, applications, interviews))
    .toBe('/interviews/1/view');
  });
});
