import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DfGroupToggle, DfGroupToggleItem } from '@devfactory/ngx-df';
import { addMinutes, format, startOfDay } from 'date-fns';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as BUTTON_LABELS from 'app/core/constants/my-dashboard/activity-button-labels';
import * as SCORE_LABELS from 'app/core/constants/my-dashboard/activity-score-labels';
import * as TIMEZONE_LABELS from 'app/core/constants/my-dashboard/activity-timezone-labels';
import { CurrentUserDetail } from 'app/core/models/identity';
import { Manager } from 'app/core/models/manager';
import {
  DaySlot,
  ProductivityGroup,
  ProductivityGroupList,
  Section,
  TimeBarStructure,
  TimeSlot,
} from 'app/core/models/productivity';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import { UserDashboardService } from 'app/shared/services/user-dashboard/user-dashboard.service';

@Component({
  selector: 'app-my-activity-page',
  templateUrl: './my-activity-page.component.html',
  styleUrls: ['./my-activity-page.component.scss'],
})
export class MyActivityPageComponent implements OnInit {
  public readonly buttonLabels = BUTTON_LABELS;
  public readonly scoreMessages = SCORE_LABELS;
  public readonly timeZoneLabels = TIMEZONE_LABELS;

  @Input()
  public assignmentId: number;

  @Input()
  public manager: Manager;

  @Input()
  public teamId: number;

  @Input()
  public userDetail: CurrentUserDetail;

  public period: string = this.buttonLabels.DAILY;
  public timePov: string;
  public managerOffset = 0;
  @ViewChild('displayModeElement') public displayModeElement: DfGroupToggle;
  public displayMode: DfGroupToggleItem;
  public displayModeItems: DfGroupToggleItem[] = [{
    text: this.buttonLabels.PERCENTAGE,
    disabled: false,
  },
  {
    text: this.buttonLabels.TIME,
    disabled: false,
  }];
  public displayToggle: DfGroupToggleItem = this.displayModeItems[0];

  public intensity: number;
  public focus: number;
  public alignment: number;
  public timeSlots = [] as TimeSlot[];
  public plannedTimeSlots = [] as TimeSlot[];
  public timeSlotsGrid: TimeBarStructure[] = [];
  public timeSlotsHeaders: string[] = [];

  public sections: Section[];
  public plannedSections: Section[];
  public date$: Observable<Date>;

  public destroy$ = new Subject();
  public isLoading = false;
  public dailyActivity: ProductivityGroup;
  public weeklyActivity: ProductivityGroup;
  public currentActivity: ProductivityGroup;

  constructor(
    private productivityService: ProductivityService,
    private dashboardService: UserDashboardService,
    private renderer: Renderer2
  ) { }

  public ngOnInit(): void {
    this.isLoading = true;
    this.setManagerTimezoneOffset();
    this.dashboardService.getDateStream()
      .subscribe(date => this.getActivities(date));

    this.displayToggle = this.displayModeItems[0];
    this.timePov = this.timeZoneLabels.CONTRACTOR_LABEL;

    this.buildTimeSlotStructure();
  }

  public setPlannedTimeBarScroll(): void {
    const timeSlotsBar = document.getElementById('timeSlotsBar');
    const plannedTimeSlotsBar = document.getElementById('plannedTimeSlotsBar');

    if (timeSlotsBar && plannedTimeSlotsBar) {
      plannedTimeSlotsBar.scrollLeft = timeSlotsBar.scrollLeft;
    }
  }

  public setTimeBarScroll(): void {
    const timeSlotsBar = document.getElementById('timeSlotsBar');
    const plannedTimeSlotsBar = document.getElementById('plannedTimeSlotsBar');

    if (timeSlotsBar && plannedTimeSlotsBar) {
      timeSlotsBar.scrollLeft = plannedTimeSlotsBar.scrollLeft;
    }
  }

  public getSlotColor(slot: TimeSlot): string {
    return slot.color || 'white';
  }

  public onDisplayModeToggleChange(event: DfGroupToggleItem): void {
    this.displayMode = event;
    if (event.text === this.buttonLabels.PERCENTAGE) {
      this.displayModeItems[1].disabled = false;
    } else {
      this.listenTimeZoneTooltips();
    }
  }

  // TODO: This method will be removed once tooltips will be available in group toggle components
  public listenTimeZoneTooltips(timePov?: string): void {
    const timePovButtonElements = document.querySelectorAll('#timePov .df-group-toggle__item');

    if (timePovButtonElements.length === 0) {
      return;
    }

    if (timePov || this.timePov === this.timeZoneLabels.MANAGER_LABEL) {
      this.renderer.listen(timePovButtonElements[0], 'mouseover', () => {
        setTimeout(() => {
          const managerTooltip = document.querySelector('.tooltip-manager .df-tooltip--top');
          if (!managerTooltip) {
            return;
          }
          this.renderer.setStyle(managerTooltip, 'display', 'block');
          const timeZoneTooltipElement = document.querySelector('#group-toggle-container .df-tooltip__content span');
          this.renderer.setProperty(timeZoneTooltipElement, 'innerText', this.timeZoneLabels.MANAGER_TEXT);
        });
      });
    } else {
      this.renderer.listen(timePovButtonElements[1], 'mouseover', () => {
        setTimeout(() => {
          const contractorTooltip = document.querySelector('.tooltip-contractor .df-tooltip--top');
          if (!contractorTooltip) {
            return;
          }
          this.renderer.setStyle(contractorTooltip, 'display', 'block');
          const timeZoneTooltipElement = document.querySelector('#group-toggle-container .df-tooltip__content span');
          this.renderer.setProperty(timeZoneTooltipElement, 'innerText', this.timeZoneLabels.CONTRACTOR_TEXT);
        });
      });
    }
  }

  public onManagerToggleChange(event: string): void {
    let offset: number;
    if (event === this.timeZoneLabels.CONTRACTOR_LABEL) {
      this.buildActivityBar();
      this.buildTimeActivityBar();
    } else {
      offset = this.managerOffset;
      this.shiftTimeSlots(offset);
    }

    this.listenTimeZoneTooltips(event);
  }

  public shiftTimeSlots(offset: number): void {
    if (offset > 0) {
      for (let i = 0; i < offset; i++) {
        this.timeSlots.pop();
        this.timeSlots.unshift(Object.assign({}));
      }
    } else {
      offset = Math.abs(offset);
      this.timeSlots = this.timeSlots.slice(offset);
      for (let i = 0; i < offset; i++) {
        this.timeSlots.push(Object.assign({}));
      }
    }
  }

  public onPeriodToggleChange(event: string): void {
    if (event === this.buttonLabels.DAILY) {
      this.displayModeItems[1].disabled = false;
    }

    if (event === this.buttonLabels.WEEKLY && this.displayToggle.text === this.buttonLabels.PERCENTAGE) {
      this.displayModeItems[1].disabled = true;
    }

    if (event === this.buttonLabels.WEEKLY && this.displayToggle.text === this.buttonLabels.TIME) {
      this.displayModeElement.selectItem(this.displayModeItems[0]);
      this.displayModeItems[1].disabled = true;
    }
    this.dashboardService.updateActivityPeriod(event);
    this.period = event;
    this.buildActivityBar();
  }

  public getIntensityTheme(): string {
    return this.getTheme(this.currentActivity.grouping.intensityScore);
  }

  public getFocusTheme(): string {
    return this.getTheme(this.currentActivity.grouping.focusScore);
  }

  public getAlignmentTheme(): string {
    return this.getTheme(this.currentActivity.grouping.alignmentScore);
  }

  public getTheme(score: number): string {
    const themeConditions = [
      {
        condition: () => score < 30,
        className: 'danger',
      },
      {
        condition: () => score < 70,
        className: 'warning',
      },
      {
        condition: () => true,
        className: 'success',
      },
    ];
    return themeConditions.filter(entry => entry.condition())[0].className;
  }

  public activityIntersectsWithPlanned(slot: TimeSlot): boolean {
    return !!(slot.plannedSectionName && slot.plannedSectionName.length);
  }

  public getElementBackground(section: Section): string {
    return section.color;
  }

  public get totalTimeLabel(): string {
    return this.period === this.buttonLabels.DAILY ? 'day' : 'week';
  }

  public showSpentTimeForManagerPlan(spentTime: number): number {
    const weekDays = 5;
    return this.period === this.buttonLabels.WEEKLY ? spentTime * weekDays : spentTime;
  }

  public showSpentTimeInHoursFormat(spentTime: number): string {
    const minutesPerHour = 60;
    const hours = Math.floor(spentTime / minutesPerHour);
    const minutes = spentTime % minutesPerHour;
    return `${hours}h ${minutes}m`;
  }

  public setManagerTimezoneOffset(): void {
    const managerTimezoneStrategies = [
      {
        condition: () => this.userDetail.assignment && typeof(this.userDetail.assignment.manager) === 'object',
        value: () => this.userDetail.assignment.manager.location.timeZone,
      },
      {
        condition: () => !!this.manager && !!this.manager.location,
        value: () => this.manager.location.timeZone,
      },
      {
        condition: () => true,
        value: () => null,
      },
    ];
    const contractorTimezone = this.userDetail.location.timeZone;
    const managerTimezone = managerTimezoneStrategies
      .filter(strategy => strategy.condition())[0].value();
    if (contractorTimezone && managerTimezone) {
      this.managerOffset = (managerTimezone.offset - contractorTimezone.offset) / 1000 / 60 / 10;
    }
  }

  private getActivities(date: Date): void {
    this.isLoading = true;
    forkJoin(
      this.productivityService.getDailyActivity(
        format(date, 'YYYY-MM-DD'),
        this.assignmentId.toString()
      ),
      this.productivityService.getWeeklyActivity(
        format(date, 'YYYY-MM-DD'),
        this.assignmentId.toString()
      ),
      this.productivityService.getDailyPlanned(
        this.assignmentId.toString(),
        'groups',
        this.teamId.toString()
      )
    )
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(([dailyActivity, weeklyActivity, plannedSections]) => {
        this.dailyActivity = dailyActivity[0];
        this.weeklyActivity = weeklyActivity[0];
        this.plannedSections = plannedSections.groupedList.map((group: ProductivityGroupList) => {
          const section: Section = { color: 'white', percentage: 0, groupItems: [], spentTime: 0 };
          section.sectionName = group.activity.name;
          section.color = group.activity.color;
          section.spentTime = group.plannedTime;
          return section;
        });

        // Load planned time slots
        const plannedTimeSlots: Partial<TimeSlot>[] = Array.from({ length: 50 }, () => <Partial<TimeSlot>>{});
        let plannedTimeLength = plannedTimeSlots.length;
        plannedSections.daySlots.map((plannedSlot: DaySlot) => {
          if (plannedSlot.activity) {
            plannedTimeSlots.push({
              timeSlot: this.getTimeSlot(plannedTimeLength),
              plannedSectionName: plannedSlot.activity.name,
              color: plannedSlot.activity.color,
            });
            plannedTimeLength++;
          }
        });

        const totalPlannedTimeSlots = 144;
        const secondaryLength: number = totalPlannedTimeSlots - plannedTimeLength;
        const plannedTimeSlotsSecondary: Partial<TimeSlot>[] = Array.from({ length: secondaryLength }, () => <Partial<TimeSlot>>{});
        this.plannedTimeSlots = Object.assign(plannedTimeSlots.concat(plannedTimeSlotsSecondary)) as TimeSlot[];

        this.buildActivityBar();
        this.buildTimeActivityBar();
      });
  }

  private buildTimeActivityBar(): void {
    const slot: Partial<TimeSlot> = {};
    if (this.dailyActivity) {
      const timeSlots: Partial<TimeSlot>[] = [];
      this.dailyActivity.dayActivitiesTime.contractorTimeSlots.forEach((timeSlot: TimeSlot | null) => {
        if (timeSlot !== null) {
          timeSlot.timeSlot = this.getTimeSlot(timeSlot.index);
          this.setPlannedSection(timeSlot);
          timeSlots.push(timeSlot);
        } else {
          timeSlots.push(slot);
        }
      });
      this.timeSlots = Object.assign(timeSlots) as TimeSlot[];

      if (this.timePov === this.timeZoneLabels.MANAGER_LABEL) {
        this.shiftTimeSlots(this.managerOffset);
      }
    }
  }

  private setPlannedSection(slot: TimeSlot): void {
    const plannedSlot = this.plannedTimeSlots[slot.index];
    if (plannedSlot.plannedSectionName) {
      slot.plannedSectionName = plannedSlot.plannedSectionName;
    }
  }

  private getTimeSlot(slot: number): string {
    const timeCardMinutes = 10;
    const today = startOfDay(new Date());
    const start = addMinutes(today, slot * timeCardMinutes);
    const end = addMinutes(today, slot * timeCardMinutes + timeCardMinutes);
    return `${format(start, 'hh:mm aa')} - ${format(end, 'hh:mm aa')}`;
  }

  private buildActivityBar(): void {
    if (this.dailyActivity) {
      let sections: Section[];
      if (this.period === this.buttonLabels.DAILY) {
        this.currentActivity = this.dailyActivity;
        sections = this.dailyActivity.grouping.advancedGroups as Section[];
      } else {
        this.currentActivity = this.weeklyActivity;
        sections = this.weeklyActivity.grouping.advancedGroups as Section[];
      }

      // User's activities
      if (sections.length) {
        const hourMinutes = 60;
        const workdayInHours = 8;
        const weekdaysInHours = 40;
        const dailyTotalMinutes = hourMinutes * workdayInHours;
        let total = this.dailyActivity.grouping.totalTrackedTime;
        total = Math.max(total, dailyTotalMinutes) < dailyTotalMinutes ? dailyTotalMinutes : total;

        if (this.period === this.buttonLabels.WEEKLY) {
          const weeklyTotalMinutes = hourMinutes * weekdaysInHours;
          total = this.weeklyActivity.grouping.totalTrackedTime;
          total = Math.max(total, weeklyTotalMinutes) <= weeklyTotalMinutes ? weeklyTotalMinutes : total;
        }

        sections = sections
          .sort((sectionA, sectionB) => sectionB.spentTime - sectionA.spentTime)
          .map(section => {
            section.percentage = section.spentTime / total * 100;
            section.percentageRounded = Math.round(section.percentage);

            // Calculate for each group
            const sectionTotal = section.groupItems
              .map((item) => item.spentTime)
              .reduce((timeA, timeB) => timeA + timeB);
            section.groupItems = section.groupItems
              .map((item) => {
                item.percentage = Math.round(item.spentTime / sectionTotal * 100);
                return item;
              })
              .sort((itemA, itemB) => itemB.spentTime - itemA.spentTime);

            return section;
          });
      }
      this.sections = sections;

      // Planned activities
      const planned = this.plannedSections;
      if (planned.length) {
        const total = planned
          .map(section => section.spentTime)
          .reduce((timeA, timeB) => timeA + timeB);

        planned
          .sort((sectionA, sectionB) => sectionB.spentTime - sectionA.spentTime)
          .map(section => {
            section.percentage = section.spentTime / total * 100;
            section.percentageRounded = Math.round(section.percentage);

            return section;
          });
      }
    }
  }

  private buildTimeSlotStructure(): void {
    const DAILY_SLOTS = 144;
    const HOURLY_INTERVALS = 6;
    const TIME_BAR_HOURS = 24;
    const NOON = 12;

    for (let i = 0; i < DAILY_SLOTS; i++) {
      this.timeSlotsGrid.push({
        hourStart: i % HOURLY_INTERVALS === 0,
        hourEnd: i % HOURLY_INTERVALS === 5,
      });
    }

    for (let i = 0; i < TIME_BAR_HOURS; i++) {
      const header = `${i % NOON === 0 ? NOON : i % NOON}:00 ${i < NOON ? 'AM' : 'PM'}`;
      this.timeSlotsHeaders.push(header);
    }
  }
}
