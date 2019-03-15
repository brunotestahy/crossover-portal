import { Assignment } from 'app/core/models/assignment';
import { Team } from 'app/core/models/team';

export interface DashboardResponse {
  assignments: Assignment[];
  // replace with proper interface
  productivityAverage: string[];
  teams: Team[];
}
