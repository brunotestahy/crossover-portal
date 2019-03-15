import * as _ from 'lodash';

import * as TeamSelectorConstants from 'app/core/constants/team-selector';
import { CurrentUserDetail } from 'app/core/models/identity';
import { Manager } from 'app/core/models/manager';
import { Team } from 'app/core/models/team';
import {
  AbstractTeamSelectorStrategy,
} from 'app/core/models/team-selector-strategy/abstract-team-selector-strategy.model';

export class OnlyTeamsMatchingCompanyWithoutAllManagers extends AbstractTeamSelectorStrategy {
  public filterTeams(teams: Team[], currentUserDetail: CurrentUserDetail): Team[] {
    const managerCompanyId = _.get(currentUserDetail, 'assignment.team.company.id', 0) as number;
    return teams.filter(team => {
      const currentTeamCompanyId = _.get(team, 'company.id', null) as number | null;
      return managerCompanyId === currentTeamCompanyId;
    });
  }

  public filterManagers(managers: Manager[]): Manager[] {
    return managers.filter(
      manager => typeof(manager.id) === 'number' && !TeamSelectorConstants.isAllManagers(manager.id)
    );
  }
}
