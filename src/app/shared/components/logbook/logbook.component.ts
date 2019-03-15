import { BreakpointObserver } from '@angular/cdk/layout';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  compareValidatorGenerator,
  DfModalOptions,
  DfModalService,
  DfModalSize,
  DfTimePickerChangeMode,
  DfValidationMessagesMap,
  isDefined,
} from '@devfactory/ngx-df';
import { addMinutes, startOfWeek } from 'date-fns';
import * as moment from 'moment';
import * as R from 'ramda';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import {
  SM_BREAKPOINT,
} from 'app/core/constants/breakpoint';
import * as TIME_CARD_ACTIONS from 'app/core/constants/my-dashboard/time-card-actions';
import { CurrentUserDetail } from 'app/core/models/identity';
import {
  LogbookFilters,
  ManualTimecard,
  TimeCardListViewRow,
  WorkDiariesByHour,
  WorkDiariesFilters,
  WorkDiary,
  WorkDiaryWithFlags,
} from 'app/core/models/logbook';
import { TimetrackingService } from 'app/core/services/timetracking/timetracking.service';
import { DeleteTimecardsModalComponent } from 'app/shared/components/delete-timecards-modal/delete-timecards-modal.component';
import {
  LogbookScreenshotViewerComponent,
  LogbookScreenshotViewerData,
} from 'app/shared/components/logbook-screenshot-viewer/logbook-screenshot-viewer.component';
import { TimecardDetailsModalComponent } from 'app/shared/components/timecard-details-modal/timecard-details-modal.component';
import { TimecardsListViewComponent } from 'app/shared/components/timecards-list-view/timecards-list-view.component';
import { TimecardsNotIdleModalComponent } from 'app/shared/components/timecards-not-idle-modal/timecards-not-idle-modal.component';
import { UserDashboardService } from 'app/shared/services/user-dashboard/user-dashboard.service';

@Component({
  selector: 'app-logbook',
  templateUrl: './logbook.component.html',
  styleUrls: ['./logbook.component.scss'],
})
export class LogbookComponent implements OnInit, OnDestroy, OnChanges {
  private destroy$ = new Subject();
  public isGridView = true;
  public filteredWorkdiaries: WorkDiaryWithFlags[];
  public shouldGroupByHour$: Observable<boolean>;
  public workDiariesByHour: WorkDiariesByHour[];
  public areTimecardsExpanded = false;
  public hourFormat = 'hh a';
  public allExpanded = false;
  public rowSelection: TimeCardListViewRow[] = [];

  public readonly FORMAT_12H = 'hh a';
  public readonly FORMAT_24H = 'HH';
  public readonly DATE_FORMAT = 'YYYY-MM-DD';
  public readonly HOUR_FORMAT = 'HH:mm';
  public readonly TIME_PICKER_CHANGE_MODE = DfTimePickerChangeMode.Continuous;
  public readonly timeCardActions = TIME_CARD_ACTIONS;

  public isLoading = false;
  public workDiaries: WorkDiaryWithFlags[] = [];
  @ViewChild('infoModal')
  public infoModal: TemplateRef<{}>;
  @ViewChild('addManualTimeModal')
  public addManualTimeModal: TemplateRef<{}>;
  @ViewChild(TimecardsListViewComponent)
  public timecardsListView: TimecardsListViewComponent;

  @Input()
  public userDetail: CurrentUserDetail | null = null;
  public timezoneId: number;
  public isEnforcerUser: boolean;
  public isManagerUser: boolean;

  @Input() public day: Date;

  @Input()
  public assignmentId: number;

  @Input()
  public isReadOnly = false;

  public timezoneControl: FormControl = new FormControl(0);
  public filterControl: FormControl;

  public isAddingManualTime = false;
  public manualTimeError: string | null = null;
  public manualTimeForm: FormGroup = new FormGroup(
    {
      start: new FormControl(null, Validators.required),
      end: new FormControl(null, Validators.required),
      memo: new FormControl(null, Validators.required),
    },
    {
      validators: compareValidatorGenerator(
        'start',
        'end',
        'range',
        (start: Date, end: Date) => start < end
      ),
    }
  );

  public filters: ReadonlyArray<LogbookFilters> = [
    {
      label: 'All Timecards',
      value: 'all',
      predicate: () => true,
    },
    {
      label: 'Manual Time',
      value: 'manual',
      predicate: a => a.isManual,
    },
    {
      label: 'Meeting Time',
      value: 'meeting',
      predicate: a => a.isMeeting,
    },
    {
      label: 'Idle Time',
      value: 'idle',
      predicate: a => a.isIdle,
    },
    {
      label: 'Low Activity',
      value: 'low',
      predicate: a =>
        a.calculatedIntensityScore < 10 && !a.isIdle && !a.isManual,
    },
    {
      label: 'Disputed Time',
      value: 'disputed',
      predicate: a => a.isDisputed,
    },
  ];

  public manualMessagesMap: DfValidationMessagesMap = {
    range: () => 'Invalid time range',
  };

  public get is12HFormat(): boolean {
    return this.hourFormat === this.FORMAT_12H;
  }

  constructor(
    private modalService: DfModalService,
    private timetrackingService: TimetrackingService,
    private breakpointObserver: BreakpointObserver,
    private userDashboardService: UserDashboardService
  ) {
  }

  public ngOnInit(): void {
    this.filterControl = new FormControl(this.filters[0]);
    this.shouldGroupByHour$ = this.breakpointObserver
      .observe(SM_BREAKPOINT)
      .pipe(map(matches => !matches.matches), takeUntil(this.destroy$));
    this.setFormListeners();
  }

  public showInfo(): void {
    this.modalService.open(this.infoModal, {
      size: DfModalSize.Large,
      customClass: 'huge-modal',
    });
  }

  public toggleHourFormat(): void {
    if (this.hourFormat === this.FORMAT_12H) {
      this.hourFormat = this.FORMAT_24H;
    } else {
      this.hourFormat = this.FORMAT_12H;
    }
  }

  public toggleView(): void {
    this.isGridView = !this.isGridView;
  }

  public toggleExpansion(): void {
    this.allExpanded = !this.allExpanded;
  }

  public openManualTimeModal(): void {
    this.manualTimeForm.reset();
    this.isAddingManualTime = false;
    this.manualTimeError = null;
    const start = moment(new Date()).hours(7).minutes(0).seconds(0).toDate();
    const end = addMinutes(start, 30);
    this.manualTimeForm.patchValue({
      start: start,
      end: end,
    });
    this.modalService.open(this.addManualTimeModal, {});
  }

  public timecardRangeExists(startDate: Date, endDate: Date): boolean {
    startDate.setSeconds(0);
    endDate.setSeconds(0);
    while (startDate < endDate) {
      const condition: boolean = this.workDiaries
        .filter(diary => moment(diary.date.slice(0, 10)).isSame(moment(this.day), 'day'))
        .some(diary => diary.time === moment(startDate).format(this.HOUR_FORMAT));

      if (!condition) {
        return false;
      }
      startDate = addMinutes(startDate, 10);
    }
    return true;
  }

  public saveManualTime(closeModalFn: Function): void {
    if (this.manualTimeForm.valid && !this.isAddingManualTime) {
      this.isAddingManualTime = true;
      this.manualTimeError = null;

      const timeZoneOffsetMinutes: number = this.timezoneControl.value / 60000;
      const timeZoneStartPosition = 19;
      const selectedTimezone = moment(new Date())
        .utcOffset(timeZoneOffsetMinutes).format().slice(timeZoneStartPosition);
      const dateFraction = 10;
      const timeFractionEnd = 9;
      const timeFractionStart = 0;

      const newManualCard: ManualTimecard = {
        approved: false,
        assignmentId: this.assignmentId,
        createDate: moment(this.day).format(this.DATE_FORMAT),
        endTime: moment(this.day).format(this.DATE_FORMAT) +
          moment(this.manualTimeForm.value.end).seconds(0).format().slice(dateFraction).slice(timeFractionStart, timeFractionEnd) +
          selectedTimezone,
        endTimeSel: moment(this.manualTimeForm.value.end).format(this.HOUR_FORMAT),
        memo: this.manualTimeForm.value.memo,
        startTime: moment(this.day).format(this.DATE_FORMAT) +
          moment(this.manualTimeForm.value.start).seconds(0).format().slice(dateFraction).slice(timeFractionStart, timeFractionEnd) +
          selectedTimezone,
        startTimeSel: moment(this.manualTimeForm.value.start).format(this.HOUR_FORMAT),
        timeZoneId: this.timezoneId,
      };

      if (newManualCard.startTimeSel === newManualCard.endTimeSel) {
        this.manualTimeError = 'Invalid time range, end time should be greater than start time';
        this.isAddingManualTime = false;
        return;
      }

      if (this.timecardRangeExists(this.manualTimeForm.value.start, this.manualTimeForm.value.end)) {
        this.manualTimeError = 'Time card for the selected time range already exists!';
        this.isAddingManualTime = false;
        return;
      }

      this.timetrackingService.addManualTimeCard(newManualCard)
        .subscribe(
          () => {
            closeModalFn();
            this.refresh();
          },
          negativeResponse => {
            this.isAddingManualTime = false;
            this.manualTimeError = negativeResponse.error.text;
          });
    }
  }

  public openDeleteTimecardModal(): void {
    const diaries: WorkDiaryWithFlags[] = this.isGridView ?
      this.workDiaries.filter(diary => diary.checked) :
      this.rowSelection.map(row => row.workDiary);
    const modalRef = this.modalService.open(DeleteTimecardsModalComponent, <DfModalOptions>{
      data: {
        diaries,
        is12HFormat: this.is12HFormat,
      },
      size: DfModalSize.Large,
    });
    modalRef.onClose.pipe(filter(payload => payload))
      .subscribe(() => {
        this.userDashboardService.updateTimesheets(true);
        this.refresh();
        this.rowSelection = [];
      });
  }

  public openNotIdleModal(): void {
    const selectedIdleCards: WorkDiaryWithFlags[] = this.isGridView ?
      this.workDiaries.filter(diary => diary.checked && diary.isIdle) :
      this.rowSelection.map(row => row.workDiary).filter(workDiary => workDiary.isIdle);
    this.modalService.open(TimecardsNotIdleModalComponent, {
      data: {
        assignmentId: this.assignmentId,
        selectedIdleCards,
      },
      size: DfModalSize.Large,
    }).onClose
      .pipe(filter(payload => payload === 'Yes'))
      .subscribe(() => {
        this.refresh();
        this.rowSelection = [];
      });
  }

  public openTimecardDetails(diary: WorkDiary): void {
    this.modalService.open(TimecardDetailsModalComponent, {
      data: diary,
      size: DfModalSize.Large,
      customClass: 'huge-modal',
    });
  }

  public openLogbookScreenshotViewer(diaryIndex: number): void {
    const data: LogbookScreenshotViewerData = {
      currentIndex: diaryIndex,
      workDiaries: this.workDiaries,
      hourFormat: this.hourFormat,
    };
    this.modalService.open(LogbookScreenshotViewerComponent, {
      data: data,
      size: DfModalSize.Large,
      customClass: 'huge-modal',
    });
  }

  public get showSelectedTimeZone(): string {
    const timeZoneOffsetMinutes: number = this.timezoneControl.value / 60000;
    const timeZoneStartPosition = 19;
    const currentTimezone: string = moment(new Date())
      .utcOffset(timeZoneOffsetMinutes).format().slice(timeZoneStartPosition);
    return currentTimezone === 'Z' ? '+00:00' : currentTimezone;
  }

  public get isCurrentWeek(): boolean {
    const weekStartDefinition = { weekStartsOn: 1 };
    const currentWeek = startOfWeek(new Date(), weekStartDefinition);
    const selectedWeek = startOfWeek(this.day, weekStartDefinition);
    return !(selectedWeek < currentWeek);
  }

  public get hasOneCardCheckedAtList(): boolean {
    if (this.isGridView) {
      return this.workDiaries.some(diary => diary.checked);
    }
    return this.rowSelection.length > 0;
  }

  public get hasOneIdleCardCheckedAtList(): boolean {
    if (this.isGridView) {
      return this.workDiaries.some(diary => diary.checked && diary.isIdle);
    }
    return this.rowSelection.some(row => row.workDiary.isIdle);
  }

  public getActionComment(diary: WorkDiaryWithFlags, requestedAction: string): string {
    const filteredAction = diary.actions.find(action => action.actionType === requestedAction);
    return filteredAction ? filteredAction.comment : 'No comment found!';
  }

  public getIntensityScore(diary: WorkDiaryWithFlags): string {
    return (diary.isMeeting ? '100' : diary.intensityScore) + '%';
  }

  public isNormalTimeCard(timecard: WorkDiaryWithFlags): boolean {
    return timecard.autoTracker &&
      !timecard.isIdle &&
      !timecard.isManual &&
      !timecard.isMeeting &&
      !timecard.isDisputed &&
      !timecard.isDisputeResolved &&
      !timecard.isRejected;
  }

  public isIdleTimeCard(timecard: WorkDiaryWithFlags): boolean {
    return timecard.isIdle &&
      !timecard.isManual &&
      !timecard.isMeeting &&
      !timecard.isDisputed &&
      !timecard.isDisputeResolved &&
      !timecard.isRejected;
  }

  public isMeetingTimeCard(timecard: WorkDiaryWithFlags): boolean {
    return timecard.isMeeting &&
      !timecard.isManual &&
      !timecard.isIdle &&
      !timecard.isDisputed &&
      !timecard.isDisputeResolved &&
      !timecard.isRejected;
  }

  public isManualTimeCard(timecard: WorkDiaryWithFlags): boolean {
    return timecard.isManual &&
      !timecard.isIdle &&
      !timecard.isMeeting &&
      !timecard.isDisputed &&
      !timecard.isDisputeResolved &&
      !timecard.isRejected;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.day) {
      this.refresh();
    }

    if (changes.userDetail && this.userDetail) {
      this.isLoading = true;
      this.isEnforcerUser = this.userDetail.avatarTypes.indexOf('ENFORCER') > -1;
      this.isManagerUser = this.userDetail.avatarTypes.indexOf('MANAGER') > -1 ||
        this.userDetail.avatarTypes.indexOf('COMPANY_ADMIN') > -1 ||
        this.userDetail.avatarTypes.indexOf('MIGRATED_MANAGER') > -1;
      if (this.userDetail.location.timeZone) {
        this.timezoneControl.setValue(this.userDetail.location.timeZone.offset);
        this.timezoneId = this.userDetail.location.timeZone.id;
      }
      this.loadTimecards();
    }
  }

  public refresh(): void {
    this.loadTimecards();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onRowSelect(rows: TimeCardListViewRow[]): void {
    this.rowSelection = rows;
  }

  private loadTimecards(): void {
    if (!this.userDetail) {
      return;
    }
    this.isLoading = true;
    const workDiaryParams: WorkDiariesFilters = {
      assignmentId: this.assignmentId,
      date: moment(this.day).format(this.DATE_FORMAT),
    };
    // If not an UTC timezone
    if (this.timezoneControl.value !== 0 && this.userDetail.location.timeZone) {
      workDiaryParams.timeZoneId = this.userDetail.location.timeZone.id;
    }
    this.timetrackingService.getWorkDiaries(workDiaryParams)
      .pipe(
        map(workDiaries => {
          return workDiaries.map(diary =>
            this.setTimecardFlags(diary, this.areTimecardsExpanded)
          );
        })
      )
      .subscribe(workdiaries => {
        this.isLoading = false;
        this.workDiaries = workdiaries;
        this.filterResults();
      });
  }

  /**
   * Hidrates workdiary with contextual flags used for filtering and display
   * @param timecard
   * @param expanded
   */
  private setTimecardFlags(timecard: WorkDiary, expanded: boolean): WorkDiaryWithFlags {
    const isMeeting = this.isMeeting(timecard);
    let calculatedIntensityScore: number;
    if (isMeeting) {
      calculatedIntensityScore = 100;
    } else {
      calculatedIntensityScore =
        timecard.intensityScore +
        (isDefined(timecard.mobileIntensityScore)
          ? timecard.mobileIntensityScore * 10
          : 0);
      calculatedIntensityScore = Math.min(calculatedIntensityScore, 100);
    }
    return {
      ...timecard,
      checked: false,
      isMeeting: isMeeting,
      isOutlook: this.isOutlookMetting(timecard),
      isIdle: !isMeeting && timecard.autoTracker && timecard.activityLevel < 10,
      isManual: !timecard.autoTracker,
      isApproved: !timecard.autoTracker && !timecard.rejected,
      isRejected: timecard.rejected,
      isDisputed: timecard.disputed,
      isDisputeResolved: (timecard.actions || []).reduce((ret, x) => {
        return ret || x.actionType === 'RESOLVE_DISPUTE';
      }, false),
      expanded: expanded,
      calculatedIntensityScore: calculatedIntensityScore,
      localDate: this.convertToZone(timecard.date, this.timezoneControl.value),
    };
  }

  private isOutlookMetting(timecard: WorkDiary): boolean {
    return (timecard.actions || []).reduce((result, action) => {
      return (
        result ||
        (action.actionType === 'OUTLOOK_MEETING' &&
          timecard.windowTitle === '' &&
          timecard.keyboardEvents + timecard.mouseEvents === 0)
      );
    }, false);
  }

  private isMeeting(timecard: WorkDiary): boolean {
    return (timecard.actions || []).reduce((result, action) => {
      return (
        result ||
        action.actionType === 'SET_MEETING_TIME' ||
        this.isOutlookMetting(timecard)
      );
    }, false);
  }

  private filterResults(): void {
    this.filteredWorkdiaries = this.workDiaries.filter(
      this.filterControl.value.predicate
    );
    this.workDiariesByHour = this.groupDiariesByHours(this.filteredWorkdiaries);
  }

  private groupDiariesByHours(diaries: WorkDiaryWithFlags[]): WorkDiariesByHour[] {
    const sortByDate = R.sortBy(R.prop('date'));
    const sortedDiaries = sortByDate(diaries);
    const groupByHour = R.groupWith<WorkDiaryWithFlags>((a, b) => {
      const aHour = this.getDateWithOffset(
        a.localDate,
        this.timezoneControl.value
      ).getHours();
      const bHour = this.getDateWithOffset(
        b.localDate,
        this.timezoneControl.value
      ).getHours();
      return aHour === bHour;
    });
    const groupedDiaries = groupByHour(sortedDiaries);
    return groupedDiaries.map(timecards => {
      // make sure each list has 6 items
      const tcArray = new Array(6);
      timecards.forEach(timecard => {
        tcArray[this.calculate10MinuteIndex(timecard)] = timecard;
      });
      return {
        hour: moment(timecards[0].localDate).toDate(),
        diaries: tcArray,
      };
    });
  }

  private calculate10MinuteIndex(timecard: WorkDiaryWithFlags): number {
    return Math.floor(
      this.getDateWithOffset(
        timecard.localDate,
        this.timezoneControl.value
      ).getMinutes() / 10
    );
  }

  private getDateWithOffset(date: string | number | Date, offset: number): Date {
    const minute = 60000;
    return moment(moment(date).valueOf())
      .utcOffset(offset / minute)
      .toDate();
  }

  private convertToZone(dateString: string, offset: number): Date {
    const minute = 60000;
    const d = new Date(dateString);
    const utc = d.getTime() + d.getTimezoneOffset() * minute;
    return moment(utc + offset).toDate();
  }

  private setFormListeners(): void {
    this.manualTimeForm.controls.start.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((startTime: Date) => {
        this.manualTimeForm.patchValue({
          end: addMinutes(startTime, 30),
        });
      });
    this.filterControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.rowSelection = [];
        this.filterResults();
        this.refresh();
      });
    this.timezoneControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.rowSelection = [];
        this.refresh();
      });
  }
}
