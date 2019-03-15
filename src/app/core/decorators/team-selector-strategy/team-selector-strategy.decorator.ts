import {
  TeamSelectorStrategyService,
} from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';

import {
  AbstractTeamSelectorStrategy,
  DefaultTeamSelectorStrategy,
} from 'app/core/models/team-selector-strategy';

export function TeamSelectorStrategy(
  mode: { new(): AbstractTeamSelectorStrategy } = DefaultTeamSelectorStrategy
): Function {
  return function(
    constructor: { new(...args: {}[]): {} }
  ): void {
    const originalOnInit = constructor.prototype.ngOnInit || function(): void { };
    const originalOnDestroy = constructor.prototype.ngOnDestroy || function(): void { };
    const overwrittenOnInit = function(this: {
      teamSelectorStrategyService: TeamSelectorStrategyService
    }): void {
      if (typeof(this.teamSelectorStrategyService) === 'undefined') {
        throw new Error('Your target component must contain a teamSelectorStrategyService property on it.');
      }
      this.teamSelectorStrategyService.strategy.next(new mode());
      originalOnInit.apply(this);
    };
    const overwrittenOnDestroy = function(this: {
      teamSelectorStrategyService: TeamSelectorStrategyService
    }): void {
      originalOnDestroy.apply(this);
      if (typeof(this.teamSelectorStrategyService) === 'undefined') {
        throw new Error('Your target component must contain a teamSelectorStrategyService property on it.');
      }
      this.teamSelectorStrategyService.strategy.next(new DefaultTeamSelectorStrategy());
    };
    constructor.prototype.ngOnInit = overwrittenOnInit;
    constructor.prototype.ngOnDestroy = overwrittenOnDestroy;
  };
}
