import { AfterViewInit, Component, HostBinding, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DfGroupToggleItem, DfLine, DfLineChartConfiguration, DfLineChartScaleType } from '@devfactory/ngx-df';
import { addDays, addMonths, addQuarters, addWeeks, endOfWeek, endOfYear, format, setYear, startOfWeek, startOfYear } from 'date-fns';
import * as _ from 'lodash';
import { debounceTime, filter, take, takeUntil } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import * as MetricsConstants from 'app/core/constants/metrics';
import * as TeamHistoryConstants from 'app/core/constants/team-history';
import { TeamSelectorStrategy } from 'app/core/decorators/team-selector-strategy';
import { Team, TeamHistoryChartPoint, TeamHistoryChartTooltip, TeamHistoryRecord, TeamManagerGroup } from 'app/core/models/team';
import { AllTeamsDisableManagers } from 'app/core/models/team-selector-strategy';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { MetricService } from 'app/core/services/metric/metric.service';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import {
  TeamSelectorStrategyService,
} from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';

@Component({
  selector: 'app-team-history',
  templateUrl: './team-history.component.html',
  styleUrls: ['./team-history.component.scss'],
})
@TeamSelectorStrategy(AllTeamsDisableManagers)
export class TeamHistoryComponent implements AfterViewInit, OnInit, OnDestroy {
  private destroy$ = new Subject();

  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  @ViewChild(DfLine)
  public readonly chart: DfLine;

  public readonly viewModeItems: DfGroupToggleItem[] = [
    {
      text: '',
      id: MetricsConstants.CHART,
      icon: 'fa fa-line-chart fa-lg',
    },
    {
      text: '',
      id: MetricsConstants.TABLE,
      icon: 'fa fa-table fa-lg',
      disabled: true,
    },
  ];

  public readonly dimensionItems = [
    TeamHistoryConstants.METRIC,
    TeamHistoryConstants.COST,
    TeamHistoryConstants.COST_PER_UNIT,
    TeamHistoryConstants.SIZE
  ];

  public readonly periodItems = [
    {
      id: TeamHistoryConstants.MODES[TeamHistoryConstants.WEEKLY],
      text: TeamHistoryConstants.WEEKLY,
    },
    {
      id: TeamHistoryConstants.MODES[TeamHistoryConstants.MONTHLY],
      text: TeamHistoryConstants.MONTHLY,
    },
    {
      id: TeamHistoryConstants.MODES[TeamHistoryConstants.QUARTERLY],
      text: TeamHistoryConstants.QUARTERLY,
    },
  ];

  public error = '';
  public formGroup: FormGroup;
  public isLoading = true;
  public selectedYear: number;
  public teamHistory: TeamHistoryChartPoint[] = [];
  public tooltipInfo: TeamHistoryChartTooltip[] = [];
  public teamHistoryRecords: TeamHistoryRecord[] = [];
  public chartConfig = new DfLineChartConfiguration();
  public currentTeam = new BehaviorSubject<Team | null>(null);
  public dimensionValue = TeamHistoryConstants.METRIC;
  public periodValue = TeamHistoryConstants.WEEKLY;


  constructor(
    private formBuilder: FormBuilder,
    private metricService: MetricService,
    private identityService: IdentityService,
    public teamSelectorStrategyService: TeamSelectorStrategyService,
    @Inject(WINDOW_TOKEN) private window: Window
  ) {
  }

  public ngOnInit(): void {
    this.chartConfig.xAxisScale = DfLineChartScaleType.Linear;
    this.chartConfig.showDots = true;
    this.chartConfig.smoothLine = false;
    this.chartConfig.horizontalGridLineCount = 6;

    this.formGroup = this.formBuilder.group({
      dimension: [TeamHistoryConstants.METRIC],
      period : [this.periodItems[0]],
      viewMode: [this.viewModeItems[0]]
    });
    this.selectedYear = new Date().getFullYear();

    this.formGroup.valueChanges.subscribe(() => this.fetchTeamHistory());
    this.identityService.getTeamManagerGroupSelection()
      .pipe(
        takeUntil(this.destroy$),
        filter(teamManagerGroup => !!teamManagerGroup)
      )
      .subscribe(teamManagerGroup => {
        const value = teamManagerGroup as TeamManagerGroup;
        this.currentTeam.next(value.team);
      });
    this.currentTeam
      .pipe(
        filter(team => !!team),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.fetchTeamHistory());
  }

  public ngAfterViewInit(): void {
    const debounceInterval = 500;
    this.teamSelectorStrategyService.menuState
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(debounceInterval)
      )
      .subscribe(() => this.chart.onResize());
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public fetchTeamHistory(): void {
    this.teamHistory = [];
    this.dimensionValue = this.formGroup.controls.dimension.value;
    this.periodValue = this.formGroup.controls.period.value;

    const teamId = _.get(this.currentTeam.getValue(), 'id', 'all') as string;
    this.isLoading = true;
    this.error = '';
    const from = addDays(startOfYear(setYear(new Date(), this.selectedYear)), 1);
    const to = addDays(endOfYear(setYear(new Date(), this.selectedYear)), 1);
    const period = this.formGroup.controls.period.value.id as string;
    this.metricService.getTeamStatistics(
      teamId,
      format(from, 'YYYY-MM-DD'),
      format(to, 'YYYY-MM-DD'),
      period
    )
    .pipe(
      take(1)
    )
    .subscribe(
      records => {
        this.buildTeamHistory(records);
        this.isLoading = false;
      },
      error => {
        this.error = _.get(error, 'error.text', 'An unknown error happened while loading metrics data.');
        this.isLoading = false;
      }
    );
  }

  public buildTeamHistory(records: TeamHistoryRecord[]): void {
    this.teamHistoryRecords = records;
    const period = this.formGroup.controls.period.value.id;
    const dimensionKey = this.getDimensionKey();
    const strategies = [
      {
        value: TeamHistoryConstants.MODES[TeamHistoryConstants.WEEKLY],
        action: () => this.setWeeklyHistory(dimensionKey),
      },
      {
        value: TeamHistoryConstants.MODES[TeamHistoryConstants.MONTHLY],
        action: () => this.setMonthlyHistory(dimensionKey),
      },
      {
        value: TeamHistoryConstants.MODES[TeamHistoryConstants.QUARTERLY],
        action: () => this.setQuarterlyHistory(dimensionKey),
      },
    ];
    const strategy = strategies.filter(entry => entry.value === period)[0];
    strategy.action();
  }

  public getDimensionKey(): 'teamSize' | 'cost' | 'costPerUnit' | 'metricValue' {
    const dimension = this.formGroup.controls.dimension.value;
    if (dimension === TeamHistoryConstants.COST) {
      return 'cost';
    }
    if (dimension === TeamHistoryConstants.COST_PER_UNIT) {
      return 'costPerUnit';
    }
    if (dimension === TeamHistoryConstants.METRIC) {
      return 'metricValue';
    }
    return 'teamSize';
  }

  public getTooltipInfo(key: string): TeamHistoryChartTooltip | undefined {
    return this.tooltipInfo.find(tooltip => tooltip.xKey === key);
  }

  public setWeeklyHistory(key: 'teamSize' | 'cost' | 'costPerUnit' | 'metricValue'): void {
    const teamHistory: TeamHistoryChartPoint[] = [];
    this.teamHistory = [];
    this.tooltipInfo = [];

    const date = startOfYear(setYear(new Date(), this.selectedYear));
    let week = startOfWeek(date, { weekStartsOn: 1 });
    if (date.getFullYear() !== week.getFullYear()) {
      week = startOfWeek(addWeeks(week, 1), {weekStartsOn: 1} );
    }
    week = addDays(week, 1);
    const yearInWeeks = 52;
    for (let i = 0; i < yearInWeeks; i++) {
      const yKey = _.get(this.teamHistoryRecords, `${i}.${key}`, 0);
      teamHistory.push({
        xKey: this.getWeeklyFormat(week),
        yKey
      });

      const currentTooltip: TeamHistoryChartTooltip = {
        xKey: this.getWeeklyFormat(week),
        label: this.getWeeklyFormat(week),
        delta: undefined,
      };

      this.tooltipInfo.push(currentTooltip);
      week = addWeeks(week, 1);

      if (i !== 0) {
        const previousValue = teamHistory[i - 1].yKey;
        const currentValue = teamHistory[i].yKey;
        if (previousValue) {
          currentTooltip.previousValue = previousValue.toFixed(1);
          currentTooltip.delta = ((currentValue - previousValue) / previousValue * 100).toFixed(0);
        }
      }
    }

    this.window.setTimeout(() => this.teamHistory = teamHistory);
  }

  public setMonthlyHistory(key: 'teamSize' | 'cost' | 'costPerUnit' | 'metricValue'): void {
    const teamHistory: TeamHistoryChartPoint[] = [];
    this.teamHistory = [];
    this.tooltipInfo = [];

    let month = startOfYear(new Date());

    const yearInMonths = 12;
    for (let i = 0; i < yearInMonths; i++) {
      const yKey = _.get(this.teamHistoryRecords, `${i}.${key}`, 0);
      teamHistory.push({
        xKey: format(month, 'MMM'),
        yKey,
      });
      month = addMonths(month, 1);

      const currentTooltip: TeamHistoryChartTooltip = {
        xKey: format(month, 'MMM'),
        label: format(month, 'MMMM'),
        delta: '',
      };

      this.tooltipInfo.push(currentTooltip);

      if (i !== 0) {
        const previousValue = teamHistory[i - 1].yKey;
        const currentValue = teamHistory[i].yKey;
        currentTooltip.previousValue = previousValue.toFixed(1);
        if (previousValue) {
          currentTooltip.previousValue = previousValue.toFixed(1);
          currentTooltip.delta = ((currentValue - previousValue) / previousValue * 100).toFixed(0);
        }
      }
    }

    this.window.setTimeout(() => this.teamHistory = teamHistory);
  }

  public setQuarterlyHistory(key: 'teamSize' | 'cost' | 'costPerUnit' | 'metricValue'): void {
    const teamHistory: TeamHistoryChartPoint[] = [];
    this.teamHistory = [];
    this.tooltipInfo = [];

    const quarterLength = 4;
    let quarter = startOfYear(new Date());
    for (let i = 0; i < quarterLength; i++) {
      const yKey = _.get(this.teamHistoryRecords, `${i}.${key}`, 0);
      teamHistory.push({
        xKey: `Q${i + 1}`,
        yKey,
      });
      quarter = addQuarters(quarter, 1);

      const currentTooltip: TeamHistoryChartTooltip = {
        xKey: `Q${i + 1}`,
        label: this.getQuarterLabel(i),
        delta: ''
      };

      this.tooltipInfo.push(currentTooltip);

      if (i > 0) {
        const previousValue = teamHistory[i - 1].yKey;
        const currentValue = teamHistory[i].yKey;
        currentTooltip.previousValue = previousValue.toFixed(1);
        if (previousValue) {
          currentTooltip.previousValue = previousValue.toFixed(1);
          currentTooltip.delta = ((currentValue - previousValue) / previousValue * 100).toFixed(0);
        }
      }
    }

    this.window.setTimeout(() => this.teamHistory = teamHistory);
  }

  public getQuarterLabel(i: number): string {
    const quarterLabels = [
      'Q1(Jan, Feb, Mar)',
      'Q2(Apr, May, Jun)',
      'Q3(Jul, Aug, Sep)',
      'Q4(Oct, Nov, Dec)',
    ];
    return quarterLabels[i];
  }

  public previousYear(): void {
    if (this.isPreviousYearAvailable()) {
      this.selectedYear--;
      this.fetchTeamHistory();
    }
  }

  public nextYear(): void {
    if (this.isNextYearAvailable()) {
      this.selectedYear++;
      this.fetchTeamHistory();
    }
  }

  public downloadCsv(): void {
    const weeksRange = 52;
    const startOfIsoWeek = { weekStartsOn: 1 };
    const iso8601 = 'YYYY-MM-DD';
    const from = addWeeks(startOfWeek(new Date(), startOfIsoWeek), -weeksRange);
    const to = endOfWeek(new Date(), startOfIsoWeek);
    const period = this.formGroup.value.period.id;
    const teamId = _.get(this.currentTeam.getValue(), 'id', 'all') as string;
    const targetUrl = this.metricService.downloadTeamStatisticsUrl(
      teamId,
      format(from, iso8601),
      format(to, iso8601),
      period
    );
    this.window.location.href = targetUrl;
  }

  public isNextYearAvailable(): boolean {
    const currentYear = new Date().getFullYear();
    return this.selectedYear < currentYear;
  }

  public isPreviousYearAvailable(): boolean {
    const currentYear = new Date().getFullYear();
    return currentYear - this.selectedYear < 3;
  }

  public xAxisTickFormatter(value: string, index: number): string {
    if (this.periodValue === TeamHistoryConstants.WEEKLY) {
      return index % 3 === 0 ? value : '';
    } else {
      return value;
    }
  }

  public yAxisTickFormatter(value: number): string {
    value = Number(_.defaultTo(value, '0'));
    return this.dimensionValue === TeamHistoryConstants.COST ||
      this.dimensionValue === TeamHistoryConstants.COST_PER_UNIT ?
      '$' + value.toFixed(1) :
      value.toFixed(1);
  }

  public getWeeklyFormat(date: Date): string {
    const start = addDays(startOfWeek(date), 1);
    const end = addDays(endOfWeek(date), 1);

    return `${format(start, 'MMM DD')} - ${format(end, 'MMM DD')}`;
  }
}
