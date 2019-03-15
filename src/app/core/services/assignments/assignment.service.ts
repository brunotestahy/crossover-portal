import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { sprintf } from 'sprintf-js';

import * as AvatarTypes from 'app/core/constants/avatar-types';
import * as TeamConstants from 'app/core/constants/team-selector';
import { JobApplication } from 'app/core/models/application';
import {
  Assignment,
  CurrentUserAssignmentsRequest,
  DashboardResponse,
} from 'app/core/models/assignment';
import { InterviewDetailsResponse } from 'app/core/models/interview';
import { Manager } from 'app/core/models/manager';
import { MetricSetup } from 'app/core/models/metric';
import { PaginatedApi } from 'app/core/models/paginated-api';
import { Team } from 'app/core/models/team';
import { environment } from 'environments/environment';

export const ASSIGNMENT_URLS = {
  currentUserAssignments: `${environment.apiPath}/teams/assignments`,
  updateUserAssignments: `${environment.apiPath}/v2/teams/assignments`,
  currentUserTeams: `${environment.apiPath}/v2/teams`,
  teamManagers: `${environment.apiPath}/managers`,
  team: `${environment.apiPath}/teams`,
  teamWatchers: `${environment.apiPath}/managers/logicalWatchers`,
  provideBackgroundCode: `${
    environment.apiPath
    }/teams/assignments/%(id)s/actions/candidate?action=provideBackgroundCode&code=%(code)s`,
  providePasswordAction: `${
    environment.apiPath
    }/teams/assignments/%(userId)s/actions/candidate?action=providePassword`,
  changeTeamManagerAction: `${
    environment.apiPath
    }/teams/assignments/%(assignmentId)s/actions/manager?action=changeTeam`,
  provideResidenceInfo: `${
    environment.apiPath
    }/teams/assignments/%(assignmentId)s/actions/candidate?action=provideResidenceInfo`,
  teamAssignments: `${environment.apiPath}/v2/teams/assignments`,
  teamsDashboard: `${environment.apiPath}/internal/teams/dashboard`,
  contractorAssignment: `${
    environment.apiPath
    }/teams/assignments/%(assignmentId)s`,
  saveContractorAvatar: `${environment.apiPath}/teams/assignments/%(assignmentId)s/avatar?avatarId=%(avatarId)s`,
};

const ASSIGNMENT_ACCEPT_OFFER_STATUS = 'acceptOffer';
const ASSIGNMENT_DECLINE_OFFER_STATUS = 'declineOffer';
const ASSIGNMENT_ACTIVE_STATUS = 'ACTIVE';

@Injectable()
export class AssignmentService {
  public cachedTeamsAssignments: {
    [key: string]: Assignment[];
  } = {};

  constructor(protected http: HttpClient) {
  }

  public getCurrentUserAssignments(
    params: CurrentUserAssignmentsRequest,
  ): Observable<PaginatedApi<Assignment>> {
    return this.http.get<PaginatedApi<Assignment>>(
      ASSIGNMENT_URLS.currentUserAssignments,
      { params },
    );
  }

  public getCurrentUserActiveAssignments(): Observable<PaginatedApi<Assignment>> {
    return this.getCurrentUserAssignments({
      status: ASSIGNMENT_ACTIVE_STATUS,
      page: '0',
      avatarType: AvatarTypes.Candidate,
    });
  }

  public getCurrentUserAssignment(): Observable<Assignment> {
    return this.getCurrentUserActiveAssignments()
      .pipe(map(res => res.content[0]));
  }

  public getAssignmentsForTeam(
    teamId: string,
    options: { [key: string]: string },
  ): Observable<PaginatedApi<Assignment>> {
    const params = { ...options, teamId } as typeof options;
    return this.http.get<PaginatedApi<Assignment>>(
      ASSIGNMENT_URLS.currentUserAssignments,
      { params },
    );
  }

  public getAssignmentById(id: string): Observable<Assignment> {
    return this.http.get<Assignment>(`${ASSIGNMENT_URLS.currentUserAssignments}/${id}`);
  }

  public candidateAcceptsOffer(id: string): Observable<Assignment> {
    return this.http.post<Assignment>(`${ASSIGNMENT_URLS.currentUserAssignments}/${id}
    /actions/candidate?action=${ASSIGNMENT_ACCEPT_OFFER_STATUS}`, {});
  }

  public candidateDeclinesOffer(id: string): Observable<Assignment> {
    return this.http.post<Assignment>(`${ASSIGNMENT_URLS.currentUserAssignments}/${id}
    /actions/candidate?action=${ASSIGNMENT_DECLINE_OFFER_STATUS}`, {});
  }

  public provideUserPassword(
    userId: number,
    password: string,
  ): Observable<void> {
    return this.http.post<void>(
      sprintf(ASSIGNMENT_URLS.providePasswordAction, { userId }),
      password,
    );
  }

  public getAssignmentList(): Observable<Assignment[]> {
    return this.http
      .get<PaginatedApi<Assignment>>(ASSIGNMENT_URLS.currentUserAssignments, {
        params: {
          page: '0',
          avatarType: AvatarTypes.Candidate,
        },
      })
      .pipe(map(res => res.content));
  }

  public getContractorAssignment(assignmentId: number): Observable<Assignment> {
    return this.http.get<Assignment>(
      sprintf(ASSIGNMENT_URLS.contractorAssignment, { assignmentId }),
      {
        params: {
          avatarType: AvatarTypes.Manager,
        },
      },
    );
  }

  public getTeamAssignments(
    managerId: string | undefined,
    teamId: string,
    from: string,
    to: string,
    isCacheOk: boolean = false,
    fullTeam?: string,
  ): Observable<Assignment[]> {
    if (!this.cachedTeamsAssignments[teamId] || !isCacheOk) {
      return this.http
        .get<PaginatedApi<Assignment>>(ASSIGNMENT_URLS.teamAssignments, {
          params: {
            avatarType: AvatarTypes.Candidate,
            from,
            fullTeam: _.defaultTo(fullTeam, 'true'),
            limit: '1000',
            ...managerId && { managerId },
            status: ASSIGNMENT_ACTIVE_STATUS,
            teamId,
            to,
          },
        })
        .pipe(
          map(res => {
            res.content.sort((a, b) => {
              const aName = _.get(a, 'candidate.printableName') || '';
              const bName = _.get(b, 'candidate.printableName') || '';

              return aName.localeCompare(bName);
            });
            this.cachedTeamsAssignments[teamId] = res.content;
            return res.content;
          }),
        );
    } else {
      return Observable.of(this.cachedTeamsAssignments[teamId]);
    }
  }

  public getTeamAssignmentsAsManager(
    fullTeam?: boolean,
    managerId?: number,
    teamId?: number,
    status?: string,
    page?: number,
    from?: string,
    to?: string,
  ): Observable<Assignment[]> {
    return this.http
      .get<PaginatedApi<Assignment>>(ASSIGNMENT_URLS.teamAssignments, {
        params: {
          ...fullTeam && { fullTeam: fullTeam.toString() },
          ...managerId && !TeamConstants.isAllManagers(managerId.toString()) && { managerId: managerId.toString() },
          ...teamId && { teamId: teamId.toString() },
          ...page && { page: page.toString() },
          ...status && { status },
          ...from && { from },
          ...to && { to },
          limit: '1000',
        },
      })
      .pipe(map(res => res.content));
  }

  public getTeamAssignmentsAsCandidate(): Observable<Assignment[]> {
    return this.http
      .get<PaginatedApi<Assignment>>(ASSIGNMENT_URLS.teamAssignments, {
        params: {
          avatarType: AvatarTypes.Candidate,
          fullTeam: 'false',
          status: ASSIGNMENT_ACTIVE_STATUS,
        },
      })
      .pipe(map(res => res.content));
  }

  public getUserTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(ASSIGNMENT_URLS.currentUserTeams, {
      params: {
        direct: 'false',
        projection: 'COLLECTION_0',
      },
    });
  }

  public getManagers(): Observable<Manager[]> {
    return this.http.get<Manager[]>(
      ASSIGNMENT_URLS.teamManagers + '?allInternal=true&avatarType=MANAGER',
    );
  }

  public getTeamMetricSettings(team: Team): Observable<MetricSetup[] | undefined> {
    return this.getTeam(team.id.toString())
      .pipe(map(res => res.metricsSetups));
  }

  public getTeam(teamId: string): Observable<Team> {
    return this.http.get<Team>(`${ASSIGNMENT_URLS.team}/${teamId}`);
  }

  public deleteTeam(teamId: string): Observable<Team> {
    return this.http.delete<Team>(`${ASSIGNMENT_URLS.team}/${teamId}`);
  }

  public updateTeam(team: Team): Observable<Team> {
    return this.http.put<Team>(`${ASSIGNMENT_URLS.team}/${team.id}`, team);
  }

  public getWatchers(teamId: string): Observable<Manager[]> {
    return this.http.get<Manager[]>(
      `${ASSIGNMENT_URLS.teamWatchers}/${teamId}`,
    ).pipe(map(res => _.orderBy(res, ['printableName'], ['asc'])));
  }

  public getDashboard(
    managerId: number,
    teamId: number | string,
    directOnly: boolean = true,
  ): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(ASSIGNMENT_URLS.teamsDashboard, {
      params: {
        managerId: managerId.toString(),
        teamId: teamId.toString(),
        directOnly: directOnly.toString(),
      },
    });
  }

  public candidateProvideBackgroundCode(
    id: string,
    code: string,
  ): Observable<void> {
    return this.http.post<void>(
      sprintf(ASSIGNMENT_URLS.provideBackgroundCode, { id, code }),
      JSON.stringify({}),
    );
  }

  public candidateProvidesResidenceInfo(
    assignmentId: number,
  ): Observable<boolean> {
    return this.http
      .post<boolean>(
        sprintf(ASSIGNMENT_URLS.provideResidenceInfo, { assignmentId }),
        {},
      )
      .pipe(map(() => true));
  }

  public getRedirectionState(
    assignments: Assignment[],
    applications: JobApplication[],
    interviews?: InterviewDetailsResponse[],
  ): string {
    // TODO: all the route redirection stuff is supposed to be handled on ticket AWORK-32207
    const assignment =
      assignments.find(entry => entry.status !== undefined) ||
      ({} as Assignment);
    const interview =
      interviews && interviews.length
        ? interviews[0]
        : ({} as InterviewDetailsResponse);
    const states = [
      {
        condition: () =>
          ['ACTIVE', 'CANDIDATE_ACCEPTED', 'MANAGER_SETUP', 'PENDING'].indexOf(
            assignment.status,
          ) !== -1,
        redirectUrl: this.getDefaultRedirectionState(),
      },
      {
        condition: () => (interviews ? interviews.length > 0 : false),
        redirectUrl: `/interviews/${interview.id}/view`,
      },
      {
        condition: () => (assignments.length ? true : applications.length > 0),
        redirectUrl: `/candidate/dashboard/applications`,
      },
      // Default condition
      {
        condition: () => true,
        redirectUrl: this.getDefaultRedirectionState(),
      },
    ];
    const state = states.filter(entry => entry.condition())[0];
    return state.redirectUrl;
  }

  public getDefaultRedirectionState(): string {
    return '/candidate';
  }

  public saveContractorAvatar(assignmentId: string, avatarId: string): Observable<void> {
    return this.http.put<void>(sprintf(ASSIGNMENT_URLS.saveContractorAvatar, { assignmentId, avatarId }), {
      id: assignmentId,
      avatarId,
    });
  }

  public updateTeamManager(assignmentId: string, managerId: string, teamId: string): Observable<Assignment> {
    return this.http.post<Assignment>(sprintf(ASSIGNMENT_URLS.changeTeamManagerAction, { assignmentId }), {
        assignmentId,
        managerId,
        teamId,
      },
      {
        params: {
          assignmentId,
          managerId,
          teamId,
        },
      });
  }

  public updateAssignment(assignment: Assignment): Observable<Assignment> {
    return this.http.put<Assignment>(`${ASSIGNMENT_URLS.updateUserAssignments}/${assignment.id}`, assignment);
  }
}
