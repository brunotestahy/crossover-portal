import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfExportXLSXService, DfModalService } from '@devfactory/ngx-df';
import { addDays, addWeeks, subDays, subWeeks } from 'date-fns';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { take } from 'rxjs/operators';
import { mock } from 'ts-mockito';

import { CurrentUserDetail } from 'app/core/models/identity';
import { Activity, PlannedProductivityGroup, ProductivityGroup } from 'app/core/models/productivity';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import {
ACTIVITY_MOCK_DAILY,
ACTIVITY_MOCK_WEEKLY,
PLANNED_ACTIVITY_MOCK,
} from 'app/core/services/mocks/activity.mock';
import { CURRENT_USER_DETAIL_MOCK } from 'app/core/services/mocks/current-user-detail.mock';
import { ASSIGNMENT_MOCK } from 'app/core/services/mocks/productivity.mock';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import { TeamActivitiesComponent } from 'app/modules/contractor/pages/team-activities/team-activities.component';

describe('TeamActivitiesComponent', () => {
  let component: TeamActivitiesComponent;
  let fixture: ComponentFixture<TeamActivitiesComponent>;

  let assignmentService: AssignmentService;
  let exportService: DfExportXLSXService;
  let identityService: IdentityService;
  let modalService: DfModalService;
  let productivityService: ProductivityService;

  let userDetail: CurrentUserDetail;
  let activities: Activity[];
  let dailyActivities: ProductivityGroup[];
  let dailyPlannedActivities: PlannedProductivityGroup;
  let weeklyActivities: ProductivityGroup[];
  let spyUserDetail: jasmine.Spy;
  let spyTeamManager: jasmine.Spy;
  let spyDailyTeamAct: jasmine.Spy;
  let spyWeeklyTeamAct: jasmine.Spy;
  let spyDailyPlannedAct: jasmine.Spy;
  let spyActivities: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TeamActivitiesComponent,
      ],
      providers: [
        { provide: AssignmentService, useFactory: () => mock(AssignmentService) },
        { provide: DfExportXLSXService, useFactory: () => mock(DfExportXLSXService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        { provide: ProductivityService, useFactory: () => mock(ProductivityService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamActivitiesComponent);
    component = fixture.componentInstance;

    assignmentService = TestBed.get(AssignmentService);
    exportService = TestBed.get(DfExportXLSXService);
    identityService = TestBed.get(IdentityService);
    modalService = TestBed.get(DfModalService);
    productivityService = TestBed.get(ProductivityService);

    userDetail = Object.assign(CURRENT_USER_DETAIL_MOCK);
    userDetail.assignment = Object.assign({ id: 13, team: { id: 11 } });
    userDetail.managerAvatar = Object.assign({ id: 13 });
    activities = Object.assign(PLANNED_ACTIVITY_MOCK.groupedList.map(group => Object.assign(group).activity));
    dailyActivities = Object.assign(ACTIVITY_MOCK_DAILY);
    dailyActivities[0].assignment = Object.assign(ASSIGNMENT_MOCK.content[0]);
    dailyActivities[1].assignment = Object.assign(ASSIGNMENT_MOCK.content[0]);
    dailyActivities[2].assignment = Object.assign(ASSIGNMENT_MOCK.content[0]);
    dailyActivities[2].assignment.candidate.printableName = '';
    dailyPlannedActivities = Object.assign(PLANNED_ACTIVITY_MOCK);
    dailyPlannedActivities.daySlots.push({
      'id': 619579,
      'activity': Object.assign({ value: null }).value,
      'startTime': '2017-10-02T08:20:00.000+0000',
      'endTime': '2017-10-02T08:30:00.000+0000',
      'actTimeLong': 10,
    });
    weeklyActivities = Object.assign(ACTIVITY_MOCK_WEEKLY);
    weeklyActivities[0].assignment = Object.assign(ASSIGNMENT_MOCK.content[0]);
    spyTeamManager = spyOn(identityService, 'getTeamManagerGroupSelection')
      .and.returnValue(of({ managerId: 1, team: { id: 1 } }));
    spyUserDetail = spyOn(identityService, 'getCurrentUserDetail')
      .and.returnValue(of(userDetail).pipe(take(1)));
    spyDailyTeamAct = spyOn(productivityService, 'getDailyActivity')
      .and.returnValue(of(dailyActivities).pipe(take(1)));
    spyWeeklyTeamAct = spyOn(productivityService, 'getWeeklyActivity')
      .and.returnValue(of(weeklyActivities).pipe(take(1)));
    spyDailyPlannedAct = spyOn(productivityService, 'getDailyPlanned')
      .and.returnValue(of(dailyPlannedActivities).pipe(take(1)));
    spyActivities = spyOn(productivityService, 'getActivities').and.returnValue(of(activities).pipe(take(1)));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should place the tooltip in the top when the section percentage has more than 50%', () => {
    component.periodMode = component.DAILY;
    const sections = Object.assign([{ percentageRounded: 60, spentTime: 350 }, {}]);
    const index = 2;

    expect(component.getTooltipPlacement(sections, index)).toBe('top');
  });

  it('should place the tooltip in the bottom when the section percentage has less than 50%', () => {
    const sections = Object.assign([{ percentageRounded: 40 }]);
    const index = 1;

    expect(component.getTooltipPlacement(sections, index)).toBe('bottom');
  });

  it('should load the current user and the team activity when the page is loaded - Table - Daily', () => {
    component.viewMode = component.viewModeItems[1];
    component.periodMode = component.DAILY;
    fixture.detectChanges();

    expect(component.dailyActivities).toBeDefined();
    expect(component.groups).toBeDefined();
    expect(component.timeSlotsGrid.length).toBe(144);
    expect(component.timeSlotsHeaders.length).toBe(24);
    expect(component.isLoading).toBe(false);
    if (userDetail.location.timeZone) {
      expect(component.managerOffset).toBe(userDetail.location.timeZone.offset);
    }
  });

  it('should not load the activities when the team manager is not defined', () => {
    component.viewMode = component.viewModeItems[1];
    spyTeamManager.and.returnValue(of({ managerId: 1, team: null }));
    fixture.detectChanges();

    expect(component.dailyActivities).not.toBeDefined();
    expect(component.groups).not.toBeDefined();
  });

  it('should load the current user and the team activity when the page is loaded - Percentage - Daily', () => {
    component.viewMode = component.viewModeItems[1];
    component.periodMode = component.DAILY;
    spyTeamManager.and.returnValue(of({ managerId: 1, team: { id: 3 } }));
    fixture.detectChanges();

    expect(component.dailyActivities).toBeDefined();
    expect(component.groups).toBeDefined();
    expect(component.timeSlotsGrid.length).toBe(144);
    expect(component.timeSlotsHeaders.length).toBe(24);
    expect(component.isLoading).toBe(false);
    if (userDetail.location.timeZone) {
      expect(component.managerOffset).toBe(userDetail.location.timeZone.offset);
    }
  });

  it('should load the current user and the team activity when the page is loaded - Time - Daily', () => {
    component.viewMode = component.viewModeItems[1];
    component.percentageTimeMode = component.TIME;
    component.periodMode = component.DAILY;
    spyTeamManager.and.returnValue(of({ managerId: 1, team: { id: 3 } }));
    fixture.detectChanges();

    expect(component.dailyActivities).toBeDefined();
    expect(component.groups).toBeDefined();
    expect(component.timeSlotsGrid.length).toBe(144);
    expect(component.timeSlotsHeaders.length).toBe(24);
    expect(component.isLoading).toBe(false);
    if (userDetail.location.timeZone) {
      expect(component.managerOffset).toBe(userDetail.location.timeZone.offset);
    }
  });

  it('should load the current user and the team activity when the page is loaded - Table - All Reports Team', () => {
    component.viewMode = component.viewModeItems[1];
    component.periodMode = component.DAILY;
    spyTeamManager.and.returnValue(of({ managerId: 1, team: { id: -1 } }));
    fixture.detectChanges();

    expect(component.dailyActivities).toBeDefined();
    expect(component.groups).toBeDefined();
    expect(component.timeSlotsGrid.length).toBe(144);
    expect(component.timeSlotsHeaders.length).toBe(24);
    expect(component.isLoading).toBe(false);
    if (userDetail.location.timeZone) {
      expect(component.managerOffset).toBe(userDetail.location.timeZone.offset);
    }
  });

  it('should load the current user and the team activity when the page is loaded - Time - Weekly', () => {
    component.viewMode = component.viewModeItems[1];
    component.percentageTimeMode = component.TIME;
    component.periodMode = component.WEEKLY;
    spyTeamManager.and.returnValue(of({ managerId: 1, team: { id: null } }));
    fixture.detectChanges();

    expect(component.dailyActivities).toBeDefined();
    expect(component.groups).toBeDefined();
    expect(component.timeSlotsGrid.length).toBe(144);
    expect(component.timeSlotsHeaders.length).toBe(24);
    expect(component.isLoading).toBe(false);
    if (userDetail.location.timeZone) {
      expect(component.managerOffset).toBe(userDetail.location.timeZone.offset);
    }
  });

  it('should load the current user and the team activity when the page is loaded - Chart - Percentage', () => {
    component.viewMode = component.viewModeItems[0];
    fixture.detectChanges();

    component.dateControlDaily.setValue(new Date());
    component.dateControlWeekly.setValue(new Date());

    expect(component.dailyActivities).toBeDefined();
    expect(component.groups).toBeDefined();
    expect(component.timeSlotsGrid.length).toBe(144);
    expect(component.timeSlotsHeaders.length).toBe(24);
    expect(component.isLoading).toBe(false);
    if (userDetail.location.timeZone) {
      expect(component.managerOffset).toBe(userDetail.location.timeZone.offset);
    }
  });

  it('should load the current user and the team activity when the page is loaded - Chart - Time', () => {
    component.percentageTimeMode = component.TIME;
    component.periodMode = component.DAILY;
    component.viewMode = component.viewModeItems[0];
    fixture.detectChanges();

    component.dailyTimeControl.patchValue(component.MANAGER);

    expect(component.dailyActivities).toBeDefined();
    expect(component.groups).toBeDefined();
    expect(component.timeSlotsGrid.length).toBe(144);
    expect(component.timeSlotsHeaders.length).toBe(24);
    expect(component.isLoading).toBe(false);
    if (userDetail.location.timeZone) {
      expect(component.managerOffset).toBe(userDetail.location.timeZone.offset);
    }
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
    spyUserDetail.and.returnValue(ErrorObservable.create(negativeResponse));

    fixture.detectChanges();

    expect(component.dailyActivities).not.toBeDefined();
    expect(component.groups).not.toBeDefined();
    expect(component.isLoading).toBe(false);
    expect(component.error).toBe(negativeResponse.error.text);
  });

  it('should throw a general error when the current user is loaded', () => {
    const negativeResponse = { error: {} };
    spyUserDetail.and.returnValue(ErrorObservable.create(negativeResponse));

    fixture.detectChanges();

    expect(component.dailyActivities).not.toBeDefined();
    expect(component.groups).not.toBeDefined();
    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('Error trying to load the current user.');
  });

  it('should throw an API error when the activities are loaded', () => {
    const negativeResponse = {
      error: {
        errorCode: 'CROS-0027',
        httpStatus: 400,
        type: 'ERROR',
        text: 'Sample error text',
      },
    };
    spyActivities.and.returnValue(ErrorObservable.create(negativeResponse));
    spyDailyPlannedAct.and.returnValue(ErrorObservable.create(negativeResponse));
    spyDailyTeamAct.and.returnValue(ErrorObservable.create(negativeResponse));
    spyWeeklyTeamAct.and.returnValue(ErrorObservable.create(negativeResponse));

    fixture.detectChanges();

    expect(component.dailyActivities).not.toBeDefined();
    expect(component.groups).not.toBeDefined();
    expect(component.isLoading).toBe(false);
    expect(component.error).toBe(negativeResponse.error.text);
  });

  it('should throw a general error when the activities are loaded', () => {
    const negativeResponse = { error: {} };
    spyActivities.and.returnValue(ErrorObservable.create(negativeResponse));

    fixture.detectChanges();

    expect(component.dailyActivities).not.toBeDefined();
    expect(component.groups).not.toBeDefined();
    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('Error trying to load the team activities.');
  });

  it('should update the activities when the refresh button is clicked', () => {
    component.updateActivitiesBtn.frequency = 0.1;
    spyOn(component, 'refresh').and.returnValue('');

    component.update();

    expect(component.updateActivitiesBtn.isDisabled).toBe(true);
    expect(component.refresh).toHaveBeenCalledWith();
    component.updateActivitiesBtn.observableTimer.subscribe(() => {
      expect(component.updateActivitiesBtn.isDisabled).toBe(false);
    });
  });

  it('should show a message in the tooltip when the refresh button is disabled', () => {
    component.updateActivitiesBtn.isDisabled = true;

    expect(component.formatLastUpdateDate).toContain('You can refresh again in 10 minutes');
  });

  it('should export the CSV file when the Table is in Percentage view', () => {
    component.viewMode = component.viewModeItems[1];
    component.periodMode = component.DAILY;
    component.currentTeam = Object.assign({ name: 'All' });
    component.teamPercentageTableGrid = Object.assign({
      exportFilename: '',
      exportCSV: () => {},
    });
    spyOn(component.teamPercentageTableGrid, 'exportCSV').and.returnValue('');

    component.downloadCSV();

    expect(component.teamPercentageTableGrid.exportFilename).toContain('Productivity Report All - Day-Table');
    expect(component.teamPercentageTableGrid.exportCSV).toHaveBeenCalledWith();
  });

  it('should export the CSV file when the Table is in Time view', () => {
    component.viewMode = component.viewModeItems[1];
    component.currentTeam = Object.assign({ name: 'All' });
    component.teamTimeTableGrid = Object.assign({
      exportFilename: '',
      exportCSV: () => {},
    });
    component.periodMode = 'Weekly';
    component.percentageTimeMode = 'Time';
    spyOn(component.teamTimeTableGrid, 'exportCSV').and.returnValue('');

    component.downloadCSV();

    expect(component.teamTimeTableGrid.exportFilename).toContain('Productivity Report All - Week-Table');
    expect(component.teamTimeTableGrid.exportCSV).toHaveBeenCalledWith();
  });

  it('should export the CSV file when the Chart is in Percentage view', () => {
    component.viewMode = component.viewModeItems[0];
    component.currentTeam = Object.assign({ name: 'All' });
    component.periodMode = 'Weekly';
    spyOn(exportService, 'exportToExcel').and.returnValue('');

    component.downloadCSV();

    expect(exportService.exportToExcel).toHaveBeenCalled();
  });

  it('should export the CSV file when the Chart is in Time view', () => {
    component.viewMode = component.viewModeItems[0];
    component.currentTeam = Object.assign({ name: 'All' });
    component.periodMode = 'Daily';
    component.percentageTimeMode = 'Time';
    spyOn(exportService, 'exportToExcel').and.returnValue('');

    component.downloadCSV();

    expect(exportService.exportToExcel).toHaveBeenCalled();
  });

  it('should get the timezone difference between the contractor and the manager when the chart is loaded', () => {
    const candidate = Object.assign({ location: { timeZone: { offset: 19800000 } } });
    component.managerOffset = 10800000;

    expect(component.getTimezoneOffsetText(candidate)).toBe('2.5h ahead you');

    candidate.location.timeZone.offset = -25200000;

    expect(component.getTimezoneOffsetText(candidate)).toBe('10h behind you');
  });

  it('should get the empty timezone when there is not a provided contractor', () => {
    const candidate = Object.assign({ location: {} });
    component.managerOffset = 10800000;

    expect(component.getTimezoneOffsetText(candidate)).toBe('');
  });

  it('should get the slot height correctly when the Time screen is loaded in Daily view', () => {
    component.periodMode = component.DAILY;
    expect(component.getSlotHeightPercentage(48)).toBe('10%');
  });

  it('should get the slot height correctly when the Time screen is loaded in Weekly view', () => {
    component.periodMode = component.WEEKLY;
    expect(component.getSlotHeightPercentage(4000)).toBe('100%');
  });

  it('should get the empty height when the slot does not have a spent time', () => {
    expect(component.getSlotHeightPercentage(0)).toBe('');
  });

  it('should set the correct border color when the activity has its own color', () => {
    component.teamActivities = Object.assign([{ name: 'Distraction', color: 'red' }]);

    expect(component.getCellBorderColor('Distraction')).toBe('red');
  });

  it('should set the white border color when the activity has not its own color', () => {
    component.teamActivities = Object.assign([{ name: 'Distraction', color: 'red' }]);

    expect(component.getCellBorderColor('Development')).toBeUndefined();
  });

  it('should switch the screen from Percentage to Time view when the Time link is clicked in the Chart mode', () => {
    component.percentageTimeMode = component.PERCENTAGE;

    component.switchToTimeMode();

    expect(component.percentageTimeMode).toBe(component.TIME);
  });

  it('should build the Time Chart screen when the Contractor option is selected', () => {
    component.dailyActivities = dailyActivities;
    component.onManagerToggleChange(component.CONTRACTOR);

    expect(component.timeSlotsPerContractor.length).toBeGreaterThan(0);
  });

  it('should get the time slot color or white when the Time Chart is loaded', () => {
    expect(component.getSlotColor(Object.assign({ color: 'blue' }))).toBe('blue');
    expect(component.getSlotColor(Object.assign({}))).toBe('white');
  });

  it('should get success score class when the score is greater or equal to 70', () => {
    expect(component.getScoreClass(90)).toBe('score-success');
  });

  it('should get warning score class when the score is greater or equal to 30 and smaller than 70', () => {
    expect(component.getScoreClass(45)).toBe('score-warning');
  });

  it('should get danger score class when the score is smaller than 30', () => {
    expect(component.getScoreClass(15)).toBe('score-danger');
  });

  it('should get success class name when the score is greater or equal to 70', () => {
    expect(component.getTheme(90)).toBe('success');
  });

  it('should get warning class name when the score is smaller than 70', () => {
    expect(component.getTheme(45)).toBe('warning');
  });

  it('should get danger class name when the score is smaller than 30', () => {
    expect(component.getTheme(15)).toBe('danger');
  });

  it('should change the date picker to the previous day when the previous button is clicked in Daily view', () => {
    const testDate = new Date();
    component.dateControlDaily.patchValue(testDate);
    spyOn(component.dateControlDaily, 'setValue').and.returnValue('');

    component.previousDay();

    expect(component.dateControlDaily.setValue).toHaveBeenCalledWith(subDays(testDate, 1));
  });

  it('should change the date picker to the next day when the next button is clicked in Daily view', () => {
    const testDate = new Date();
    component.dateControlDaily.patchValue(testDate);
    spyOn(component.dateControlDaily, 'setValue').and.returnValue('');

    component.nextDay();

    expect(component.dateControlDaily.setValue).toHaveBeenCalledWith(addDays(testDate, 1));
  });

  it('should change the date picker to the previous week when the previous button is clicked in Weekly view', () => {
    const testDate = new Date();
    component.dateControlWeekly.patchValue(testDate);
    spyOn(component.dateControlWeekly, 'setValue').and.returnValue('');

    component.previousWeek();

    expect(component.dateControlWeekly.setValue).toHaveBeenCalledWith(subWeeks(testDate, 1));
  });

  it('should change the date picker to the next week when the next button is clicked in Weekly view', () => {
    const testDate = new Date();
    component.dateControlWeekly.patchValue(testDate);
    spyOn(component.dateControlWeekly, 'setValue').and.returnValue('');

    component.nextWeek();

    expect(component.dateControlWeekly.setValue).toHaveBeenCalledWith(addWeeks(testDate, 1));
  });

  it('should refresh the screen when toggle between the view or period mode', () => {
    component.dailyActivities = Object.assign({ value: null }).value;
    const temporaryUser = Object.assign(CURRENT_USER_DETAIL_MOCK);
    temporaryUser.assignment = Object.assign({ id: 12, team: { id: 11 } });
    temporaryUser.managerAvatar = Object.assign({ id: 12 });
    component.currentUser = temporaryUser;
    component.currentManagerId = 1;
    component.currentTeam = Object.assign({ id: 1 });

    component.refresh();

    expect(component.dailyActivities).toBeDefined();
  });

  it('should not refresh the screen when there is not current user', () => {
    component.currentUser = Object.assign({ value: null }).value;
    component.dailyActivities = Object.assign({ value: null }).value;
    component.periodMode = component.DAILY;

    component.refresh();

    expect(component.dailyActivities).toBeNull();
  });

  it('should not refresh the screen and change to Percentage when trying to access the Time view in Weekly period ', () => {
    const toggle = Object.assign({ selectedItem: component.WEEKLY });
    component.percentageTimeToggle = Object.assign({ selectItem: () => {} });
    component.periodMode = 'Weekly';
    component.percentageTimeMode = 'Time';
    spyOn(component.percentageTimeToggle, 'selectItem');

    component.refresh(toggle);

    expect(component.percentageTimeToggle.selectItem).toHaveBeenCalledWith(component.PERCENTAGE);
  });

  it('should not refresh the screen when trying to access the Time view in Daily period ', () => {
    const toggle = Object.assign({ selectedItem: component.DAILY });
    component.periodToggle = Object.assign({ selectItem: () => {} });
    component.periodMode = 'Weekly';
    component.percentageTimeMode = 'Time';
    spyOn(component.periodToggle, 'selectItem');

    component.refresh(toggle);

    expect(component.periodToggle.selectItem).toHaveBeenCalledWith(component.DAILY);
  });

  it('should show the contractor profile inside the modal correctly when the contractor picture is clicked', () => {
    const contractor = Object.assign({ candidate: { id: 23 }, id: 13, manager: { id: 17 }, team: { id: 11 } });
    spyOn(assignmentService, 'getContractorAssignment').and.returnValue(of(contractor));
    spyOn(modalService, 'open').and.returnValue('');

    component.showContractorModal(13);

    expect(component.currentContractor).toBe(contractor.candidate);
    expect(component.currentUserAssignmentId).toBe(13);
    expect(component.currentUserManager).toBe(contractor.manager);
    expect(component.currentUserTeamId).toBe(contractor.team.id);
    expect(modalService.open).toHaveBeenCalledWith(component.profileModal,  { customClass: 'profile-modal' });
  });

  it('should throw an API error when trying to show the contractor profile', () => {
    const negativeResponse = {
      error: {
        errorCode: 'CROS-0027',
        httpStatus: 400,
        type: 'ERROR',
        text: 'Sample error text',
      },
    };
    spyOn(assignmentService, 'getContractorAssignment').and.returnValue(ErrorObservable.create(negativeResponse));

    component.showContractorModal(13);

    expect(component.currentContractor).toBeUndefined();
    expect(component.error).toBe(negativeResponse.error.text);
  });

  it('should throw a general error when trying to show the contractor profile', () => {
    const negativeResponse = { error: {} };
    spyOn(assignmentService, 'getContractorAssignment').and.returnValue(ErrorObservable.create(negativeResponse));

    component.showContractorModal(13);

    expect(component.currentContractor).toBeUndefined();
    expect(component.error).toBe('Error fetching contractor assignment.');
  });

  it('should show the Alignment Score average in percentage when the Table is in Percentage mode', () => {
    const contractor = Object.assign({ assignment: { candidate: { printableName: 'John' } } });
    const item = Object.assign({ name: 'Alignment Score', teamMembers: { John: 30 } });

    expect(component.showPercentageOrTime(item, contractor)).toBe('30%');
  });

  it('should show the average when the Table is in Percentage mode', () => {
    const contractor = Object.assign({ assignment: { candidate: { printableName: 'John' } } });
    const item = Object.assign({ name: 'Development', teamMembers: { John: '30' } });

    expect(component.showPercentageOrTime(item, contractor)).toBe('30');
  });
});
