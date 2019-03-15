import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Assignment } from 'app/core/models/assignment';
import { addDays, addMinutes, format, startOfDay, startOfToday, subDays } from 'date-fns';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { finalize } from 'rxjs/operators';

import * as scoreLabels from 'app/core/constants/my-dashboard/activity-score-labels';
import * as PerformanceLevels from 'app/core/constants/rank-review/performance-levels';
import { CurrentUserDetail } from 'app/core/models/identity';
import { WorkDiariesFilters, WorkDiary } from 'app/core/models/logbook';
import { ProductivityGroup, TimeBarStructure, TimeSlot } from 'app/core/models/productivity';
import { TeamManagerGroup } from 'app/core/models/team';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import { OnlineStatusService } from 'app/core/services/timetracking/online-status.service';
import { TimetrackingService } from 'app/core/services/timetracking/timetracking.service';

@Component({
  selector: 'app-contractor-activity',
  templateUrl: './contractor-activity.component.html',
  styleUrls: ['./contractor-activity.component.scss'],
})
export class ContractorActivityComponent implements OnInit{
  public today = startOfToday();

  @HostBinding('class')
  public readonly classes = 'overflow-visible';

  @Input()
  public assignment: Assignment;

  @Input()
  public currentWorkDiaries: WorkDiary[] = [];

  @Output()
  public close = new EventEmitter<{}>();

  public alignment: number;
  public intensity: number;
  public focus: number;

  public ALIGNMENT_LABEL = scoreLabels.alignmentScore;
  public INTENSITY_LABEL = scoreLabels.intensityScore;
  public FOCUS_LABEL = scoreLabels.focusScore;

  public dateControl: FormControl = new FormControl(this.today);
  public isLoading = false;

  public timeSlotsGrid: TimeBarStructure[] = [];
  public timeSlotsHeaders: string[] = [];
  public timeSlots = [] as TimeSlot[];
  public workDiaries = [] as Array<WorkDiary | null>;

  public dailyActivity: ProductivityGroup;
  public selectedTimeSlot: TimeSlot | undefined;

  public currentTeam: TeamManagerGroup | null;

  public currentImageUrl: string | undefined;

  constructor(
    private productivityService: ProductivityService,
    private timetrackingService: TimetrackingService,
    private identityService: IdentityService,
    private onlineStatusService: OnlineStatusService
  ) { }

  public ngOnInit(): void {
    this.currentTeam = this.identityService.getTeamManagerGroupSelectionValue();
    this.buildTimeSlotStructure();
    this.dateControl.valueChanges.subscribe(date => this.fetchContractorActivity(date));
    this.fetchContractorActivity(this.today);
  }

  public getScoreClass(value: number, maxValue: number): string {
    const types = Object.keys(PerformanceLevels)
      .map(key => PerformanceLevels[key as keyof typeof PerformanceLevels]);
    return types.filter(entry => entry.threshold(value, maxValue))[0].cssClass;
  }

  public onClose(): void {
    this.close.emit();
  }

  public getScorePercentage(score: number): number {
    return Math.round(score);
  }

  public nextDay(): void {
    this.dateControl.setValue(addDays(this.dateControl.value, 1));
  }

  public previousDay(): void {
    this.dateControl.setValue(subDays(this.dateControl.value, 1));
  }

  public fetchToday(): void {
    this.dateControl.setValue(this.today);
  }

  public fetchContractorActivity(date: Date): void {
    this.isLoading = true;
    const formattedDate = format(date, 'YYYY-MM-DD');
    const workDiariesFilter = {
      assignmentId: this.assignment.id,
      date: formattedDate
    } as WorkDiariesFilters;
    if (this.assignment.candidate.location && this.assignment.candidate.location.timeZone) {
      workDiariesFilter.timeZoneId = this.assignment.candidate.location.timeZone.id;
    }

    const teamOwnerId = this.currentTeam && this.currentTeam.team.teamOwner
      ? this.currentTeam.team.teamOwner.id
      : (this.identityService.getCurrentUserValue() as CurrentUserDetail).managerAvatar.id;

    forkJoin(
      this.productivityService.getDailyActivity(
        formattedDate,
        undefined,
        teamOwnerId.toString(),
        this.assignment.id.toString(),
        this.assignment.team.id.toString()
      ),
      this.timetrackingService.getWorkDiaries(workDiariesFilter)
    )
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(([dailyActivity, workDiaries]) => {
        this.dailyActivity = dailyActivity[0];
        this.intensity = dailyActivity[0].grouping.intensityScore;
        this.focus = dailyActivity[0].grouping.focusScore;
        this.alignment = dailyActivity[0].grouping.alignmentScore;
        this.buildTimeActivityBar();
        this.buildWorkDiaries(workDiaries);
        this.selectFirstTimeSlot();
      });
  }

  public buildWorkDiaries(workDiaries: WorkDiary[]): void {
    let i = 0;
    this.workDiaries = [];
    this.timeSlots.forEach(timeSlot => {
      if (timeSlot !== null && timeSlot.index !== undefined) {
        this.workDiaries.push(workDiaries[i]);
        i++;
      } else {
        this.workDiaries.push(null);
      }
    });
  }

  public getDailyFormat(date: Date): string {
    return `${format(date, 'MMMM')} ${date.getDate()}`;
  }

  public getSlotColor(slot: TimeSlot): string {
    return slot.color || 'white';
  }

  public selectTimeSlot(index: number | undefined): void {
    if (index !== undefined) {
      this.selectedTimeSlot = this.timeSlots[index];
      if (this.selectedTimeSlot && this.workDiaries[this.selectedTimeSlot.index]) {
        this.currentImageUrl = (<WorkDiary>this.workDiaries[this.selectedTimeSlot.index]).screenshot.url;
        return;
      }
    }
    this.selectedTimeSlot = undefined;
    this.currentImageUrl = undefined;
  }

  public getOpacity(index: number): string {
    return this.selectedTimeSlot === this.timeSlots[index] ? 'selected-slot' : 'regular-slot';
  }

  public getSlotHeight(index: number): string {
    return this.selectedTimeSlot === this.timeSlots[index] ? '100' : '75';
  }

  public getSnapshotTaken(): string {
    const timeSlot = _.defaultTo(_.get(this.selectedTimeSlot, 'timeSlot'), '');
    return timeSlot.split('-')[0];
  }

  public getActiveWindow(): string {
    if (this.selectedTimeSlot && this.workDiaries[this.selectedTimeSlot.index]) {
      const workDiary = (<WorkDiary>this.workDiaries[this.selectedTimeSlot.index]).screenshot;
      return workDiary.currentWindow;
    }
    return '';
  }

  public isFirstSlot(): boolean {
    if (!this.selectedTimeSlot) {
      return false;
    }
    let index = this.selectedTimeSlot.index - 1;
    while (index >= 0) {
      if (this.timeSlots[index].index !== undefined) {
        return false;
      }

      index--;
    }
    return true;
  }

  public isLastSlot(): boolean {
    if (!this.selectedTimeSlot) {
      return false;
    }
    let index = this.selectedTimeSlot.index + 1;
    while (index < this.timeSlots.length) {
      if (this.timeSlots[index].index !== undefined) {
        return false;
      }
      index++;
    }
    return true;
  }

  public nextTimeSlot(): void {
    if (!this.selectedTimeSlot) {
      return;
    }
    let index = this.selectedTimeSlot.index + 1;
    while (index < this.timeSlots.length) {
      if (this.timeSlots[index].index !== undefined) {
        this.selectTimeSlot(index);
        break;
      }

      index++;
    }
  }

  public selectFirstTimeSlot(): void {
    let index = 0;
    while (index >= 0 && index < this.timeSlots.length) {
      if (this.timeSlots[index].index !== undefined) {
        this.selectTimeSlot(index);
        return;
      }
      index++;
    }
    this.selectTimeSlot(undefined);
  }

  public previousTimeSlot(): void {
    if (!this.selectedTimeSlot) {
      return;
    }
    let index = this.selectedTimeSlot.index - 1;
    while (index >= 0) {
      if (this.timeSlots[index].index !== undefined) {
        this.selectTimeSlot(index);
        break;
      }

      index--;
    }
  }

  public getOnlineStatusClass(): string {
    const workDiary = this.onlineStatusService.getWorkDiary(this.assignment, this.currentWorkDiaries);
    return workDiary ? this.onlineStatusService.getWorkDiaryOnlineStatusClass(workDiary) : '';
  }

  private buildTimeActivityBar(): void {
    const slot: Partial<TimeSlot> = {};
    if (this.dailyActivity) {
      const timeSlots: Partial<TimeSlot>[] = [];
      this.dailyActivity.dayActivitiesTime.contractorTimeSlots.forEach((timeSlot: TimeSlot | null) => {
        if (timeSlot !== null) {
          timeSlot.timeSlot = this.getTimeSlot(timeSlot.index);
          timeSlots.push(timeSlot);
        } else {
          timeSlots.push(slot);
        }
      });
      this.timeSlots = Object.assign(timeSlots) as TimeSlot[];
    }
  }

  private getTimeSlot(slot: number): string {
    const timeCardMinutes = 10;
    const today = startOfDay(new Date());
    const start = addMinutes(today, slot * timeCardMinutes);
    const end = addMinutes(today, slot * timeCardMinutes + timeCardMinutes);
    return `${format(start, 'hh:mm aa')} - ${format(end, 'hh:mm aa')}`;
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
