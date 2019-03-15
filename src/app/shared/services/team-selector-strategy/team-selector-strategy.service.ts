import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Team } from 'app/core/models/team';
import {
  AbstractTeamSelectorStrategy,
} from 'app/core/models/team-selector-strategy';

@Injectable()
export class TeamSelectorStrategyService {
  public strategy = new BehaviorSubject<AbstractTeamSelectorStrategy | null>(null);
  public newTeam = new BehaviorSubject<Team | null>(null);
  public menuState = new BehaviorSubject<boolean>(false);
  public currentUserAsTeamOwner = new BehaviorSubject<boolean>(false);
  public isTeamSelectorVisible = new BehaviorSubject<boolean>(false);
}
