import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { DfModalService, DfModalSize } from '@devfactory/ngx-df';
import { Subject } from 'rxjs/Subject';

import { TeamSelectorStrategy } from 'app/core/decorators/team-selector-strategy';
import { Assignment } from 'app/core/models/assignment';
import { OnlyTeamsMatchingCompanyWithoutAllManagers } from 'app/core/models/team-selector-strategy';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { HireAddRoleModalComponent } from 'app/modules/contractor/components/hire-add-role-modal/hire-add-role-modal.component';
import { DataFetchingService } from 'app/modules/contractor/pages/hire/services/data-fetching.service';
import {
  TeamSelectorStrategyService,
} from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';

@Component({
  selector: 'app-hire',
  templateUrl: './hire.component.html',
  styleUrls: ['./hire.component.scss'],
})
@TeamSelectorStrategy(OnlyTeamsMatchingCompanyWithoutAllManagers)
export class HireComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  public readonly classes: string = 'app-hire d-flex flex-grow flex-column h-100';
  public readonly instance = this;
  public readonly destroy$ = new Subject();

  public assignments = [] as Assignment[];
  public isLoading = true;
  public error: string | null = null;

  constructor (
    public assignmentService: AssignmentService,
    public identityService: IdentityService,
    public teamSelectorStrategyService: TeamSelectorStrategyService,
    public dataFetchingService: DataFetchingService,
    public modalService: DfModalService,
  ) {
  }

  public ngOnInit(): void {
    this.dataFetchingService.load(this.instance);
  }

  public openAddRoleModal(): void {
    this.modalService.open(HireAddRoleModalComponent, {
      size: DfModalSize.Large,
      data: { currentTeam: this.dataFetchingService.currentTeam },
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.identityService.clearTeamManagerGroupSelection();
  }
}
