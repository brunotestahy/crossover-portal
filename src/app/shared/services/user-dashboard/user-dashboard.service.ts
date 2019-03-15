import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ALL_MANAGERS_ID } from 'app/core/constants/team-selector';
import { Team as DashboardTeam } from 'app/core/models/dashboard';
import { TeamDashboard } from 'app/core/models/time-tracking/team-dashboard.model';
import { TEAM_ACTIVITIES_MOCK, TEAM_ACTIVITY_MOCK } from 'app/core/services/mocks/activity.mock';
import { TEAMS_MOCK } from 'app/core/services/mocks/dashboard.mock';
import { environment } from 'environments/environment';

const API = {
  teamDashboard: `${environment.apiPath}/internal/teams/dashboard`,
};

@Injectable()
export class UserDashboardService {
  private _date$: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());
  private _updateTimesheets$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _period$: Subject<string> = new Subject();

  constructor(private http: HttpClient) { }

  public getDateStream(): Observable<Date> {
    return this._date$.asObservable();
  }

  public updateDate(date: Date): void {
    this._date$.next(date);
  }

  public isTimesheetsUpdated(): Observable<boolean> {
    return this._updateTimesheets$.asObservable();
  }

  public updateTimesheets(update: boolean): void {
    this._updateTimesheets$.next(update);
  }

  public getTeamDashboard(directOnly: boolean, managerId?: number, teamId?: number): Observable<TeamDashboard> {
    return this.http.get<TeamDashboard>(API.teamDashboard, {
      params: {
        directOnly: directOnly.toString(),
        ...managerId && managerId !== ALL_MANAGERS_ID && { managerId: managerId.toString() },
        ...teamId && { teamId: teamId.toString() },
      },
    });
  }

  public getActivityPeriod(): Observable<string> {
    return this._period$.asObservable();
  }

  public updateActivityPeriod(period: string): void {
    this._period$.next(period);
  }

  public getActivityGroups(_teamId: number, _date: string, _daily: boolean): Observable<Object> {
    return Observable.of(TEAM_ACTIVITY_MOCK).delay(200);
  }

  public getTeamActivites(_teamId: number): Observable<Object> {
    return Observable.of(TEAM_ACTIVITIES_MOCK).delay(200);

  }

  public getTeams(_managerId: number): Observable<Partial<DashboardTeam>> {
    return Object.assign(Observable.of(TEAMS_MOCK));
  }
}
