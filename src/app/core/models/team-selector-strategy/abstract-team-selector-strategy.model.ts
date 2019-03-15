import { CurrentUserDetail } from 'app/core/models/identity';
import { Manager } from 'app/core/models/manager';
import { Team } from 'app/core/models/team';

export abstract class AbstractTeamSelectorStrategy {
  public navigationDisabledMessage =
  'Selector is disabled for this app. Please use the built-in selectors ' +
  'to navigate between items.';

  public navigationEnabled(_currentUser: CurrentUserDetail): boolean {
    return true;
  }

  public managerSelectorEnabled(_currentUser: CurrentUserDetail): boolean {
    return true;
  }

  public filterTeams(input: Team[], _currentUser: CurrentUserDetail): Team[] {
    return input;
  }

  public filterManagers(input: Manager[], _currentUser: CurrentUserDetail): Manager[] {
    return input;
  }
}
