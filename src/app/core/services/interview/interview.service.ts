import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { addMinutes, format } from 'date-fns';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { sprintf } from 'sprintf-js';

import * as AvatarTypes from 'app/core/constants/avatar-types';
import { InterviewDetailsResponse } from 'app/core/models/interview';
import { PaginatedApi } from 'app/core/models/paginated-api/paginated-api.model';
import { environment } from 'environments/environment';


export const INTERVIEW_URLS = {
  interviewDetails: `${environment.apiPath}/interview/interviews/%(id)s`,
  candidateInterviewDetails: `${environment.apiPath}/interview/candidates/interviews/%(id)s`,
  declineInterview: `${environment.apiPath}/interview/candidates/interviews/%(id)s?status=CANDIDATE_REJECTED`,
  interviewList: `${environment.apiPath}/interview/interviews`,
};

@Injectable()
export class InterviewService {

  constructor(private http: HttpClient) { }

  public declineInterview(id: number, interview: InterviewDetailsResponse): Observable<InterviewDetailsResponse> {
    return this.http.put<InterviewDetailsResponse>(sprintf(INTERVIEW_URLS.declineInterview, { id }), Object.assign(interview));
  }

  public getInterviewDetails(id: number): Observable<InterviewDetailsResponse> {
    return this.http.get<InterviewDetailsResponse>(sprintf(INTERVIEW_URLS.interviewDetails, { id }));
  }

  public submitReschedule(
    notes: { message: string },
    interviewDetails: InterviewDetailsResponse
  ): Observable<InterviewDetailsResponse> {
    interviewDetails.intervieweeNotes = notes.message;
    return this.http.put<InterviewDetailsResponse>(
      sprintf(INTERVIEW_URLS.candidateInterviewDetails, { id: interviewDetails.id }),
      interviewDetails
    );
  }

  public saveInterviewSchedule(
    selectedSlot: string,
    interviewDetails: InterviewDetailsResponse
  ): Observable<InterviewDetailsResponse> {
    const interview = interviewDetails;
    interview.status = 'CANDIDATE_ACCEPTED';
    interview.selectedSlot = true;
    interview.durationInMilliseconds = interview.durationInMinutes * 60000;
    interview.startDateTime = selectedSlot;
    interview.endDateTime = format(addMinutes(selectedSlot, interview.durationInMinutes));
    interview.candidateResponseSent = true;
    return this.http.put<InterviewDetailsResponse>(
      `${sprintf(INTERVIEW_URLS.candidateInterviewDetails, { id: interview.id })}?status=${interview.status}`,
      interview
    );
  }

  public getInterviewList(): Observable<InterviewDetailsResponse[]> {
    return this.http
      .get<PaginatedApi<InterviewDetailsResponse>>(INTERVIEW_URLS.interviewList, {
        params: {
          avatarType: AvatarTypes.Candidate,
        },
      })
      .pipe(
        map(res => res.content),
        shareReplay(1)
      );
  }

}
