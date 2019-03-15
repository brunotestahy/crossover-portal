import * as TeamSelectorConstants from 'app/core/constants/team-selector';
import { Manager } from 'app/core/models/manager';
import { Team } from 'app/core/models/team';
import {
  AbstractTeamSelectorStrategy,
} from 'app/core/models/team-selector-strategy/abstract-team-selector-strategy.model';

export class AllTeamsDisableManagers extends AbstractTeamSelectorStrategy {
  public filterTeams(teams: Team[]): Team[] {
    return teams.filter(team => team.name !== TeamSelectorConstants.ALL_DIRECT_REPORT);
  }

  public managerSelectorEnabled(): boolean {
    return false;
  }

  public filterManagers(_managers: Manager[]): Manager[] {
    return [];
  }
}
