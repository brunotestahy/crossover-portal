import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DfGroupToggleItem } from '@devfactory/ngx-df';
import { format } from 'date-fns';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { CurrentUserDetail } from 'app/core/models/identity/current-user-detail.model';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { ASSIGNMENT_SIMPLE_MOCK } from 'app/core/services/mocks/assignment.mock';
import { CURRENT_USER_DETAILS } from 'app/core/services/mocks/current-user-details.mock';
import { TRACKING_TIMESHEET_MOCK } from 'app/core/services/mocks/tracking-timesheet.mock';
import { TimetrackingService } from 'app/core/services/timetracking/timetracking.service';
import { MyDashboardPageComponent } from 'app/modules/my-dashboard/pages/my-dashboard-page/my-dashboard-page.component';
import { UserDashboardService } from 'app/shared/services/user-dashboard/user-dashboard.service';

describe('MyDashboardPageComponent', () => {
  let component: MyDashboardPageComponent;
  let fixture: ComponentFixture<MyDashboardPageComponent>;

  let assignmentService: AssignmentService;
  let identityService: IdentityService;
  let dashboardService: UserDashboardService;
  let timetrackingService: TimetrackingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyDashboardPageComponent],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: AssignmentService, useFactory: () => mock(AssignmentService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: UserDashboardService, useFactory: () => mock(UserDashboardService) },
        { provide: TimetrackingService, useFactory: () => mock(TimetrackingService) },
        { provide: HttpClient, useFactory: () => mock(HttpClient) },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-04-11T03:24:00'));
    fixture = TestBed.createComponent(MyDashboardPageComponent);
    component = fixture.componentInstance;
    assignmentService = TestBed.get(AssignmentService);
    identityService = TestBed.get(IdentityService);
    dashboardService = TestBed.get(UserDashboardService);
    timetrackingService = TestBed.get(TimetrackingService);
    spyOn(dashboardService, 'updateDate');
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('[ngOnInit] should set data', () => {
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of(CURRENT_USER_DETAILS));
    spyOn(assignmentService, 'getAssignmentById').and.returnValue(of(ASSIGNMENT_SIMPLE_MOCK));
    spyOn(timetrackingService, 'getTimesheets').and.returnValue(of(TRACKING_TIMESHEET_MOCK));
    fixture.detectChanges();
    expect(component.assignment).toEqual(ASSIGNMENT_SIMPLE_MOCK);
    expect(component.timesheets.length).toEqual(4);
  });

  it('[ngOnInit] should set data as manager', () => {
    spyOn(assignmentService, 'getAssignmentById').and.returnValue(of(ASSIGNMENT_SIMPLE_MOCK));
    spyOn(timetrackingService, 'getTimesheets').and.returnValue(of(TRACKING_TIMESHEET_MOCK));
    component.managerControl = true;
    component.userDetail = Object.assign({
      id: 1,
    }, {}) as CurrentUserDetail;
    fixture.detectChanges();
    expect(component.userId).toEqual(1);
  });

  it('[ngOnInit] identity service throws error', () => {
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(Observable.throw({}));
    fixture.detectChanges();
    expect(component.error).toEqual('Error loading user detail');
  });

  it('[ngOnInit] no assignment', () => {
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of(CURRENT_USER_DETAILS));
    spyOn(assignmentService, 'getAssignmentById').and.returnValue(of(undefined));
    spyOn(timetrackingService, 'getTimesheets').and.returnValue(of({}));
    fixture.detectChanges();
    expect(timetrackingService.getTimesheets).not.toHaveBeenCalled();
  });

  it('[previousWeek] should switch week', () => {
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of(CURRENT_USER_DETAILS));
    spyOn(assignmentService, 'getAssignmentById').and.returnValue(of(ASSIGNMENT_SIMPLE_MOCK));
    spyOn(timetrackingService, 'getTimesheets').and.returnValue(of(TRACKING_TIMESHEET_MOCK));
    fixture.detectChanges();
    component.previousWeek();
    expect(format(component.dateControl.value, 'YYYY-MM-DD')).toEqual('2018-04-02');
    component.nextWeek();
    expect(format(component.dateControl.value, 'YYYY-MM-DD')).toEqual('2018-04-09');
  });

  it('[weekFormatFn] returns date range', () => {
    expect(component.weekFormatFn(new Date('2018-04-04T03:24:00'))).toEqual('Apr 02 - Apr 08, 2018');
  });

  it('[onToggleChange] should set period to weekly', () => {
    component.option = 'OTHER';
    component.onToggleChange({} as DfGroupToggleItem);
    expect(component.period).toBe('Weekly');
  });

  it('[onToggleChange] should set period to monthly', () => {
    component.option = 'Activity';
    component.onToggleChange({} as DfGroupToggleItem);
    expect(component.period).toBe('Daily');
  });

  it('[getItems] should return profile item', () => {
    component.includeProfile = true;
    expect(component.getItems().length).toBe(5);
  });
});
