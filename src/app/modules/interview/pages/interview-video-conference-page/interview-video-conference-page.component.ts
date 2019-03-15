import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';

import { InterviewDetailsResponse } from 'app/core/models/interview/interview-details-response.model';
import { InterviewService } from 'app/core/services/interview/interview.service';

@Component({
  selector: 'app-interview-video-conference-page',
  templateUrl: './interview-video-conference-page.component.html',
  styleUrls: ['./interview-video-conference-page.component.scss'],
})
export class InterviewVideoConferencePageComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public error: string | null;

  public isLoading = false;

  public interview: InterviewDetailsResponse;

  constructor(
    private interviewService: InterviewService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.fetchInterviewDetails();
  }

  private fetchInterviewDetails(): void {
    this.isLoading = true;
    this.activatedRoute.params
      .pipe(
        tap(() => this.isLoading = true),
        map(params => params.id),
        switchMap(interviewId => this.interviewService.getInterviewDetails(interviewId))
      )
      .subscribe(interview => {
        this.interview = interview;
        this.checkInterviewStatus();
        this.isLoading = false;
      }, negativeResponse => {
        this.isLoading = false;
        this.error = negativeResponse.error.text;
      });
  }

  private checkInterviewStatus(): void {
    const notAllowedStatus: string[] = ['INITIAL', 'NOT_CONDUCTED', 'CANDIDATE_REJECTED', 'SCHEDULED', 'CONDUCTED'];

    if (notAllowedStatus.filter(status =>  status === this.interview.status).length > 0) {
      this.router.navigate([`interview/${this.interview.id}/view`]);
    }
  }
}
