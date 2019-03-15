import { Team } from 'app/core/models/team/team.model';

export interface TeamManagerGroup {
  managerId: number;
  team: Team;
  teams?: Team[];
}
