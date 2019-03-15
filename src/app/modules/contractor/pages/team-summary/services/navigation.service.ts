import { ElementRef, Injectable } from '@angular/core';
import { addDays, addWeeks, endOfWeek, subWeeks } from 'date-fns';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';

import { Trends } from 'app/core/constants/team-summary/trends';
import { WeekModes } from 'app/core/constants/team-summary/week-modes';
import { CurrentUserDetail } from 'app/core/models/identity';
import { AssignmentSummary } from 'app/core/models/productivity';
import { TeamSummaryComponent } from 'app/modules/contractor/pages/team-summary/team-summary.component';

@Injectable()
export class NavigationService {
  public previousWeek(instance: TeamSummaryComponent): void {
    const weeksCount = WeekModes.Single;
    const dateControl = subWeeks(instance.form.value.dateControl, 1);
    instance.form.patchValue({ weeksCount }, { emitEvent: false });
    instance.form.patchValue({ dateControl });
  }

  public nextWeek(instance: TeamSummaryComponent): void {
    const weeksCount = WeekModes.Single;
    const dateControl = addWeeks(instance.form.value.dateControl, 1);
    instance.form.patchValue({ weeksCount }, { emitEvent: false });
    instance.form.patchValue({ dateControl });
  }

  public fetchLastFourWeeks(instance: TeamSummaryComponent): void {
    const weeksCount = WeekModes.FourPreviousWeeks;
    const dateControl = instance.recentDates.startOfToday;
    instance.cookiesService.setCookie(instance.cookieInfo.name, '');
    instance.form.patchValue({ weeksCount }, { emitEvent: false });
    instance.form.patchValue({ dateControl });
  }

  public fetchLastWeek(instance: TeamSummaryComponent): void {
    const weeksCount = WeekModes.Single;
    const dateControl = instance.recentDates.startOfLastWeek;
    instance.cookiesService.setCookie(instance.cookieInfo.name, WeekModes.LastWeek);
    instance.form.patchValue({ weeksCount }, { emitEvent: false });
    instance.form.patchValue({ dateControl });
  }

  public fetchThisWeek(instance: TeamSummaryComponent): void {
    const weeksCount = WeekModes.Single;
    const dateControl = instance.recentDates.startOfThisWeek;
    instance.cookiesService.setCookie(instance.cookieInfo.name, WeekModes.CurrentWeek);
    instance.form.patchValue({ weeksCount }, { emitEvent: false });
    instance.form.patchValue({ dateControl });
  }

  public openContractorModal(
    instance: TeamSummaryComponent,
    item: AssignmentSummary,
    template: ElementRef
  ): void {
    instance.loadState.model = true;
    instance.currentUserAssignmentId = item.id;

    instance.modalService.open(template, { customClass: 'full-screen' });
    instance.assignmentService.getContractorAssignment(item.id)
      .pipe(finalize(() => instance.loadState.model = false))
      .subscribe(assignment => {
        instance.currentUserManager = Object.assign(assignment.manager);
        instance.currentUserTeamId = assignment.team.id;
        instance.currentContractor = assignment.candidate as CurrentUserDetail;
      }, () => instance.error = 'Error fetching contractor assignment.'
    );
  }

  public setWeeksCount(instance: TeamSummaryComponent, weeksCount: string): void {
    instance.form.patchValue({ weeksCount });
  }

  public showSelectedTeam(instance: TeamSummaryComponent, teamId: number): void {
    instance.identityService.updateTeamById(teamId);
    instance.showTeamSelector = false;
  }

  public showTrend(
    instance: TeamSummaryComponent,
    trend: Trends,
    values?: number[]
  ): void {
    let chartValues: number[];
    const trendRange = parseInt(WeekModes.FourPreviousWeeks, 10) - Number(!instance.isThisWeek);
    const weeksAgo = subWeeks(instance.recentDates.startOfToday, trendRange);
    const startDate = addDays(endOfWeek(weeksAgo, instance.startOfIsoWeek), 1);

    const strategies = [
      {
        condition: () => trend === Trends.HoursLogged,
        action: () => {
          instance.modalService.open(instance.hoursLoggedModal);
          chartValues = _.defaultTo(values, instance.metricInfo.hoursLogged);
        },
      },
      {
        condition: () => trend === Trends.Metrics,
        action: () => {
          instance.modalService.open(instance.metricModal);
          chartValues = _.defaultTo(values, instance.metricInfo.metrics);
        },
      },
      {
        condition: () => trend === Trends.Intensity,
        action: () => {
          instance.modalService.open(instance.intensityScoreModal);
          chartValues = _.defaultTo(values, instance.metricInfo.intensity);
        },
      },
      {
        condition: () => trend === Trends.Focus,
        action: () => {
          instance.modalService.open(instance.focusScoreModal);
          chartValues = _.defaultTo(values, instance.metricInfo.focus);
        },
      },
      {
        condition: () => trend === Trends.Alignment,
        action: () => {
          instance.modalService.open(instance.alignmentScoreModal);
          chartValues = _.defaultTo(values, instance.metricInfo.alignment);
        },
      },
    ];
    const strategy = strategies.filter(entry => entry.condition())[0];
    strategy.action();
    instance.metricInfo.current = Array.from({ length: trendRange })
      .map((_value, index) => ({
        date: addWeeks(startDate, index),
        value: Math.round(chartValues[index]),
      }));
    instance.trendRangeTitle = `Last ${trendRange} weeks`;
  }
}
