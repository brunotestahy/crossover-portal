import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InterviewService } from 'app/core/services/interview/interview.service';
import {
  map,
  mergeMap,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { COLORS } from 'app/core/constants/colors';
import { InterviewDetailsResponse } from 'app/core/models/interview/interview-details-response.model';
import { Timezone } from 'app/core/models/timezone/timezone.model';
import { parse } from 'date-fns';
import * as moment from 'moment-timezone';
import { interval } from 'rxjs/observable/interval';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-interview-video-conference-manager-page',
  templateUrl: './interview-video-conference-manager-page.component.html',
  styleUrls: ['./interview-video-conference-manager-page.component.scss'],
})
export class InterviewVideoConferenceManagerPageComponent
  implements OnInit, OnDestroy {
  private now$: Observable<Date>;
  private destroy$ = new Subject();

  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public interviewHasStarted$: Observable<boolean>;
  public interview$: Observable<InterviewDetailsResponse>;
  public candidateTime$: Observable<string>;
  public error: string | null;
  public isLoading = false;
  public interview: InterviewDetailsResponse;
  public form: FormGroup;
  public isSaving = false;
  public blue = COLORS.blue;
  public timeToInterview$: Observable<string>;

  constructor(
    private interviewService: InterviewService,
    private activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.form = new FormGroup(
      {
        cultureFit: new FormControl(null, Validators.required),
        attitudeProfessionalism: new FormControl(null, Validators.required),
        knowledgeExperience: new FormControl(null, Validators.required),
        feedback: new FormControl(null, Validators.required),
        interviewDidntTakePlace: new FormControl(false),
      },
      {
        validators: (group) => {
          const value = group.value;
          if (
            (value.cultureFit &&
              value.attitudeProfessionalism &&
              value.knowledgeExperience) ||
            value.interviewDidntTakePlace
          ) {
            return null;
          }
          return { candidateFeedback: true };
        },
      }
    );
    this.form.controls.interviewDidntTakePlace.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((v: boolean) => {
        if (v) {
          this.form.patchValue({
            cultureFit: null,
            attitudeProfessionalism: null,
            knowledgeExperience: null,
          });
          this.form.controls.cultureFit.disable();
          this.form.controls.attitudeProfessionalism.disable();
          this.form.controls.knowledgeExperience.disable();
        } else {
          this.form.controls.cultureFit.enable();
          this.form.controls.attitudeProfessionalism.enable();
          this.form.controls.knowledgeExperience.enable();
        }
      });

    this.interview$ = this.activatedRoute.params.pipe(
      takeUntil(this.destroy$),
      tap(() => (this.isLoading = true)),
      map(params => params.id),
      switchMap(interviewId =>
        this.interviewService.getInterviewDetails(interviewId)
      ),
      shareReplay(1)
    );
    this.interview$.subscribe(interview => {
      this.interview = interview;
      this.isLoading = false;
    });

    this.now$ = interval(1000).pipe(
      takeUntil(this.destroy$),
      startWith(0),
      map(() => new Date()),
       shareReplay(1)
    );

    this.candidateTime$ = this.now$.pipe(
      takeUntil(this.destroy$),
      withLatestFrom(this.interview$),
      map(([now]) => {
        const timezone: Timezone = this.interview.interviewee.location.timeZone as Timezone;
        return moment(now)
          .tz(timezone.name)
          .format('h:m a');
      })
    );

    this.interviewHasStarted$ = this.now$.pipe(
      takeUntil(this.destroy$),
      withLatestFrom(this.interview$),
      map(([now, interview]) => {
        const startTime = parse(interview.startDateTime as string);
        return moment(now).isAfter(moment(startTime));
      })
    );

    this.timeToInterview$ = this.now$.pipe(
      takeUntil(this.destroy$),
      mergeMap(() => this.interviewHasStarted$),
      withLatestFrom(this.interview$),
      map(([_interviewHasStarted, interview]) => moment(interview.startDateTime).fromNow())
    );
  }

  public rateCandidate(): void {
    if (this.form.valid && !this.isSaving) {
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
