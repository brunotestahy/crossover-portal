import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DfModalService, DfModalSize } from '@devfactory/ngx-df';

import { OnlineStatus } from 'app/core/constants/timetracking/online-status';
import { Assignment } from 'app/core/models/assignment';
import { CurrentUserDetail } from 'app/core/models/identity';
import { WorkDiary } from 'app/core/models/logbook';
import { Manager } from 'app/core/models/manager';
import { OnlineStatusService } from 'app/core/services/timetracking/online-status.service';

@Component({
  selector: 'app-contractors-desks',
  templateUrl: './contractors-desks.component.html',
  styleUrls: ['./contractors-desks.component.scss'],
})
export class ContractorsDesksComponent {
  public readonly SUMMARY = 'Summary';

  @Input()
  public workDiaries: WorkDiary[] = [];

  @Input()
  public contractors: Assignment[] = [];

  @Input()
  public managerMode: boolean;

  @Input()
  public currentUser: CurrentUserDetail;

  public currentUserAssignmentId: number;
  public currentUserManager: Manager;
  public currentUserTeamId: number;
  public currentContractor: CurrentUserDetail;

  public currentAssignment: Assignment;

  @ViewChild('contractorActivityModal')
  public contractorActivityModal: TemplateRef<{}>;

  @ViewChild('profileModal')
  public profileModal: TemplateRef<{}>;

  constructor(
    private onlineStatusService: OnlineStatusService,
    private modalService: DfModalService,
    private router: Router,
  ) {
  }

  public getDesk(assignment: Assignment): string {
    const onlineClass = this.getOnlineStatusClass(assignment);
    switch (onlineClass) {
      case OnlineStatus[0].cssClass:
        return 'contractor-1';

      case OnlineStatus[1].cssClass:
        return 'empty';

      case OnlineStatus[2].cssClass:
        return 'empty';

      default:
        return 'empty';
    }
  }

  public getOnlineStatusClass(assignment: Assignment): string {
    const workDiary = this.onlineStatusService.getWorkDiary(assignment, this.workDiaries);
    return workDiary ? this.onlineStatusService.getWorkDiaryOnlineStatusClass(workDiary) : '';
  }

  public showContractorTooltip(assignment: Assignment): boolean {
    if (!this.managerMode) {
      return !!this.currentUser && assignment.candidate.userId === this.currentUser.id;
    }
    return true;
  }

  public navigateToContractor(assignment: Assignment): void {
    if (!!this.currentUser && assignment.candidate.userId === this.currentUser.id) {
      this.router.navigate(['/contractor/my-dashboard/summary']);
    } else {
      if (this.showContractorTooltip(assignment)) {
        this.currentUserManager = assignment.manager;
        this.currentUserAssignmentId = assignment.id;
        this.currentUserTeamId = assignment.team.id;
        this.currentContractor = assignment.candidate as CurrentUserDetail;
        this.modalService.open(this.profileModal, { customClass: 'full-screen' });
      }
    }
  }

  public navigateToLogbook(assignment: Assignment): void {
    if (!!this.currentUser && assignment.candidate.userId === this.currentUser.id) {
      this.router.navigate(['/contractor/my-dashboard/logbook']);
    } else {
      if (this.showContractorTooltip(assignment)) {
        this.currentAssignment = assignment;
        this.modalService.open(this.contractorActivityModal, {
          size: DfModalSize.Large,
        });
      }
    }
  }

  public getDeskOrientation(index: number): string {
    return index % 2 === 0 ? 'right' : 'left';
  }
}
