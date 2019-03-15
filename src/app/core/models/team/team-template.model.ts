import { TeamCategory, TeamTemplateSeat } from 'app/core/models/team';

export interface TeamTemplate {
  createdOn?: string;
  goal?: string;
  id: number;
  name?: string;
  teamCategory?: TeamCategory;
  templateSeats?: Array<TeamTemplateSeat>;
  updatedOn?: string;
  weeklyCost?: number;
}
