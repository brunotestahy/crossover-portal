import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { sprintf } from 'sprintf-js';

import { TeamStatistics } from 'app/core/models/dashboard';
import { Job } from 'app/core/models/hire';
import { Team, TeamDemand, TeamStoreRequest } from 'app/core/models/team';
import { environment } from 'environments/environment';

const URLs = {
  storeTeam: `${environment.apiPath}/teams?avatarType=%(avatarType)s`,
  storeDemand: `${environment.apiPath}/teams/%(teamId)s/demands`,
  getStatistics: `${environment.apiPath}/teams/%(teamId)s/workflows/statistics?managerId=%(managerId)s`,
};

@Injectable()
export class TeamService {
  constructor (
    private http: HttpClient
  ) {
  }

  public store(data: TeamStoreRequest, avatarType: string): Observable<Team> {
    return this.http.post<Team>(sprintf(URLs.storeTeam, { avatarType }), data);
  }

  public demand(teamId: number, job: Job): Observable<TeamDemand> {
    return this.http.post<TeamDemand>(sprintf(URLs.storeDemand, { teamId }), {
      id: teamId,
      job
    });
  }

  public getTeamStatistics(teamId: string, managerId: string): Observable<TeamStatistics> {
    return this.http.get<TeamStatistics>(sprintf(URLs.getStatistics, { teamId, managerId}));
  }
}
