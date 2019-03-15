import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { addDays, addWeeks, endOfWeek, format, getISOWeek, startOfWeek, subWeeks } from 'date-fns';
import * as _ from 'lodash';
import * as moment from 'moment';
import 'rxjs/add/operator/debounceTime';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { take, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import * as AvatarTypes from 'app/core/constants/avatar-types';
import * as PerformanceLevels from 'app/core/constants/rank-review/performance-levels';
import { TeamSelectorStrategy } from 'app/core/decorators/team-selector-strategy';
import { CurrentUserDetail } from 'app/core/models/identity';
import { MappedActivityInfo } from 'app/core/models/productivity';
import { Review } from 'app/core/models/rank-review';
import { FroalaEditor } from 'app/core/models/shared';
import { TeamManagerGroup } from 'app/core/models/team';
import { NoDirectReportsWithoutAllManagers } from 'app/core/models/team-selector-strategy';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import {
  TeamSelectorStrategyService,
} from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';

@Component({
  selector: 'app-rank-and-review',
  templateUrl: './rank-and-review.component.html',
  styleUrls: ['./rank-and-review.component.scss'],
})
@TeamSelectorStrategy(NoDirectReportsWithoutAllManagers)
export class RankAndReviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();

  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';
  public readonly performanceLevels = PerformanceLevels;
  public readonly recentWeeks = {
    current: startOfWeek(new Date(), { weekStartsOn: 1 }),
    previous: subWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), 1),
  };
  public readonly pov = {
    topPerformers: [] as MappedActivityInfo[],
    topGainers: [] as MappedActivityInfo[],
    bottomPerformers: [] as MappedActivityInfo[],
    bottomGainers: [] as MappedActivityInfo[],
  };
  public loadState = {
    review: false,
    activities: false,
  };

  public errorMessage = '';
  public form: FormGroup;

  public review: Review;
  public currentUserDetail: CurrentUserDetail;
  public currentUserIsManager: boolean;
  public canEdit = false;
  public currentManagerId = new BehaviorSubject<number>(0);
  public currentTeamId = new BehaviorSubject<number>(0);

  public froalaEditorOptions = {
    placeholderText: 'Please write your answer here',
    toolbarButtons: ['bold', 'underline', 'formatUL', 'insertLink'],
    pluginsEnabled: ['link', 'lists'],
    initOnClick: true,
  };

  public editors = [] as FroalaEditor[];

  constructor(
    public identityService: IdentityService,
    private productivityService: ProductivityService,
    public teamSelectorStrategyService: TeamSelectorStrategyService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
  }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      performers: this.formBuilder.array([]),
      date: [this.recentWeeks.current],
    });

    this.form.controls['date']
      .valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getReviews());

    this.currentTeamId
      .pipe(takeUntil(this.destroy$))
      .subscribe(teamId => teamId && this.getReviews());

    combineLatest(
      this.identityService.getCurrentUser(),
      this.identityService.getTeamManagerGroupSelection()
    )
    .pipe(
      takeUntil(this.destroy$),
      tap(([currentUser, teamManager]) => {
        const teamManagerGroup = teamManager as TeamManagerGroup;
        this.currentUserDetail = currentUser || {} as CurrentUserDetail;
        this.currentUserIsManager = !!teamManagerGroup &&
          !!currentUser && !!currentUser.managerAvatar &&
          this.identityService.isOwnerOrReportingManager(currentUser.managerAvatar.id, teamManagerGroup.team);
        this.canEdit = this.currentUserIsManager && this.currentUserDetail.managerAvatar.id === teamManagerGroup.managerId;
      })
    )
    .subscribe(
      ([currentUser, teamManagerGroup]) => {
        const value = teamManagerGroup as TeamManagerGroup;
        this.currentManagerId.next(value ? value.managerId : 0);
        if (!this.currentUserIsManager && currentUser) {
          this.currentManagerId.next(currentUser.assignment.manager.id);
          this.currentTeamId.next(currentUser.assignment.team.id);
        } else if (value && value.team !== null) {
          this.currentTeamId.next(value.team.id);
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public initializeFroalaEditor(
    index: number,
    initObject?: FroalaEditor
  ): void {
    const field = this.form.get(`performers.${index}.answer`) as AbstractControl;
    if (initObject) {
      initObject.initialize();
      initObject.tempValue = field.value;
      this.editors[index] = initObject;
      return;
    }
    this.editors[index].active = true;
  }

  public saveFroalaEditor(index: number): void {
    const review = {
      ...this.review,
      reviewDetails: this.form.value.performers,
      reviewAnswered: true,
    };
    this.saveReview(review);
    this.editors[index].destroy();
    this.editors[index].initialize();
    this.editors[index].active = false;
    this.editors[index].tempValue = this.form.value.performers[index].answer;
  }

  public cancelFroalaEditor(index: number): void {
    const field = this.form.get(`performers.${index}.answer`) as AbstractControl;
    const previousValue = this.editors[index].tempValue;
    field.reset();
    field.setValue(previousValue);
    this.editors[index].destroy();
    this.editors[index].initialize();
    this.editors[index].active = false;
    this.editors[index].tempValue = field.value;
  }

  public previousWeek(): void {
    this.form.controls['date'].setValue(
      subWeeks(this.form.controls['date'].value, 1)
    );
  }

  public nextWeek(): void {
    this.form.controls['date'].setValue(
      addWeeks(this.form.controls['date'].value, 1)
    );
  }

  public fetchLastWeek(): void {
    this.form.controls['date'].setValue(subWeeks(this.recentWeeks.current, 1));
  }

  public fetchThisWeek(): void {
    this.form.controls['date'].setValue(this.recentWeeks.current);
  }

  public currentDateMatches(date: Date): boolean {
    const compareDate = this.form.value;
    return getISOWeek(compareDate.date) === getISOWeek(date);
  }

  public getFormattedWeekDays(date: Date): string {
    const start = addDays(startOfWeek(date), 1);
    const end = addDays(endOfWeek(date), 1);
    return `${format(start, 'MMM DD')} - ${format(end, 'MMM DD, YYYY')}`;
  }

  public getFormattedAnswer(answer: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(answer);
  }

  public getReviews(): void {
    const teamId = this.currentTeamId.getValue();
    const managerId = this.currentManagerId.getValue();
    const avatarType = this.currentUserIsManager
      ? AvatarTypes.Manager
      : AvatarTypes.Candidate;
    const weeksCount = '9';

    this.loadState.activities = true;
    this.loadState.review = true;
    this.errorMessage = '';

    this.productivityService
      .getReviews(
        avatarType,
        managerId.toString(),
        teamId.toString(),
        format(this.form.controls['date'].value, 'YYYY-MM-DD'),
        true
      )
      .pipe (take(1))
      .subscribe(
        review => {
          if (!review) {
            this.errorMessage = 'No reviews are available for this week.';
            this.loadState.review = false;
            return;
          }
          this.review = review;
          const formArray = this.formBuilder.array([]);
          review.reviewDetails
            .sort((previous, next) => previous.orderIndex - next.orderIndex)
            .forEach(entry => formArray.push(this.formBuilder.group(entry)));
          this.editors = review.reviewDetails.map(() => new FroalaEditor());
          this.form.setControl('performers', formArray);
          this.loadState.review = false;
        },
        () => {
          this.errorMessage = 'An unknown error happened while retrieving review data.';
          this.loadState.review = false;
        }
      );

      this.productivityService.getPerformers(
        managerId.toString(),
        teamId.toString(),
        format(this.form.controls['date'].value, 'YYYY-MM-DD'),
        weeksCount
      )
      .pipe(
        take(1)
      )
      .subscribe(
        entries => {
          const performers = _.orderBy(
            (entries.mappedActivities as MappedActivityInfo[]).filter(
              performer => performer !== null
            ),
            [
              'calculatedAverages.metricsStats',
              'calculatedAverages.activityMetrics',
              'calculatedAverages.recordedHours',
              'calculatedAverages.intensityScores',
              'calculatedAverages.focusScores',
            ],
            'desc'
          );
          const changedPerformers = _.orderBy(
            performers.filter(
              performer => performer.metricsChange !== undefined
            ),
            'metricsChange',
            'desc'
          );
          this.pov.topPerformers = performers.slice(
            0,
            this.getInfoMaxDisplayLimit(teamId, performers)
          );
          this.pov.topGainers = changedPerformers.slice(
            0,
            this.getInfoMaxDisplayLimit(teamId, changedPerformers)
          );
          this.pov.bottomPerformers = _
            .orderBy(
              performers.slice(),
              [
                'calculatedAverages.metricsStats',
                'calculatedAverages.activityMetrics',
                'calculatedAverages.recordedHours',
                'calculatedAverages.intensityScores',
                'calculatedAverages.focusScores',
              ],
              'asc'
            )
            .slice(0, this.getInfoMaxDisplayLimit(teamId, performers));
          this.pov.bottomGainers = _
            .orderBy(changedPerformers.slice(), ['metricsChange'], 'asc')
            .slice(0, this.getInfoMaxDisplayLimit(teamId, changedPerformers));
          this.loadState.activities = false;
        },
        () => {
          this.errorMessage = 'An unknown error happened while retrieving review data.';
          this.loadState.activities = false;
        }
      );
  }

  public saveReview(review: Review): void {
    this.errorMessage = '';
    this.productivityService
      .saveReview(review)
      .pipe(
        take(1)
      )
      .subscribe(
        () => true,
        () => this.errorMessage = 'An error occurred while storing your review.'
      );
  }

  public getNumberSymbol(value: number): string {
    const conditions = [
      { condition: () => value > 0, symbol: '+' },
      { condition: () => true, symbol: '' },
    ];
    return conditions.filter(entry => entry.condition())[0].symbol;
  }

  public getInactiveMessage(
    item: Partial<MappedActivityInfo>
  ): string | undefined {
    if (!item.active) {
      const formatDate = 'MMMM, D YYYY';
      return `This person left the team on ${moment(
        item.effectiveDateEnd
      ).format(formatDate)}`;
    }
    return;
  }

  public getScoreClass(value: number, maxValue: number): string {
    const types = Object.keys(PerformanceLevels).map(
      key => PerformanceLevels[key as keyof typeof PerformanceLevels]
    );
    return types.filter(entry => entry.threshold(value, maxValue))[0].cssClass;
  }

  private isInfoAvailable(
    teamId: number,
    entries: MappedActivityInfo[]
  ): boolean {
    const activeAssignments = entries.filter(
      entry =>
        !entry.assignment ||
        !entry.assignment.team ||
        entry.assignment.team.id === teamId
    );
    if (activeAssignments.length <= 1) {
      return entries.length > 1;
    }
    return entries.length !== 0;
  }

  private getInfoMaxDisplayLimit(
    teamId: number,
    entries: MappedActivityInfo[]
  ): number {
    const conditions = [
      {
        condition: () => !this.isInfoAvailable(teamId, entries),
        maxEntries: 0,
      },
      { condition: () => entries.length <= 1, maxEntries: 1 },
      { condition: () => entries.length >= 6, maxEntries: 3 },
      { condition: () => true, maxEntries: Math.floor(entries.length / 2) },
    ];
    return conditions.filter(entry => entry.condition())[0].maxEntries;
  }
}
