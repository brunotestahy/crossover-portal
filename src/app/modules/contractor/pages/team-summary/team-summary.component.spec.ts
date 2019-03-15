import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfModalService } from '@devfactory/ngx-df';
import { format } from 'date-fns';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { mock } from 'ts-mockito';

import { Trends } from 'app/core/constants/team-summary/trends';
import { WeekModes } from 'app/core/constants/team-summary/week-modes';
import { AssignmentSummary } from 'app/core/models/productivity';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import { OnlineStatusService } from 'app/core/services/timetracking/online-status.service';
import { TimetrackingService } from 'app/core/services/timetracking/timetracking.service';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { DataFetchingService } from 'app/modules/contractor/pages/team-summary/services/data-fetching.service';
import { DataFormattingService } from 'app/modules/contractor/pages/team-summary/services/data-formatting.service';
import { DataRenderingService } from 'app/modules/contractor/pages/team-summary/services/data-rendering.service';
import {
  NavigationService,
} from 'app/modules/contractor/pages/team-summary/services/navigation.service';
import {
  PerformanceDataService,
} from 'app/modules/contractor/pages/team-summary/services/performance-data.service';
import { TeamSummaryComponent } from 'app/modules/contractor/pages/team-summary/team-summary.component';
import { CookiesService } from 'app/shared/services/cookies/cookies.service';

describe('TeamSummaryComponent', () => {
  let component: TeamSummaryComponent;
  let fixture: ComponentFixture<typeof component>;
  let cookiesService: CookiesService;
  let modalService: DfModalService;
  let onlineStatusService: OnlineStatusService;
  let dataFormattingService: DataFormattingService;
  let dataFetchingService: DataFetchingService;
  let dataRenderingService: DataRenderingService;
  let identityService: IdentityService;
  let performanceDataService: PerformanceDataService;
  let productivityService: ProductivityService;
  let timetrackingService: TimetrackingService;
  let navigationService: NavigationService;
  let windowService: Window;
  let assignmentService: AssignmentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TeamSummaryComponent,
      ],
      providers: [
        { provide: CookiesService, useFactory: () => mock(CookiesService) },
        { provide: AssignmentService, useFactory: () => mock(AssignmentService) },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        { provide: ProductivityService, useFactory: () => mock(ProductivityService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: OnlineStatusService, useFactory: () => mock(OnlineStatusService) },
        { provide: TimetrackingService, useFactory: () => mock(TimetrackingService) },
        DataFetchingService,
        DataFormattingService,
        DataRenderingService,
        PerformanceDataService,
        NavigationService,
        { provide: WINDOW_TOKEN, useValue: { setTimeout: () => true } },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-06-07T03:00:00'));

    fixture = TestBed.createComponent(TeamSummaryComponent);
    component = fixture.componentInstance;
    cookiesService = TestBed.get(CookiesService);
    modalService = TestBed.get(DfModalService);
    onlineStatusService = TestBed.get(OnlineStatusService);
    dataFetchingService = TestBed.get(DataFetchingService);
    dataFormattingService = TestBed.get(DataFormattingService);
    dataRenderingService = TestBed.get(DataRenderingService);
    identityService = TestBed.get(IdentityService);
    performanceDataService = TestBed.get(PerformanceDataService);
    productivityService = TestBed.get(ProductivityService);
    timetrackingService = TestBed.get(TimetrackingService);
    navigationService = TestBed.get(NavigationService);
    windowService = TestBed.get(WINDOW_TOKEN);
    assignmentService = TestBed.get(AssignmentService);
  });

  afterEach(() => jasmine.clock().uninstall());

  it('should be created', () => expect(component).toBeTruthy());

  it('should retrieve an error message when there is just a single performer', () => {
    component.productivitySummary = Object.assign({
      productivitySummary: {
        metricSetupPresent: true,
        activeAssignmentsCount: [1],
      },
    });
    component.teamSummaryCount = 1;

    const result = component.bottomPerformerError;
    expect(result).toBe('Expand your teams to compare your top and bottom performers');
  });

  it('should retrieve an error message when there is just a single performer and there was more previously', () => {
    component.productivitySummary = Object.assign({
      productivitySummary: {
        metricSetupPresent: true,
        activeAssignmentsCount: [2],
      },
    });
    component.teamSummaryCount = 1;

    const result = component.bottomPerformerError;
    expect(result).toBe('The team had only one contractor');
  });

  it('should retrieve the number of weeks successfully', () => {
    const numberOfWeeks = 999;
    spyOn(dataFormattingService, 'numberOfWeeks').and.returnValue(numberOfWeeks);
    const result = component.numberOfWeeks;

    expect(result).toBe(numberOfWeeks);
  });

  it('should fetch data successfully when initialised', () => {
    const cookieValue = 'sample string';
    spyOn(cookiesService, 'getCookie').and.returnValue(cookieValue);
    spyOn(dataFetchingService, 'load');
    fixture.detectChanges();

    expect(component.cookieInfo.value).toBe(cookieValue);
    expect(dataFetchingService.load).toHaveBeenCalledWith(component);
  });

  it('should execute a method call when a provided condition is true', () => {
    const callback = jasmine.createSpy('Sample callback');
    const condition = true;

    component.invokeIf(condition, callback);

    expect(callback).toHaveBeenCalledWith(component);
  });

  it('should not execute a method call when a provided condition is false', () => {
    const callback = jasmine.createSpy('Sample callback');
    const condition = false;

    component.invokeIf(condition, callback);

    expect(callback).not.toHaveBeenCalledWith(component);
  });

  describe('DataFetchingService', () => {
    it('should initialize data successfully', () => {
      spyOn(cookiesService, 'getCookie').and.returnValue('');
      spyOn(identityService, 'getCurrentUser').and.returnValue(of({
        managerAvatar: { id: 1 },
      }));
      spyOn(identityService, 'hasAvatarType').and.returnValue(true);
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
        team: {
          id: 1,
          teamOwner: {id: 1},
        },
        managerId: 1,
      }));
      spyOn(productivityService, 'getPerformers').and.returnValue(of({
        productivitySummary: {
          assignments: [1, 2, 3, 4],
          activeAssignmentsCount: [1, 2, 3, 4],
          intensityScoreAvg: [1, 2, 3, 4],
          focusScoreAvg: [1, 2, 3, 4],
          activityMetricsAvg: [1, 2, 3, 4],
          metricsStatsAvg: [1, 2, 3, 4],
          weeklyHoursAvg: [1, 2, 3, 4],
        },
      }));
      spyOn(timetrackingService, 'getLatestWorkDiaries').and.returnValue(of([]));
      spyOn(dataFormattingService, 'fetchSummaryData');

      fixture.detectChanges();

      const currentManagerId = component.currentManagerId as number;
      expect(productivityService.getPerformers).toHaveBeenCalledWith(
        currentManagerId.toString(),
        jasmine.any(String),
        jasmine.any(String),
        jasmine.any(String)
      );
    });

    it('should initialize data successfully when the current week is not being displayed', () => {
      spyOn(cookiesService, 'getCookie').and.returnValue('');
      spyOn(dataFormattingService, 'currentDateMatches').and.returnValue(false);
      spyOn(identityService, 'getCurrentUser').and.returnValue(of({
        managerAvatar: { id: 1 },
      }));
      spyOn(identityService, 'hasAvatarType').and.returnValue(true);
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
        team: {
          id: 1,
          teamOwner: {id: 1},
        },
        managerId: 1,
      }));
      spyOn(productivityService, 'getPerformers').and.returnValue(of({
        productivitySummary: {
          assignments: [1, 2, 3, 4],
          activeAssignmentsCount: [1, 2, 3, 4],
          intensityScoreAvg: [1, 2, 3, 4],
          focusScoreAvg: [1, 2, 3, 4],
          activityMetricsAvg: [1, 2, 3, 4],
          metricsStatsAvg: [1, 2, 3, 4],
          weeklyHoursAvg: [1, 2, 3, 4],
        },
      }));
      spyOn(timetrackingService, 'getLatestWorkDiaries').and.returnValue(of([]));
      spyOn(dataFormattingService, 'fetchSummaryData');

      fixture.detectChanges();

      const currentManagerId = component.currentManagerId as number;
      expect(productivityService.getPerformers).toHaveBeenCalledWith(
        currentManagerId.toString(),
        jasmine.any(String),
        jasmine.any(String),
        jasmine.any(String)
      );
    });

    it('should initialize data successfully when cookie contains a data request for the current week', () => {
      spyOn(cookiesService, 'getCookie').and.returnValue(WeekModes.CurrentWeek);
      spyOn(dataFormattingService, 'currentDateMatches').and.returnValue(true);
      spyOn(identityService, 'getCurrentUser').and.returnValue(of({
        managerAvatar: { id: 1 },
      }));
      spyOn(identityService, 'hasAvatarType').and.returnValue(true);
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
        team: {
          id: 1,
          name: 'Sample Team',
          teamOwner: {id: 1},
        },
        managerId: 1,
      }));
      spyOn(performanceDataService, 'mapPerformerDetails').and.returnValue(of({}));
      spyOn(performanceDataService, 'buildStats');
      spyOn(productivityService, 'getPerformers').and.returnValue(of({
        productivitySummary: {
          assignments: [1, 2, 3, 4],
          activeAssignmentsCount: [1, 2, 3, 4],
          intensityScoreAvg: [1, 2, 3, 4],
          focusScoreAvg: [1, 2, 3, 4],
          activityMetricsAvg: [1, 2, 3, 4],
          metricsStatsAvg: [1, 2, 3, 4],
          weeklyHoursAvg: [1, 2, 3, 4],
        },
      }));
      spyOn(timetrackingService, 'getLatestWorkDiaries').and.returnValue(of([]));
      spyOn(navigationService, 'fetchThisWeek');
      spyOn(dataFormattingService, 'fetchSummaryData');

      fixture.detectChanges();

      expect(navigationService.fetchThisWeek).toHaveBeenCalledWith(component);
    });

    it('should initialize data successfully when cookie contains a data request for the last week', () => {
      spyOn(cookiesService, 'getCookie').and.returnValue(WeekModes.LastWeek);
      spyOn(identityService, 'getCurrentUser').and.returnValue(of({
        managerAvatar: { id: 1 },
      }));
      spyOn(identityService, 'hasAvatarType').and.returnValue(true);
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
        team: {
          id: 1,
          teamOwner: {id: 1},
        },
        managerId: 1,
      }));
      spyOn(productivityService, 'getPerformers').and.returnValue(of({
        productivitySummary: {
          assignments: [1, 2, 3, 4],
          activeAssignmentsCount: [1, 2, 3, 4],
          intensityScoreAvg: [1, 2, 3, 4],
          focusScoreAvg: [1, 2, 3, 4],
          activityMetricsAvg: [1, 2, 3, 4],
          metricsStatsAvg: [1, 2, 3, 4],
          weeklyHoursAvg: [1, 2, 3, 4],
        },
      }));
      spyOn(timetrackingService, 'getLatestWorkDiaries').and.returnValue(of([]));
      spyOn(navigationService, 'fetchLastWeek');
      spyOn(dataFormattingService, 'fetchSummaryData');

    fixture.detectChanges();

      expect(navigationService.fetchLastWeek).toHaveBeenCalledWith(component);
    });

    it('should initialize data successfully when the current manager is a reporting manager', () => {
      spyOn(identityService, 'getCurrentUser').and.returnValue(of({
        managerAvatar: { id: 1 },
      }));
      spyOn(identityService, 'hasAvatarType').and.returnValue(true);
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
        team: {
          id: 1,
          teamOwner: null,
          reportingManagers: [{ id: 1 }],
        },
        managerId: 1,
      }));
      spyOn(productivityService, 'getPerformers').and.returnValue(of({
        productivitySummary: {
          assignments: [
            {
              activityMetrics: [1, 2, 3, 4],
              metricsStats: [1, 2, 3, 4],
              intensityScores: [1, 2, 3, 4],
              focusScores: [1, 2, 3, 4],
              recordedHours: [1, 2, 3, 4],
            },
          ],
          activeAssignmentsCount: [1, 2, 3, 4],
          averageBottomPerformer: [1, 2, 3, 4],
          averageTopPerformer: [1, 2, 3, 4],
          intensityScoreAvg: [1, 2, 3, 4],
          focusScoreAvg: [1, 2, 3, 4],
          activityMetricsAvg: [1, 2, 3, 4],
          metricsStatsAvg: [1, 2, 3, 4],
          weeklyHoursAvg: [1, 2, 3, 4],
          topPerformers: [1, 2, 3, 4],
          bottomPerformers: [1, 2, 3, 4],
        },
      }));
      spyOn(timetrackingService, 'getLatestWorkDiaries').and.returnValue(of([]));
      spyOn(cookiesService, 'getCookie').and.returnValue('');
      spyOn(windowService, 'setTimeout').and.callFake((method: Function) => method());
      spyOn(dataFormattingService, 'fetchSummaryData');

      fixture.detectChanges();
      expect(component.loadState.component).toBe(false);

      component.form.patchValue({ weeksCount: WeekModes.Single });
      fixture.detectChanges();
      expect(component.loadState.component).toBe(false);
    });

    it('should not initialize when no team was selected', () => {
      spyOn(identityService, 'getCurrentUser').and.returnValue(of({}));
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({}));
      spyOn(dataFormattingService, 'fetchSummaryData');
      component.showTeamSelector = false;

      fixture.detectChanges();

      expect(component.showTeamSelector).not.toBe(true);
    });

    it('should fetch summary data successfully when params contains some null data', () => {
      spyOn(component.currentTeam, 'getValue').and.returnValue({
        id: 1,
        teamOwner: null,
        reportingManagers: null,
      });
      spyOn(productivityService, 'getPerformers').and.returnValue({
        pipe: () => ({
          subscribe: () => true
        })
      });
      spyOn(dataFormattingService, 'fetchSummaryData');
      component.form = Object.assign({ value: {} });
      dataFetchingService.fetchSummary(component);

      expect(productivityService.getPerformers).toHaveBeenCalled();
    });

    it('should set an error message when an error occurs during online data retrieval', () => {
      spyOn(timetrackingService, 'getLatestWorkDiaries').and.returnValue(ErrorObservable.create({}));
      spyOn(dataFormattingService, 'fetchSummaryData');
      component.currentTeam = Object.assign({ getValue: () => ({ id: 1 }) });
      component.currentUserDetail = Object.assign({ managerAvatar: { id: 1 }});
      component.currentManagerId = 1;
      dataFetchingService.fetchOnlineStatus(component);

      expect(component.error).toBe('An unknown error happened while retrieving work diaries data.');
    });
  });

  describe('DataFormattingService', () => {
    it('should retrieve a date formatter successfully', () => {
      const result = dataFormattingService.getWeeklyFormatter(component);
      expect(result.constructor).toBe(Function);
    });

    it('should grab the formatted description for a single week successfully', () => {
      component.form = Object.assign({ value: { weeksCount: WeekModes.Single } });
      const value = new Date();
      const formatter = dataFormattingService.getWeeklyFormat.bind(component);
      const result = formatter(value);

      expect(result).toBe('Jun 04 - Jun 10, 2018');
    });

    it('should grab the formatted description for the last four weeks successfully', () => {
      component.form = Object.assign({ value: { weeksCount: WeekModes.FourPreviousWeeks } });
      const value = new Date();
      const formatter = dataFormattingService.getWeeklyFormat.bind(component);
      const result = formatter(value, true);

      expect(result).toBe('week of May 07 - Jun 03, 2018');
    });

    it('should retrieve the metric percentage successfully', () => {
      component.metricInfo.target = 5;
      const metricPercentage = 50;

      const result = dataFormattingService.getMetric(component, metricPercentage);

      expect(result).toBe('2.5');
    });

    it('should retrieve a metric percentage successfully', () => {
      component.metricInfo.target = 0;

      const result = dataFormattingService.getMetricPercentage(component);

      expect(result).toBe('0.0');
    });

    it('should retrieve a metric percentage successfully', () => {
      component.hoursInfo.currentViewMaxHours = 40;

      const result = dataFormattingService.getHoursLoggedPercentage(component);

      expect(result).toBe('0.0');
    });

    it('should format a X axis tick date successfully', () => {
      const date = new Date();
      const result = dataFormattingService.xAxisTickFormatter(date);

      expect(result).toBe('Jun 07');
    });

    it('should format a metric successfully', () => {
      const result = dataFormattingService.formatMetric();

      expect(result).toBe('0.0');
    });

    it('should fetch summary data successfully', () => {
      const averageTopPerformer = 1;
      const averageBottomPerformer = 2;
      const assignments = Object.assign([{ id: 1 }, { id: 2 }]);
      const productivitySummary = {
        averageTopPerformer,
        averageBottomPerformer,
        assignments,
      };
      const summary = Object.assign({ productivitySummary });
      dataFormattingService.fetchSummaryData(component, summary);

      expect(component.topPerformer.id).toBe(averageTopPerformer);
      expect(component.bottomPerformer.id).toBe(averageBottomPerformer);
    });

    it('should retrieve 5 weeks when displaying the current week', () => {
      spyOn(dataFormattingService, 'currentDateMatches').and.returnValue(true);
      const result = dataFormattingService.numberOfWeeks(component);

      expect(result).toBe(5);
    });

    it('should retrieve 4 weeks when not displaying the current week', () => {
      spyOn(dataFormattingService, 'currentDateMatches').and.returnValue(false);
      const result = dataFormattingService.numberOfWeeks(component);

      expect(result).toBe(4);
    });
  });

  describe('DataRenderingService', () => {
    it('should retrieve a left date message when an inactive assignment is provided', () => {
      const data = { active: false, effectiveDateEnd: new Date().toISOString() };
      const result = dataRenderingService.getInactiveMessage(data);

      expect(result).toBe('This person left the team on June, 7 2018');
    });

    it('should not retrieve a left date message when a active assignment is provided', () => {
      const data = { active: true, effectiveDateEnd: new Date().toISOString() };
      const result = dataRenderingService.getInactiveMessage(data);

      expect(result).toBeUndefined();
    });

    it('should retrieve success class for performers when the performance level is above 69%', () => {
      const performanceValue = 70;
      const maxValue = 100;

      const result = dataRenderingService.getScoreClass(performanceValue, maxValue);

      expect(result).toBe('success');
    });

    it('should retrieve success class for grid when the performance level is above 69%', () => {
      const performanceValue = 70;
      const maxValue = 100;

      const result = dataRenderingService.getTrendClass(performanceValue, maxValue);

      expect(result.cssClass).toBe('success');
    });

    it('should retrieve online class status successfully when a work diary is found', () => {
      const returnClass = 'Value Found';
      spyOn(onlineStatusService, 'getWorkDiary').and.returnValue(true);
      spyOn(onlineStatusService, 'getWorkDiaryOnlineStatusClass').and.returnValue(returnClass);

      const result = dataRenderingService.getOnlineStatusClass(component, Object.assign({}));

      expect(result).toBe(returnClass);
    });

    it('should not retrieve online class status successfully when a work diary is not found', () => {
      const returnClass = 'Value Found';
      spyOn(onlineStatusService, 'getWorkDiary').and.returnValue(false);
      spyOn(onlineStatusService, 'getWorkDiaryOnlineStatusClass').and.returnValue(returnClass);

      const result = dataRenderingService.getOnlineStatusClass(component, Object.assign({}));

      expect(result).toBe('');
    });
  });

  describe('NavigationService', () => {
    it('should navigate to the previous week successfully', () => {
      spyOn(identityService, 'getCurrentUser').and.returnValue(of({
        managerAvatar: { id: 1 },
      }));
      spyOn(identityService, 'hasAvatarType').and.returnValue(true);
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
        team: null,
        managerId: 1,
      }));
      component.currentTeam = new BehaviorSubject(Object.assign({}));
      spyOn(component.currentTeam, 'next');
      spyOn(dataFetchingService, 'fetchSummary');
      spyOn(dataFetchingService, 'fetchOnlineStatus');

      fixture.detectChanges();

      navigationService.previousWeek(component);
      expect(format(component.form.value.dateControl, 'YYYY-MM-DD')).toBe('2018-05-31');
    });

    it('should navigate to the next week successfully', () => {
      spyOn(identityService, 'getCurrentUser').and.returnValue(of({
        managerAvatar: { id: 1 },
      }));
      spyOn(identityService, 'hasAvatarType').and.returnValue(true);
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
        team: null,
        managerId: 1,
      }));
      component.currentTeam = new BehaviorSubject(Object.assign({}));
      spyOn(component.currentTeam, 'next');
      spyOn(dataFetchingService, 'fetchSummary');
      spyOn(dataFetchingService, 'fetchOnlineStatus');

      fixture.detectChanges();

      navigationService.nextWeek(component);
      expect(format(component.form.value.dateControl, 'YYYY-MM-DD')).toBe('2018-06-14');
    });

    it('should fetch data from the last 4 weeks successfully', () => {
      spyOn(identityService, 'getCurrentUser').and.returnValue(of({
        managerAvatar: { id: 1 },
      }));
      spyOn(identityService, 'hasAvatarType').and.returnValue(true);
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
        team: null,
        managerId: 1,
      }));

      component.currentTeam = new BehaviorSubject(Object.assign({value: null}).value);
      spyOn(component.currentTeam, 'next');
      spyOn(dataFetchingService, 'fetchSummary');
      spyOn(dataFetchingService, 'fetchOnlineStatus');

      fixture.detectChanges();

      navigationService.fetchLastFourWeeks(component);
      expect(format(component.form.value.dateControl, 'YYYY-MM-DD')).toBe('2018-06-07');
      expect(component.form.value.weeksCount).toBe(WeekModes.FourPreviousWeeks);
    });

    it('should fetch data from the last week successfully', () => {
      spyOn(identityService, 'getCurrentUser').and.returnValue(of({
        managerAvatar: { id: 1 },
      }));
      spyOn(identityService, 'hasAvatarType').and.returnValue(true);
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
        team: null,
        managerId: 1,
      }));

      component.currentTeam = new BehaviorSubject(Object.assign({value: null}).value);
      spyOn(component.currentTeam, 'next');
      spyOn(dataFetchingService, 'fetchSummary');
      spyOn(dataFetchingService, 'fetchOnlineStatus');

      fixture.detectChanges();

      navigationService.fetchLastWeek(component);
      expect(format(component.form.value.dateControl, 'YYYY-MM-DD')).toBe('2018-05-31');
      expect(component.form.value.weeksCount).toBe(WeekModes.Single);
    });

    it('should fetch data from the current week successfully', () => {
      spyOn(identityService, 'getCurrentUser').and.returnValue(of({
        managerAvatar: { id: 1 },
      }));
      spyOn(identityService, 'hasAvatarType').and.returnValue(true);
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
        team: null,
        managerId: 1,
      }));
      component.currentTeam = new BehaviorSubject(Object.assign({value: null}).value);
      spyOn(component.currentTeam, 'next');
      spyOn(dataFetchingService, 'fetchSummary');
      spyOn(dataFetchingService, 'fetchOnlineStatus');

      fixture.detectChanges();

      navigationService.fetchThisWeek(component);
      expect(format(component.form.value.dateControl, 'YYYY-MM-DD')).toBe('2018-06-04');
      expect(component.form.value.weeksCount).toBe(WeekModes.Single);
    });

    it('should open the contractor modal successfully', () => {
      const assignment = {
        manager: {},
        team: {
          id: 1,
        },
        candidate: {},
      };
      spyOn(assignmentService, 'getContractorAssignment').and.returnValue(of(assignment));
      const currentUser = {
        managerAvatar: { id: 1 },
      };
      const item = Object.assign({
        id: 1,
      }, {}) as AssignmentSummary;
      const template = {} as ElementRef;
      spyOn(identityService, 'getCurrentUser').and.returnValue(of(currentUser));
      spyOn(identityService, 'hasAvatarType').and.returnValue(true);
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
        team: null,
        managerId: 1,
      }));
      component.currentTeam = new BehaviorSubject(Object.assign({value: null}).value);

      spyOn(component.currentTeam, 'next');
      spyOn(dataFetchingService, 'fetchSummary');
      spyOn(dataFetchingService, 'fetchOnlineStatus');
      spyOn(modalService, 'open');

      fixture.detectChanges();

      navigationService.openContractorModal(component, item, template);
      expect(modalService.open).toHaveBeenCalledWith(template, jasmine.objectContaining({
        customClass: 'full-screen',
      }));
      expect(assignmentService.getContractorAssignment).toHaveBeenCalledWith(item.id);
    });

    it('should get api error while opening contractor modal', () => {
      spyOn(assignmentService, 'getContractorAssignment').and.returnValue(ErrorObservable.create({}));
      const currentUser = {
      managerAvatar: { id: 1 },
      };
      const item = Object.assign({
      id: 1,
      }, {}) as AssignmentSummary;
      const template = {} as ElementRef;
      spyOn(identityService, 'getCurrentUser').and.returnValue(of(currentUser));
      spyOn(identityService, 'hasAvatarType').and.returnValue(true);
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: null,
      managerId: 1,
      }));
      component.currentTeam = new BehaviorSubject(Object.assign({ value: null }).value);

      spyOn(component.currentTeam, 'next');
      spyOn(dataFetchingService, 'fetchSummary');
      spyOn(dataFetchingService, 'fetchOnlineStatus');
      spyOn(modalService, 'open');

      fixture.detectChanges();

      navigationService.openContractorModal(component, item, template);
      expect(modalService.open).toHaveBeenCalledWith(template, jasmine.objectContaining({
      customClass: 'full-screen',
      }));
      expect(assignmentService.getContractorAssignment).toHaveBeenCalledWith(item.id);
      expect(component.error).toBe('Error fetching contractor assignment.');
    });

    it('should set the weeks count successfully', () => {
      const weeksCount = '9';
      spyOn(identityService, 'getCurrentUser').and.returnValue(of({
        managerAvatar: { id: 1 },
      }));
      spyOn(identityService, 'hasAvatarType').and.returnValue(true);
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
        team: null,
        managerId: 1,
      }));
      component.currentTeam = new BehaviorSubject(Object.assign({value: null}).value);

      spyOn(component.currentTeam, 'next');
      spyOn(dataFetchingService, 'fetchSummary');
      spyOn(dataFetchingService, 'fetchOnlineStatus');

      fixture.detectChanges();

      navigationService.setWeeksCount(component, weeksCount);
      expect(component.form.value.weeksCount).toBe(weeksCount);
    });

    it('should show a team when it is selected', () => {
      const teamId = 1;
      spyOn(identityService, 'updateTeamById');

      navigationService.showSelectedTeam(component, teamId);
      expect(identityService.updateTeamById).toHaveBeenCalledWith(teamId);
    });

    it('should show the hours logged trend modal successfully', () => {
      const values = [1, 2, 3, 4];
      const modalValue = Object.assign({});
      spyOn(modalService, 'open');

      component.hoursLoggedModal = modalValue;
      navigationService.showTrend(component, Trends.HoursLogged, values);

      expect(modalService.open).toHaveBeenCalledWith(modalValue);
    });

    it('should show the metrics trend modal successfully', () => {
      const values = [1, 2, 3, 4];
      const modalValue = Object.assign({});
      spyOn(modalService, 'open');

      component.metricModal = modalValue;
      navigationService.showTrend(component, Trends.Metrics, values);

      expect(modalService.open).toHaveBeenCalledWith(modalValue);
    });

    it('should show the intensity trend modal successfully', () => {
      const values = [1, 2, 3, 4];
      const modalValue = Object.assign({});
      spyOn(modalService, 'open');

      component.intensityScoreModal = modalValue;
      navigationService.showTrend(component, Trends.Intensity, values);

      expect(modalService.open).toHaveBeenCalledWith(modalValue);
    });

    it('should show the focus trend modal successfully', () => {
      const values = [1, 2, 3, 4];
      const modalValue = Object.assign({});
      spyOn(modalService, 'open');

      component.focusScoreModal = modalValue;
      navigationService.showTrend(component, Trends.Focus, values);

      expect(modalService.open).toHaveBeenCalledWith(modalValue);
    });

    it('should show the alignment trend modal successfully', () => {
      const values = [1, 2, 3, 4];
      const modalValue = Object.assign({});
      spyOn(modalService, 'open');

      component.alignmentScoreModal = modalValue;
      navigationService.showTrend(component, Trends.Alignment, values);

      expect(modalService.open).toHaveBeenCalledWith(modalValue);
    });
  });

  describe('PerformanceDataService', () => {
    it('should map performer details when retrieving data for a single week', () => {
      const productivitySummary = Object.assign({
        topPerformers: [1, 2, 3, 4, 5],
        bottomPerformers: [1, 2, 3, 4, 5],
        activityMetricsAvg: [1, 2, 3, 4, 5],
        metricsStatsAvg: [1, 2, 3, 4, 5],
        intensityScoreAvg: [1, 2, 3, 4, 5],
        focusScoreAvg: [1, 2, 3, 4, 5],
        weeklyHoursAvg: [1, 2, 3, 4, 5],
        assignments: [{
          activityMetrics: [1, 2, 3, 4, 5],
          metricsStats: [1, 2, 3, 4, 5],
          intensityScores: [1, 2, 3, 4, 5],
          focusScores: [1, 2, 3, 4, 5],
          recordedHours: [1, 2, 3, 4, 5],
        }]
      });
      const summary = Object.assign({ productivitySummary });

      const result = performanceDataService.mapPerformerDetails(summary, WeekModes.Single);

      expect(result.productivitySummary.averageTopPerformer).toBeDefined();
      expect(result.productivitySummary.averageBottomPerformer).toBeDefined();
    });

    it('should not map performer details when retrieving data for a more than a single week', () => {
      const productivitySummary = Object.assign({});
      const summary = Object.assign({ productivitySummary });

      const result = performanceDataService.mapPerformerDetails(summary, WeekModes.FourPreviousWeeks);

      expect(result.productivitySummary.averageTopPerformer).not.toBeDefined();
      expect(result.productivitySummary.averageBottomPerformer).not.toBeDefined();
    });
  });
});
