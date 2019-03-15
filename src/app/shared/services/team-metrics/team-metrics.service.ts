import { Injectable } from '@angular/core';
import { addDays, endOfWeek, format, isAfter, isBefore, startOfWeek } from 'date-fns';
import * as _ from 'lodash';

import { ACTIVE_STATUS } from 'app/core/constants/assignment';
import * as AvatarTypes from 'app/core/constants/avatar-types';
import { Assignment } from 'app/core/models/assignment';
import { CurrentUserDetail } from 'app/core/models/identity';
import {
  IndividualStat, MetricAuthorization, RawMetrics, TeamAverageMetric, TeamMetricRecord, WeekMetrics, WeekStats,
} from 'app/core/models/metric';
import { Team } from 'app/core/models/team';

@Injectable()
export class TeamMetricsService {

  private static readonly thisMonday = startOfWeek(new Date(), { weekStartsOn: 1});

  public getMetricsAuthorization(
    currentUserDetail: CurrentUserDetail | null,
    team: Team,
    assignments: Assignment[]
  ): MetricAuthorization {
    if (currentUserDetail) {
      const isCompanyAdmin = currentUserDetail.userAvatars.some(avatar => avatar.type === AvatarTypes.CompanyAdmin);
      const isTeamOwner = currentUserDetail.userAvatars.some(avatar =>  {
        const isManager = avatar.type === AvatarTypes.Manager;
        let isOwner = false;
        if (team.teamOwner) {
          isOwner = avatar.id === team.teamOwner.id;
        }
        return isManager && isOwner;
      });
      const teamMembers = _.chain(assignments).filter((assignment: Assignment) => {
        return currentUserDetail.userAvatars.some(avatar => avatar.type === 'MANAGER' && avatar.id === assignment.manager.id);
      }).map('id').value();
      const canEditMetrics = isTeamOwner || isCompanyAdmin;
      const canSaveMetrics = teamMembers.length > 0 || isTeamOwner || isCompanyAdmin;
      return {
        canEditMetrics: canEditMetrics,
        canSaveMetrics: canSaveMetrics,
      };
    } else {
      return {
        canEditMetrics: false,
        canSaveMetrics: false,
      };
    }
  }

  public calculateWeeklyTeamMetrics(
    metricsValues: RawMetrics[],
    metricsTarget: number,
    normalize: boolean
  ): TeamMetricRecord {
    const flattenedStats = this.getFlattenedStats(metricsValues, normalize);

    const weeklyStats = _.chain(flattenedStats)
    .groupBy('startDate')
    .map((individualStat, startDate: string) => {
      let teamStat = {
        ticketsResolved: 0,
        cost: 0,
        teamSize: 0,
        unitPerAssignment: 0,
        costPerUnit: 0,
        startDate: '',
      } as WeekStats;
      teamStat = _.chain(individualStat).reduce((week, stat) => {
        week.ticketsResolved += stat.ticketsResolved  as number;
        week.cost += stat.weekSalary;
        teamStat.teamSize += stat.activeWeek ? 1 : 0;
        return week;
      }, teamStat)
      .value() as WeekStats;
      teamStat.unitPerAssignment = teamStat.ticketsResolved / teamStat.teamSize;
      teamStat.costPerUnit = teamStat.ticketsResolved === 0 ? teamStat.cost : teamStat.cost / teamStat.ticketsResolved;
      teamStat.startDate = startDate;
      return teamStat;
    })
    .value() as WeekStats[];

    const weeklyMetrics = weeklyStats.map(stat => {
      const week: { [key: string]: WeekMetrics } = {};
      week[this.getWeeklyFormat(new Date(stat.startDate))] = {
        ticketsResolved: stat.ticketsResolved,
        hoursWorked: 0,
        weekSalary: 0,
        startDate: stat.startDate,
        cost: stat.costPerUnit,
        isLastWeek: !isBefore(new Date(stat.startDate), TeamMetricsService.thisMonday),
        teamSize: stat.teamSize
      } as WeekMetrics;
      return week;
    });

    const teamAverage = this.calculateTeamAverageMetrics(weeklyStats);

    const teamRecord = {
      name: 'Team',
      metric: teamAverage.unitPerWeek,
      cost: teamAverage.costPerUnit,
      hoursLogged: 0,
      teamRecord: true,
      metricScoreClass: metricsTarget === 0 ? 0 : this.getScoreClass(teamAverage.unitPerWeek / metricsTarget),
      weeks: {},
    } as TeamMetricRecord;

    weeklyMetrics.forEach(metric => {
      const key = Object.keys(metric).toString();
      teamRecord.weeks[key] = metric[key];
    });

    return teamRecord;
  }

  public calculateTeamAverageMetrics(weeklyTeamMetrics: WeekStats[]): TeamAverageMetric {
    const teamMetricsBeforeThisWeek = Object.assign(
        weeklyTeamMetrics.filter(metric => isBefore(new Date(metric.startDate), TeamMetricsService.thisMonday) && metric.teamSize > 0), {}
      );
    let total = {
      cost: 0,
      unit: 0,
      unitPerWeek: 0,
      numberOfWeeks: 0,
    };
    total = _.chain(teamMetricsBeforeThisWeek)
    .reduce((accumulator, week) => {
      accumulator.cost = accumulator.cost + week.cost;
      accumulator.unit = accumulator.unit + week.ticketsResolved;
      accumulator.unitPerWeek = accumulator.unitPerWeek + week.unitPerAssignment;
      accumulator.numberOfWeeks++;
      return total;
    }, total).value();
    return {
      costPerUnit: total.unit === 0 ? total.cost : total.cost / total.unit,
      unitPerWeek: total.numberOfWeeks === 0 ? total.unitPerWeek : total.unitPerWeek / total.numberOfWeeks,
    };
  }

  public calculateStatsPerAssignments(
    assignments: Assignment[],
    metricsValues: RawMetrics[],
    metricTarget: number,
    normalize: boolean,
    managerId?: number,
    teamId?: number
  ): TeamMetricRecord[] {
    const flattenedStats = this.getFlattenedStats(metricsValues, normalize);
    const statsPerAssignments = Object.assign(_.chain(flattenedStats)
    .groupBy('assignmentId')
    .map((assignmentStats, assignmentId) => {
      const refinedStats = _.chain(assignmentStats)
      .map(stat => {
        const ticketsResolved = stat.ticketsResolved as number
        return {
          startDate: stat.startDate,
          ticketsResolved: ticketsResolved,
          cost: stat.weekSalary,
          teamSize: 0,
          costPerUnit: stat.ticketsResolved === 0 ? stat.weekSalary : stat.weekSalary / ticketsResolved,
          queryUsed: stat.queryUsed,
          activeWeek: stat.activeWeek,
        };
      }).value();
      return {
        id: +assignmentId,
        stats: refinedStats,
      };
    }).value(), {}) as IndividualStat[];
    const individualRecords: TeamMetricRecord[] = [];
    statsPerAssignments.forEach(statsPerAssignment => {
      const assignment = assignments.find(item => {
        return item.id === statsPerAssignment.id;
      });
      if (assignment) {
        statsPerAssignment.name = assignment.candidate.printableName;
        const lastAssignmentHistory = assignment.assignmentHistories.find(history => history.id === assignment.id);
        statsPerAssignment.effectiveDateEndInTeam = lastAssignmentHistory ? lastAssignmentHistory.effectiveDateEnd : undefined;

        const weeklyMetrics = statsPerAssignment.stats.map(stat => {
          const week: { [key: string]: WeekMetrics } = {};
          week[this.getWeeklyFormat(new Date(stat.startDate))] = {
            ticketsResolved: stat.ticketsResolved,
            cost: stat.costPerUnit,
            weekSalary: stat.cost,
            startDate: stat.startDate,
            activeWeek: stat.activeWeek,
            queryUsed: stat.queryUsed,
            isLastWeek: !isBefore(new Date(stat.startDate), TeamMetricsService.thisMonday),
          } as WeekMetrics;
          return week;
        });

        const individualAverage = this.calIndividualAverage(statsPerAssignment.stats);
        const isPartOfTeam = (assignment.manager.id === managerId  || managerId === -1) && (teamId === assignment.team.id);
        const individualRecord = {
          name: assignment.candidate.printableName,
          assignmentId: assignment.id,
          photoUrl: assignment.candidate.photoUrl,
          metric: individualAverage.unitPerWeek,
          cost: individualAverage.costPerUnit,
          hoursLogged: 0,
          effectiveDateEndInTeam: assignment.status === ACTIVE_STATUS ? undefined : assignment.effectiveDateBegin,
          metricScoreClass: metricTarget === 0 ? 0 : this.getScoreClass(individualAverage.unitPerWeek / metricTarget),
          isActiveAssignment: assignment.status === ACTIVE_STATUS && isPartOfTeam,
          weeks: {},
        } as TeamMetricRecord;

        weeklyMetrics.forEach(metric => {
          const key = Object.keys(metric).toString();
          individualRecord.weeks[key] = metric[key];
        });
        individualRecords.push(individualRecord);
      }
    });
    return individualRecords;
  }

  public calIndividualAverage(assignmentStats: WeekStats[]): TeamAverageMetric {
    const thisMonday = startOfWeek(new Date(), { weekStartsOn: 1});
    const teamMetricsBeforeThisWeek = Object.assign(
      assignmentStats.filter(metric => !isAfter(new Date(metric.startDate), thisMonday)), {}
    );
    let averageTotal = {
      unit: 0,
      week: 0,
      cost: 0,
    };
    averageTotal = _.chain(teamMetricsBeforeThisWeek)
    .reduce((total, stat) => {
      total.unit = total.unit + stat.ticketsResolved;
      total.cost = total.cost + stat.cost;
      if (stat.activeWeek) {
        total.week++;
      }
      return total;
    }, averageTotal).value();
    return {
      costPerUnit: averageTotal.unit === 0 ? averageTotal.cost : averageTotal.cost / averageTotal.unit,
      unitPerWeek: averageTotal.week === 0 ? 0 : averageTotal.unit / averageTotal.week,
    };
  }

  public getWeeklyFormat(date: Date): string {
    const start = addDays(startOfWeek(date), 1);
    const end = addDays(endOfWeek(date), 1);

    return `${format(start, 'MMM DD')} - ${format(end, 'MMM DD')}`;
  }

  public getScoreClass(score: number): string {
    if (score >= 0.7) {
      return 'score-success';
    } else if (score >= 0.5) {
      return 'score-warning';
    } else {
      return 'score-danger';
    }
  }

  private getFlattenedStats(metricsValues: RawMetrics[], normalize: boolean): WeekMetrics[] {
    const denormalizedStats = _.chain(metricsValues)
    .map(assignment => {
      return _.chain(assignment.stats)
      .map(stat => {
        stat.assignmentId = assignment.assignmentId;
        return stat;
      }).value();
    })
    .flatten().value() as WeekMetrics[];

    const normalizedStats: WeekMetrics[] = [];
    denormalizedStats.forEach(stat => {
      const clonedStat = _.clone(stat);
      clonedStat.ticketsResolved = clonedStat.hoursWorked > 0 ?
        +(clonedStat.ticketsResolved as number / clonedStat.hoursWorked * 40).toFixed(1) : clonedStat.ticketsResolved;
      normalizedStats.push(clonedStat);
    });

    return normalize ? normalizedStats : denormalizedStats;
  }
}
