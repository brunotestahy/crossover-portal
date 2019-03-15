import { Assignment } from 'app/core/models/assignment/assignment.model';
import { TeamAverage } from 'app/core/models/team/team-average.model';
import { Team } from 'app/core/models/team/team.model';

export class TeamDashboard {
  teams: Team[];
  assignments: Partial<Assignment>[];
  productivityAverage: TeamAverage[];
}
