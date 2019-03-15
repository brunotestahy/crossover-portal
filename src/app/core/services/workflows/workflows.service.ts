import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {
  JiraProject,
  JiraServer,
  JiraWorkflow,
  JiraWorkflowGoals,
  WorkflowStateMapping } from 'app/core/models/workflow';
import { PROJECTS_MOCK } from 'app/core/services/mocks/workflows.mock';
import { environment } from 'environments/environment';

const URLs = {
  getServers: `${environment.apiPath}/workflows/servers`,
  getProjects: `${environment.apiPath}/workflows/projects`,
  saveWorkflow: `${environment.apiPath}/teams/%(teamId)s/workflows/`,
  getWorkflowGoals: `${environment.apiPath}/teams/%(teamId)s/workflows/goals`,
  getWorkflowStates: `${environment.apiPath}/teams/%(teamId)s/workflows/states`,
};

@Injectable()
export class WorkflowsService {
  constructor(private httpClient: HttpClient) { }

  public getServers(): Observable<JiraServer[]> {
    return this.httpClient.get<JiraServer[]>(URLs.getServers);
  }

  public getProjects(_serverId: string): Observable<JiraProject[]> {
    return Observable.of(PROJECTS_MOCK).delay(300);
  }

  public saveWorkflow(_teamId: string, _workflow: JiraWorkflow): Observable<{}> {
    return Observable.of({}).delay(300);
  }

  public getWorkflowGoals(teamId: string): Observable<JiraWorkflowGoals> {
    return this.httpClient.get<JiraWorkflowGoals>(sprintf(URLs.getWorkflowGoals, { teamId }));
  }

  public getWorkflowStates(teamId: string): Observable<WorkflowStateMapping[]> {
    return this.httpClient.get<WorkflowStateMapping[]>(sprintf(URLs.getWorkflowStates, { teamId }));
  }
}
