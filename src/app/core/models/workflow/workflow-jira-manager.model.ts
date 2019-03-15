import { Manager } from 'app/core/models/manager';
import { Team } from 'app/core/models/team';

export interface WorkflowJiraManager {
  id: number;
  manager?: Manager;
  team?: Team;
  username?: string;
}
