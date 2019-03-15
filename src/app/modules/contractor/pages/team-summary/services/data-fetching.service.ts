import { Injectable } from '@angular/core';
import { endOfWeek, format, startOfToday, subWeeks } from 'date-fns';
import * as _ from 'lodash';
import { filter, map, take, takeUntil, tap } from 'rxjs/operators';

import * as TeamSelectorConstants from 'app/core/constants/team-selector';
import { WeekModes } from 'app/core/constants/team-summary/week-modes';
import { CurrentUserDetail } from 'app/core/models/identity';
import { Manager } from 'app/core/models/manager';
import { Team, TeamManagerGroup } from 'app/core/models/team';
import { TeamSummaryComponent } from 'app/modules/contractor/pages/team-summary/team-summary.component';

@Injectable()
export class DataFetchingService {
  public load(instance: TeamSummaryComponent): void {
    instance.identityService
      .getCurrentUser()
      .pipe(
        takeUntil(instance.destroy$),
        take(1)
      )
      .subscribe(
        currentUser => instance.currentUserDetail = currentUser as CurrentUserDetail
      );

    instance.currentTeam
      .pipe(
        takeUntil(instance.destroy$),
        filter(entry => !!entry && !TeamSelectorConstants.isDirectReportsTeam(entry.name as string))
      )
      .subscribe(
        () => {
          this.fetchSummary(instance);
          this.fetchOnlineStatus(instance);
        }
      );

    instance.identityService.getTeamManagerGroupSelection()
      .pipe(
        takeUntil(instance.destroy$),
        filter(teamManagerGroup => !!teamManagerGroup)
      )
      .subscribe(teamManagerGroup => {
        const weeksCount = WeekModes.FourPreviousWeeks;
        const value = teamManagerGroup as TeamManagerGroup;
        const dateControl = instance.recentDates.startOfToday;
        instance.form.patchValue({ dateControl, weeksCount }, { emitEvent: false });
        instance.error = '';
        instance.currentManagerId = value.managerId;
        instance.cookieInfo.value = instance.cookiesService.getCookie(instance.cookieInfo.name) as string;
        if (value.team) {
          instance.showTeamSelector = TeamSelectorConstants.isDirectReportsTeam(value.team.name as string);
          instance.currentTeam.next(value.team);
        }
      });

    instance.form.valueChanges
      .pipe(
        takeUntil(instance.destroy$)
      )
      .subscribe(data => {
        instance.form.patchValue(data, { emitEvent: false });
        this.fetchSummary(instance);
      });
  }

  public fetchSummary(instance: TeamSummaryComponent): void {
    instance.loadState.component = true;
    const team = instance.currentTeam.getValue() as Team;
    const teamOwner = team.teamOwner as Manager;
    const reportingManagers = _.defaultTo(_.get(team, 'reportingManagers'), []) as Manager[];
    const userId = instance.currentManagerId as number;
    const managerId = _.get(teamOwner, 'id') === userId ||
      reportingManagers.find(entry => entry.id === userId) ?
      userId.toString() : '';
    const targetDate = endOfWeek(instance.form.value.dateControl, instance.startOfIsoWeek);
    const weeksCount = instance.form.value.weeksCount as string;

    instance.productivityService.getPerformers(
      managerId,
      team.id.toString(),
      format(targetDate, 'YYYY-MM-DD'),
      weeksCount
    )
    .pipe(
      map(summary => instance.performanceDataService.mapPerformerDetails(summary, weeksCount)),
      tap(summary => {
        instance.isThisWeek = instance.dataFormattingService.currentDateMatches(
          instance,
          WeekModes.Single,
          instance.recentDates.startOfThisWeek
        );
        const strategies = [
          {
            condition: () => instance.isThisWeek,
            date: () => endOfWeek(startOfToday(), instance.startOfIsoWeek),
          },
          {
            condition: () => true,
            date: () => {
              const lastWeek = subWeeks(instance.recentDates.startOfToday, 1);
              return endOfWeek(lastWeek, instance.startOfIsoWeek);
            },
          },
        ];
        const date = strategies.filter(entry => entry.condition())[0].date();
        instance.performanceDataService.buildStats(instance, summary, date, weeksCount);
      })
    )
    .subscribe(summary => {
      instance.dataFormattingService.fetchSummaryData(instance, summary);
      this.fetchByDefinition(instance, instance.cookieInfo.value);
      instance.invokeIf(
        !instance.cookieInfo.value,
        () => instance.window.setTimeout(() => instance.loadState.component = false)
      );
      instance.cookieInfo.value = '';
    });
  }

  public fetchByDefinition(instance: TeamSummaryComponent, definition: string): void {
    const strategies = [
      {
        condition: () => definition === WeekModes.CurrentWeek,
        action: () => instance.navigationService.fetchThisWeek(instance),
      },
      {
        condition: () => definition === WeekModes.LastWeek,
        action: () => instance.navigationService.fetchLastWeek(instance),
      },
      {
        condition: () => true,
        action: () => true,
      },
    ];
    const strategy = strategies.filter(entry => entry.condition())[0];
    strategy.action();
  }

  public fetchOnlineStatus(instance: TeamSummaryComponent): void {
    const team = instance.currentTeam.getValue() as Team;
    const managerId = instance.currentManagerId as number;

    instance.timetrackingService
      .getLatestWorkDiaries({
        fullTeam: 'false',
        managerId: managerId.toString(),
        teamId: team.id.toString(),
      })
      .subscribe(
        workDiaries => instance.workDiaries = workDiaries,
        () => instance.error = 'An unknown error happened while retrieving work diaries data.'
      );
  }
}
