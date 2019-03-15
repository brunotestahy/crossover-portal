import { BreakpointObserver } from '@angular/cdk/layout';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfModalService, DfModalSize } from '@devfactory/ngx-df';
import * as moment from 'moment';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { take } from 'rxjs/operators';
import { mock } from 'ts-mockito';

import { WorkDiary, WorkDiaryAction, WorkDiaryWithFlags } from 'app/core/models/logbook';
import { CURRENT_USER_DETAIL_MOCK } from 'app/core/services/mocks/current-user-detail.mock';
import { WORKDIARIES_MOCK } from 'app/core/services/mocks/work-diaries.mock';
import { TimetrackingService } from 'app/core/services/timetracking/timetracking.service';
import { DeleteTimecardsModalComponent } from 'app/shared/components/delete-timecards-modal/delete-timecards-modal.component';
import { LogbookScreenshotViewerComponent } from 'app/shared/components/logbook-screenshot-viewer/logbook-screenshot-viewer.component';
import { LogbookComponent } from 'app/shared/components/logbook/logbook.component';
import { TimecardDetailsModalComponent } from 'app/shared/components/timecard-details-modal/timecard-details-modal.component';
import { TimecardsNotIdleModalComponent } from 'app/shared/components/timecards-not-idle-modal/timecards-not-idle-modal.component';
import { UserDashboardService } from 'app/shared/services/user-dashboard/user-dashboard.service';

describe('LogbookComponent', () => {
  let component: LogbookComponent;
  let fixture: ComponentFixture<LogbookComponent>;

  let breakpointObserver: BreakpointObserver;
  let modalService: DfModalService;
  let timetrackingService: TimetrackingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LogbookComponent,
      ],
      providers: [
        { provide: BreakpointObserver, useFactory: () => mock(BreakpointObserver) },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        { provide: TimetrackingService, useFactory: () => mock(TimetrackingService) },
        { provide: UserDashboardService, useFactory: () => mock(UserDashboardService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogbookComponent);
    component = fixture.componentInstance;

    breakpointObserver = TestBed.get(BreakpointObserver);
    modalService = TestBed.get(DfModalService);
    timetrackingService = TestBed.get(TimetrackingService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should return a invalid time range message when a time range is set', () => {
    expect(component.manualMessagesMap.range({
      label: 'Test',
      validationObject: {},
      value: null,
    })).toBe('Invalid time range');
  });

  it('should check if the date\'s current format is 12h or not', () => {
    expect(component.is12HFormat).toBe(true);

    component.hourFormat = 'hh';

    expect(component.is12HFormat).toBe(false);
  });

  it('should execute predicate and filter the Manual time cards when the filter is selected', () => {
    const timecard = {} as WorkDiaryWithFlags;
    timecard.isManual = true;

    expect(component.filters[1].predicate(timecard)).toBe(true);
  });

  it('should execute predicate and filter the Meeting time cards when the filter is selected', () => {
    const timecard = {} as WorkDiaryWithFlags;
    timecard.isMeeting = true;

    expect(component.filters[2].predicate(timecard)).toBe(true);
  });

  it('should execute predicate and filter the Idle time cards when the filter is selected', () => {
    const timecard = {} as WorkDiaryWithFlags;
    timecard.isIdle = true;

    expect(component.filters[3].predicate(timecard)).toBe(true);
  });

  it('should execute predicate and filter the cards with low activity when the filter is selected', () => {
    const timecard = {} as WorkDiaryWithFlags;
    timecard.calculatedIntensityScore = 8;
    timecard.isIdle = false;
    timecard.isManual = false;

    expect(component.filters[4].predicate(timecard)).toBe(true);
  });

  it('should execute predicate and filter the disputed cards when the filter is selected', () => {
    const timecard = {} as WorkDiaryWithFlags;
    timecard.isDisputed = true;

    expect(component.filters[5].predicate(timecard)).toBe(true);
  });

  it('should update the end input in plus 30 minutes from the start input when the start input value is changed', () => {
    spyOn(breakpointObserver, 'observe').and.returnValue(of([{ matches: false }]).pipe(take(1)));
    spyOn(timetrackingService, 'getWorkDiaries').and.returnValue(of(WORKDIARIES_MOCK));
    component.userDetail = CURRENT_USER_DETAIL_MOCK;

    fixture.detectChanges();

    const starDate: Date = new Date();

    component.manualTimeForm.patchValue({
      start: starDate,
    });

    component.manualTimeForm.controls.start.valueChanges
      .pipe(take(1))
      .subscribe(() => {
        expect(component.manualTimeForm.value.end).toBe(moment(starDate).add(30, 'minute').toDate());
      });
  });

  it('should apply the filter, when the filter is changed to Manual', () => {
    spyOn(breakpointObserver, 'observe').and.returnValue(of([{ matches: false }]).pipe(take(1)));
    spyOn(timetrackingService, 'getWorkDiaries').and.returnValue(of(WORKDIARIES_MOCK).pipe(take(1)));
    component.userDetail = CURRENT_USER_DETAIL_MOCK;

    fixture.detectChanges();

    component.filterControl.patchValue(component.filters[1]);

    component.filterControl.valueChanges
      .pipe(take(1))
      .subscribe(() => {
        expect(component.filteredWorkdiaries).toBe(
          component.workDiaries.filter(component.filterControl.value.predicate)
        );
      });
  });

  it('should apply the filter, when the filter is changed to Meeting', () => {
    spyOn(breakpointObserver, 'observe').and.returnValue(of([{ matches: false }]).pipe(take(1)));
    spyOn(timetrackingService, 'getWorkDiaries').and.returnValue(of(WORKDIARIES_MOCK).pipe(take(1)));
    component.userDetail = CURRENT_USER_DETAIL_MOCK;

    fixture.detectChanges();

    component.filterControl.patchValue(component.filters[2]);

    component.filterControl.valueChanges
      .pipe(take(1))
      .subscribe(() => {
        expect(component.filteredWorkdiaries).toBe(
          component.workDiaries.filter(component.filterControl.value.predicate)
        );
      });
  });

  it('should apply the filter, when the filter is changed to Idle', () => {
    spyOn(breakpointObserver, 'observe').and.returnValue(of([{ matches: false }]).pipe(take(1)));
    spyOn(timetrackingService, 'getWorkDiaries').and.returnValue(of(WORKDIARIES_MOCK).pipe(take(1)));
    component.userDetail = CURRENT_USER_DETAIL_MOCK;

    fixture.detectChanges();

    component.filterControl.patchValue(component.filters[3]);

    component.filterControl.valueChanges
      .pipe(take(1))
      .subscribe(() => {
        expect(component.filteredWorkdiaries).toBe(
          component.workDiaries.filter(component.filterControl.value.predicate)
        );
      });
  });

  it('should apply the filter, when the filter is changed to Low Activity', () => {
    spyOn(breakpointObserver, 'observe').and.returnValue(of([{ matches: false }]).pipe(take(1)));
    spyOn(timetrackingService, 'getWorkDiaries').and.returnValue(of(WORKDIARIES_MOCK).pipe(take(1)));
    component.userDetail = CURRENT_USER_DETAIL_MOCK;

    fixture.detectChanges();

    component.filterControl.patchValue(component.filters[4]);

    component.filterControl.valueChanges
      .pipe(take(1))
      .subscribe(() => {
        expect(component.filteredWorkdiaries).toBe(
          component.workDiaries.filter(component.filterControl.value.predicate)
        );
      });
  });

  it('should apply the filter, when the filter is changed to Disputed', () => {
    spyOn(breakpointObserver, 'observe').and.returnValue(of([{ matches: false }]).pipe(take(1)));
    spyOn(timetrackingService, 'getWorkDiaries').and.returnValue(of(WORKDIARIES_MOCK).pipe(take(1)));
    spyOn(component, 'refresh').and.returnValue('');
    component.userDetail = CURRENT_USER_DETAIL_MOCK;

    fixture.detectChanges();

    component.filterControl.patchValue(component.filters[5]);

    component.filterControl.valueChanges
      .pipe(take(1))
      .subscribe(() => {
        expect(component.filteredWorkdiaries).toBe(
          component.workDiaries.filter(component.filterControl.value.predicate)
        );
        expect(component.refresh).toHaveBeenCalledWith();
      });
  });

  it('should reload the time cards, when the timezone control is changed', () => {
    spyOn(breakpointObserver, 'observe').and.returnValue(of([{ matches: false }]).pipe(take(1)));
    spyOn(timetrackingService, 'getWorkDiaries').and.returnValue(of(WORKDIARIES_MOCK).pipe(take(1)));
    component.userDetail = CURRENT_USER_DETAIL_MOCK;

    fixture.detectChanges();

    component.timezoneControl.setValue(0);

    component.timezoneControl.valueChanges
      .pipe(take(1))
      .subscribe(() => {
        expect(timetrackingService.getWorkDiaries).toHaveBeenCalledTimes(2);
      });
  });

  it('should open the info modal correctly', () => {
    spyOn(modalService, 'open');

    component.showInfo();

    expect(modalService.open).toHaveBeenCalledWith(component.infoModal, {
      size: DfModalSize.Large,
      customClass: 'huge-modal',
    });
  });

  it('should toggle the hour format between 12h or 24h correctly', () => {
    component.toggleHourFormat();

    expect(component.hourFormat).toEqual(component.FORMAT_24H);

    component.toggleHourFormat();

    expect(component.hourFormat).toEqual(component.FORMAT_12H);
  });

  it('should toggle between Grid and List view correctly', () => {
    component.isGridView = true;

    component.toggleView();

    expect(component.isGridView).toBe(false);
  });

  it('should toggle between in List expanded or not correctly', () => {
    component.allExpanded = true;

    component.toggleExpansion();

    expect(component.allExpanded).toBe(false);
  });

  it('should open the Manual time modal correctly', () => {
    spyOn(component.manualTimeForm, 'reset');
    spyOn(modalService, 'open');

    component.openManualTimeModal();

    expect(component.manualTimeForm.reset).toHaveBeenCalledWith();
    expect(modalService.open).toHaveBeenCalledWith(component.addManualTimeModal, {});
  });

  it('should be false when no time card exists at the specified time range', () => {
    const startDate = moment(new Date()).toDate();
    const endDate = moment(startDate).add(10, 'minute').toDate();
    const timecard = {} as WorkDiaryWithFlags;
    timecard.date = moment(startDate).format();
    timecard.time = moment(startDate).add(10, 'minute').format('HH:mm');

    component.day = startDate;
    component.workDiaries = [timecard];

    expect(component.timecardRangeExists(startDate, endDate)).toBe(false);
  });

  it('should be false when at least one time card exists at the specified time range', () => {
    const startDate = moment(new Date()).toDate();
    const endDate = moment(startDate).add(10, 'minute').toDate();
    const timecard = {} as WorkDiaryWithFlags;
    timecard.date = moment(startDate).format();
    timecard.time = moment(startDate).format('HH:mm');

    component.day = startDate;
    component.workDiaries = [timecard];

    expect(component.timecardRangeExists(startDate, endDate)).toBe(true);
  });

  it('should close the modal and refresh the cards when manual time card is added successfully', () => {
    const modal = {
      close: () => {},
    };
    component.manualTimeForm.patchValue({
      start: new Date(),
      end: moment(new Date()).add(30, 'minute').toDate() as Date,
      memo: new Date(),
    });
    spyOn(timetrackingService, 'addManualTimeCard').and.returnValue(of({}).pipe(take(1)));
    spyOn(component, 'refresh').and.returnValue('');
    spyOn(modal, 'close').and.returnValue('');

    component.saveManualTime(modal.close);

    expect(component.refresh).toHaveBeenCalledWith();
    expect(modal.close).toHaveBeenCalledWith();
  });

  it('should return an error message, when the the start and end date are the same in the manual form', () => {
    const modal = {
      close: () => {},
    };
    const date: Date = moment(new Date()).minutes(30).seconds(0).toDate();
    component.manualTimeForm.patchValue({
      start: date,
      end: moment(date).add(10, 'second').toDate() as Date,
      memo: new Date(),
    });

    component.saveManualTime(modal.close);

    expect(component.isAddingManualTime).toBe(false);
    expect(component.manualTimeError).toBe('Invalid time range, end time should be greater than start time');
  });

  it('should fail on data storage when the specified time card range already exists', () => {
    const modal = {
      close: () => {},
    };
    const date: Date = moment(new Date()).minutes(30).toDate();
    component.manualTimeForm.patchValue({
      start: date,
      end: moment(date).add(30, 'minute').toDate() as Date,
      memo: new Date(),
    });
    spyOn(component, 'timecardRangeExists').and.returnValue(true);

    component.saveManualTime(modal.close);

    expect(component.isAddingManualTime).toBe(false);
    expect(component.manualTimeError).toBe('Time card for the selected time range already exists!');
  });

  it('should display an error message in the manual card modal when API throws an error', () => {
    const modal = {
      close: () => {},
    };
    component.manualTimeForm.patchValue({
      start: new Date(),
      end: moment(new Date()).add(30, 'minute').toDate() as Date,
      memo: new Date(),
    });
    spyOn(timetrackingService, 'addManualTimeCard').and.returnValue(ErrorObservable.create({ error: { text: 'Error' } }));
    spyOn(modal, 'close').and.returnValue('');

    component.saveManualTime(modal.close);

    expect(component.isAddingManualTime).toBe(false);
    expect(component.manualTimeError).toBe('Error');
    expect(modal.close).not.toHaveBeenCalledWith();
  });

  it('should try to save the manual time with empty form inputs', () => {
    component.saveManualTime(() => {});

    expect(component.manualTimeError).not.toBe('Error adding manual time.');
  });

  it('should open the Delete time card Modal correctly', () => {
    const timecard = {} as WorkDiaryWithFlags;
    timecard.checked = true;

    component.workDiaries = [timecard];
    spyOn(component, 'is12HFormat').and.returnValue(true);
    spyOn(modalService, 'open').and.returnValue({ onClose: of(true).pipe(take(1)) });

    component.openDeleteTimecardModal();

    expect(modalService.open).toHaveBeenCalledWith(DeleteTimecardsModalComponent, {
      data: {
        diaries: [{ checked: true }],
        is12HFormat: true,
      },
      size: DfModalSize.Large,
    });
  });

  it('should refresh the page when busy time is provided and confirmed', () => {
    const timecard = {} as WorkDiaryWithFlags;
    timecard.checked = true;
    timecard.isIdle = true;

    component.workDiaries = [timecard];
    spyOn(modalService, 'open').and.returnValue({
      onClose: of('Yes'),
    });
    spyOn(component, 'refresh').and.returnValue('');

    component.openNotIdleModal();

    expect(modalService.open).toHaveBeenCalledWith(TimecardsNotIdleModalComponent, {
      data: {
        assignmentId: component.assignmentId,
        selectedIdleCards: component.workDiaries.filter(diary => diary.checked && diary.isIdle),
      },
      size: DfModalSize.Large,
    });

    modalService.open({}).onClose
      .pipe(take(1))
      .subscribe(() => {
      expect(component.refresh).toHaveBeenCalledWith();
    });
  });

  it('should refresh the page when busy time is provided and confirmed in list layout', () => {
    component.isGridView = false;
    const workDiary = Object.assign({ isIdle: true });
    component.rowSelection = Object.assign([{ workDiary }]);
    spyOn(modalService, 'open').and.returnValue({
      onClose: of('Yes'),
    });
    spyOn(component, 'refresh').and.returnValue('');

    component.openNotIdleModal();

    expect(modalService.open).toHaveBeenCalledWith(TimecardsNotIdleModalComponent, {
      data: {
        assignmentId: component.assignmentId,
        selectedIdleCards: [workDiary],
      },
      size: DfModalSize.Large,
    });

    modalService.open({}).onClose
      .pipe(take(1))
      .subscribe(() => {
      expect(component.refresh).toHaveBeenCalledWith();
    });
  });

  it('should close the modal when busy time is provided and not confirmed', () => {
    const timecard = {} as WorkDiaryWithFlags;
    timecard.checked = true;
    timecard.isIdle = true;

    component.workDiaries = [timecard];
    spyOn(modalService, 'open').and.returnValue({
      onClose: of('No'),
    });
    spyOn(component, 'refresh').and.returnValue('');

    component.openNotIdleModal();

    expect(modalService.open).toHaveBeenCalledWith(TimecardsNotIdleModalComponent, {
      data: {
        assignmentId: component.assignmentId,
        selectedIdleCards: component.workDiaries.filter(diary => diary.checked && diary.isIdle),
      },
      size: DfModalSize.Large,
    });

    modalService.open({}).onClose.pipe(take((1))).subscribe(() => expect(component.refresh).not.toHaveBeenCalledWith());
  });

  it('should open the detail time card Modal correctly', () => {
    const timecard = {} as WorkDiary;
    spyOn(modalService, 'open');

    component.openTimecardDetails(timecard);

    expect(modalService.open).toHaveBeenCalledWith(TimecardDetailsModalComponent, {
      data: {},
      size: DfModalSize.Large,
      customClass: 'huge-modal',
    });
  });

  it('should open the ScreenShot Viewer Modal correctly', () => {
    spyOn(modalService, 'open');
    const data = {
      currentIndex: 1,
      workDiaries: component.workDiaries,
      hourFormat: component.hourFormat,
    };

    component.openLogbookScreenshotViewer(data.currentIndex);

    expect(modalService.open).toHaveBeenCalledWith(LogbookScreenshotViewerComponent, {
      data: data,
      size: DfModalSize.Large,
      customClass: 'huge-modal',
    });
  });

  it('should show the time zone correctly in the modal, when the  time zone value changes in the select input', () => {
    component.timezoneControl.patchValue(-180000);
    expect(component.showSelectedTimeZone).toBe('-03:00');

    component.timezoneControl.patchValue(0);
    expect(component.showSelectedTimeZone).toBe('+00:00');
  });

  it('should check if the selected week is the current one or not', () => {
    component.day = moment('2018-01-01T00:00:00-03:00').toDate();

    expect(component.isCurrentWeek).toBe(false);
  });

  it('should filter by the checked time cards correctly when the layout is in grid mode', () => {
    component.workDiaries = [];

    expect(component.hasOneCardCheckedAtList).toBe(false);

    component.workDiaries = [
      {} as WorkDiaryWithFlags,
      {} as WorkDiaryWithFlags,
    ];

    component.workDiaries[0].checked = true;
    component.workDiaries[1].checked = false;

    expect(component.hasOneCardCheckedAtList).toBe(true);
  });

  it('should filter by the checked idle time cards correctly when the layout is in grid', () => {
    component.workDiaries = [];

    expect(component.hasOneIdleCardCheckedAtList).toBe(false);

    component.workDiaries = [
      {} as WorkDiaryWithFlags,
      {} as WorkDiaryWithFlags,
    ];

    component.workDiaries[0].checked = true;
    component.workDiaries[0].isIdle = true;
    component.workDiaries[1].checked = false;

    expect(component.hasOneIdleCardCheckedAtList).toBe(true);
  });

  it('should return the idle card\'s comment when a specific action is provided', () => {
    const diary = {} as WorkDiaryWithFlags;
    const action = {} as WorkDiaryAction;
    action.actionType = 'SET_MEETING_TIME';
    action.comment = 'Meeting';
    diary.actions = [action];

    expect(component.getActionComment(diary, 'SET_MEETING_TIME')).toBe('Meeting');
  });

  it('should return a default comment when the idle card does not have any comment', () => {
    const diary = {} as WorkDiaryWithFlags;
    const action = {} as WorkDiaryAction;
    diary.actions = [action];

    expect(component.getActionComment(diary, 'SET_MEETING_TIME')).toBe('No comment found!');
  });

  it('[getIntensityScore] should return 100% when a meeting card is displayed', () => {
    const diary = {} as WorkDiaryWithFlags;
    diary.isMeeting = true;

    expect(component.getIntensityScore(diary)).toBe('100%');
  });

  it('[getIntensityScore] should return the intensity score when a normal card is displayed', () => {
    const diary = {} as WorkDiaryWithFlags;
    diary.isMeeting = false;
    diary.intensityScore = 60;

    expect(component.getIntensityScore(diary)).toBe('60%');
  });

  it('should classify the card as normal when it doesn\'t have any additional flag', () => {
    const timecard = {} as WorkDiaryWithFlags;
    timecard.autoTracker = true;

    expect(component.isNormalTimeCard(timecard)).toBe(true);
  });

  it('should classify the card as Idle when it has only the Idle flag', () => {
    const timecard = {} as WorkDiaryWithFlags;
    timecard.isIdle = true;

    expect(component.isIdleTimeCard(timecard)).toBe(true);
  });

  it('should classify the card as Meeting when it has only the Meeting flag', () => {
    const timecard = {} as WorkDiaryWithFlags;
    timecard.isMeeting = true;

    expect(component.isMeetingTimeCard(timecard)).toBe(true);
  });

  it('should classify the card as Manual when it has only the Manual flag', () => {
    const timecard = {} as WorkDiaryWithFlags;
    timecard.isManual = true;

    expect(component.isManualTimeCard(timecard)).toBe(true);
  });

  it('should refresh the time cards when the day is changed', () => {
    spyOn(component, 'refresh').and.returnValue('');

    component.ngOnChanges({
      day: new SimpleChange(null, 19, false),
    });

    expect(component.refresh).toHaveBeenCalledWith();
  });

  it('shouldn\'t refresh the time cards when the day is not changed', () => {
    spyOn(component, 'refresh').and.returnValue('');

    component.ngOnChanges({});

    expect(component.refresh).not.toHaveBeenCalledWith();
  });

  it('should load the time cards, when the logbook page is accessed', () => {
    spyOn(breakpointObserver, 'observe').and.returnValue(of([{ matches: false }]).pipe(take(1)));
    spyOn(timetrackingService, 'getWorkDiaries').and.returnValue(of(WORKDIARIES_MOCK).pipe(take(1)));
    component.userDetail = CURRENT_USER_DETAIL_MOCK;

    fixture.detectChanges();
    const changes = Object.assign({ day: false, userDetail: component.userDetail });
    component.ngOnChanges(changes);

    expect(timetrackingService.getWorkDiaries).toHaveBeenCalledTimes(2);
  });

  it('should load the time cards, when the logbook page is accessed with a null Timezone', () => {
    spyOn(breakpointObserver, 'observe').and.returnValue(of([{ matches: false }]).pipe(take(1)));
    spyOn(timetrackingService, 'getWorkDiaries').and.returnValue(of(WORKDIARIES_MOCK).pipe(take(1)));
    component.userDetail = CURRENT_USER_DETAIL_MOCK;
    component.userDetail.location.timeZone = Object.assign({ value: undefined }).value;

    fixture.detectChanges();
    const changes = Object.assign({ day: false, userDetail: component.userDetail });
    component.ngOnChanges(changes);

    expect(timetrackingService.getWorkDiaries).toHaveBeenCalledTimes(1);
  });

  it('should do nothing, when the refresh method is called without a valid user', () => {
    spyOn(breakpointObserver, 'observe').and.returnValue(of([{ matches: false }]).pipe(take(1)));
    spyOn(timetrackingService, 'getWorkDiaries').and.returnValue(of(WORKDIARIES_MOCK).pipe(take(1)));
    component.userDetail = null;

    fixture.detectChanges();
    component.ngOnChanges({
      day: new SimpleChange(null, true, false),
      userDetail: new SimpleChange(null, component.userDetail, false),
    });

    expect(timetrackingService.getWorkDiaries).not.toHaveBeenCalledWith();
  });
});
