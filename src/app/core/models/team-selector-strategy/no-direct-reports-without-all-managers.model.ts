import * as TeamSelectorConstants from 'app/core/constants/team-selector';
import { Manager } from 'app/core/models/manager';
import { Team } from 'app/core/models/team';
import {
  AbstractTeamSelectorStrategy,
} from 'app/core/models/team-selector-strategy/abstract-team-selector-strategy.model';

export class NoDirectReportsWithoutAllManagers extends AbstractTeamSelectorStrategy {
  public filterTeams(teams: Team[]): Team[] {
    return teams.filter(team => team.name !== TeamSelectorConstants.ALL_DIRECT_REPORT);
  }

  public filterManagers(managers: Manager[]): Manager[] {
    return managers.filter(
      manager => typeof(manager.id) === 'number' && manager.id !== TeamSelectorConstants.ALL_MANAGERS_ID
    );
  }
}
