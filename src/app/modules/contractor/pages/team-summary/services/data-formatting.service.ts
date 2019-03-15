import { Injectable } from '@angular/core';
import { addDays, endOfWeek, format, getISOWeek, startOfWeek, subWeeks } from 'date-fns';

import { WeekModes } from 'app/core/constants/team-summary/week-modes';
import { ProductivitySummaryWithMappedActivities } from 'app/core/models/productivity';
import { TeamSummaryComponent } from 'app/modules/contractor/pages/team-summary/team-summary.component';

@Injectable()
export class DataFormattingService {
  public getWeeklyFormat(this: TeamSummaryComponent, date: Date, includePrefix: boolean = false): string {
    const weeksMode = {
      [WeekModes.Single]: (targetDate: Date) => ({
        startDate: startOfWeek(targetDate, this.startOfIsoWeek),
        endDate: endOfWeek(targetDate, this.startOfIsoWeek),
      }),
      [WeekModes.FourPreviousWeeks]: (_targetDate: Date) => {
        const lastWeek = subWeeks(this.recentDates.startOfThisWeek, 1);
        const endDate = endOfWeek(lastWeek, this.startOfIsoWeek);
        const startDate = addDays(subWeeks(endDate, parseInt(WeekModes.FourPreviousWeeks, 10) - 1), 1);
        return { startDate, endDate };
      },
    };
    const weeksCount = this.form.value.weeksCount as keyof typeof weeksMode;
    const range = weeksMode[weeksCount](date);
    const prefix = includePrefix ? 'week of ' : '';
    return `${prefix}${format(range.startDate, 'MMM DD')} - ${format(range.endDate, 'MMM DD, YYYY')}`;
}

  public getWeeklyFormatter(instance: TeamSummaryComponent):
    typeof DataFormattingService.prototype.getWeeklyFormat {
    return this.getWeeklyFormat.bind(instance);
  }

  public getMetric(
    instance: TeamSummaryComponent,
    metricPercentage: number
  ): string {
    return (metricPercentage / 100 * instance.metricInfo.target).toFixed(1);
  }

  public getMetricPercentage(
    instance: TeamSummaryComponent,
    metric?: number
  ): string {
    const metricTarget = instance.metricInfo.target || 1;
    return ((metric || 0) / metricTarget).toFixed(1);
  }

  public getHoursLoggedPercentage(
    instance: TeamSummaryComponent,
    hoursLogged?: number,
    limit?: number
  ): string {
    limit = limit || instance.hoursInfo.currentViewMaxHours;
    const percentage = (hoursLogged || 0) / limit;
    return percentage.toFixed(1);
  }

  public xAxisTickFormatter(value: Date): string {
    return format(value, 'MMM DD');
  }

  public formatMetric(metric?: number): string {
    return (metric || 0).toFixed(1);
  }

  public fetchSummaryData(
    instance: TeamSummaryComponent,
    summary: ProductivitySummaryWithMappedActivities
  ): void {
    instance.hoursInfo.currentViewMaxHours = Math.max(
      ...summary.productivitySummary
        .assignments.map(entry => entry.recordedHoursPastWeeksAvg),
      instance.hoursInfo.maxHours
    );
    instance.teamSummary = summary.productivitySummary.assignments;
    instance.teamAverage = {
      activityMetricsPastWeeksAvg: summary.productivitySummary.activityMetricsPastWeeksAvg,
      metricsStatsPastWeeksAvg: summary.productivitySummary.metricsStatsPastWeeksAvg,
      intensityScorePastWeeksAvg: summary.productivitySummary.intensityScorePastWeeksAvg,
      focusScorePastWeeksAvg: summary.productivitySummary.focusScorePastWeeksAvg,
      recordedHoursPastWeeksAvg: summary.productivitySummary.weeklyHoursPastWeeksAvg,
    };
    instance.topPerformer = instance.teamSummary
      .filter(entry => entry.id === summary.productivitySummary.averageTopPerformer)[0];
    instance.bottomPerformer =  instance.teamSummary
      .filter(entry => entry.id === summary.productivitySummary.averageBottomPerformer)[0];
  }

  public numberOfWeeks(instance: TeamSummaryComponent): number {
    const strategies = [
      {
        condition: () => this.currentDateMatches(
          instance,
          WeekModes.Single,
          instance.recentDates.startOfThisWeek
        ),
        weeks: 5,
      },
      {
        condition: () => true,
        weeks: 4,
      }
    ];
    return strategies.filter(entry => entry.condition())[0].weeks;
  }

  public bottomPerformerError(instance: TeamSummaryComponent): string | null {
    const strategies = [
      {
        condition: () => instance.teamSummaryCount === 1 &&
          (instance.productivitySummary && instance.productivitySummary.productivitySummary.metricSetupPresent) &&
          (instance.productivitySummary && instance.productivitySummary.productivitySummary.activeAssignmentsCount[0] === 1),
        message: 'Expand your teams to compare your top and bottom performers',
      },
      {
        condition: () => instance.teamSummaryCount === 1 &&
          (instance.productivitySummary && instance.productivitySummary.productivitySummary.metricSetupPresent) &&
          (instance.productivitySummary && instance.productivitySummary.productivitySummary.activeAssignmentsCount[0] > 1),
        message: 'The team had only one contractor',
      },
      {
        condition: () => true,
        message: null,
      },
    ];
    return strategies.filter(entry => entry.condition())[0].message;
  }

  public currentDateMatches(
    instance: TeamSummaryComponent,
    weeksCount: string,
    dateControl?: Date
  ): boolean {
    const compareDate = instance.form.value;
    return compareDate.weeksCount === weeksCount &&
      (!dateControl || getISOWeek(compareDate.dateControl) === getISOWeek(dateControl));
  }
}
