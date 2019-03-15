import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DfGrid } from '@devfactory/ngx-df';
import { startOfWeek } from 'date-fns';
import * as moment from 'moment';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { RESPONSIVE_BREAKPOINT } from 'app/core/constants/breakpoint';
import {
TimeCardListViewRow,
WorkDiaryWithFlags,
} from 'app/core/models/logbook';

@Component({
  selector: 'app-timecards-list-view',
  templateUrl: './timecards-list-view.component.html',
  styleUrls: ['./timecards-list-view.component.scss'],
})
export class TimecardsListViewComponent implements OnInit, AfterViewInit, OnChanges {
  private destroy$ = new Subject();
  public isResponsive = false;

  public workDiaryRows: TimeCardListViewRow[];

  public selection: WorkDiaryWithFlags[] = [];

  @Output()
  public openDetails: EventEmitter<WorkDiaryWithFlags> = new EventEmitter<WorkDiaryWithFlags>();

  @Output()
  public rowSelect: EventEmitter<TimeCardListViewRow[]> = new EventEmitter<TimeCardListViewRow[]>();

  @Input() public isExpanded = false;
  @Input() public is12hFormat = false;
  @Input() public day: Date;

  @ViewChild('mainGrid') public mainGrid: DfGrid;

  @Input()
  public set workDiaries(workDiaries: WorkDiaryWithFlags[]) {
    this.workDiaryRows = [];
    workDiaries.forEach(workDiary => {
      const hasScreenshot = !!workDiary.screenshot && !!workDiary.screenshot.url;
      const webCam = workDiary.webcam;
      const hasWebCam = !!workDiary.webcam;
      this.workDiaryRows.push({
        id: workDiary.id,
        time: moment(workDiary.date.slice(0, 16)).toDate(),
        title: workDiary.isManual ? 'Manual Time' : workDiary.windowTitle,
        application: workDiary.autoTracker ? '- -' : '',
        keyboard: workDiary.keyboardEvents,
        mouse: workDiary.mouseEvents,
        activity: workDiary.calculatedIntensityScore,
        details: workDiary.events,
        hasScreenshot,
        hasWebCam,
        screenshotUrl: hasScreenshot ? workDiary.screenshot.url : null,
        webCamUrl: webCam ? webCam.url : null,
        workDiary: workDiary,
      });
    });
  }

  @Input() public is12HourFormat = true;

  constructor(private breakpointObserver: BreakpointObserver) {}

  public ngOnInit(): void {
    this.breakpointObserver
      .observe(RESPONSIVE_BREAKPOINT)
      .pipe(map(matches => matches.matches), takeUntil(this.destroy$))
      .subscribe(isResponsive => {
        this.isResponsive = isResponsive;
      });
  }

  public ngAfterViewInit(): void {
    if (!this.isExpanded) {
      this.expandAll();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.isExpanded && !changes.isExpanded.firstChange) {
      if (!this.isExpanded) {
        this.expandAll();
      } else {
        this.collapseAll();
      }
    }
  }

  public openTimecardDetails(timecard: WorkDiaryWithFlags): void {
    this.openDetails.emit(timecard);
  }

  public selectionChange(rows: TimeCardListViewRow[]): void {
    this.rowSelect.emit(rows);
  }

  public get isCurrentWeek(): boolean {
    const weekStartDefinition = { weekStartsOn: 1 };
    const currentWeek = startOfWeek(new Date(), weekStartDefinition);
    const selectedWeek = startOfWeek(this.day, weekStartDefinition);
    return !(selectedWeek < currentWeek);
  }

  private expandAll(): void {
    this.workDiaryRows.forEach(row => {
      if (!this.mainGrid.isRowExpanded(row)) {
        this.mainGrid.toggleRow(row);
      }
    });
  }

  private collapseAll(): void {
    this.workDiaryRows.forEach(row => {
      if (this.mainGrid.isRowExpanded(row)) {
        this.mainGrid.toggleRow(row);
      }
    });
  }
}
