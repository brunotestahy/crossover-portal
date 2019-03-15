import { Component, EventEmitter, Input, OnChanges, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DfModalService } from '@devfactory/ngx-df';
import {
  addDays,
  addWeeks,
  eachDay,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isSameDay,
  isWeekend,
  startOfMonth,
  startOfToday,
  startOfWeek,
  subWeeks,
} from 'date-fns';

import { CHECKIN_STATUSES } from 'app/core/constants/contractor/check-in-statuses';
import * as PeriodConstants from 'app/core/constants/period';
import { TeamFeature } from 'app/core/models/app';
import { Assignment } from 'app/core/models/assignment';
import { CurrentUserDetail } from 'app/core/models/identity';
import {
  AssignmentSummary,
  BlocksStreak,
  CheckIn,
  CheckInChartMetricsData,
  CheckInStatus,
  ProductivitySummary,
  TeamMember,
  TeamMemberCheckIn,
  WeeklyMemberCheckInSummary,
} from 'app/core/models/productivity';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import { isApiError } from 'app/core/type-guards/is-api-error';
import { SkypeModalComponent } from 'app/shared/components/skype-modal/skype-modal.component';

@Component({
  selector: 'app-check-in-chats-member',
  templateUrl: './check-in-chats-member.component.html',
  styleUrls: ['./check-in-chats-member.component.scss'],
})
export class CheckInChatsMemberComponent implements OnChanges {

  private static readonly STATE_ON_TRACK = 'on-track';
  private static readonly STATE_PENDING_BLOCKED = 'pending-blocked';
  private static readonly STATE_PENDING_UNBLOCKED = 'pending-unblocked';
  private static readonly STATE_NOT_DONE = 'not-done';
  private static readonly METRICS_WEEKS_COUNT = 4;
  private static readonly TEAM_PERIOD_FOUR_WEEKS = 'Last 4 Weeks';
  private static readonly TEAM_PERIOD_LAST_WEEK = 'Last Week';
  private static readonly TEAM_PERIOD_CURRENT_WEEK = 'Current Week';
  private static readonly LAST_WEEK_INDEX = 1;
  private static readonly CURRENT_WEEK_INDEX = 0;

  private today = startOfToday();

  @Input()
  public managerMode: boolean;
  @Input()
  public periodMode: string;
  @Input()
  public checkins: CheckIn[];
  @Input()
  public blocksStreaks: BlocksStreak[];
  @Input()
  public startDate: Date;
  @Input()
  public currentUserDetail: CurrentUserDetail;
  @Input()
  public teamMember: TeamMember;
  @Input()
  public teamMembers: TeamMember[];
  @Input()
  public summary: ProductivitySummary;
  @Input()
  public teamFeature: TeamFeature;

  @Output()
  public refresh = new EventEmitter<{}>();

  public teamPeriodToggleItems: string[] = [
    CheckInChatsMemberComponent.TEAM_PERIOD_FOUR_WEEKS,
    CheckInChatsMemberComponent.TEAM_PERIOD_LAST_WEEK,
    CheckInChatsMemberComponent.TEAM_PERIOD_CURRENT_WEEK,
  ];
  public teamCheckinsDaily: WeeklyMemberCheckInSummary[] = [];
  public teamCheckinsWeekly: WeeklyMemberCheckInSummary[] = [];
  public teamCheckinsMonthly: WeeklyMemberCheckInSummary[] = [];
  public weekDayHeaders = ['', '', '' , '', ''];
  public monthDays: number[] = [];
  public selectedTeamMemberCheckin: TeamMemberCheckIn = {} as TeamMemberCheckIn;
  public contractorHoursLogged: CheckInChartMetricsData[] = [];
  public contractorMetrics: CheckInChartMetricsData[] = [];
  public checkInForm = new FormBuilder().group({
    checkInComments: [null, []],
    status: [null, []],
    unblocked: ['Yes', []],
  });
  public statuses = CHECKIN_STATUSES;
  public periodConstants = PeriodConstants;
  public error: string | null = null;
  public teamPeriod = '';
  public selectedTeamMembers: TeamMember[] = [];

  @ViewChild('hoursLoggedModal')
  public hoursLoggedModal: TemplateRef<{}>;

  @ViewChild('screensReleasedModal')
  public screensReleasedModal: TemplateRef<{}>;

  @ViewChild('checkInModal')
  public checkInModal: TemplateRef<{}>;

  @ViewChildren(SkypeModalComponent)
  public skypeTooltips: QueryList<SkypeModalComponent>;

  constructor(
    private productivityService: ProductivityService,
    private modalService: DfModalService
  ) { }

  public ngOnChanges(): void {
    this.setupMembers();
    this.onStatusChange();
  }

  public xAxisTickFormatter(value: Date): string {
    return format(value, 'MMM DD');
  }

  public hideSkypeTooltip(): void {
    this.skypeTooltips.forEach(skypeTooltip => skypeTooltip.hide());
  }

  public openCheckInModal(item: WeeklyMemberCheckInSummary, status: CheckInStatus | undefined, day: number): void {
    if (status && status.isEditable) {
      const date = this.calculateChekinModalDate(day);
      const weekDayCheckin = this.checkins
        .find(checkin => isSameDay(checkin.date, date)  && checkin.assignmentId === item.assignmentId);
      const comment = weekDayCheckin && weekDayCheckin.comment ? weekDayCheckin.comment : null;
      const unblocked = weekDayCheckin ? weekDayCheckin.unblocked : false;
      this.checkInForm.controls.status.setValue(status.key);
      this.checkInForm.controls.checkInComments.setValue(comment);
      this.checkInForm.controls.unblocked.setValue(unblocked ? 'Yes' : 'No');
      this.selectedTeamMemberCheckin.checkin = weekDayCheckin;
      this.selectedTeamMemberCheckin.date = this.getDailyFormat(date);
      this.selectedTeamMemberCheckin.photoUrl = item.photoUrl;
      this.selectedTeamMemberCheckin.fullName = item.fullName;
      this.modalService.open(this.checkInModal);
    }
  }

  public isUnblockedToggleEnabled(): boolean {
    return ['ON_TRACK', 'NOT_DONE'].indexOf(this.checkInForm.value.status) === -1;
  }

  public openScreensReleased(teamCheckIn: WeeklyMemberCheckInSummary): void {
    const contractorSummary = this.findContractor(teamCheckIn.contractorId);
    if (contractorSummary) {
      this.buildScreensReleasedChart(contractorSummary);
      this.modalService.open(this.screensReleasedModal);
    }
  }

  public openHoursLogged(teamCheckIn: WeeklyMemberCheckInSummary): void {
    const contractorSummary = this.findContractor(teamCheckIn.contractorId);
    if (contractorSummary) {
      this.buildHoursLoggedChart(contractorSummary);
      this.modalService.open(this.hoursLoggedModal);
    }
  }

  public modifyCheckins(close: Function): void {
    close();
    if (this.selectedTeamMemberCheckin.checkin) {
      this.selectedTeamMemberCheckin.checkin.status = this.checkInForm.value.status;
      this.selectedTeamMemberCheckin.checkin.unblocked = this.checkInForm.value.unblocked === 'Yes';
      this.selectedTeamMemberCheckin.checkin.comment = this.checkInForm.value.checkInComments;
      if (this.selectedTeamMemberCheckin.checkin.id) {
        this.productivityService.updateCheckIn(this.selectedTeamMemberCheckin.checkin).subscribe(() => {
          this.refresh.emit({});
        }, error => {
          if (isApiError(error)) {
            this.error = error.error.text;
          } else {
            this.error = 'Error updating checkin.';
          }
        });
      } else {
        this.productivityService.insertCheckIn(this.selectedTeamMemberCheckin.checkin).subscribe(() => {
          this.refresh.emit({});
        }, error => {
          if (isApiError(error)) {
            this.error = error.error.text;
          } else {
            this.error = 'Error inserting checkin.';
          }
        });
      }
    }
  }

  public onTeamPeriodChange(event: string): void {
    this.teamPeriod = event;
  }

  public getHoursLogged(teamCheckIn: WeeklyMemberCheckInSummary): string | undefined {
    if (this.teamPeriod === CheckInChatsMemberComponent.TEAM_PERIOD_LAST_WEEK) {
      return teamCheckIn.hoursLastWeek;
    } else if (this.teamPeriod === CheckInChatsMemberComponent.TEAM_PERIOD_CURRENT_WEEK) {
      return teamCheckIn.hoursCurrentWeek;
    }
    return teamCheckIn.hours;
  }

  public getMetrics(teamCheckIn: WeeklyMemberCheckInSummary): string | undefined {
    if (this.teamPeriod === CheckInChatsMemberComponent.TEAM_PERIOD_LAST_WEEK) {
      return teamCheckIn.metricLastWeek;
    } else if (this.teamPeriod === CheckInChatsMemberComponent.TEAM_PERIOD_CURRENT_WEEK) {
      return teamCheckIn.metricCurrentWeek;
    }
    return teamCheckIn.metric;
  }

  public getMonthlyStatusTooltip(status: CheckInStatus): string {
    const comment = status.comment ? status.comment : '';
    return this.managerMode ? comment : `${status.name} ${comment}`;
  }

  private setupMembers(): void {
    if (this.periodMode === PeriodConstants.WEEKLY) {
      const start = startOfWeek(this.startDate, {weekStartsOn: 1});
      this.weekDayHeaders = this.weekDayHeaders
      .map((_entry, index) => this.getWeekDayHeader(index, start));
    }
    if (this.periodMode === PeriodConstants.MONTHLY) {
      this.setMonthDays(this.startDate);
    }
    this.buildTeamMembers();
  }

  private getWeekDayHeader(day: number, start: Date): string {
    const weekDay = addDays(start, day);
    return `${weekDay.getDate()}`;
  }

  private buildTeamMembers(): void {
    this.teamCheckinsDaily = [];
    this.teamCheckinsWeekly = [];
    this.teamCheckinsMonthly = [];
    this.selectedTeamMembers = [];
    if (this.teamMember) {
      this.selectedTeamMembers.push(this.teamMember);
    } else {
      this.selectedTeamMembers = Object.assign(this.teamMembers, {});
    }
    this.buildTeamMembersContractors();
  }

  private buildTeamMembersContractors(): void {
    this.selectedTeamMembers.forEach(teamMember => {
      const currentAssignmentSummary = this.summary.assignments
      .find(assignment => teamMember.assignment.id === assignment.id);
      if (currentAssignmentSummary) {
        this.buildTeamMember(teamMember.assignment, currentAssignmentSummary);
      }
    });
  }

  private buildTeamMember(assignment: Assignment, currentAssignmentSummary: AssignmentSummary): void {
    const candidate = assignment.candidate;
    const currentCheckIn: WeeklyMemberCheckInSummary = {} as WeeklyMemberCheckInSummary;
    if (candidate.printableName) {
      currentCheckIn.fullName = candidate.printableName;
    }
    const location = candidate.location;
    if (location) {
      const timezone = location.timeZone;
      if (timezone) {
        const localTime = this.getUTC(timezone.offset);
        currentCheckIn.localTime = `${format(localTime, 'HH:mm')} (GMT${this.getOffsetInHours(timezone.offset)})`;
      }
    }

    currentCheckIn.assignmentId = assignment.id;
    currentCheckIn.contractorId = candidate.id;
    currentCheckIn.photoUrl = candidate.photoUrl;
    currentCheckIn.skypeId = candidate.skypeId;
    currentCheckIn.metric = this.getFormattedMetric(currentAssignmentSummary);
    currentCheckIn.metricLastWeek = this.getFormattedMetricLastWeek(currentAssignmentSummary);
    currentCheckIn.metricCurrentWeek = this.getFormattedMetricCurrentWeek(currentAssignmentSummary);
    currentCheckIn.hours = `${Math.round(currentAssignmentSummary.recordedHoursPastWeeksAvg)} h`;
    currentCheckIn.hoursLastWeek =
      `${Math.round(currentAssignmentSummary.recordedHours[CheckInChatsMemberComponent.LAST_WEEK_INDEX])} h`;
    currentCheckIn.hoursCurrentWeek =
      `${Math.round(currentAssignmentSummary.recordedHours[CheckInChatsMemberComponent.CURRENT_WEEK_INDEX])} h`;
    currentCheckIn.blockStreak = this.getBlockStreaks(assignment.id);
    if (this.periodMode === PeriodConstants.DAILY) {
      this.setupDailyCheckins(currentCheckIn);
      this.teamCheckinsDaily.push(currentCheckIn);
    } else if (this.periodMode === PeriodConstants.WEEKLY) {
      this.setupWeeklyCheckins(currentCheckIn);
      this.teamCheckinsWeekly.push(currentCheckIn);
    } else if (this.periodMode === PeriodConstants.MONTHLY) {
      this.setupMonthlyCheckins(currentCheckIn);
      this.teamCheckinsMonthly.push(currentCheckIn);
    }
  }

  private getBlockStreaks(assignmentId: number): number {
    const currentBlockStreak = this.blocksStreaks.find(blockstreak => blockstreak.assignmentId === assignmentId);
    return currentBlockStreak ? currentBlockStreak.streakCount : 0;
  }

  private setupDailyCheckins(currentCheckIn: WeeklyMemberCheckInSummary): void {
    const currentDayCheckin = this.checkins
      .find(checkin => isSameDay(checkin.date, this.startDate) && checkin.assignmentId === currentCheckIn.assignmentId) as CheckIn;
    if (currentDayCheckin) {
      const currentStatus = Object.assign({}, CHECKIN_STATUSES.find(status => {
        return currentDayCheckin.status === status.key;
      }));
      if (currentStatus) {
        currentStatus.state = this.getCheckinState(currentStatus, currentDayCheckin.unblocked);
        currentStatus.isEditable = this.isEditableCheckin(this.startDate);
        currentStatus.comment = currentDayCheckin.comment ? currentDayCheckin.comment : undefined;
      }
      currentCheckIn.today = currentStatus;
      currentCheckIn.blockage = currentDayCheckin.blockageStatus;
      currentCheckIn.comments = currentDayCheckin.comment ? currentDayCheckin.comment : 'No comments';
    }
  }

  private setupWeeklyCheckins(currentCheckIn: WeeklyMemberCheckInSummary): void {
    const start = startOfWeek(this.startDate, {weekStartsOn: 1});
    const weekDays = eachDay(start, addDays(endOfWeek(start), 1)).filter(day => !isWeekend(day));
    currentCheckIn.monday = this.setWeekDayCheckinStatus(weekDays[0], currentCheckIn);
    currentCheckIn.tuesday = this.setWeekDayCheckinStatus(weekDays[1], currentCheckIn);
    currentCheckIn.wednesday = this.setWeekDayCheckinStatus(weekDays[2], currentCheckIn);
    currentCheckIn.thursday = this.setWeekDayCheckinStatus(weekDays[3], currentCheckIn);
    currentCheckIn.friday = this.setWeekDayCheckinStatus(weekDays[4], currentCheckIn);
  }

  private setWeekDayCheckinStatus(weekDay: Date, currentCheckIn: WeeklyMemberCheckInSummary): CheckInStatus | undefined {
    if (isAfter(weekDay, this.today)) {
      return undefined;
    }
    const currentDayCheckin = this.checkins
      .find(checkin => isSameDay(checkin.date, weekDay) && checkin.assignmentId === currentCheckIn.assignmentId) as CheckIn;
    if (currentDayCheckin) {
      const currentStatus = Object.assign({}, CHECKIN_STATUSES.find(status => {
        return currentDayCheckin.status === status.key;
      }));

      if (currentStatus) {
        currentStatus.state = this.getCheckinState(currentStatus, currentDayCheckin.unblocked);
        currentStatus.isEditable = this.isEditableCheckin(weekDay);
        currentStatus.comment = currentDayCheckin.comment ? currentDayCheckin.comment : undefined;
        return currentStatus;
      }
    }
    return undefined;
  }

  private setupMonthlyCheckins(currentCheckIn: WeeklyMemberCheckInSummary): void  {
    currentCheckIn.monthDaysStatuses = new Array(this.monthDays.length).fill(undefined);
    this.monthDays.forEach((monthDay, index) => {
      const dayDate = addDays(this.startDate, monthDay - 1);
      const checkinForDate = this.checkins
        .find(checkin => isSameDay(checkin.date, dayDate) && checkin.assignmentId === currentCheckIn.assignmentId);
      if (checkinForDate) {
        const monthDateStatus =
          checkinForDate ? Object.assign({}, CHECKIN_STATUSES.find(status => checkinForDate.status === status.key)) : undefined;
        if (monthDateStatus) {
          monthDateStatus.isEditable = this.isEditableCheckin(dayDate);
          monthDateStatus.comment = checkinForDate.comment ? checkinForDate.comment : undefined;
          const monthDateState =
            monthDateStatus && checkinForDate ? this.getCheckinState(monthDateStatus, checkinForDate.unblocked) : undefined;
          monthDateStatus.state = monthDateState;
          if (currentCheckIn.monthDaysStatuses) {
            currentCheckIn.monthDaysStatuses[index] = monthDateStatus;
          }
        }
      }
    });
  }

  private isEditableCheckin(weekDay: Date): boolean {
    return ((this.managerMode)
      ||
      (!this.managerMode && isSameDay(weekDay, this.today) && this.teamFeature && this.teamFeature.enabled));
  }

  private getCheckinState(item: CheckInStatus, unblocked: boolean): string | undefined {
    if (item.key === 'ON_TRACK') {
      return CheckInChatsMemberComponent.STATE_ON_TRACK;
    } else if (item.key !== 'ON_TRACK' && unblocked === false) {
      return CheckInChatsMemberComponent.STATE_PENDING_BLOCKED;
    } else if (item.key !== 'ON_TRACK' && item.key !== 'NOT_DONE' && unblocked === true) {
      return CheckInChatsMemberComponent.STATE_PENDING_UNBLOCKED;
    }
    return CheckInChatsMemberComponent.STATE_NOT_DONE;
  }

  private getFormattedMetric(currentAssignmentSummary: AssignmentSummary): string {
    const averageMetrics = `${Math.round(currentAssignmentSummary.metricsStatsPastWeeksAvg)}`;
    const averageMetricsPercentage = Math.round(currentAssignmentSummary.metricsStatsPastWeeksAvg * 100) / this.summary.metricTarget;
    return this.summary.metricTarget ? `${averageMetrics} (${Math.round(averageMetricsPercentage)}%)` : `${averageMetrics} (%)`;
  }

  private getFormattedMetricLastWeek(currentAssignmentSummary: AssignmentSummary): string {
    const metrics = Math.round(currentAssignmentSummary.metricsStats[CheckInChatsMemberComponent.LAST_WEEK_INDEX]);
    const averageMetricsPercentage = (metrics * 100) / this.summary.metricTarget;
    return this.summary.metricTarget ? `${metrics} (${Math.round(averageMetricsPercentage)}%)` : `${metrics} (%)`;
  }

  private getFormattedMetricCurrentWeek(currentAssignmentSummary: AssignmentSummary): string {
    const metrics = Math.round(currentAssignmentSummary.metricsStats[CheckInChatsMemberComponent.CURRENT_WEEK_INDEX]);
    const averageMetricsPercentage = (metrics * 100) / this.summary.metricTarget;
    return this.summary.metricTarget ? `${metrics} (${Math.round(averageMetricsPercentage)}%)` : `${metrics} (%)`;
  }

  private setMonthDays(month: Date): void {
    const days = endOfMonth(month).getDate();
    this.monthDays = new Array(days).fill({});
    this.monthDays = this.monthDays.map((_item, index) => index + 1);
  }

  private findContractor(contractorId: number): AssignmentSummary | undefined {
    return this.summary.assignments.find(assignment => assignment.candidateId === contractorId);
  }

  private buildScreensReleasedChart(contractorSummary: AssignmentSummary): void {
    this.setLineChartDates(contractorSummary.recordedHours.slice().reverse(), contractorSummary.metricsStats.slice().reverse());
  }

  private buildHoursLoggedChart(contractorSummary: AssignmentSummary): void {
    this.setLineChartDates(contractorSummary.recordedHours.slice().reverse(), contractorSummary.metricsStats.slice().reverse());
  }

  private setLineChartDates(recordedHours: number[], metrics: number[]): void {
    let week = subWeeks(endOfWeek(new Date()), CheckInChatsMemberComponent.METRICS_WEEKS_COUNT + 1);
    this.contractorHoursLogged = new Array(CheckInChatsMemberComponent.METRICS_WEEKS_COUNT).fill({} as CheckInChartMetricsData);
    this.contractorMetrics = new Array(CheckInChatsMemberComponent.METRICS_WEEKS_COUNT).fill({} as CheckInChartMetricsData);
    this.contractorHoursLogged = this.contractorHoursLogged.map((_item, index) => {
      week = addWeeks(week, 1);
      return {
        date: week,
        value: Math.round(recordedHours[index]),
      };
    });
    week = subWeeks(endOfWeek(new Date()), CheckInChatsMemberComponent.METRICS_WEEKS_COUNT + 1);
    this.contractorMetrics = this.contractorMetrics.map((_item, index) => {
      week = addWeeks(week, 1);
      return {
        date: week,
        value: Math.round(metrics[index]),
      };
    });
  }

  private calculateChekinModalDate(day: number): Date {
    if (this.periodMode === PeriodConstants.WEEKLY) {
      return addDays(startOfWeek(this.startDate, {weekStartsOn: 1}), day);
    } else if (this.periodMode === PeriodConstants.MONTHLY) {
      return addDays(startOfMonth(this.startDate), day - 1);
    } else {
      return this.startDate;
    }
  }

  private getUTC(offset: number): Date {
    const date = new Date();
    offset += date.getTimezoneOffset() * 60 * 1000;
    const time = date.getTime() + offset;
    return new Date(time);
  }

  private getDailyFormat(date: Date): string {
    const day = `${PeriodConstants.DAYS[date.getDay()]}`;
    return `${day}, ${PeriodConstants.YEAR_MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  private getOffsetInHours(offset: number): string {
    let prefix = '';
    if (offset >= 0) {
      prefix = '+';
    }
    return `${prefix}${(offset / 3600000).toString()}`;
  }

  private onStatusChange(): void {
    this.checkInForm.controls.status.valueChanges.subscribe(value => {
      if (value === 'ON_TRACK' || value === 'NOT_DONE') {
        this.checkInForm.controls.unblocked.setValue('Yes');
      }
    });
  }
}
