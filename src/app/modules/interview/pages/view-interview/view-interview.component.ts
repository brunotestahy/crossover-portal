import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InterviewDetailsResponse } from 'app/core/models/interview';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { InterviewService } from 'app/core/services/interview/interview.service';
import { isApiError } from 'app/core/type-guards/is-api-error';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-view-interview',
  templateUrl: './view-interview.component.html',
  styleUrls: ['./view-interview.component.scss'],
})
export class ViewInterviewComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public error: string | null;
  public isLoading = false;
  public interview: InterviewDetailsResponse;
  public isManager = false;

  constructor(
    private interviewService: InterviewService,
    private identityService: IdentityService,
    private activatedRoute: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    this.isLoading = true;
    this.identityService.currentUserIsManager().subscribe(res => {
      this.isManager = res;
    });
    this.activatedRoute.params.pipe(
      tap(() => this.isLoading = true),
      map(params => params.id),
      switchMap((interviewId: number) => this.interviewService.getInterviewDetails(interviewId))
    ).subscribe((interview: InterviewDetailsResponse) => {
      this.interview = interview;
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
      if (isApiError(error)) {
        this.error = error.error.text;
      } else {
        this.error = 'Error fetching interview detail.';
      }
    });
  }
}
