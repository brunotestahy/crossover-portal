import { Assignment } from 'app/core/models/assignment';

export interface WorkflowJiraUser {
  assignment?: Assignment;
  id: number;
  userName?: string;
}
