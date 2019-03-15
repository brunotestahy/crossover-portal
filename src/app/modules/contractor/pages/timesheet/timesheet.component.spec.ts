import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfModalService } from '@devfactory/ngx-df';
import { format } from 'date-fns';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { TrackingTimesheet } from 'app/core/models/time-tracking/tracking-timesheet.model';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { TEAMS_MOCK } from 'app/core/services/mocks/dashboard.mock';
import { TEAM_TIMESHEET } from 'app/core/services/mocks/team-timesheet.mock';
import { TimetrackingService } from 'app/core/services/timetracking/timetracking.service';
import { TimesheetComponent } from 'app/modules/contractor/pages/timesheet/timesheet.component';
import { FormatHoursPipe } from 'app/shared/pipes/format-hours.pipe';
import { UserDashboardService } from 'app/shared/services/user-dashboard/user-dashboard.service';

describe('TimesheetComponent', () => {
  let component: TimesheetComponent;
  let fixture: ComponentFixture<TimesheetComponent>;

  let identityService: IdentityService;
  let dashboardService: UserDashboardService;
  let timetrackingService: TimetrackingService;
  let assignmentService: AssignmentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimesheetComponent,
        FormatHoursPipe,
      ],
      providers: [
        { provide: AssignmentService, useFactory: () => mock(AssignmentService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        { provide: TimetrackingService, useFactory: () => mock(TimetrackingService) },
        { provide: UserDashboardService, useFactory: () => mock(UserDashboardService) },
        { provide: FormatHoursPipe, useFactory: () => mock(FormatHoursPipe) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-05-17T03:24:00'));
    fixture = TestBed.createComponent(TimesheetComponent);
    component = fixture.componentInstance;

    identityService = TestBed.get(IdentityService);
    dashboardService = TestBed.get(UserDashboardService);
    timetrackingService = TestBed.get(TimetrackingService);
    assignmentService = TestBed.get(AssignmentService);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit] should get time sheet successfully', () => {
    const selectedTeam = { id: 1};
    const selectedManagerId = '2';
    const date = new Date();
    const params = {
      date: format(date, 'YYYY-MM-DD'),
      period: 'WEEK',
      managerId: selectedManagerId,
      teamId: selectedTeam.id,
      fullTeam: false,
    };
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        id: selectedTeam.id,
      },
      managerId: selectedManagerId,
    }));
    spyOn(dashboardService, 'getTeamDashboard').and.returnValue(of(TEAMS_MOCK));
    spyOn(timetrackingService, 'getTeamsTimesheet').and.returnValue(of(TEAM_TIMESHEET));
    fixture.detectChanges();
    expect(identityService.getTeamManagerGroupSelection).toHaveBeenCalledWith();
    expect(dashboardService.getTeamDashboard).toHaveBeenCalledWith(false, selectedManagerId, selectedTeam.id);
    expect(timetrackingService.getTeamsTimesheet).toHaveBeenCalledWith(params);
  });

  it('[ngOnInit] should get error while fetching team and manger selection', () => {
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(Observable.throw({ error: 'error' }));
    fixture.detectChanges();
    expect(identityService.getTeamManagerGroupSelection).toHaveBeenCalledWith();
    expect(component.error).toBe('Error loading selected team and manager.');
  });

  it('[ngOnInit] should get error while fetching team dashboard', () => {
    const selectedTeam = { id: 1};
    const selectedManagerId = '2';
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        id: selectedTeam.id,
      },
      managerId: selectedManagerId,
    }));
    spyOn(dashboardService, 'getTeamDashboard').and.returnValue(Observable.throw({ error: 'error' }));
    fixture.detectChanges();
    expect(identityService.getTeamManagerGroupSelection).toHaveBeenCalledWith();

    expect(dashboardService.getTeamDashboard).toHaveBeenCalledWith(false, selectedManagerId, selectedTeam.id);
    expect(component.error).toBe('Error fetching timesheet.');
  });

  it('[ngOnInit] should get server error with error text while fetching team dashboard', () => {
    const selectedTeam = { id: 1};
    const selectedManagerId = '2';
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        id: selectedTeam.id,
      },
      managerId: selectedManagerId,
    }));
    spyOn(dashboardService, 'getTeamDashboard').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    fixture.detectChanges();
    expect(identityService.getTeamManagerGroupSelection).toHaveBeenCalledWith();

    expect(dashboardService.getTeamDashboard).toHaveBeenCalledWith(false, selectedManagerId, selectedTeam.id);
    expect(component.error).toBe('error');
  });

  it('[ngOnInit] should get forbidden error with error text while fetching team dashboard', () => {
    const selectedTeam = { id: 1};
    const selectedManagerId = '2';
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        id: selectedTeam.id,
      },
      managerId: selectedManagerId,
    }));
    spyOn(dashboardService, 'getTeamDashboard').and.returnValue(Observable.throw({
      error: {
        errorCode: 403,
        type: 'type',
        httpStatus: 403,
        text: 'error',
      },
    }));
    fixture.detectChanges();
    expect(identityService.getTeamManagerGroupSelection).toHaveBeenCalledWith();

    expect(dashboardService.getTeamDashboard).toHaveBeenCalledWith(false, selectedManagerId, selectedTeam.id);
    expect(component.error).toBe('Time Sheet is not available for this team, please change team from team selector');
  });

  it('[ngOnInit] should get server error while fetching teams timesheet', () => {
    const selectedTeam = { id: 1};
    const selectedManagerId = '2';
    const date = new Date();
    const params = {
      date: format(date, 'YYYY-MM-DD'),
      period: 'WEEK',
      managerId: selectedManagerId,
      teamId: selectedTeam.id,
      fullTeam: false,
    };
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        id: selectedTeam.id,
      },
      managerId: selectedManagerId,
    }));
    spyOn(dashboardService, 'getTeamDashboard').and.returnValue(of(TEAMS_MOCK));
    spyOn(timetrackingService, 'getTeamsTimesheet').and.returnValue(Observable.throw({ error: 'error' }));
    fixture.detectChanges();
    expect(identityService.getTeamManagerGroupSelection).toHaveBeenCalledWith();

    expect(dashboardService.getTeamDashboard).toHaveBeenCalledWith(false, selectedManagerId, selectedTeam.id);
    expect(timetrackingService.getTeamsTimesheet).toHaveBeenCalledWith(params);
    expect(component.error).toBe('Error fetching timesheet.');
  });

  it('[ngOnInit] should get server error with error text while fetching teams timesheet', () => {
    const selectedTeam = { id: 1};
    const selectedManagerId = '2';
    const date = new Date();
    const params = {
      date: format(date, 'YYYY-MM-DD'),
      period: 'WEEK',
      managerId: selectedManagerId,
      teamId: selectedTeam.id,
      fullTeam: false,
    };
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        id: selectedTeam.id,
      },
      managerId: selectedManagerId,
    }));
    spyOn(dashboardService, 'getTeamDashboard').and.returnValue(of(TEAMS_MOCK));
    spyOn(timetrackingService, 'getTeamsTimesheet').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    fixture.detectChanges();
    expect(identityService.getTeamManagerGroupSelection).toHaveBeenCalledWith();

    expect(dashboardService.getTeamDashboard).toHaveBeenCalledWith(false, selectedManagerId, selectedTeam.id);
    expect(timetrackingService.getTeamsTimesheet).toHaveBeenCalledWith(params);
    expect(component.error).toBe('error');
  });

  it('should chnage date successfully', () => {
    const date = new Date();
    spyOn(component, 'getTeamTimesheet');
    component.onDateChange(date);
    expect(component.currentDate).toBe(date);
    expect(component.getTeamTimesheet).toHaveBeenCalledWith();
  });

  it('[showContractorModal] should get contractor assignemnt', () => {
    const item = Object.assign({
      assignmentId: 1,
    }, {}) as TrackingTimesheet;
    const assignemnt = Object.assign({
      manager: {},
      team: {
        id: 1,
      },
      candidate: {},
    }, {});
    spyOn(assignmentService, 'getContractorAssignment').and.returnValue(of(assignemnt));
    component.showContractorModal(item, {} as ElementRef, '');
    expect(assignmentService.getContractorAssignment).toHaveBeenCalled();
  });

  it('[showContractorModal] should get api error', () => {
    const item = Object.assign({
      assignmentId: 1,
    }, {}) as TrackingTimesheet;
    spyOn(assignmentService, 'getContractorAssignment').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    component.showContractorModal(item, {} as ElementRef, '');
    expect(component.error).toBe('error');
  });

  it('[showContractorModal] should get custom error', () => {
    const item = Object.assign({
      assignmentId: 1,
    }, {}) as TrackingTimesheet;
    spyOn(assignmentService, 'getContractorAssignment').and.returnValue(Observable.throw({}));
    component.showContractorModal(item, {} as ElementRef, '');
    expect(component.error).toBe('Error fetching contractor assignment.');
  });
});
