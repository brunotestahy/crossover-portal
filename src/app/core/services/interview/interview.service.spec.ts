import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, getTestBed, TestBed } from '@angular/core/testing';
import { environment } from 'environments/environment';

import { SAMPLE_INTERVIEW } from '../mocks/interview.mock';

import { InterviewService } from './interview.service';

describe('InterviewService', () => {
  let httpMock: HttpTestingController;
  let service: InterviewService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          InterviewService,
        ],
      });
    })
  );

  beforeEach(() => {
    httpMock = getTestBed().get(HttpTestingController);
    service = getTestBed().get(InterviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getInterviewDetails', () => {
    it('should delegate call the endpoint for response', () => {
      service.getInterviewDetails(17695).subscribe(res => {
        expect(res).toBeDefined();
        expect(res).toBe(SAMPLE_INTERVIEW);
      });

      const request = httpMock.expectOne(
        environment.apiPath +
        `/interview/interviews/17695`
      );
      expect(request.request.method).toBe('GET');
      request.flush(SAMPLE_INTERVIEW);
      httpMock.verify();
    });
  });

  describe('saveInterviewSchedule', () => {
    it('should delegate call the endpoint for response', () => {
      service.saveInterviewSchedule('1', SAMPLE_INTERVIEW).subscribe(res => {
        expect(res).toBeDefined();
        expect(res).toBe(SAMPLE_INTERVIEW);
      });

      const request = httpMock.expectOne(
        environment.apiPath +
        `/interview/candidates/interviews/17695?status=CANDIDATE_ACCEPTED`
      );
      expect(request.request.method).toBe('PUT');
      request.flush(SAMPLE_INTERVIEW);
      httpMock.verify();
    });
  });

  describe('submitReschedule', () => {
    it('should delegate call the endpoint for response', () => {
      const notes = { message: 'notes text' };
      service.submitReschedule(notes, SAMPLE_INTERVIEW).subscribe(res => {
        expect(res).toBeDefined();
        expect(res).toBe(SAMPLE_INTERVIEW);
      });

      const request = httpMock.expectOne(
        environment.apiPath +
        `/interview/candidates/interviews/17695`
      );
      expect(request.request.method).toBe('PUT');
      request.flush(SAMPLE_INTERVIEW);
      httpMock.verify();
    });
  });

  it('should decline interview', () => {
    const RESPONSE = Object.assign({});
    const interview = Object.assign({});
    const INTERVIEW_ID = 3;
    service.declineInterview(INTERVIEW_ID, interview)
      .subscribe(res => expect(res).toBe(RESPONSE));

    const request = httpMock.expectOne(
      `${environment.apiPath}/interview/candidates/interviews/{id}?status=CANDIDATE_REJECTED`.replace('{id}', INTERVIEW_ID.toString())
    );
    expect(request.request.method).toBe('PUT');
    request.flush(RESPONSE);
    httpMock.verify();
  });
});
