import { Team, TeamTemplate } from 'app/core/models/team';

export interface TeamCategory {
  availableTeamsCount?: number;
  id: number;
  name?: string;
  teamTemplates?: Array<TeamTemplate>;
  teams?: Array<Team>;
  weeklyCost?: number;
}
