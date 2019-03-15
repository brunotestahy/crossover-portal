import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DfGroupToggleItem, DfModalService, DfModalSize } from '@devfactory/ngx-df';
import { endOfWeek, format, parse, startOfWeek, subWeeks } from 'date-fns';
import * as moment from 'moment';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, finalize, takeUntil, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ACTIVE_STATUS } from 'app/core/constants/assignment';
import * as MetricsConstants from 'app/core/constants/metrics';
import * as PeriodConstants from 'app/core/constants/period';
import { JIRA} from 'app/core/constants/team-metric-setup/metric-setup-type';
import * as TeamConstants from 'app/core/constants/team-selector';
import { TeamSelectorStrategy } from 'app/core/decorators/team-selector-strategy/team-selector-strategy.decorator';
import { Assignment } from 'app/core/models/assignment';
import { CurrentUserDetail } from 'app/core/models/identity';
import { MetricAuthorization, MetricInputData, RawMetrics, TeamOverview } from 'app/core/models/metric';
import { Team } from 'app/core/models/team';
import { NoDirectReportsWithAllManagers } from 'app/core/models/team-selector-strategy';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { DownloadService } from 'app/core/services/download/download.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { MetricService } from 'app/core/services/metric/metric.service';
import { isApiError } from 'app/core/type-guards/is-api-error';
import { TeamMetricsService } from 'app/shared/services/team-metrics/team-metrics.service';
import { TeamSelectorStrategyService } from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';

@Component({
  selector: 'app-team-metrics',
  templateUrl: './team-metrics.component.html',
  styleUrls: ['./team-metrics.component.scss'],
})
@TeamSelectorStrategy(NoDirectReportsWithAllManagers)
export class TeamMetricsComponent implements OnInit, OnDestroy {
  private static readonly APP_NOT_AVAILABLE_MSG =
    'Metrics are not available for this team, please change team from team selector.';
  private destroy$ = new Subject();

  public readonly viewModeItems: DfGroupToggleItem[] = [
    {
      text: '',
      id: MetricsConstants.CHART,
      icon: 'fa fa-bar-chart fa-lg',
    },
    {
      text: '',
      id: MetricsConstants.TABLE,
      icon: 'fa fa-table fa-lg',
    },
  ];
  public readonly teamIndividualItems: string[] = [
    MetricsConstants.TEAM,
    MetricsConstants.INDIVIDUAL,
  ];

  public readonly queryOptions = MetricsConstants.QUERY_OPTIONS;

  public error = '';
  public unitsCostMode = MetricsConstants.UNITS;
  public unitsCostItems = [MetricsConstants.UNITS, MetricsConstants.COST];
  public teamIndividualMode = MetricsConstants.INDIVIDUAL;
  public viewMode = this.viewModeItems[0];
  public queryOption: FormControl = new FormControl(4);

  public isLoading = false;
  public metricTarget: number;
  public metricDescription: string;
  public lastUpdate: Date | undefined;
  public currentUserDetail: CurrentUserDetail | null;
  public noSettings = false;
  public team: Team;
  public teamOverview: TeamOverview;
  public managerId: number;
  public assignments: Assignment[];
  public metricsValues: RawMetrics[];
  public activeTeamMembers: number = 0;
  public isAppAvailable: boolean = true;

  public hasMetricSetting: boolean = false;
  public metricAuthorization: MetricAuthorization = {
    canEditMetrics: false,
    canSaveMetrics: false,
  };
  public metricInputData: MetricInputData;
  public metricConstants = MetricsConstants;
  public metricType: string = JIRA;
  public setupId: number =0;
  public updateMetricsBtn = {
    frequency: 10,
    lastRefreshDate: moment(),
    isDisabled: false,
    observableTimer: new Observable<void>(),
  };

  @ViewChild('settingsModal')
  public settingsModal: TemplateRef<{}>;

  constructor(
    private identityService: IdentityService,
    private assignmentService: AssignmentService,
    private teamMetricsService: TeamMetricsService,
    private metricService: MetricService,
    private modalService: DfModalService,
    private downloadService: DownloadService,
    public teamSelectorStrategyService: TeamSelectorStrategyService,
  ) { }

  public ngOnInit(): void {
    this.queryOption.valueChanges.subscribe(() => this.getMetricsData());
    this.isLoading = true;
    this.currentUserDetail = this.identityService.getCurrentUserValue();
    this.getTeamAndManagerSelection();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public update(): void {
    this.isLoading = true;
    const secondsPerMinute = 60 * 1000;
    const waitingTime = this.updateMetricsBtn.frequency * secondsPerMinute;
    this.updateMetricsBtn.isDisabled = true;
    this.updateMetricsBtn.lastRefreshDate = moment();
    this.updateMetricsBtn.observableTimer = Observable.create((observer: Subject<void>) => observer.next())
    .pipe(takeUntil(this.destroy$))
    .delay(waitingTime);
    this.updateMetricsBtn.observableTimer.subscribe(() => this.updateMetricsBtn.isDisabled = false);
    this.refreshMetrics();
  }

  public getMetricsData(): void {
    this.isLoading = true;
    const date = new Date();
    const weeks = this.queryOption.value;
    const start = subWeeks(startOfWeek(date, {weekStartsOn: 1}), weeks);
    const end = endOfWeek(date, {weekStartsOn: 1});
    combineLatest(
      this.assignmentService.getTeamAssignmentsAsManager(
        undefined,
        this.managerId,
        this.team.id,
        undefined,
        0,
        format(start, 'YYYY-MM-DD'),
        format(end, 'YYYY-MM-DD')
      ),
      this.metricService.getTeamMetricsValues(
        this.team.id,
        format(start, 'YYYY-MM-DD'),
        format(date, 'YYYY-MM-DD'),
        true,
        false,
        this.metricType,
        this.managerId
      )
    )
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(([assignments, metricsValues]) => {
      this.assignments = assignments;
      this.metricsValues = metricsValues;
      this.metricAuthorization = this.teamMetricsService.getMetricsAuthorization(this.currentUserDetail, this.team, this.assignments);
      this.setActiveAssignmentsCount();
      if (this.teamOverview.metricsSetups.length === 0) {
        this.noSettings = true;
      } else {
        this.noSettings = false;
        this.buildInputData();
      }
    }, () => this.error = 'Error loading metrics.');
  }

  public buildInputData(): void {
    this.metricInputData = {
      team: this.team,
      managerId: this.managerId,
      metricDescription: this.metricDescription,
      queryOption: this.queryOption.value,
      unitsCostMode: this.unitsCostMode,
      assignments: this.assignments,
      metricsValues: this.metricsValues,
      metricTarget: this.metricTarget,
      lastUpdate: this.lastUpdate,
      activeTeamMembers: this.activeTeamMembers
    }
  }

  public downloadCsv(): void {
    const date = new Date();
    const start = subWeeks(startOfWeek(date, {weekStartsOn: 1}), PeriodConstants.SIX_MONTH_WEEKS);
    const end = endOfWeek(date, {weekStartsOn: 1});
    this.metricService.getTeamMetricsReport(
      this.team.id,
      format(start, 'YYYY-MM-DD'),
      format(end, 'YYYY-MM-DD'),
      this.metricType,
      this.managerId
    ).subscribe(data => {
        this.isLoading = false;
        const fileName = `${this.team.name}_${this.metricDescription}_${format(start, 'YYYY-MM-DD')}_${format(end, 'YYYY-MM-DD')}.csv`;
        const blob = new Blob([data], { type: 'text/csv' });
        this.downloadService.download(blob, fileName);
      },
      () => this.error = 'Error exporting metric summary');
  }

  public openSettingsModal(): void {
    this.modalService.open(this.settingsModal, {
      size: DfModalSize.Large,
    });
  }

  public updateMetricsPage(): void {
    this.getTeamOverview();
  }

  private refreshMetrics(): void {
    this.metricService.refreshMetrics(this.team.id, this.setupId)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(() => this.getTeamOverview(),
    error => {
      this.isLoading = false;
      this.updateMetricsBtn.isDisabled = false;
      if (isApiError(error)) {
        this.error = error.error.text;
      } else {
        this.error = 'Error refreshing metrics.';
      }
    });
  }

  private getTeamAndManagerSelection(): void {
    this.identityService.getTeamManagerGroupSelection()
    .pipe(filter((selectedTeamManagerGroup) => selectedTeamManagerGroup !== null))
    .pipe(tap((selectedTeamManagerGroup) => {
      if (selectedTeamManagerGroup !== null) {
        this.team = selectedTeamManagerGroup.team;
        this.managerId = selectedTeamManagerGroup.managerId;
        this.isAppAvailable = true;
        this.error = '';
        if (
          this.team.name === TeamConstants.ALL_DIRECT_REPORT ||
          (this.team && this.currentUserDetail && this.currentUserDetail.assignment.team.id === this.team.id)
        ) {
          this.isAppAvailable = false;
          this.error = TeamMetricsComponent.APP_NOT_AVAILABLE_MSG;
        }
      }
    }))
    .pipe(filter(() => this.isAppAvailable))
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => this.getTeamOverview()
      , () => this.error = 'Error loading selected team and manager.');
  }

  private getTeamOverview(): void {
    this.metricService.getTeamOverview(this.team.id).subscribe(teamOverview => {
      this.teamOverview = teamOverview;
      const currentMetricSetup = this.teamOverview.metricsSetups.find(setup => setup.currentTeamMetric && setup.active);
      this.hasMetricSetting = !!currentMetricSetup;
      this.metricTarget = currentMetricSetup && currentMetricSetup.metricTarget ? currentMetricSetup.metricTarget : 0;
      this.lastUpdate = currentMetricSetup && currentMetricSetup.metricUpdatedOn ? parse(currentMetricSetup.metricUpdatedOn) : undefined;
      this.metricDescription = currentMetricSetup && currentMetricSetup.metricName? currentMetricSetup.metricName : '';
      this.metricType = currentMetricSetup && currentMetricSetup.type ? currentMetricSetup.type : JIRA;
      this.setupId = currentMetricSetup && currentMetricSetup.id ? currentMetricSetup.id : 0;
      this.getMetricsData();
    }
    , () => this.error = 'Error loading team overview.');
  }

  private setActiveAssignmentsCount(): void {
    this.activeTeamMembers = this.assignments.filter(assignment => {
      const isPartOfTeam = (assignment.manager.id === this.managerId  || TeamConstants.isAllManagers(this.managerId))
        && (this.team.id === assignment.team.id);
      return assignment.status === ACTIVE_STATUS && isPartOfTeam;
    }).length;
  }
}
