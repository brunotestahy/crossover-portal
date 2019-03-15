import * as TeamSelectorConstants from 'app/core/constants/team-selector';
import { NoDirectReportsWithoutAllManagers } from 'app/core/models/team-selector-strategy';

describe('NoDirectReportsWithoutAllManagers', () => {
  it('should filter the "All Direct Report" team successfully', () => {
    const instance = new NoDirectReportsWithoutAllManagers();
    const target = Object.assign([
      { name: TeamSelectorConstants.ALL_DIRECT_REPORT },
      { name: TeamSelectorConstants.ALL_DIRECT_REPORT },
    ]);
    const result = instance.filterTeams(target);
    expect(result.length).toBe(0);
  });

  it('should filter the "All Managers" manager successfully', () => {
    const instance = new NoDirectReportsWithoutAllManagers();
    const target = Object.assign([
      { id: TeamSelectorConstants.ALL_MANAGERS_ID },
      { id: TeamSelectorConstants.ALL_MANAGERS_ID },
    ]);
    const result = instance.filterManagers(target);
    expect(result.length).toBe(0);
  });
});
