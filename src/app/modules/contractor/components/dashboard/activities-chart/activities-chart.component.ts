import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { addWeeks, startOfToday, startOfWeek, subWeeks } from 'date-fns';
import * as _ from 'lodash';

import * as PerformanceLevels from 'app/core/constants/dashboard/dashboard-levels';
import * as scoreLabels from 'app/core/constants/my-dashboard/activity-score-labels';
import { TeamTrend } from 'app/core/models/dashboard';
import { Section, WeekPlannedAct } from 'app/core/models/productivity';
import { TeamActivitiesAverage, TeamAverage, WeeksMetric } from 'app/core/models/team';

@Component({
  selector: 'app-activities-chart',
  templateUrl: './activities-chart.component.html',
  styleUrls: ['./activities-chart.component.scss']
})
export class ActivitiesChartComponent implements OnChanges {

  @Input()
  public managerMode: boolean;
  @Input()
  public activityAverage: TeamAverage;
  @Input()
  public noManagersSelected: boolean = false;

  @Output()
  public teamTrend: EventEmitter<TeamTrend[]> = new EventEmitter<TeamTrend[]>();
  @Output()
  public metricAverage: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  public metricTarget: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public metricDescription: EventEmitter<string> = new EventEmitter<string>();

  public ALIGNMENT_LABEL = scoreLabels.alignmentScore;
  public INTENSITY_LABEL = scoreLabels.intensityScore;
  public FOCUS_LABEL = scoreLabels.focusScore;

  public intensity: number;
  public alignment: number;
  public focus: number;

  public sections: Partial<Section>[] = [];
  public plannedSections: Partial<Section>[] = [];

  constructor(private router: Router) { }

  public ngOnChanges(change: SimpleChanges): void {
    if (change.activityAverage) {
      if (
        !change.activityAverage.previousValue ||
        (change.activityAverage.currentValue.teamId !== change.activityAverage.previousValue.teamId)
      ) {
        this.buildScreen();
      }
    }
  }

  public getScoreClass(value: number, maxValue: number): string {
    const types = Object.keys(PerformanceLevels)
      .map(key => PerformanceLevels[key as keyof typeof PerformanceLevels]);
    return types.filter(entry => entry.threshold(value, maxValue))[0].cssClass;
  }

  public navigateToTeamActivities(): void {
    if (this.managerMode && !this.noManagersSelected) {
      this.router.navigate(['/contractor/team-activities']);
    }
  }

  private buildScreen(): void {
    if (
      this.activityAverage
    ) {

      if (this.activityAverage.metricAvg && Object.keys(this.activityAverage.metricAvg).length) {
        this.metricDescription.emit(this.activityAverage.metricAvg.metricName || '');
        this.metricTarget.emit(this.activityAverage.metricAvg.metricTarget || '1');

        const weeksMetric = (this.activityAverage.metricAvg.weeksMetric || [] as WeeksMetric[])
          .map((metric: WeeksMetric) => metric.average).reverse();
        this.metricAverage.emit(weeksMetric.reduce((a: number, b: number) => a + b, 0) / weeksMetric.length);

        const week = subWeeks(startOfWeek(startOfToday(), { weekStartsOn: 0 }), 3);
        const teamTrend: TeamTrend[] = [];

        if (weeksMetric.length) {
          const weeksPeriod = 4;
          for (let i = 0; i < weeksPeriod; i++) {
            const date = addWeeks(week, i);
            const point: TeamTrend = {
              date: date,
              value: weeksMetric[i].toFixed(1),
            };
            if (this.managerMode) {
              point.metric = Number(this.metricTarget);
            }
            teamTrend.push(point);
          }
          this.teamTrend.emit(teamTrend);
        }
      }

      if (this.activityAverage.activitiAvg && Object.keys(this.activityAverage.activitiAvg).length) {
        this.intensity = (this.activityAverage.activitiAvg.intensityScoreAvg || 0) / 100;
        this.focus = (this.activityAverage.activitiAvg.focusScoreAvg || 0) / 100;
        this.alignment = (this.activityAverage.activitiAvg.alignmentScoreAvg || 0) / 100;
        this.plannedSections = this.buildPlannedSections(this.activityAverage.activitiAvg);
        this.plannedSections = _.orderBy(this.plannedSections, ['name', 'percentageRounded'], ['asc', 'desc']);
        this.sections = this.buildAverageSections((this.activityAverage.activitiAvg.groupsSummaryAvg || []));
        this.sections = _.orderBy(this.sections, ['name', 'percentageRounded'], ['asc', 'desc']);
      }

    } else {
      this.metricDescription.emit('');
      this.metricTarget.emit('1');
    }
  }

  private buildAverageSections(averageSections: Section[]): Partial<Section>[] {
    if (!averageSections.length) {
      return [];
    }

    const total = averageSections
      .map(section => section.spentTime)
      .reduce((sectionA, sectionB) => sectionA + sectionB);
    return averageSections
      .map<Partial<Section>>(section => {
        const plannedTime = section.spentTime;
        return <Partial<Section>>{
          color: section.color,
          sectionName: section.sectionName,
          spentTime: plannedTime,
          percentage: plannedTime / total * 100,
          percentageRounded: Math.round(plannedTime / total * 100),
        };
      });
  }

  private buildPlannedSections(activitiesAverage: TeamActivitiesAverage): Partial<Section>[] {
    let sections: Partial<Section>[] = [];
    if (activitiesAverage.overWeekPlannedActs && activitiesAverage.overWeekPlannedActs.length) {
      const hourMinutes = 60;
      const workdayInHours = 8;
      const dailyTotalMinutes = hourMinutes * workdayInHours;
      let total = activitiesAverage.weekPlanedTotalLong as number;
      total = Math.max(total, dailyTotalMinutes) < dailyTotalMinutes ? dailyTotalMinutes : total;

      sections = activitiesAverage.overWeekPlannedActs
        .map<Partial<Section>>((plannedActivity: WeekPlannedAct) => {
          const plannedTime = plannedActivity.actTimeLong;
          return <Partial<Section>>{
            color: plannedActivity.activity.color,
            sectionName: plannedActivity.activity.name,
            spentTime: plannedTime,
            percentage: plannedTime / total * 100,
            percentageRounded: Math.round(plannedTime / total * 100),
          };
        });
    }
    return sections;
  }
}
