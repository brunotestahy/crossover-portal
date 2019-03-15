import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfGroupToggle } from '@devfactory/ngx-df';
import * as moment from 'moment';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators';
import { mock } from 'ts-mockito';

import { CurrentUserDetail } from 'app/core/models/identity';
import { PlannedProductivityGroup, ProductivityGroup } from 'app/core/models/productivity';
import { IdentityService } from 'app/core/services/identity/identity.service';
import {
  ACTIVITY_MOCK_DAILY,
  ACTIVITY_MOCK_WEEKLY,
  PLANNED_ACTIVITY_MOCK,
} from 'app/core/services/mocks/activity.mock';
import { CURRENT_USER_DETAIL_MOCK } from 'app/core/services/mocks/current-user-detail.mock';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import { MyActivityPageComponent } from 'app/modules/my-dashboard/pages/my-activity-page/my-activity-page.component';
import { UserDashboardService } from 'app/shared/services/user-dashboard/user-dashboard.service';

describe('MyActivityPageComponent', () => {
  let component: MyActivityPageComponent;
  let fixture: ComponentFixture<MyActivityPageComponent>;

  let dashboardService: UserDashboardService;
  let identityService: IdentityService;
  let productivityService: ProductivityService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyActivityPageComponent,
      ],
      providers: [
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: ProductivityService, useFactory: () => mock(ProductivityService) },
        Renderer2,
        { provide: UserDashboardService, useFactory: () => mock(UserDashboardService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyActivityPageComponent);
    component = fixture.componentInstance;

    dashboardService = TestBed.get(UserDashboardService);
    identityService = TestBed.get(IdentityService);
    productivityService = TestBed.get(ProductivityService);
    component.assignmentId = 1;
    component.teamId = 1;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the current user detail and its daily activities when the page is loaded in Daily mode', () => {
    const date: Date = moment().toDate();
    const userDetail: CurrentUserDetail = CURRENT_USER_DETAIL_MOCK;
    const dailyActivities: ProductivityGroup[] = Object.assign(ACTIVITY_MOCK_DAILY);
    const dailyPlannedActivities: PlannedProductivityGroup = Object.assign(PLANNED_ACTIVITY_MOCK);
    const weeklyActivities: ProductivityGroup[] = Object.assign(ACTIVITY_MOCK_WEEKLY);

    userDetail.assignment = Object.assign({ id: 11, manager: { location: { timeZone: { offset: 180 } } }, team: { id: 13 } });

    spyOn(dashboardService, 'getDateStream').and.returnValue(of(date).pipe(take(1)));
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of(userDetail).pipe(take(1)));
    spyOn(productivityService, 'getDailyActivity').and.returnValue(of(dailyActivities).pipe(take(1)));
    spyOn(productivityService, 'getWeeklyActivity').and.returnValue(of(weeklyActivities).pipe(take(1)));
    spyOn(productivityService, 'getDailyPlanned').and.returnValue(of(dailyPlannedActivities).pipe(take(1)));
    spyOn(component, 'setManagerTimezoneOffset');

    fixture.detectChanges();

    expect(component.displayToggle).toBe(component.displayModeItems[0]);
    expect(component.dailyActivity).toBe(dailyActivities[0]);
    expect(component.setManagerTimezoneOffset).toHaveBeenCalled();
  });

  it('should fetch the current user detail and its weekly activities when the page is loaded in Weekly mode', () => {
    const date: Date = moment().toDate();
    const userDetail: CurrentUserDetail = CURRENT_USER_DETAIL_MOCK;
    const dailyActivities: ProductivityGroup[] = Object.assign(ACTIVITY_MOCK_DAILY);
    const dailyPlannedActivities: PlannedProductivityGroup = Object.assign(PLANNED_ACTIVITY_MOCK);
    const weeklyActivities: ProductivityGroup[] = Object.assign(ACTIVITY_MOCK_WEEKLY);
    component.period = component.buttonLabels.WEEKLY;

    dailyPlannedActivities.daySlots.push(Object.assign({}));
    dailyPlannedActivities.groupedList = Object.assign([]);
    userDetail.assignment = Object.assign({ id: 11, manager: { location: { timeZone: null } }, team: { id: 13 } });

    spyOn(dashboardService, 'getDateStream').and.returnValue(of(date).pipe(take(1)));
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of(userDetail).pipe(take(1)));
    spyOn(productivityService, 'getDailyActivity').and.returnValue(of(dailyActivities).pipe(take(1)));
    spyOn(productivityService, 'getWeeklyActivity').and.returnValue(of(weeklyActivities).pipe(take(1)));
    spyOn(productivityService, 'getDailyPlanned').and.returnValue(of(dailyPlannedActivities).pipe(take(1)));
    spyOn(component, 'setManagerTimezoneOffset');

    fixture.detectChanges();

    expect(component.displayToggle).toBe(component.displayModeItems[0]);
    expect(component.weeklyActivity).toBe(weeklyActivities[0]);
    expect(component.setManagerTimezoneOffset).toHaveBeenCalled();
  });

  it('should fetch empty weekly advanced groups when the page is loaded in Weekly mode', () => {
    const date: Date = moment().toDate();
    const userDetail: CurrentUserDetail = CURRENT_USER_DETAIL_MOCK;
    const dailyActivities: ProductivityGroup[] = Object.assign(ACTIVITY_MOCK_DAILY);
    const dailyPlannedActivities: PlannedProductivityGroup = Object.assign(PLANNED_ACTIVITY_MOCK);
    const weeklyActivities: ProductivityGroup[] = Object.assign(ACTIVITY_MOCK_WEEKLY);
    component.period = component.buttonLabels.WEEKLY;

    dailyPlannedActivities.daySlots.push(Object.assign({}));
    dailyPlannedActivities.groupedList = Object.assign([]);
    dailyActivities[0].grouping.advancedGroups = Object.assign([]);
    weeklyActivities[0].grouping.advancedGroups = Object.assign([]);
    userDetail.assignment = Object.assign({ id: 11, manager: { location: { timeZone: null } }, team: { id: 13 } });

    spyOn(dashboardService, 'getDateStream').and.returnValue(of(date).pipe(take(1)));
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of(userDetail).pipe(take(1)));
    spyOn(productivityService, 'getDailyActivity').and.returnValue(of(dailyActivities).pipe(take(1)));
    spyOn(productivityService, 'getWeeklyActivity').and.returnValue(of(weeklyActivities).pipe(take(1)));
    spyOn(productivityService, 'getDailyPlanned').and.returnValue(of(dailyPlannedActivities).pipe(take(1)));
    spyOn(component, 'setManagerTimezoneOffset');

    fixture.detectChanges();

    expect(component.displayToggle).toBe(component.displayModeItems[0]);
    expect(component.weeklyActivity).toBe(weeklyActivities[0]);
    expect(component.setManagerTimezoneOffset).toHaveBeenCalled();
  });

  it('should fetch empty daily activities when the page is loaded in Weekly mode', () => {
    const date: Date = moment().toDate();
    const userDetail: CurrentUserDetail = CURRENT_USER_DETAIL_MOCK;
    const dailyActivities: ProductivityGroup[] = Object.assign([]);
    const dailyPlannedActivities: PlannedProductivityGroup = Object.assign(PLANNED_ACTIVITY_MOCK);
    const weeklyActivities: ProductivityGroup[] = Object.assign(ACTIVITY_MOCK_WEEKLY);
    component.period = component.buttonLabels.WEEKLY;
    component.timePov = component.timeZoneLabels.MANAGER_LABEL;
    dailyPlannedActivities.daySlots.push(Object.assign({}));
    dailyPlannedActivities.groupedList = Object.assign([]);
    weeklyActivities[0].grouping.advancedGroups = Object.assign([]);
    userDetail.assignment = Object.assign({ id: 11, manager: { location: { timeZone: null } }, team: { id: 13 } });

    spyOn(dashboardService, 'getDateStream').and.returnValue(of(date).pipe(take(1)));
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of(userDetail).pipe(take(1)));
    spyOn(productivityService, 'getDailyActivity').and.returnValue(of(dailyActivities).pipe(take(1)));
    spyOn(productivityService, 'getWeeklyActivity').and.returnValue(of(weeklyActivities).pipe(take(1)));
    spyOn(productivityService, 'getDailyPlanned').and.returnValue(of(dailyPlannedActivities).pipe(take(1)));
    spyOn(component, 'setManagerTimezoneOffset');

    fixture.detectChanges();

    expect(component.displayToggle).toBe(component.displayModeItems[0]);
    expect(component.weeklyActivity).toBe(weeklyActivities[0]);
    expect(component.setManagerTimezoneOffset).toHaveBeenCalled();
  });

  it('should set the planned Time Bar scroll to the left when the planned Time slots view is enabled', () => {
    spyOn(document, 'getElementById').and.returnValue({ scrollLeft: true });

    component.setPlannedTimeBarScroll();

    expect(document.getElementById).toHaveBeenCalledWith('timeSlotsBar');
    expect(document.getElementById).toHaveBeenCalledWith('plannedTimeSlotsBar');
  });

  it('should not set the planned Time Bar scroll to the left when there are not Time bar elements', () => {
    spyOn(document, 'getElementById').and.returnValue(null);

    component.setPlannedTimeBarScroll();

    expect(document.getElementById).toHaveBeenCalledWith('timeSlotsBar');
    expect(document.getElementById).toHaveBeenCalledWith('plannedTimeSlotsBar');
  });

  it('should set the Time Bar scroll to the left when the Time slots view is enabled', () => {
    spyOn(document, 'getElementById').and.returnValue({ scrollLeft: true });

    component.setTimeBarScroll();

    expect(document.getElementById).toHaveBeenCalledWith('timeSlotsBar');
    expect(document.getElementById).toHaveBeenCalledWith('plannedTimeSlotsBar');
  });

  it('should not set the Time Bar scroll to the left when there are not Time bar elements', () => {
    spyOn(document, 'getElementById').and.returnValue(null);

    component.setTimeBarScroll();

    expect(document.getElementById).toHaveBeenCalledWith('timeSlotsBar');
    expect(document.getElementById).toHaveBeenCalledWith('plannedTimeSlotsBar');
  });

  it('should get the slot background color when it is available', () => {
    const slot = Object.assign({ color: 'blue' });

    expect(component.getSlotColor(slot)).toBe(slot.color);
  });

  it('should get the white background color when slot background color is not available', () => {
    const slot = Object.assign({});

    expect(component.getSlotColor(slot)).toBe('white');
  });

  it('should change to Percentage view when the respective button is clicked', () => {
    const event = { text: 'Percentage' };
    component.displayModeItems[1].disabled = true;

    component.onDisplayModeToggleChange(event);

    expect(component.displayMode).toBe(event);
    expect(component.displayModeItems[1].disabled).toBe(false);
  });

  it('should change to Time view when the respective button is clicked', () => {
    const event = { text: 'Time' };
    component.displayModeItems[1].disabled = true;

    component.onDisplayModeToggleChange(event);

    expect(component.displayMode).toBe(event);
    expect(component.displayModeItems[1].disabled).toBe(true);
  });

  it('should listen the Manager mouse over event', () => {
    const event = component.timeZoneLabels.CONTRACTOR_LABEL;
    component.managerOffset = -180;
    spyOn(component, 'shiftTimeSlots').and.callThrough();
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    spyOn(document, 'querySelectorAll').and.returnValue([div1, div2]);
    spyOn(document, 'querySelector').and.returnValue(div2);

    component.onManagerToggleChange(event);


    div1.dispatchEvent(new Event('mouseover'));

    expect(component.shiftTimeSlots).not.toHaveBeenCalledWith();
  });

  it('should listen the Contractor mouse over event', () => {
    component.timePov = '';
    component.managerOffset = -180;
    spyOn(component, 'shiftTimeSlots').and.callThrough();
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    spyOn(document, 'querySelectorAll').and.returnValue([div1, div2]);
    spyOn(document, 'querySelector').and.returnValue(div2);

    component.listenTimeZoneTooltips();


    div2.dispatchEvent(new Event('mouseover'));

    expect(component.shiftTimeSlots).not.toHaveBeenCalledWith();
  });

  it('should leave the timezone offset as a negative value when Manager Time button is clicked', () => {
    const event = component.timeZoneLabels.MANAGER_LABEL;
    component.managerOffset = -180;
    spyOn(component, 'shiftTimeSlots').and.callThrough();

    component.onManagerToggleChange(event);

    expect(component.shiftTimeSlots).toHaveBeenCalledWith(component.managerOffset);
  });

  it('should leave the timezone offset as a positive value when Manager Time button is clicked', () => {
    const event = component.timeZoneLabels.MANAGER_LABEL;
    component.managerOffset = 180;
    spyOn(component, 'shiftTimeSlots').and.callThrough();

    component.onManagerToggleChange(event);

    expect(component.shiftTimeSlots).toHaveBeenCalledWith(component.managerOffset);
  });

  it('should enable the Time button when the Daily button is clicked', () => {
    const event = component.buttonLabels.DAILY;
    component.displayModeItems[1].disabled = true;

    component.onPeriodToggleChange(event);

    expect(component.displayModeItems[1].disabled).toBe(false);
  });

  it('should disable the Time button when the Weekly button is clicked in the Percentage view', () => {
    const event = component.buttonLabels.WEEKLY;
    component.displayModeItems[1].disabled = false;

    component.onPeriodToggleChange(event);

    expect(component.displayModeItems[1].disabled).toBe(true);
  });

  it('should disable the Time button and change to Percentage view when the Weekly button is clicked in the Time view', () => {
    const event = component.buttonLabels.WEEKLY;
    component.displayToggle.text = 'Time';
    component.displayModeItems[1].disabled = false;
    component.displayModeElement = Object.assign({
      selectItem: () => { },
    }) as DfGroupToggle;
    spyOn(component.displayModeElement, 'selectItem').and.returnValue({});

    component.onPeriodToggleChange(event);

    expect(component.displayModeItems[1].disabled).toBe(true);
    expect(component.displayModeElement.selectItem).toHaveBeenCalledWith(component.displayModeItems[0]);
  });

  it('should show the intersected planned activities when the time slot has a section name', () => {
    const timeSlot = Object.assign({ plannedSectionName: 'title' });

    expect(component.activityIntersectsWithPlanned(timeSlot)).toBe(true);
  });

  it('should return the section background color  when it is provided', () => {
    const section = Object.assign({ color: 'white' });

    expect(component.getElementBackground(section)).toBe('white');
  });

  it('should show the total time label as day when the is in Daily mode', () => {
    component.period = component.buttonLabels.DAILY;

    expect(component.totalTimeLabel).toBe('day');
  });

  it('should show the total time label as week when the is in Weekly mode', () => {
    component.period = component.buttonLabels.WEEKLY;

    expect(component.totalTimeLabel).toBe('week');
  });

  it('should show the spent time for Manager plan five times the spent time when the view is in Weekly mode', () => {
    component.period = component.buttonLabels.WEEKLY;
    const spentTime = 10;

    expect(component.showSpentTimeForManagerPlan(spentTime)).toBe(spentTime * 5);
  });

  it('should show the own spent time for Manager plan when the view is in Daily mode', () => {
    component.period = component.buttonLabels.DAILY;
    const spentTime = 10;

    expect(component.showSpentTimeForManagerPlan(spentTime)).toBe(spentTime);
  });

  it('should show the spent time in hours and minutes when the spent time is provided only in minutes', () => {
    const spentTime = 350;

    expect(component.showSpentTimeInHoursFormat(spentTime)).toBe('5h 50m');
  });
});
