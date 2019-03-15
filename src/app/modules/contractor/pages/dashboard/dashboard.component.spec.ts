import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DfModalService, DfModalSize } from '@devfactory/ngx-df';
import * as _ from 'lodash';
import * as moment from 'moment';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { sprintf } from 'sprintf-js';
import { mock } from 'ts-mockito';

import { Assignment } from 'app/core/models/assignment';
import { Team } from 'app/core/models/dashboard';
import { CurrentUserDetail } from 'app/core/models/identity';
import { WorkDiary } from 'app/core/models/logbook';
import { TeamAverage, TeamManagerGroup } from 'app/core/models/team';
import { TeamDashboard } from 'app/core/models/time-tracking';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { CURRENT_USER_DETAIL_MOCK } from 'app/core/services/mocks/current-user-detail.mock';
import { TEAM_AVERAGE_MOCK, TEAM_DASBOARD_MOCK } from 'app/core/services/mocks/dashboard.mock';
import { ASSIGNMENT_MOCK } from 'app/core/services/mocks/productivity.mock';
import { WORKDIARIES_MOCK } from 'app/core/services/mocks/work-diaries.mock';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import { TimetrackingService } from 'app/core/services/timetracking/timetracking.service';
import { DashboardComponent } from 'app/modules/contractor/pages/dashboard/dashboard.component';
import { SkypeModalComponent } from 'app/shared/components/skype-modal/skype-modal.component';
import { UserDashboardService } from 'app/shared/services/user-dashboard/user-dashboard.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  let assignmentService: AssignmentService;
  let authTokenService: AuthTokenService;
  let dashboardService: UserDashboardService;
  let identityService: IdentityService;
  let modalService: DfModalService;
  let productivityService: ProductivityService;
  let timeTrackingService: TimetrackingService;
  let router: Router;

  let assignments: Assignment[];
  let teamAverage: TeamAverage;
  let teamDashboard: TeamDashboard;
  let userDetail: CurrentUserDetail;
  let workDiaries: WorkDiary[];
  let spyTeamManagerGroupSelection: jasmine.Spy;
  let spyCurrentUserDetail: jasmine.Spy;
  let spyAvatarType: jasmine.Spy;
  let spyTeamAssignments: jasmine.Spy;
  let spyProductivityAverage: jasmine.Spy;
  let spyLatestWorkDiaries: jasmine.Spy;
  let spyTeamDashboard: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
      ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: AssignmentService, useFactory: () => mock(AssignmentService) },
        { provide: AuthTokenService, useFactory: () => mock(AuthTokenService) },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: ProductivityService, useFactory: () => mock(ProductivityService) },
        { provide: TimetrackingService, useFactory: () => mock(TimetrackingService) },
        { provide: UserDashboardService, useFactory: () => mock(UserDashboardService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    assignmentService = TestBed.get(AssignmentService);
    authTokenService = TestBed.get(AuthTokenService);
    dashboardService = TestBed.get(UserDashboardService);
    identityService = TestBed.get(IdentityService);
    modalService = TestBed.get(DfModalService);
    productivityService = TestBed.get(ProductivityService);
    timeTrackingService = TestBed.get(TimetrackingService);
    router = TestBed.get(Router);

    assignments = Object.assign(ASSIGNMENT_MOCK.content);
    assignments.forEach(assignment => {
      assignment.selection = Object.assign({
        marketplaceMember: {
          application: {
            candidate: assignment.candidate,
          },
        },
      });
    });
    teamAverage = Object.assign(TEAM_AVERAGE_MOCK);
    teamAverage.activitiAvg = {
      ...teamAverage.activitiAvg,
      overWeekPlannedActs: [{
        id: 0,
        activity: { id: 4, name: 'Office', timeUsed: 0, color: '#00bcd4' },
        actTimeLong: 100,
      }, {
        id: 0,
        activity: { id: 12, name: 'Email', timeUsed: 0, color: '#BDFA73' },
        actTimeLong: 100,
      }, {
        id: 0,
        activity: { id: 3431, name: 'Meeting', timeUsed: 0, color: '#516E23' },
        actTimeLong: 300,
      }, {
        id: 0,
        activity: { id: 1507, name: 'Development', timeUsed: 0, color: '#2196f3' },
        actTimeLong: 1900,
      }],
    };
    teamDashboard = Object.assign(TEAM_DASBOARD_MOCK);
    userDetail = Object.assign(CURRENT_USER_DETAIL_MOCK);
    userDetail.managerAvatar = Object.assign({ id: 13 });
    userDetail.appFeatures.push({ appFeature: 'POLLS' });
    userDetail.assignment = Object.assign({ id: 13, manager: { id: 13 }, team: { id: 11 } });
    workDiaries = Object.assign(WORKDIARIES_MOCK);
    spyCurrentUserDetail = spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of(userDetail));
    spyTeamManagerGroupSelection = spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of(null));
    spyAvatarType = spyOn(identityService, 'hasAvatarType').and.returnValue(false);
    spyTeamAssignments = spyOn(assignmentService, 'getTeamAssignments').and.returnValue(of(assignments));
    spyProductivityAverage = spyOn(productivityService, 'getProductivityAverage').and.returnValue(of(teamAverage));
    spyLatestWorkDiaries = spyOn(timeTrackingService, 'getLatestWorkDiaries').and.returnValue(of(workDiaries));
    spyTeamDashboard = spyOn(dashboardService, 'getTeamDashboard').and.returnValue(of(teamDashboard));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display the team dashboard as a contractor when the screen is loaded', () => {
    fixture.detectChanges();

    spyProductivityAverage.and.returnValue(of(null));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.isAllDirectReports).toBe(false);
    expect(component.contractors).toBeDefined();
    expect(component.workDiaries.length).toBeGreaterThan(0);
  });

  it('should display the team dashboard as a manager when the screen is loaded', () => {
    userDetail.appFeatures = [];
    spyAvatarType.and.returnValue(true);
    const teamGroup: TeamManagerGroup = {
      managerId: 13,
      team: Object.assign({}),
      teams: teamDashboard.teams,
    };
    spyTeamManagerGroupSelection.and.returnValue(of(teamGroup));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.isAllDirectReports).toBe(false);
    expect(component.managerMode).toBe(true);
    expect(component.contractors).toBeDefined();
    expect(component.workDiaries.length).toBeGreaterThan(0);
  });

  it('should display the team dashboard as a manager with multiple teams when the screen is loaded', () => {
    spyAvatarType.and.returnValue(true);
    const teamGroup: TeamManagerGroup = {
      managerId: 13,
      team: Object.assign({}),
      teams: teamDashboard.teams,
    };
    (teamGroup.teams as Team[]).push(Object.assign(teamDashboard.teams[0]));
    const newTeamDashboard = _.cloneDeep(teamDashboard);
    newTeamDashboard.productivityAverage[0].activitiAvg = {
      ...newTeamDashboard.productivityAverage[0].activitiAvg,
      groupsSummaryAvg: [],
    };
    spyTeamDashboard.and.returnValue(of(newTeamDashboard));
    spyTeamManagerGroupSelection.and.returnValue(of(teamGroup));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.isAllDirectReports).toBe(false);
    expect(component.managerMode).toBe(true);
    expect(component.contractors).toBeDefined();
    expect(component.workDiaries.length).toBeGreaterThan(0);
  });

  it('should display all direct reports as a manager when the screen is loaded', () => {
    spyAvatarType.and.returnValue(true);
    const teamGroup: TeamManagerGroup = {
      managerId: 13,
      team: Object.assign({ id: 11 }),
      teams: teamDashboard.teams,
    };
    const newTeamDashboard = _.cloneDeep(teamDashboard);
    delete newTeamDashboard.productivityAverage;
    spyTeamDashboard.and.returnValue(of(newTeamDashboard));
    spyTeamManagerGroupSelection.and.returnValue(of(teamGroup));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.isAllDirectReports).toBe(true);
    expect(component.managerMode).toBe(true);
    expect(component.contractors).toBeDefined();
    expect(component.workDiaries.length).toBeGreaterThan(0);
  });

  it('should not display the team data as a manager when the screen is loaded without a current user', () => {
    spyAvatarType.and.returnValue(true);
    spyCurrentUserDetail.and.returnValue(of(null));
    const teamGroup: TeamManagerGroup = {
      managerId: 13,
      team: Object.assign({ id: 11 }),
      teams: teamDashboard.teams,
    };
    spyTeamManagerGroupSelection.and.returnValue(of(teamGroup));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.managerMode).toBe(false);
  });

  it('should throw an API error when the team data is loaded as manager', () => {
    spyAvatarType.and.returnValue(true);
    const teamGroup: TeamManagerGroup = {
      managerId: 13,
      team: Object.assign({}),
      teams: teamDashboard.teams,
    };
    spyTeamManagerGroupSelection.and.returnValue(of(teamGroup));
    const negativeResponse = {
      error: {
        errorCode: 'CROS-0027',
        httpStatus: 400,
        type: 'ERROR',
        text: 'Sample error text',
      },
    };

    spyTeamDashboard.and.returnValue(ErrorObservable.create(negativeResponse));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.error).toBe(negativeResponse.error.text);
  });

  it('should throw an 403 API error when the team data is loaded as manager without a Team Owner', () => {
    spyAvatarType.and.returnValue(true);
    const teamGroup: TeamManagerGroup = {
      managerId: 13,
      team: Object.assign({ id: 11 }),
      teams: teamDashboard.teams,
    };
    spyTeamManagerGroupSelection.and.returnValue(of(teamGroup));
    const negativeResponse = {
      error: {
        errorCode: 'CROS-0027',
        httpStatus: 403,
        type: 'ERROR',
        text: 'Sample error text',
      },
    };

    spyTeamDashboard.and.returnValue(ErrorObservable.create(negativeResponse));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('');
  });

  it('should throw an general error when the team data is loaded as manager', () => {
    spyAvatarType.and.returnValue(true);
    const teamGroup: TeamManagerGroup = {
      managerId: 13,
      team: Object.assign({}),
      teams: teamDashboard.teams,
    };
    spyTeamManagerGroupSelection.and.returnValue(of(teamGroup));
    const negativeResponse = {};

    spyTeamDashboard.and.returnValue(ErrorObservable.create(negativeResponse));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('Error trying to load the dashboard data.');
  });

  it('should throw an error when the work diaries are loaded', () => {
    spyLatestWorkDiaries.and.returnValue(ErrorObservable.create({}));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.isAllDirectReports).toBe(false);
    expect(component.contractors).toBeDefined();
    expect(component.workDiaries.length).toBe(0);
    expect(component.error).toBe('An unknown error happened while retrieving work diaries data.');
  });

  it('should throw an API error when the team data is loaded', () => {
    const negativeResponse = {
      error: {
        errorCode: 'CROS-0027',
        httpStatus: 400,
        type: 'ERROR',
        text: 'Sample error text',
      },
    };

    spyTeamAssignments.and.returnValue(ErrorObservable.create(negativeResponse));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.error).toBe(negativeResponse.error.text);
  });

  it('should throw an general error when the team data is loaded', () => {
    const negativeResponse = {};

    spyTeamAssignments.and.returnValue(ErrorObservable.create(negativeResponse));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('Error trying to load the dashboard data.');
  });

  it('should throw an API error when the current user is loaded', () => {
    const negativeResponse = {
      error: {
        errorCode: 'CROS-0027',
        httpStatus: 400,
        type: 'ERROR',
        text: 'Sample error text',
      },
    };

    spyTeamManagerGroupSelection.and.returnValue(ErrorObservable.create(negativeResponse));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.error).toBe(negativeResponse.error.text);
    expect(component.currentUser).toBeUndefined();
  });

  it('should throw an general error when the current user is loaded', () => {
    const negativeResponse = {};

    spyCurrentUserDetail.and.returnValue(ErrorObservable.create(negativeResponse));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('Error trying to load the current user.');
  });

  it('should display the team dashboard as a contractor when the screen is loaded without planned metrics', () => {
    const newTeamAverage = _.cloneDeep(teamAverage);
    newTeamAverage.activitiAvg = {
      ...newTeamAverage.activitiAvg,
      overWeekPlannedActs: [],
    };
    spyProductivityAverage.and.returnValue(of(newTeamAverage));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.isAllDirectReports).toBe(false);
  });

  it('should format the date in the graph horizontal line when the page is loaded', () => {
    const date: Date = moment('2018-01-01').hour(11).minutes(0).seconds(0).toDate();

    expect(component.xAxisTickFormatter(date)).toBe('Jan 01');
  });

  it('should should display empty values in the graph vertical line when the page is loaded', () => {
    expect(component.yAxisTickFormatter()).toBe('');
  });

  it('should hide the skype tooltips when the page is scrolled', () => {
    component.skypeTooltips = Object.assign([{
      hide: () => {},
    }]);

    spyOn(component.skypeTooltips.find(item => !!item) as SkypeModalComponent, 'hide').and.returnValue('');

    component.onPageScroll();

    expect((component.skypeTooltips.find(item => !!item) as SkypeModalComponent).hide).toHaveBeenCalledWith();
  });

  it('should navigate to an internal application when an app button is clicked', () => {
    const buttonObj = Object.assign({ link: 'timezone' });
    spyOn(router, 'navigate').and.returnValue('');

    component.navigateTo(buttonObj);

    expect(router.navigate).toHaveBeenCalledWith([buttonObj.link]);
  });

  it('should navigate to an external link when an app button is clicked', () => {
    const buttonObj = Object.assign({ externalUrl: 'google' });
    spyOn(window, 'open').and.returnValue('');

    component.navigateTo(buttonObj);

    expect(window.open).toHaveBeenCalledWith(buttonObj.externalUrl, '_blank');
  });

  it('should navigate to the workSmart link when the workSmart app button is clicked', () => {
    const buttonObj = Object.assign({ worksmartUrl: 'google' });
    component.currentUser = Object.assign({ id: 13 });
    spyOn(window, 'open').and.returnValue('');

    component.navigateTo(buttonObj);

    expect(window.open).toHaveBeenCalledWith(sprintf(buttonObj.worksmartUrl, {
      env: 'qa',
      contractorId: (component.currentUser as CurrentUserDetail).id,
      date: new Date().getTime(),
      token: authTokenService.getToken(),
    }), '_blank');
  });

  it('should not navigate when there is not link available in the app button', () => {
    const buttonObj = Object.assign({});
    spyOn(window, 'open').and.returnValue('');

    component.navigateTo(buttonObj);

    expect(window.open).not.toHaveBeenCalledWith();
  });

  it('should navigate to the Team Metrics screen when the Metric Chart is clicked as a manager', () => {
    component.managerMode = true;
    component.metricAverage = 30;
    spyOn(router, 'navigate').and.returnValue('');

    component.navigateToTeamMetrics();

    expect(router.navigate).toHaveBeenCalledWith(['/contractor/team-metrics']);
  });

  it('should not navigate to the Team Metrics screen when the Metric Chart is clicked as a contractor', () => {
    component.managerMode = false;
    spyOn(router, 'navigate').and.returnValue('');

    component.navigateToTeamMetrics();

    expect(router.navigate).not.toHaveBeenCalledWith();
  });

  it('should define a specific color to metric lines when the graph is loaded', () => {
    expect(component.colorFn('metric')).toBe('#828886');
  });

  it('should define a specific color to not metric lines when the graph is loaded', () => {
    expect(component.colorFn('other')).toBe('#247ab6');
  });

  it('should open the workflows modal when the workflows link is clicked as a manager', () => {
    spyOn(modalService, 'open').and.returnValue('');

    component.openWorkflowsWizard();

    expect(modalService.open).toHaveBeenCalledWith(component.workflowsWizardModal, {
      size: DfModalSize.Large,
    });
  });

  it('should get the correct metric percentage when the metrics chart is loaded', () => {
    component.metricAverage = 8;
    component.metricTarget = '10';

    expect(component.getMetricTargetPercentage()).toBe('80');
  });

  it('should get the no target message when the metrics chart is loaded without target', () => {
    component.metricAverage = 8;
    component.metricTarget = '1';

    expect(component.getMetricTargetPercentage()).toBe('no target');
  });

  it('should format the metric average correctly when the metrics chart is loaded', () => {
    component.metricAverage = 0.85;

    expect(component.getMetricAverage()).toBe('0.8');
  });

  it('should update the team trend correctly when the metrics chart is updated', () => {
    const event = Object.assign({ id: 13 });

    component.updateTeamTrend(event);

    expect(component.teamTrend).toBe(event);
  });
});
