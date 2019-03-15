import { Component, Input, OnChanges } from '@angular/core';
import { DfPieChartConfiguration } from '@devfactory/ngx-df';
import {
  addDays,
  addWeeks,
  eachDay,
  endOfWeek,
  format,
  isWeekend,
  isWithinRange,
  startOfMonth,
  startOfWeek,
  subDays,
  subWeeks,
} from 'date-fns';
import * as _ from 'lodash';

import { CHECKIN_STATUSES } from 'app/core/constants/contractor/check-in-statuses';
import * as PeriodConstants from 'app/core/constants/period';
import {
  CheckIn,
  CheckInChartData,
  DailyCheckInSummary,
  DateBlock,
  MonthlyCheckInSummary,
  StatusRow,
  TeamMember,
  WeeklyCheckInSummary,
} from 'app/core/models/productivity';


@Component({
  selector: 'app-check-in-chats-summary',
  templateUrl: './check-in-chats-summary.component.html',
  styleUrls: ['./check-in-chats-summary.component.scss'],
})
export class CheckInChatsSummaryComponent implements OnChanges {

  private static readonly MONTH_WEEKSCOUNT = 5;
  private static readonly STATUS_ON_TRACK = 'On Track';

  @Input()
  public managerMode: boolean;
  @Input()
  public periodMode: string;
  @Input()
  public checkins: CheckIn[];
  @Input()
  public startDate: Date;
  @Input()
  public teamMember: TeamMember;

  public chartOptions = new DfPieChartConfiguration();
  public chartColors: string[] = [];
  public onTrackPercentage: number;
  public dailyHeader: string;
  public weekDayHeaders = ['', '', '' , '', ''];
  public weekHeaders = ['', '', '' , '', ''];
  public weeklySummary: WeeklyCheckInSummary[] = [];
  public monthlySummary: MonthlyCheckInSummary[] = [];
  public dailySummary: DailyCheckInSummary[] = [];
  public statusPercentages: CheckInChartData[];
  public periodConstants = PeriodConstants;

  constructor() { }

  public ngOnChanges(): void {
    this.setupChart();
    this.setupSummaryDates();
  }

  public getStatusDescription(checkinStatus: string): string {
    const currentStatus = CHECKIN_STATUSES.find(status => {
      return checkinStatus === status.name;
    });
    return currentStatus ? currentStatus.description : '';
  }

  private setupChart(): void {
    this.chartOptions.animationDelay = 2000;
    this.chartOptions.animationDuration = 500;
    this.chartOptions.defaultOpacity = 1;
    this.chartOptions.innerRadius = 80;
  }

  private setupSummaryDates(): void {
    if (this.periodMode === PeriodConstants.DAILY) {
      this.dailyHeader = this.getDailyFormatShort(this.startDate);
      this.buildDailySummary();
    } else if (this.periodMode === PeriodConstants.WEEKLY) {
      const start = startOfWeek(this.startDate, {weekStartsOn: 1});
      this.weekDayHeaders =
        this.weekDayHeaders.map((_header, index) => this.getWeekDayHeader(index, start));
      this.buildWeeklySummary(start, addDays(endOfWeek(start), 1));
    } else if (this.periodMode === PeriodConstants.MONTHLY) {
      const monthStart = startOfWeek(startOfMonth(this.startDate), {weekStartsOn: 1});
      let weekStart = subWeeks(monthStart, 1);
      this.weekHeaders = this.weekHeaders.map(() => {
        weekStart = addDays(endOfWeek(weekStart), 1);
        return this.getWeeklyFormat(weekStart);
      });
      if (addWeeks(weekStart, 1).getMonth() !== this.startDate.getMonth()) {
        this.weekHeaders.pop();
      }
      this.buildMonthlySummary();
    }
  }

  private buildDailySummary(): void {
    const dateBlocks: DateBlock[] = [{
      from: this.startDate,
      to: this.startDate,
    }];

    const dailyCheckinsData: StatusRow[] = this.getCheckinsSummaryMap(dateBlocks);
    this.dailySummary = dailyCheckinsData.map(row => (
      {
        status: row.status.name,
        statusColor: row.status.color,
        today: row[0],
      } as DailyCheckInSummary)
    );

    this.statusPercentages = [];
    const chartColors: string[] = [];
    this.dailySummary.forEach(
      summary => {
        this.statusPercentages.push({ title: summary.status, value : summary.today});
        chartColors.push(summary.statusColor);
      }
    );
    this.chartColors = chartColors;
    this.onTrackPercentage = this.calculateDailyOnTrackPercentage();
  }

  private getCheckinsSummaryMap(dateBlocks: DateBlock[]): StatusRow[] {
    let userCheckins: CheckIn[] = [];
    if (this.teamMember) {
      userCheckins = this.checkins.filter(checkin => checkin.assignmentId === this.teamMember.assignment.id);
    } else {
      userCheckins = Object.assign(this.checkins, {});
    }

    return _.chain(CHECKIN_STATUSES).map(status => {
      const checkinsOfStatus = userCheckins.filter(checkin => checkin.status === status.key);
      const statusRow: StatusRow = {
        status,
        total: checkinsOfStatus.length,
      };
      dateBlocks.forEach((dateBlock, key) => {
        const inBlock = (date: Date) => isWithinRange(date, dateBlock.from, dateBlock.to);
        statusRow[key.toString()] = _.chain(checkinsOfStatus).map('date').filter(inBlock).size().value();
      });
      return statusRow;
    }).filter((row: StatusRow) => row.total > 0)
    .value();
  }

  private buildWeeklySummary(start: Date, end: Date): void {
    const weekDays: Date[] = eachDay(start, end).filter(day => !isWeekend(day));
    const dateBlocks: DateBlock[] = weekDays.map(startDate => (
      {
        from: startDate,
        to: startDate,
      })
    );

    const weeklyCheckinsData: StatusRow[] = this.getCheckinsSummaryMap(dateBlocks);
    this.weeklySummary = weeklyCheckinsData.map(row => (
      {
        contractorId: 0,
        status: row.status.name,
        statusColor: row.status.color,
        monday: row[0],
        tuesday: row[1],
        wednesday: row[2],
        thursday: row[3],
        friday: row[4],
        total: row.total,
      } as WeeklyCheckInSummary)
    );

    this.statusPercentages = [];
    const chartColors: string[] = [];
    this.weeklySummary.forEach(
      summary => {
        this.statusPercentages.push({ title: summary.status, value : summary.total});
        chartColors.push(summary.statusColor);
      }
    );
    this.chartColors = chartColors;
    this.onTrackPercentage = this.calculateWeeklyOnTrackPercentage();
  }

  private calculateDailyOnTrackPercentage(): number {
    const total = this.dailySummary.reduce((accumulator, item) => accumulator + item.today, 0);
    const onTrack = this.dailySummary
    .filter(summary => summary.status === CheckInChatsSummaryComponent.STATUS_ON_TRACK)
    .reduce((accumulator, item) => accumulator + item.today, 0);
    return total === 0 ? 0 : Math.round(onTrack / total * 100);
  }

  private calculateWeeklyOnTrackPercentage(): number {
    const total = this.weeklySummary.reduce((accumulator, item) => accumulator + item.total, 0);
    const onTrack = this.weeklySummary
      .filter(summary => summary.status === CheckInChatsSummaryComponent.STATUS_ON_TRACK)
      .reduce((accumulator, item) => accumulator + item.total, 0);
    return total === 0 ? 0 : Math.round(onTrack / total * 100);
  }

  private calculateMonthlyOnTrackPercentage(): number {
    const total = this.monthlySummary.reduce((accumulator, item) => accumulator + item.total, 0);
    const onTrack = this.monthlySummary
    .filter(summary => summary.status === CheckInChatsSummaryComponent.STATUS_ON_TRACK)
    .reduce((accumulator, item) => accumulator + item.total, 0);
    return total === 0 ? 0 : Math.round(onTrack / total * 100);
  }

  private buildMonthlySummary(): void {
    const monthWeekStartDates = this.getMonthWeekStartDates();
    const dateBlocks: DateBlock[] = monthWeekStartDates.map(startDate => (
      {
        from: startDate,
        to: subDays(addWeeks(startDate, 1), 1),
      })
    );
    const monthlyCheckinsData: StatusRow[] = this.getCheckinsSummaryMap(dateBlocks);
    this.monthlySummary = monthlyCheckinsData.map(row => (
      {
        contractorId: 0,
        status: row.status.name,
        statusColor: row.status.color,
        week0: row[0],
        week1: row[1],
        week2: row[2],
        week3: row[3],
        week4: row[4],
        total: row.total,
      } as MonthlyCheckInSummary)
    );
    this.statusPercentages = [];
    const chartColors: string[] = [];
    this.monthlySummary.forEach(
      summary => {
        this.statusPercentages.push({ title: summary.status, value : summary.total});
        chartColors.push(summary.statusColor);
      }
    );
    this.chartColors = chartColors;
    this.onTrackPercentage = this.calculateMonthlyOnTrackPercentage();
  }

  private getMonthWeekStartDates(): Date[] {
    let monthWeeks: Date[] = new Array(CheckInChatsSummaryComponent.MONTH_WEEKSCOUNT).fill(new Date());
    const monthStart = startOfWeek(startOfMonth(this.startDate), {weekStartsOn: 1});
    let weekStart = subWeeks(monthStart, 1);
    monthWeeks = monthWeeks.map(() => {
      weekStart = addWeeks(weekStart, 1);
      return weekStart;
    });
    if (addWeeks(weekStart, 1).getMonth() !== this.startDate.getMonth()) {
      monthWeeks.pop();
    }
    return monthWeeks;
  }

  private getDailyFormatShort(date: Date): string {
    return `${PeriodConstants.DAYS[date.getDay()]} ${date.getDate()}`;
  }

  private getWeekDayHeader(day: number, start: Date): string {
    const weekDay = addDays(start, day);
    return `${weekDay.getDate()}`;
  }

  private getWeeklyFormat(date: Date): string {
    const start = addDays(startOfWeek(date), 1);
    const end = addDays(endOfWeek(date), 1);
    return `${format(start, 'MMM DD')} - ${format(end, 'MMM DD')}`;
  }
}
