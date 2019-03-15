import { Manager } from 'app/core/models/manager';
import { MarketplaceMember } from 'app/core/models/marketplace-member';
import { Team } from 'app/core/models/team/team.model';

export interface Selection {
  id: number;
  status: string;
  manager: Manager;
  createdOn: string;
  updatedOn: string;
  marketplaceMember: MarketplaceMember;
  team?: Team;
}
