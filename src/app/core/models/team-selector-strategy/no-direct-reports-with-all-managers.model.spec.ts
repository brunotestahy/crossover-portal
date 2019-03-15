import * as TeamSelectorConstants from 'app/core/constants/team-selector';
import { NoDirectReportsWithAllManagers } from 'app/core/models/team-selector-strategy';

describe('NoDirectReportsWithAllManagers', () => {
  it('should filter the "All Direct Report" team successfully', () => {
    const instance = new NoDirectReportsWithAllManagers();
    const target = Object.assign([
      { name: TeamSelectorConstants.ALL_DIRECT_REPORT },
      { name: TeamSelectorConstants.ALL_DIRECT_REPORT },
    ]);
    const result = instance.filterTeams(target);
    expect(result.length).toBe(0);
  });

  it('should return the same managers successfully', () => {
    const instance = new NoDirectReportsWithAllManagers();
    const target = Object.assign([
      { id: TeamSelectorConstants.ALL_MANAGERS_ID },
      { id: TeamSelectorConstants.ALL_MANAGERS_ID },
    ]);
    const currentUserDetail = Object.assign({});
    const result = instance.filterManagers(target, currentUserDetail);
    expect(result.length).toBe(target.length);
  });
});
