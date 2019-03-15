import { async, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TeamSelectorStrategyService } from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';

describe('TeamSelectorStrategyService', () => {
  let service: TeamSelectorStrategyService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        providers: [
          TeamSelectorStrategyService,
        ],
      })
      .compileComponents()
      .then(() => service = TestBed.get(TeamSelectorStrategyService));
    })
  );

  it('should create an instance successfully', () => {
    expect(service).toBeTruthy();
    expect(service.strategy).toEqual(jasmine.any(BehaviorSubject));
  });
});
