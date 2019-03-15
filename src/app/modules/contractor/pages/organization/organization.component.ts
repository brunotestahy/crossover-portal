import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit, TemplateRef, ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { DfAlertService, DfAlertType, DfGroupToggleItem, DfModalRef, DfModalService } from '@devfactory/ngx-df';
import { format } from 'date-fns';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { combineLatest, filter, finalize, mergeMap, take, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { AppTypes } from 'app/core/constants/app/app-types';
import * as AvatarTypes from 'app/core/constants/avatar-types';
import { TeamSelectorStrategy } from 'app/core/decorators/team-selector-strategy';
import { Assignment } from 'app/core/models/assignment';
import { Candidate } from 'app/core/models/candidate';
import { Company } from 'app/core/models/company';
import { CurrentUserDetail } from 'app/core/models/identity';
import { Manager } from 'app/core/models/manager';
import { Team, TeamManagerGroup, TeamStoreRequest } from 'app/core/models/team';
import { DisabledSelectorForOrganizationApp } from 'app/core/models/team-selector-strategy';
import { AppsService } from 'app/core/services/apps/apps.service';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { TeamService } from 'app/core/services/team/team.service';
import { NewTeamModalComponent } from 'app/modules/contractor/components/organization/new-team-modal/new-team-modal.component';
import {
  TeamSelectorStrategyService,
} from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
@TeamSelectorStrategy(DisabledSelectorForOrganizationApp)
export class OrganizationComponent implements OnDestroy, OnInit {
  private destroy$ = new Subject();

  public readonly avatarTypes = AvatarTypes;
  public readonly SUMMARY = 'Summary';
  public readonly minimumHeightForDropAreaChange = 780;
  public currentUserAvatarType: string = AvatarTypes.Manager;
  public currentUser: CurrentUserDetail;

  public currentManagerId: number;

  public otherTeams: Team[] = [];
  public myTeams: Team[] = [];
  public selectedTeam: Team;

  public teamAssignments: Assignment[] = [];

  public managers: { [key: string]: Manager } = {};
  public isEditing: {
    [rowId: number]: { [columnField: number]: boolean };
  } = {};
  public managersIds: number[] = [];
  public managersLastCompany: Company;
  public teamDetailTabs: DfGroupToggleItem[] = [
    {
      text: 'Members',
      id: '0',
    },
    {
      text: 'Productivity',
      id: '1',
    },
    {
      text: 'Settings',
      id: '2',
    },
  ];
  public selectedTeamDetailTab: string = '0';

  public isTeamLoading: boolean = true;
  public isTeamsLoading: boolean = true;
  public isManagersLoading: boolean = true;
  public isDropAreaOutOfView: boolean = false;
  public isOtherTeamSelected: boolean = false;
  public isOwnerEditing: boolean = false;
  public isTeamNameEditing: boolean = false;

  public currentUserAssignmentId: number;
  public currentUserManager: Manager;
  public currentUserTeamId: number;
  public currentContractor: CurrentUserDetail;
  @ViewChild('profileModal')
  public profileModal: TemplateRef<{}>;

  @ViewChild('managerChangeConfirmationTemplate')
  public managerChangeConfirmationTemplate: TemplateRef<{}>;
  public managerChangeConfirmationData: { candidateName: string; teamName: string; managerName: string; };

  public error = '';

  constructor(
    protected elRef: ElementRef,
    private changeDetector: ChangeDetectorRef,
    private identityService: IdentityService,
    private appsService: AppsService,
    private assignmentService: AssignmentService,
    private teamService: TeamService,
    private router: Router,
    public teamSelectorStrategyService: TeamSelectorStrategyService,
    private modalService: DfModalService,
    protected alertService: DfAlertService
  ) {
  }

  public ngOnInit(): void {
    this.getTeams();
    this.getManagers();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public isRole(user: CurrentUserDetail | Candidate, role: string): boolean {
    return user ? (user.avatarTypes as string[]).some(avatar => avatar === role) : false;
  }

  public openNewTeamModal(): void {
    const newTeamModal = this.modalService.open(
      NewTeamModalComponent,
      { customClass: 'new-team-modal' },
    );
    const newTeamModalData = newTeamModal.instance.data as EventEmitter<TeamStoreRequest>;

    this.error = '';
    this.identityService
      .getCurrentUserAs(AvatarTypes.Manager)
      .pipe(
        take(1),
        finalize(() => newTeamModal.instance.isLoading = false),
      )
      .subscribe(
        value => newTeamModal.instance.userDetail = value,
        error => this.error = _.get(error, 'error.text', 'An unknown error happened while retrieving manager data.'),
      );

    newTeamModalData
      .pipe(
        filter(data => !!data),
        takeUntil(this.destroy$),
        tap(() => {
          newTeamModal.instance.error = '';
          newTeamModal.instance.isLoading = true;
        }),
      )
      .subscribe(data => this.storeNewTeam(data, newTeamModal));
  }

  public storeNewTeam(data: TeamStoreRequest, modal: DfModalRef): void {
    this.teamService
      .store(data, AvatarTypes.Manager)
      .pipe(
        combineLatest(
          this.appsService.storeStatisticsFormManagers(AppTypes.Hire),
        ),
        take(1),
      )
      .subscribe(
        ([team]) => {
          const hireAppUrl = `/contractor/team-hire`;
          this.teamSelectorStrategyService.newTeam.next(team);
          modal.instance.close();
          this.router.navigate([hireAppUrl]);
        },
        error => {
          modal.instance.error = _.get(error, 'error.text', 'An unknown error occurred during team storage.');
          modal.instance.isLoading = false;
        },
      );
  }

  public teamDetailTabChange(tabId: number): void {
    const productivityIndex = '1';
    this.selectedTeamDetailTab = tabId.toString();
    if (this.selectedTeamDetailTab === productivityIndex) {
      this.router.navigate(['/contractor/team-summary']);
    }
  }

  public navigateToContractor(assignment: Assignment): void {
    this.currentUserManager = assignment.manager;
    this.currentUserAssignmentId = assignment.id;
    this.currentUserTeamId = assignment.team.id;
    this.currentContractor = assignment.candidate as CurrentUserDetail;
    this.modalService.open(this.profileModal, { customClass: 'full-screen' });
  }

  public moveContractorToTeam(
    event: { dragData: { assignment: Assignment; oldTeam: Team }; mouseEvent: MouseEvent },
    newTeam?: Team,
  ): void {
    if (!newTeam) {
      // Team not found > create TODO: update this once the New Team by dragging will be implemented
    } else if (event.dragData.oldTeam.id !== newTeam.id) {
      // Team found > move
      this.managerChangeConfirmationData = {
        candidateName: event.dragData.assignment.candidate.printableName as string,
        managerName: this.currentUser.fullName,
        teamName: newTeam.name as string,
      };
      this.alertService.createDialog({
        title: 'Confirmation',
        template: this.managerChangeConfirmationTemplate,
        type: DfAlertType.Confirm,
      })
        .pipe(filter(data => data[0] === 'ok'))
        .subscribe(() => {
          this.assignmentService.updateTeamManager(
            event.dragData.assignment.id.toString(),
            this.currentManagerId.toString(),
            newTeam.id.toString(),
          ).pipe(take(1))
            .subscribe(() => {
              (newTeam.activeAssignments as Assignment[]).push(event.dragData.assignment);
              newTeam.activeAssignments = _.orderBy(newTeam.activeAssignments, ['candidate.printableName'], ['asc']);
              event.dragData.oldTeam.activeAssignments = (event.dragData.oldTeam.activeAssignments as Assignment[])
                .filter(activeAssignment => activeAssignment.id !== event.dragData.assignment.id);
              this.selectTeam(newTeam, { shouldCache: false });
            });
        });
    }
  }

  public getTeams(): void {
    this.error = '';
    this.isTeamsLoading = true;
    let teamManagerSelection: TeamManagerGroup;

    this.identityService.getTeamManagerGroupSelection()
      .pipe(
        takeUntil(this.destroy$),
        filter(teamManagerGroup => !!teamManagerGroup),
        combineLatest(
          this.identityService.getCurrentUserDetail(),
        ),
        take(1),
        mergeMap(([teamManagerSelectionData, userDetail]) => {
          this.currentUser = userDetail;
          teamManagerSelection = teamManagerSelectionData as TeamManagerGroup;
          if (this.identityService.hasAvatarType(this.currentUser, AvatarTypes.Admin)) {
            this.currentUserAvatarType = AvatarTypes.Admin;
          }

          return forkJoin(
            this.assignmentService.getDashboard(userDetail.managerAvatar.id, '', false),
            this.assignmentService.getUserTeams(),
          );
        }),
        tap(() => {
          this.myTeams = [];
          this.otherTeams = [];
        }),
        finalize(() => {
          this.isTeamsLoading = false;
          this.isTeamLoading = false;
        }))
      .subscribe(([dashboard, updatedTeams]) => {
          dashboard.teams.forEach(team => {
            if (
              team.reportingManagers &&
              team.reportingManagers.some(manager => manager.id === teamManagerSelection.managerId)
            ) {
              team.name = updatedTeams.filter(updatedTeam => updatedTeam.id === team.id)[0].name;
              this.myTeams.push(team);
            } else {
              team.name = updatedTeams.filter(updatedTeam => updatedTeam.id === team.id)[0].name;
              this.otherTeams.push(team);
            }
          });

          this.myTeams = _.orderBy(this.myTeams, ['name'], ['asc']);
          this.otherTeams = _.orderBy(this.otherTeams, ['name'], ['asc']);

          if (teamManagerSelection) {
            this.currentManagerId = teamManagerSelection.managerId;
            if (this.myTeams.length) {
              this.selectTeam(
                this.myTeams.find(team => team.id === teamManagerSelection.team.id) || this.myTeams[0],
              );
            }
          }
        },
        error => this.error = _.get(error, 'error.text', 'Error trying to load the teams.'));
  }

  public getManagers(): void {
    this.isManagersLoading = true;
    this.assignmentService.getManagers()
      .pipe(
        take(1),
        tap(() => this.error = ''),
      )
      .subscribe(data => {
          data.forEach(value => (this.managers[value.id] = value));
          this.managersIds = Object.keys(this.managers).map(value => Number(value));
          this.managersIds.sort((a, b) => {
            const aCompanyName: string = (this.managers[a].company || { name: '' }).name || '';
            const bCompanyName: string = (this.managers[b].company || { name: '' }).name || '';
            const aName: string = this.managers[a].printableName || '';
            const bName: string = this.managers[b].printableName || '';

            /**
             * aCompanyName.localeCompare(bCompanyName) = 0 ? then use manager name
             * So it would group managers of the same company together
             */
            return aCompanyName.localeCompare(bCompanyName) === 0 ?
              aName.localeCompare(bName) : aCompanyName.localeCompare(bCompanyName);
          });
          this.isManagersLoading = false;
        },
        error => this.error = _.get(error, 'error.text', 'Error trying to load the managers.'));
  }

  public isNewManagersCompany(company: Company): boolean {
    if (this.managersLastCompany && this.managersLastCompany.id === company.id) {
      return false;
    }
    this.managersLastCompany = company;
    return true;
  }

  public roleSelected(assignment: Assignment, type: string): void {
    let avatars: string[] = assignment.candidate.avatarTypes as string[];

    avatars = avatars.filter(avatar => avatar !== this.avatarTypes.CompanyAdmin && avatar !== this.avatarTypes.Manager);

    if (type === 'Manager') {
      avatars.push(this.avatarTypes.Manager);
    } else if (type === 'Admin') {
      avatars.push(this.avatarTypes.Manager);
      avatars.push(this.avatarTypes.CompanyAdmin);
    }

    this.identityService.updateUserAvatars(assignment.candidate.userId as number, avatars)
      .pipe(
        take(1),
        tap(() => this.error = ''),
      )
      .subscribe(
        () => assignment.type = type,
        error => this.error = _.get(error, 'error.text', 'Error trying to update the user avatars.'),
      );
  }

  public updateActiveAssignment(assignment: Assignment): void {
    this.assignmentService.updateAssignment(assignment)
      .pipe(
        take(1),
        tap(() => this.error = ''),
      )
      .subscribe(() => {
          const oldMyTeam: Team = this.myTeams.filter(team => team.id === this.selectedTeam.id)[0];
          if (oldMyTeam.activeAssignments) {
            const oldAssignment: Assignment =
              oldMyTeam.activeAssignments.filter(activeAssign => activeAssign.id === assignment.id)[0];
            oldAssignment.jobTitle = assignment.jobTitle;
          }
        },
        error => this.error = _.get(error, 'error.text', 'Error trying to update the assignment.'),
      );
  }

  public onTeamNameChange(teamName: string): void {
    if (teamName !== this.selectedTeam.name) {
      const newTeam: Team = _.cloneDeep(this.selectedTeam);
      newTeam.name = teamName;
      this.assignmentService.updateTeam(newTeam)
        .pipe(
          take(1),
          tap(() => this.error = ''),
        )
        .subscribe(updatedTeam => {
            this.selectedTeam = updatedTeam;
            if (!this.isOtherTeamSelected) {
              this.myTeams.filter(team => team.id === this.selectedTeam.id)[0].name = this.selectedTeam.name as string;
            } else {
              this.otherTeams.filter(team => team.id === this.selectedTeam.id)[0].name = this.selectedTeam.name as string;
            }
          },
          error => this.error = _.get(error, 'error.text', 'Error trying to update the Team name.'),
        );
    }
  }

  public onTeamOwnerChange(selectedTeamOwnerId: number): void {
    const newTeamOwner: Manager = this.managers[selectedTeamOwnerId.toString()];
    this.assignmentService.getTeam(this.selectedTeam.id.toString())
      .pipe(
        take(1),
        tap(() => this.error = ''),
      )
      .subscribe(fetchedTeam => {
          if (!fetchedTeam.teamOwner || (selectedTeamOwnerId !== fetchedTeam.teamOwner.id)) {
            fetchedTeam.teamOwner = newTeamOwner;
            this.selectedTeam.teamOwner = newTeamOwner;
            this.assignmentService.updateTeam(fetchedTeam).subscribe(() => {
            });
          }
        },
        error => this.error = _.get(error, 'error.text', 'Error trying to update the Team owner.'),
      );
  }

  public onManagerChange(index: number, newManager: Manager): void {
    this.managerChangeConfirmationData = {
      candidateName: this.teamAssignments[index].candidate.printableName as string,
      managerName: newManager.printableName as string,
      teamName: this.teamAssignments[index].team.name as string,
    };
    this.alertService.createDialog({
      title: 'Confirmation',
      template: this.managerChangeConfirmationTemplate,
      type: DfAlertType.Confirm,
    })
      .pipe(filter(data => data[0] === 'ok'))
      .subscribe(() => {
        this.teamAssignments[index].manager = newManager;
        this.assignmentService.updateTeamManager(
          this.teamAssignments[index].id.toString(),
          this.teamAssignments[index].manager.id.toString(),
          this.teamAssignments[index].team.id.toString(),
        ).pipe(
          take(1),
          tap(() => this.error = ''),
        )
          .subscribe(() => {
              const oldMyTeam: Team = this.myTeams.filter(team => team.id === this.selectedTeam.id)[0];
              const oldAssignment: Assignment = (oldMyTeam.activeAssignments as Assignment[]).filter(activeAssign => activeAssign.id === this.teamAssignments[index].id)[0];
              oldMyTeam.activeAssignments = (oldMyTeam.activeAssignments as Assignment[]).filter(activeAssign => activeAssign.id !== oldAssignment.id);
              this.selectTeam(oldMyTeam, { shouldCache: false });
            },
            error => this.error = _.get(error, 'error.text', 'Error trying to update the manager.'),
          );
      });
  }

  public selectTeam(
    team: Team,
    options: { otherTeamType?: boolean; shouldCache?: boolean; } = { shouldCache: true },
  ): void {
    this.teamDetailTabs[2].disabled = team.teamOwner && team.teamOwner.id !== this.currentManagerId &&
      !this.isRole(this.currentUser, this.avatarTypes.CompanyAdmin);

    if (this.teamDetailTabs[2].disabled) {
      this.selectedTeamDetailTab = '0';
      const isDestroyed = _.get(this.changeDetector, 'destroyed', false);
      if (!isDestroyed) {
        this.changeDetector.detectChanges();
      }
    }

    this.isTeamLoading = true;
    if (team.teamOwner) {
      forkJoin(
        this.assignmentService.getTeamAssignments(
          undefined,
          team.id.toString(),
          format(new Date(), 'YYYY-MM-DD'),
          format(new Date(), 'YYYY-MM-DD'),
          options.shouldCache as boolean),
        this.assignmentService.getTeam(team.id.toString()),
      ).pipe(
        take(1),
        tap(() => this.error = ''),
      )
        .subscribe(([assignmentsData, fetchedTeam]) => {
            this.selectedTeam = fetchedTeam;
            this.isOtherTeamSelected = !!options.otherTeamType;
            if (!options.otherTeamType) {
              assignmentsData = assignmentsData.filter(assignment => assignment.manager.id === this.currentManagerId);
            }
            this.teamAssignments =
              this.areDifferentAssignments(this.selectedTeam.activeAssignments as Assignment[], assignmentsData) ?
                this.selectedTeam.activeAssignments as Assignment[] :
                assignmentsData;

            this.teamAssignments.forEach(assignment => assignment.type = this.setUserType(assignment));
            this.isTeamLoading = false;
          },
          error => this.error = _.get(error, 'error.text', 'Error trying to load the team.'),
        );
    }
  }

  public setUserType(assignment: Assignment): string {
    const ADMIN = 'Admin';
    const CONTRACTOR = 'Contractor';
    const MANAGER = 'Manager';
    return this.isRole(assignment.candidate, this.avatarTypes.CompanyAdmin) ?
      ADMIN :
      this.isRole(assignment.candidate, this.avatarTypes.Manager) ? MANAGER : CONTRACTOR;
  }

  public areDifferentAssignments(oldAssignments: Assignment[], newAssignments: Assignment[]): boolean {
    if (!this.selectedTeam.activeAssignments) {
      return false;
    }

    // Eliminate the steps below if the arrays have different lengths
    if (oldAssignments.length !== newAssignments.length) {
      return true;
    }

    const oldAssIds: number[] = oldAssignments.map(assignment => assignment.id);
    const newAssIds: number[] = newAssignments.map(assignment => assignment.id);

    for (const id of oldAssIds) {
      if (!newAssIds.some(newId => newId === id)) {
        return true;
      }
    }
    return false;
  }

  public getTeam(team: Team, otherTeamType: boolean = false): void {
    if (!team.activeAssignments) {
      this.assignmentService.getTeamAssignments(
        undefined,
        team.id.toString(),
        format(new Date(), 'YYYY-MM-DD'),
        format(new Date(), 'YYYY-MM-DD'),
        false)
        .pipe(
          take(1),
          tap(() => this.error = ''),
        )
        .subscribe((assignmentsData: Assignment[]) => {
            if (!otherTeamType) {
              assignmentsData = assignmentsData.filter(assignment => assignment.manager.id === this.currentManagerId);
            }
            team.activeAssignments = assignmentsData;
            this.isTeamLoading = false;
          },
          error => this.error = _.get(error, 'error.text', 'Error trying to load the team assignments.'),
        );
    }
  }
}
