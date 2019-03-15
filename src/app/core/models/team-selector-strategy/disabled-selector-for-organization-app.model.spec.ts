import * as TeamSelectorConstants from 'app/core/constants/team-selector';
import { DisabledSelectorForOrganizationApp } from 'app/core/models/team-selector-strategy';

describe('DisabledSelectorForOrganizationApp', () => {
  it('should filter teams for other companies successfully', () => {
    const instance = new DisabledSelectorForOrganizationApp();
    const targetCompanyId = 1;
    const otherCompanyId = 2;
    const currentUser = Object.assign({
      assignment: {
        team: {
          company: { id: targetCompanyId },
        },
      },
    });
    const target = Object.assign([
      {
        name: 'Team From the Same Company',
        company: { id: targetCompanyId },
      },
      {
        name: 'Team From Other Company',
        company: { id: otherCompanyId  },
      }
    ]);
    const result = instance.filterTeams(target, currentUser);
    expect(result.length).toBe(1);
  });

  it('should filter the "All Managers" manager successfully', () => {
    const instance = new DisabledSelectorForOrganizationApp();
    const target = Object.assign([
      { id: TeamSelectorConstants.ALL_MANAGERS_ID },
      { id: TeamSelectorConstants.ALL_MANAGERS_ID },
    ]);
    const result = instance.filterManagers(target);
    expect(result.length).toBe(0);
  });

  it('should disable the selector successfully', () => {
    const instance = new DisabledSelectorForOrganizationApp();
    const result = instance.navigationEnabled();

    expect(result).toBe(false);
  });
});
