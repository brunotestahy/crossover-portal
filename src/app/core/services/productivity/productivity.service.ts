import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { sprintf } from 'sprintf-js';


import * as TeamConstants from 'app/core/constants/team-selector';
import { TeamFeature } from 'app/core/models/app';
import {
  Activity,
  BlocksStreak,
  CheckIn,
  PlannedProductivityGroup,
  ProductivityFilters,
  ProductivityGroup,
  ProductivitySummary,
  ProductivitySummaryWithMappedActivities,
} from 'app/core/models/productivity';
import { Review } from 'app/core/models/rank-review';
import { TeamAverage } from 'app/core/models/team';
import { ActivityInfoMapService } from 'app/core/services/productivity/activity-info-map.service';

const URLs = {
  getActivities: `${environment.apiPath}/productivity/activities`,
  getDailyPlanned: `${environment.apiPath}/productivity/activities/daily-planned`,
  getProductivityGroups: `${environment.apiPath}/tracker/activity/groups`,
  getCandidateCheckins: `${environment.apiPath}/productivity/candidates/checkins`,
  getProductivityAverage: `${environment.apiPath}/teams/%(teamId)s/productivity/average`,
  getManagerCheckins: `${environment.apiPath}/productivity/managers/checkins`,
  getProductivitySummary: `${environment.apiPath}/teams/%(teamId)s/productivity/summary`,
  getOverallProductivitySummary: `${environment.apiPath}/teams/productivity/summary`,
  getTeamFeature: `${environment.apiPath}/teams/%(teamId)s/features`,
  getReviews: `${environment.apiPath}/productivity/reviews`,
  saveReview: `${environment.apiPath}/productivity/reviews/%(id)s`,
  getBlocksStreaks: `${environment.apiPath}/productivity/checkins/blocks-streak`,
  insertCheckIn: `${environment.apiPath}/productivity/checkins?assignmentId=%(assignmentId)s`,
  updateCheckIn: `${environment.apiPath}/productivity/checkins/%(checkinId)s`,
  updateCheckInTeamFeature: `${environment.apiPath}/teams/%(teamId)s/features?teamFeature=TEAM_CHECKINS`,
};

@Injectable()
export class ProductivityService {

  constructor(
    private httpClient: HttpClient,
    private activityInfoMap: ActivityInfoMapService,
  ) {
  }

  public getProductivityGroups(params: ProductivityFilters): Observable<ProductivityGroup[]> {
    return this.httpClient.get<ProductivityGroup[]>(URLs.getProductivityGroups, {
      params: {
        assignmentId: params.assignmentId,
        date: params.date,
        weekly: params.weekly,
      },
    });
  }

  public getCandidateCheckIns(start: string, end: string): Observable<CheckIn[]> {
    return this.httpClient.get<CheckIn[]>(URLs.getCandidateCheckins, {
      params: {
        from: start,
        to: end,
      },
    });
  }

  public getManagerCheckIns(start: string, end: string, managerId?: number, teamId?: number): Observable<CheckIn[]> {
    return this.httpClient.get<CheckIn[]>(URLs.getManagerCheckins, {
      params: {
        from: start,
        to: end,
        ...managerId && { managerId: managerId.toString() },
        ...teamId && { teamId: teamId.toString() },
      },
    });
  }

  public getSummary(weeksCount: number, teamId: string, managerId?: number): Observable<ProductivitySummary> {
    return this.httpClient.get<ProductivitySummary>(sprintf(URLs.getProductivitySummary, { teamId }), {
      params: {
        weeksCount: weeksCount.toString(),
        ...managerId && { managerId: managerId.toString() },
      },
    });
  }

  public getTeamFeature(teamId: string): Observable<TeamFeature> {
    return this.httpClient.get<TeamFeature[]>(sprintf(URLs.getTeamFeature, { teamId }))
      .pipe(map(teamFeature => teamFeature[0]));
  }

  public toggleCheckinTeamFeature(teamId: string, teamFeature: TeamFeature): Observable<{}> {
    return this.httpClient.put<TeamFeature[]>(sprintf(URLs.updateCheckInTeamFeature, { teamId }), teamFeature);
  }

  public getBlocksStreaks(teamId: string, managerId?: number): Observable<BlocksStreak[]> {
    return this.httpClient.get<BlocksStreak[]>(URLs.getBlocksStreaks, {
      params: {
        teamId: teamId,
        ...managerId && { managerId: managerId.toString() },
      },
    });
  }

  public getActivities(managerId: string, teamId: string): Observable<Activity[]> {
    return this.httpClient.get<Activity[]>(URLs.getActivities, {
      params: {
        ...!TeamConstants.isAllManagers(managerId) && { managerId },
        ...!TeamConstants.isDirectReportsTeam(teamId) && { teamId },
      } as { [index: string]: string },
    });
  }

  public getDailyActivity(
    date: string,
    groups?: string,
    managerId?: string,
    assignmentId?: string,
    teamId?: string,
  ): Observable<ProductivityGroup[]> {
    return this.getPeriodActivities(
      date,
      groups as string,
      managerId as string,
      assignmentId as string,
      teamId as string,
    );
  }

  public getWeeklyActivity(
    date: string,
    groups?: string,
    managerId?: string,
    assignmentId?: string,
    teamId?: string,
  ): Observable<ProductivityGroup[]> {
    return this.getPeriodActivities(
      date,
      groups as string,
      managerId as string,
      assignmentId as string,
      teamId as string,
      true,
    );
  }

  public getDailyPlanned(
    assignmentId: string | undefined,
    groups: string,
    teamId: string,
    managerId?: string,
  ): Observable<PlannedProductivityGroup> {
    return this.httpClient.get<PlannedProductivityGroup>(URLs.getDailyPlanned, {
      params: {
        ...assignmentId && { assignmentId },
        ...managerId && !TeamConstants.isAllManagers(managerId) && { managerId },
        groups,
        refresh: 'false',
        teamId,
      },
    });
  }

  public insertCheckIn(checkin: CheckIn): Observable<{}> {
    const assignmentId = checkin.assignmentId;
    return this.httpClient.post(sprintf(URLs.insertCheckIn, { assignmentId }), checkin);
  }

  public updateCheckIn(checkin: CheckIn): Observable<{}> {
    const checkinId = checkin.id ? checkin.id.toString() : '';
    return this.httpClient.put(sprintf(URLs.updateCheckIn, { checkinId }), checkin);
  }

  public getReviews(
    avatarType: string,
    managerId: string,
    teamId: string,
    date: string,
    preventCache: boolean = false,
  ): Observable<Review | void> {
    return this.httpClient.get<Review>(URLs.getReviews, {
      params: {
        avatarType,
        teamId,
        managerId,
        date,
        ...preventCache && { preventCache: new Date().getTime().toString() },
      },
    });
  }

  public getOverallPerformers(): Observable<ProductivitySummaryWithMappedActivities[]> {
    return this.httpClient.get<ProductivitySummary[]>(URLs.getOverallProductivitySummary)
      .pipe(
        map(
          summaries => summaries.map(summary => ({
            productivitySummary: summary,
            mappedActivities: summary.assignments.map(assignment => this.activityInfoMap.map(assignment)),
          })),
        ),
      );
  }

  public saveReview(review: Review): Observable<Review> {
    return this.httpClient.put<Review>(sprintf(URLs.saveReview, review), review);
  }

  public getPerformers(
    managerId: string,
    teamId: string,
    date: string,
    weeksCount: string,
  ): Observable<ProductivitySummaryWithMappedActivities> {
    return this.httpClient.get<ProductivitySummary>(sprintf(URLs.getProductivitySummary, { teamId }), {
      params: {
        managerId,
        weeksCount,
        date,
      },
    })
      .pipe(
        map(productivitySummary => ({
            productivitySummary,
            mappedActivities:
              productivitySummary.assignments.map(assignment => this.activityInfoMap.map(assignment)),
          }),
        ));
  }

  public getProductivityAverage(
    avatarType: string,
    managerId: string,
    teamId: string,
    date: string,
    weeksCount: string,
  ): Observable<TeamAverage> {
    return this.httpClient.get<TeamAverage>(sprintf(URLs.getProductivityAverage, { teamId }), {
      params: {
        avatarType,
        managerId,
        weeksCount,
        date,
      },
    });
  }

  protected getPeriodActivities(
    date: string,
    groups?: string,
    managerId?: string,
    assignmentId?: string,
    teamId?: string,
    weekly?: boolean,
  ): Observable<ProductivityGroup[]> {
    const fullTeam = TeamConstants.isAllManagers(managerId).toString();
    return this.httpClient.get<ProductivityGroup[]>(URLs.getProductivityGroups, {
      params: {
        date,
        ...assignmentId && { assignmentId },
        ...groups && { groups },
        ...managerId && !TeamConstants.isAllManagers(managerId) && { managerId },
        ...teamId && !TeamConstants.isDirectReportsTeam(teamId) && { teamId },
        ...weekly === true && { weekly: 'true' },
        fullTeam,
        refresh: 'false',
      },
    });
  }
}
