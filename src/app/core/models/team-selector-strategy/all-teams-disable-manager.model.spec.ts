import * as TeamSelectorConstants from 'app/core/constants/team-selector';
import { AllTeamsDisableManagers } from 'app/core/models/team-selector-strategy';

describe('AllTeamsDisableManagers', () => {
  it('should filter the "All Direct Report" team successfully', () => {
    const instance = new AllTeamsDisableManagers();
    const target = Object.assign([
      { name: TeamSelectorConstants.ALL_DIRECT_REPORT },
      { name: TeamSelectorConstants.ALL_DIRECT_REPORT },
    ]);
    const result = instance.filterTeams(target);
    expect(result.length).toBe(0);
  });

  it('should disable the manager selector successfully', () => {
    const instance = new AllTeamsDisableManagers();
    const result = instance.managerSelectorEnabled();

    expect(result).toBe(false);
  });

  it('should disable the manager selector successfully', () => {
    const instance = new AllTeamsDisableManagers();
    const result = instance.managerSelectorEnabled();

    expect(result).toBe(false);
  });

  it('should filter all managerssuccessfully', () => {
    const managers = Object.assign([{}, {}]);
    const instance = new AllTeamsDisableManagers();
    const result = instance.filterManagers(managers);

    expect(result.length).toBe(0);
  });
});
