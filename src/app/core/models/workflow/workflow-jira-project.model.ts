import { WorkflowJiraServer } from 'app/core/models/workflow';

export interface WorkflowJiraProject {
  groupName?: string;
  id: number;
  jiraId?: number;
  jiraKey?: string;
  jiraName?: string;
  lastSyncedAt?: string;
  permissionSchemeId?: number;
  workflowJiraServer?: WorkflowJiraServer;
}
