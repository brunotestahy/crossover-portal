import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ALL_MANAGERS_ID } from 'app/core/constants/team-selector';
import {
  ManualTimecard,
  WorkDiariesFilters,
  WorkDiary,
  WorkDiaryActionCreate,
  WorkDiaryLatestFilters,
} from 'app/core/models/logbook';
import { TrackingTimesheet } from 'app/core/models/time-tracking';
import { environment } from 'environments/environment';

export interface TimesheetFilters {
  teamId?: number;
  managerId?: number;
  userId?: number;
  date?: string;
  isCacheAccess?: boolean;
  period?: string;
  fullTeam?: boolean;
}

export const TIMETRACKING_URLS = {
  getWorkDiaries: `${environment.apiPath}/timetracking/workdiaries`,
  getTimesheets: `${environment.apiPath}/timetracking/timesheets`,
  getTeamsTimesheet: `${environment.apiPath}/v2/timetracking/timesheets/assignment`,
  getLatestWorkDiaries: `${environment.apiPath}/timetracking/workdiaries/latest`,
};

@Injectable()
export class TimetrackingService {

  constructor(
    private http: HttpClient
  ) {
  }

  public getWorkDiaries(filters: WorkDiariesFilters): Observable<WorkDiary[]> {
    return this.http.get<WorkDiary[]>(TIMETRACKING_URLS.getWorkDiaries +
      '?assignmentId=' + filters.assignmentId +
      '&date=' + filters.date +
      (filters.timeZoneId ? '&timeZoneId=' + filters.timeZoneId : ''));
  }

  public getLatestWorkDiaries(params: WorkDiaryLatestFilters): Observable<WorkDiary[]> {
    return this.http.get<WorkDiary[]>(TIMETRACKING_URLS.getLatestWorkDiaries, { params });
  }

  public getTimesheets(filters: TimesheetFilters): Observable<TrackingTimesheet[]> {
    const httpParams = this.getApiParams(filters);
    return this.http.get<TrackingTimesheet[]>(TIMETRACKING_URLS.getTimesheets, { params: httpParams });
  }

  public getTeamsTimesheet(filters: TimesheetFilters): Observable<TrackingTimesheet[]> {
    return this.http.get<TrackingTimesheet[]>(TIMETRACKING_URLS.getTeamsTimesheet, {
      params: {
        directOnly: 'false',
        ...filters.managerId && filters.managerId !== ALL_MANAGERS_ID && { managerId: filters.managerId.toString() },
        teamId: filters.teamId && filters.teamId !== ALL_MANAGERS_ID ? filters.teamId.toString() : '',
        ...filters.period && { period: filters.period },
        ...filters.date && { date: filters.date },
        fullTeam: (filters.fullTeam || false).toString(),
      },
    }
    );
  }

  public deleteTimecards(timecardIds: number[]): Observable<Object> {
    const query = timecardIds.map(id => `id=${id}`);
    return this.http.delete<Object>(`${TIMETRACKING_URLS.getWorkDiaries}?${query.join('&')}`);
  }

  public addManualTimeCard(manualCard: ManualTimecard): Observable<boolean> {
    return this.http.post<boolean>(`${TIMETRACKING_URLS.getWorkDiaries}`,
      manualCard,
      { params: { assignmentId: manualCard.assignmentId.toString() } });
  }

  public addWorkdiaryAction(filters: WorkDiaryActionCreate): Observable<boolean> {
    return this.http.put<boolean>(
      `${TIMETRACKING_URLS.getWorkDiaries}`,
      filters,
      { params: { action: filters.action, assignmentId: filters.assignmentId.toString() } }
    );
  }

  protected getApiParams(filters: TimesheetFilters): HttpParams {
    const apiParams: Record<string, string | string[]> = {};
    if (filters.teamId) {
      apiParams['teamId'] = filters.teamId.toString();
    }
    if (filters.managerId) {
      apiParams['managerId'] = filters.managerId.toString();
    }
    if (filters.userId) {
      apiParams['userId'] = filters.userId.toString();
    }
    if (filters.date) {
      apiParams['date'] = filters.date;
    }
    if (filters.isCacheAccess) {
      apiParams['isCacheAccess'] = filters.isCacheAccess.toString();
    }
    if (filters.period) {
      apiParams['period'] = filters.period;
    }

    return new HttpParams({
      fromObject: apiParams,
    });
  }
}
