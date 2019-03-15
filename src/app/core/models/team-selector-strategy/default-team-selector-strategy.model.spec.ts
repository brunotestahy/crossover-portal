import * as TeamSelectorConstants from 'app/core/constants/team-selector';
import { DefaultTeamSelectorStrategy } from 'app/core/models/team-selector-strategy';

describe('DefaultTeamSelectorStrategy', () => {
  it('should return the same input values successfully', () => {
    const instance = new DefaultTeamSelectorStrategy();
    const teams = Object.assign([
      { name: TeamSelectorConstants.ALL_DIRECT_REPORT },
      { name: TeamSelectorConstants.ALL_DIRECT_REPORT },
    ]);
    const managers = Object.assign([
      { id: TeamSelectorConstants.ALL_MANAGERS_ID },
      { id: TeamSelectorConstants.ALL_MANAGERS_ID },
    ]);
    const currentUserDetail = Object.assign({});
    const resultTeams = instance.filterTeams(teams, currentUserDetail);
    const resultManagers = instance.filterManagers(managers, currentUserDetail);

    expect(resultTeams.length).toBe(teams.length);
    expect(resultManagers.length).toBe(managers.length);
  });
});
