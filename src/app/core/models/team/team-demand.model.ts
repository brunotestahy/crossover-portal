import { Job } from 'app/core/models/hire';
import { Team } from 'app/core/models/team';

export interface TeamDemand {
  description?: string;
  id: number;
  job?: Job;
  team?: Team;
}
