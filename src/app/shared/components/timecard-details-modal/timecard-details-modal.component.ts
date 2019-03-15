import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { DfActiveModal } from '@devfactory/ngx-df';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { RESPONSIVE_BREAKPOINT } from 'app/core/constants/breakpoint';
import { WorkDiary, WorkDiaryEvent, WorkDiaryImage } from 'app/core/models/logbook';
import { sortBy } from 'app/utils/sorting';

@Component({
  selector: 'app-timecard-details-modal',
  templateUrl: './timecard-details-modal.component.html',
  styleUrls: ['./timecard-details-modal.component.scss'],
})
export class TimecardDetailsModalComponent implements OnInit, OnDestroy {


  private destroy$ = new Subject();

  public diary: WorkDiary;
  public isResponsive: boolean;
  public events: WorkDiaryEvent[];
  public screenshot: WorkDiaryImage;
  public isScreenshotMissing = false;

  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  constructor(
    private activeModal: DfActiveModal,
    private breakpointObserver: BreakpointObserver
  ) {}

  public setScreenshotMissingState(state: boolean): void {
    this.isScreenshotMissing = state;
  }

  public ngOnInit(): void {
    this.breakpointObserver
      .observe(RESPONSIVE_BREAKPOINT)
      .pipe(takeUntil(this.destroy$))
      .subscribe(responsive => {
        this.isResponsive = responsive.matches;
      });
    this.loadContent();
  }

  public close(): void {
    this.activeModal.close();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadContent(): void {
    this.diary = this.activeModal.data;
    this.events = this.diary.events.slice().sort(sortBy<WorkDiaryEvent>('date'));
    this.screenshot = this.diary.screenshot;
  }
}
