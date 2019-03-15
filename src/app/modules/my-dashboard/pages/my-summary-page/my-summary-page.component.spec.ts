import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { mock } from 'ts-mockito';

import { IdentityService } from 'app/core/services/identity/identity.service';
import { CURRENT_USER_DETAILS } from 'app/core/services/mocks/current-user-details.mock';
import { PRODUCTIVITY_MOCK } from 'app/core/services/mocks/productivity.mock';
import { TRACKING_TIMESHEET_MOCK } from 'app/core/services/mocks/tracking-timesheet.mock';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import { TimetrackingService } from 'app/core/services/timetracking/timetracking.service';
import { MySummaryPageComponent } from 'app/modules/my-dashboard/pages/my-summary-page/my-summary-page.component';
import { EducationFormComponent } from 'app/shared/components/education-form/education-form.component';
import { UserDashboardService } from 'app/shared/services/user-dashboard/user-dashboard.service';

describe('MySummaryPageComponent', () => {
  let component: MySummaryPageComponent;
  let fixture: ComponentFixture<MySummaryPageComponent>;

  let productivityService: ProductivityService;
  let identityService: IdentityService;
  let dashboardService: UserDashboardService;
  let timetrackingService: TimetrackingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MySummaryPageComponent, EducationFormComponent],
      providers: [
        { provide: ProductivityService, useFactory: () => mock(ProductivityService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: UserDashboardService, useFactory: () => mock(UserDashboardService) },
        { provide: TimetrackingService, useFactory: () => mock(TimetrackingService) },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-04-23T03:24:00'));
    fixture = TestBed.createComponent(MySummaryPageComponent);
    component = fixture.componentInstance;
    productivityService = TestBed.get(ProductivityService);
    identityService = TestBed.get(IdentityService);
    dashboardService = TestBed.get(UserDashboardService);
    timetrackingService = TestBed.get(TimetrackingService);
    spyOn(dashboardService, 'getDateStream').and.returnValue(of(new Date()));
    component.assignmentId = 1;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit] should set data when minutes not divisible by 60', () => {
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of(CURRENT_USER_DETAILS));
    spyOn(productivityService, 'getProductivityGroups').and.returnValue(of(PRODUCTIVITY_MOCK));
    spyOn(timetrackingService, 'getTimesheets').and.returnValue(of(TRACKING_TIMESHEET_MOCK.slice(0)));
    fixture.detectChanges();
    expect(component.weeklyTimesheets[0].printableTime).toEqual('8 hours 20 minutes');
  });

  it('[ngOnInit] should set data when minutes divisible by 60', () => {
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of(CURRENT_USER_DETAILS));
    spyOn(productivityService, 'getProductivityGroups').and.returnValue(of(PRODUCTIVITY_MOCK));
    spyOn(timetrackingService, 'getTimesheets').and.returnValue(of(TRACKING_TIMESHEET_MOCK.slice(1)));
    fixture.detectChanges();
    expect(component.weeklyTimesheets[0].printableTime).toEqual('40 hours ');
  });

});
