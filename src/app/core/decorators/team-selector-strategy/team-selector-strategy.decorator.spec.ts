import { TeamSelectorStrategy } from 'app/core/decorators/team-selector-strategy';
import { DefaultTeamSelectorStrategy } from 'app/core/models/team-selector-strategy';

describe('TeamSelectorStrategyDecorator', () => {
  it('should retrieve a handler function successfully when a strategy is not provided', () => {
    const result = TeamSelectorStrategy();
    expect(typeof(result)).toBe('function');
  });

  it('should retrieve a handler function successfully when a strategy is provided', () => {
    const result = TeamSelectorStrategy(DefaultTeamSelectorStrategy);
    expect(typeof(result)).toBe('function');
  });

  it('should throw an initialization error when a teamSelectorStrategyService property does not exist on the target', () => {
    const classType = Object.assign(function(): void {});
    const result = TeamSelectorStrategy();
    result(classType);
    const instance = new classType();
    expect(() => instance.ngOnInit())
      .toThrow(new Error('Your target component must contain a teamSelectorStrategyService property on it.'));
  });

  it('should throw an termination error when a teamSelectorStrategyService property does not exist on the target', () => {
    const classType = Object.assign(function(): void {});
    const result = TeamSelectorStrategy();
    result(classType);
    const instance = new classType();
    expect(() => instance.ngOnDestroy())
      .toThrow(new Error('Your target component must contain a teamSelectorStrategyService property on it.'));
  });

  it('should initialize the target component successfully', () => {
    const service = { strategy: {next: jasmine.createSpy('next') } };
    const classType = Object.assign(function(this: { teamSelectorStrategyService: typeof service }): void {
      this.teamSelectorStrategyService = service;
    });
    const result = TeamSelectorStrategy();
    result(classType);
    const instance = new classType();
    instance.ngOnInit();
    expect(service.strategy.next).toHaveBeenCalledWith(jasmine.any(DefaultTeamSelectorStrategy));
  });

  it('should destroy the target component successfully', () => {
    const service = { strategy: {next: jasmine.createSpy('next') } };
    const classType = Object.assign(function(this: { teamSelectorStrategyService: typeof service }): void {
      this.teamSelectorStrategyService = service;
    });
    const result = TeamSelectorStrategy();
    result(classType);
    const instance = new classType();
    instance.ngOnDestroy();
    expect(service.strategy.next).toHaveBeenCalledWith(jasmine.any(DefaultTeamSelectorStrategy));
  });
});
