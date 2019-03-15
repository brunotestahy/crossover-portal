import { Assignment } from 'app/core/models/assignment/assignment.model';
import { Team } from 'app/core/models/team/team.model';

export interface Team {
  assignments?: Partial<Assignment>[];
  teams?: Partial<Team>[];
}
