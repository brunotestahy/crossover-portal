import { AssignmentHistory, JiraSetup } from 'app/core/models/assignment';

export interface CurrentAssignmentHistory extends AssignmentHistory {
  jiraSetup: JiraSetup;
  jiraId: string;
}
