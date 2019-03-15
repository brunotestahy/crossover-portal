import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';

import { InterviewDetailsResponse } from 'app/core/models/interview';
import { InterviewService } from 'app/core/services/interview/interview.service';

@Component({
  selector: 'app-video-conference',
  templateUrl: './video-conference.component.html',
  styleUrls: ['./video-conference.component.scss'],
})
export class VideoConferenceComponent implements OnInit {
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
    this.isLoading = true;
    this.activatedRoute.params.pipe(
      tap(() => this.isLoading = true),
      map(params => params.id),
      switchMap((interviewId: number) => this.interviewService.getInterviewDetails(interviewId))
    ).subscribe((interview: InterviewDetailsResponse) => {
      this.interview = interview;
      if (interview.status !== 'CANDIDATE_ACCEPTED') {
        this.router.navigate(['../view'], { relativeTo: this.activatedRoute });
      }
      this.isLoading = false;
    });
  }
}
