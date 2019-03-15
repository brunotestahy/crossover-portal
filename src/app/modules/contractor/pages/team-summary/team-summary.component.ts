import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DfModalService } from '@devfactory/ngx-df';
import { startOfToday, startOfWeek, subWeeks } from 'date-fns';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import * as GridTrends from 'app/core/constants/team-summary/grid-trends';
import * as TrendDescriptions from 'app/core/constants/team-summary/trend-descriptions';
import { Trends } from 'app/core/constants/team-summary/trends';
import { WeekModes } from 'app/core/constants/team-summary/week-modes';
import { CurrentUserDetail } from 'app/core/models/identity';
import { WorkDiary } from 'app/core/models/logbook';
import { Manager } from 'app/core/models/manager';
import {
  AssignmentSummary,
  ProductivitySummaryWithMappedActivities,
} from 'app/core/models/productivity';
import { Team, TeamManagerGroup, TeamMetricInfo } from 'app/core/models/team';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import { OnlineStatusService } from 'app/core/services/timetracking/online-status.service';
import { TimetrackingService } from 'app/core/services/timetracking/timetracking.service';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { DeepPartial } from 'app/core/type-guards/deep-partial';
import { DataFetchingService } from 'app/modules/contractor/pages/team-summary/services/data-fetching.service';
import { DataFormattingService } from 'app/modules/contractor/pages/team-summary/services/data-formatting.service';
import { DataRenderingService } from 'app/modules/contractor/pages/team-summary/services/data-rendering.service';
import {
  NavigationService,
} from 'app/modules/contractor/pages/team-summary/services/navigation.service';
import {
  PerformanceDataService,
} from 'app/modules/contractor/pages/team-summary/services/performance-data.service';
import { CookiesService } from 'app/shared/services/cookies/cookies.service';

@Component({
  selector: 'app-team-summary',
  templateUrl: './team-summary.component.html',
  styleUrls: ['./team-summary.component.scss'],
})
export class TeamSummaryComponent implements OnInit, OnDestroy {
  public readonly destroy$ = new Subject();
  public readonly instance = this;
  public readonly startOfIsoWeek = { weekStartsOn: 1 };
  public readonly cookieInfo = {
    name: 'CURRENTLY_SHOWN_WEEK',
    value: '',
  };
  public readonly gridTrends = GridTrends;
  public readonly trends = Trends;
  public readonly trendDescriptions = TrendDescriptions;
  public readonly recentDates = {
    startOfThisWeek: startOfWeek(new Date(), this.startOfIsoWeek),
    startOfLastWeek: subWeeks(startOfToday(), 1),
    startOfToday: startOfToday(),
  };
  public readonly metricInfo = new TeamMetricInfo('', 3);
  public readonly hoursInfo = {
    maxHours: 40,
    currentViewMaxHours: 40,
  };

  public form: FormGroup;
  public error = '';
  public loadState = {
    component: false,
    model: false,
  };
  public isThisWeek = false;
  public teamSummary = [] as AssignmentSummary[];
  public workDiaries = [] as WorkDiary[];
  public weekModes = WeekModes;

  public topPerformer: AssignmentSummary;
  public bottomPerformer: AssignmentSummary;
  public teamAverage: DeepPartial<AssignmentSummary>;

  public productivitySummary: ProductivitySummaryWithMappedActivities;
  public endDate: Date;
  public teamSummaryCount: number;

  public currentUserDetail: CurrentUserDetail;
  public currentManagerId: number | null = null;
  public currentTeam = new BehaviorSubject<Team | null>(null);

  public showTeamSelector = true;
  public teamManagerGroup: TeamManagerGroup | null;
  public trendRangeTitle: string;

  public currentContractor: CurrentUserDetail;
  public currentUserAssignmentId: number;
  public currentUserManager: Manager;
  public currentUserTeamId: number;

  @ViewChild('hoursLoggedModal')
  public hoursLoggedModal: TemplateRef<{}>;

  @ViewChild('metricModal')
  public metricModal: TemplateRef<{}>;

  @ViewChild('intensityScoreModal')
  public intensityScoreModal: TemplateRef<{}>;

  @ViewChild('alignmentScoreModal')
  public alignmentScoreModal: TemplateRef<{}>;

  @ViewChild('focusScoreModal')
  public focusScoreModal: TemplateRef<{}>;

  public get numberOfWeeks(): number {
    return this.dataFormattingService.numberOfWeeks(this);
  }

  public get bottomPerformerError(): string | null {
    return this.dataFormattingService.bottomPerformerError(this);
  }

  constructor(
    public assignmentService: AssignmentService,
    public cookiesService: CookiesService,
    public modalService: DfModalService,
    public productivityService: ProductivityService,
    public identityService: IdentityService,
    public onlineStatusService: OnlineStatusService,
    public timetrackingService: TimetrackingService,
    @Inject(WINDOW_TOKEN) public window: Window,
    public dataFetchingService: DataFetchingService,
    public dataFormattingService: DataFormattingService,
    public dataRenderingService: DataRenderingService,
    public performanceDataService: PerformanceDataService,
    public navigationService: NavigationService,
  ) {
  }

  public ngOnInit(): void {
    this.form = new FormBuilder().group({
      dateControl: [this.recentDates.startOfToday],
      weeksCount: [WeekModes.FourPreviousWeeks],
    });
    this.cookieInfo.value = this.cookiesService.getCookie(this.cookieInfo.name) as string;
    this.dataFetchingService.load(this);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public invokeIf(condition: boolean, callback: (instance: this) => void): void {
    if (condition) {
      callback.bind(this)(this);
    }
  }
}
