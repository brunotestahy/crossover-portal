import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import {
  CalendarDayViewBeforeRenderEvent,
  CalendarEvent,
  CalendarEventTimesChangedEvent,
} from 'angular-calendar';
import { CalendarUtils } from 'angular-calendar';
import { DayViewEventResize } from 'angular-calendar/modules/day/calendar-day-view.component';
import { ResizeEvent } from 'angular-resizable-element';
import { DayView, DayViewEvent, DayViewHour, DayViewHourSegment, validateEvents } from 'calendar-utils';
import { addMinutes } from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

const MINUTES_IN_HOUR = 60;

@Component({
  selector: 'app-schedule-calendar',
  templateUrl: './schedule-calendar.component.html',
  styleUrls: ['./schedule-calendar.component.scss'],
})
export class ScheduleCalendarComponent implements OnChanges, OnInit, OnDestroy {
  /**
   * The current view date
   */
  @Input() public viewDate: Date;

  /**
   * An array of events to display on view
   */
  @Input() public events: CalendarEvent[] = [];

  /**
   * The number of segments in an hour. Must be <= 6
   */
  @Input() public hourSegments = 2;

  /**
   * The height in pixels of each hour segment
   */
  @Input() public hourSegmentHeight = 30;

  /**
   * The day start hours in 24 hour time. Must be 0-23
   */
  @Input() public dayStartHour = 0;

  /**
   * The day start minutes. Must be 0-59
   */
  @Input() public dayStartMinute = 0;

  /**
   * The day end hours in 24 hour time. Must be 0-23
   */
  @Input() public dayEndHour = 23;

  /**
   * The day end minutes. Must be 0-59
   */
  @Input() public dayEndMinute = 59;

  /**
   * The width in pixels of each event on the view
   */
  @Input() public eventWidth = 150;

  /**
   * An observable that when emitted on will re-render the current view
   */
  @Input() public refresh: Subject<void>;

  /**
   * The locale used to format dates
   */
  @Input() public locale: string;

  /**
   * The grid size to snap resizing and dragging of events to
   */
  @Input() public eventSnapSize: number = this.hourSegmentHeight;

  /**
   * The placement of the event tooltip
   */
  @Input() public tooltipPlacement = 'top';

  /**
   * A custom template to use for the event tooltips
   */
  @Input() public tooltipTemplate: TemplateRef<{}>;

  /**
   * Whether to append tooltips to the body or next to the trigger element
   */
  @Input() public tooltipAppendToBody = true;

  /**
   * A custom template to use to replace the hour segment
   */
  @Input() public hourSegmentTemplate: TemplateRef<{}>;

  /**
   * A custom template to use for all day events
   */
  @Input() public allDayEventTemplate: TemplateRef<{}>;

  /**
   * A custom template to use for day view events
   */
  @Input() public eventTemplate: TemplateRef<{}>;

  /**
   * A custom template to use for event titles
   */
  @Input() public eventTitleTemplate: TemplateRef<{}>;

  /**
   * Called when an event title is clicked
   */
  @Output()
  public eventClicked = new EventEmitter<{
    event: CalendarEvent;
  }>();

  /**
   * Called when an hour segment is clicked
   */
  @Output()
  public hourSegmentClicked = new EventEmitter<{
    date: Date;
  }>();

  /**
   * Called when an event is resized or dragged and dropped
   */
  @Output()
  public eventTimesChanged = new EventEmitter<CalendarEventTimesChangedEvent>();

  /**
   * An output that will be called before the view is rendered for the current day.
   * If you add the `cssClass` property to an hour grid segment it will add that class to the hour segment in the template
   */
  @Output()
  public beforeViewRender = new EventEmitter<CalendarDayViewBeforeRenderEvent>();

  /**
   * @hidden
   */
  public hours: DayViewHour[] = [];

  /**
   * @hidden
   */
  public view: DayView;

  /**
   * @hidden
   */
  public width = 0;

  /**
   * @hidden
   */
  public refreshSubscription: Subscription;

  /**
   * @hidden
   */
  public currentResizes: Map<DayViewEvent, DayViewEventResize> = new Map();

  /**
   * @hidden
   */
  public validateDrag: () => boolean;

  /**
   * @hidden
   */
  public validateResize: () => boolean;

  /**
   * @hidden
   */
  constructor(
    private cdr: ChangeDetectorRef,
    private utils: CalendarUtils,
    @Inject(LOCALE_ID) locale: string
  ) {
    this.locale = locale;
  }

  /**
   * @hidden
   */
  public trackByEventId = (_index: number, event: CalendarEvent) => event.id;

  /**
   * @hidden
   */
  public trackByDayEvent = (_index: number, dayEvent: DayViewEvent) =>
    dayEvent.event.id ? dayEvent.event.id : dayEvent.event

  /**
   * @hidden
   */
  public trackByHour = (_index: number, hour: DayViewHour) =>
    hour.segments[0].date.toISOString()

  /**
   * @hidden
   */
  public trackByHourSegment = (_index: number, segment: DayViewHourSegment) =>
    segment.date.toISOString()

  /**
   * @hidden
   */
  public ngOnInit(): void {
    if (this.refresh) {
      this.refreshSubscription = this.refresh.subscribe(() => {
        this.refreshAll();
        this.cdr.markForCheck();
      });
    }
  }

  /**
   * @hidden
   */
  public ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  /**
   * @hidden
   */
  public ngOnChanges(changes: SimpleChanges): void {
    const values = Object.assign(changes) as { [key: string]: string };
    if (
      values.viewDate ||
      values.dayStartHour ||
      values.dayStartMinute ||
      values.dayEndHour ||
      values.dayEndMinute
    ) {
      this.refreshHourGrid();
    }

    if (values.events) {
      validateEvents(this.events, () => {});
    }

    if (
      values.viewDate ||
      values.events ||
      values.dayStartHour ||
      values.dayStartMinute ||
      values.dayEndHour ||
      values.dayEndMinute ||
      values.eventWidth
    ) {
      this.refreshView();
    }
  }

  public eventDropped(
    dropEvent: { dropData?: { event?: CalendarEvent } },
    segment: DayViewHourSegment
  ): void {
    if (dropEvent.dropData && dropEvent.dropData.event) {
      this.eventTimesChanged.emit({
        event: dropEvent.dropData.event,
        newStart: segment.date,
      });
    }
  }

  public resizeStarted(): void {
  }

  public resizing(event: DayViewEvent, resizeEvent: ResizeEvent): void {
    const currentResize: DayViewEventResize = this.currentResizes.get(event) as DayViewEventResize;
    if (resizeEvent.edges.top) {
      event.top = currentResize.originalTop + +resizeEvent.edges.top;
      event.height = currentResize.originalHeight - +resizeEvent.edges.top;
    } else if (resizeEvent.edges.bottom) {
      event.height = currentResize.originalHeight + +resizeEvent.edges.bottom;
    }
  }

  public resizeEnded(dayEvent: DayViewEvent): void {
    const currentResize: DayViewEventResize = this.currentResizes.get(dayEvent) as DayViewEventResize;

    let pixelsMoved: number;
    if (currentResize.edge === 'top') {
      pixelsMoved = dayEvent.top - currentResize.originalTop;
    } else {
      pixelsMoved = dayEvent.height - currentResize.originalHeight;
    }

    dayEvent.top = currentResize.originalTop;
    dayEvent.height = currentResize.originalHeight;

    const pixelAmountInMinutes: number =
      MINUTES_IN_HOUR / (this.hourSegments * this.hourSegmentHeight);
    const minutesMoved: number = pixelsMoved * pixelAmountInMinutes;
    let newStart: Date = dayEvent.event.start;
    let newEnd: Date = dayEvent.event.end as Date;
    if (currentResize.edge === 'top') {
      newStart = addMinutes(newStart, minutesMoved);
    } else if (newEnd) {
      newEnd = addMinutes(newEnd, minutesMoved);
    }

    this.eventTimesChanged.emit({ newStart, newEnd, event: dayEvent.event });
    this.currentResizes.delete(dayEvent);
  }

  public dragStart(): void {
  }

  public eventDragged(dayEvent: DayViewEvent, draggedInPixels: number): void {
    const pixelAmountInMinutes: number =
      MINUTES_IN_HOUR / (this.hourSegments * this.hourSegmentHeight);
    const minutesMoved: number = draggedInPixels * pixelAmountInMinutes;
    const newStart: Date = addMinutes(dayEvent.event.start, minutesMoved);
    let newEnd: Date | undefined;
    if (dayEvent.event.end) {
      newEnd = addMinutes(dayEvent.event.end, minutesMoved);
    }
    this.eventTimesChanged.emit({ newStart, newEnd, event: dayEvent.event });
  }

  private refreshHourGrid(): void {
    this.hours = this.utils.getDayViewHourGrid({
      viewDate: this.viewDate,
      hourSegments: this.hourSegments,
      dayStart: {
        hour: this.dayStartHour,
        minute: this.dayStartMinute,
      },
      dayEnd: {
        hour: this.dayEndHour,
        minute: this.dayEndMinute,
      },
    });
    this.emitBeforeViewRender();
  }

  private refreshView(): void {
    this.view = this.utils.getDayView({
      events: this.events,
      viewDate: this.viewDate,
      hourSegments: this.hourSegments,
      dayStart: {
        hour: this.dayStartHour,
        minute: this.dayStartMinute,
      },
      dayEnd: {
        hour: this.dayEndHour,
        minute: this.dayEndMinute,
      },
      eventWidth: this.eventWidth,
      segmentHeight: this.hourSegmentHeight,
    });
    this.emitBeforeViewRender();
  }

  private refreshAll(): void {
    this.refreshHourGrid();
    this.refreshView();
  }

  private emitBeforeViewRender(): void {
    if (this.hours && this.view) {
      this.beforeViewRender.emit({
        body: {
          hourGrid: this.hours,
        },
        period: this.view.period,
      });
    }
  }
}
