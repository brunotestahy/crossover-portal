import { ChangeDetectorRef, Component, EventEmitter, HostBinding, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { debounceTime, filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { LayoutModes } from 'app/core/constants/layout-modes';
import * as TeamSelectorConstants from 'app/core/constants/team-selector';
import { Assignment } from 'app/core/models/assignment';
import { TeamType } from 'app/core/models/dashboard';
import { CurrentUserDetail } from 'app/core/models/identity';
import { Manager } from 'app/core/models/manager';
import { Team, TeamManagerGroup } from 'app/core/models/team';
import {
  AbstractTeamSelectorStrategy,
  DefaultTeamSelectorStrategy,
} from 'app/core/models/team-selector-strategy';
import { TeamDashboard } from 'app/core/models/time-tracking/team-dashboard.model';
import { IdentityService } from 'app/core/services/identity/identity.service';
import {
  TeamSelectorStrategyService,
} from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';
import { UserDashboardService } from 'app/shared/services/user-dashboard/user-dashboard.service';

@Component({
  selector: 'app-team-selector',
  templateUrl: './team-selector.component.html',
  styleUrls: ['./team-selector.component.scss'],
})
export class TeamSelectorComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();

  public readonly debounceTime = 500;

  @HostBinding('class')
  public classes = 'd-flex flex-column pl-3 ml-1';
  public defaultSelectedManagerObject = { id: TeamSelectorConstants.ALL_MANAGERS_ID, printableName: 'All Managers' };
  public numberOfMember = 3;
  public layoutModes = LayoutModes;
  public selectedLayout = this.layoutModes.TILE_LAYOUT;

  public teamDashboard: TeamDashboard;
  public strategy: AbstractTeamSelectorStrategy;

  public isEnabled = true;
  public isManagerSelectionEnabled = true;
  public myTeam = [] as Team[];
  public myTeamId: number;
  public selectedTeam = {} as Team;
  public selectedManager?: Manager;
  public currentUser: CurrentUserDetail;
  public managerId: number;
  public teamTypes = [] as TeamType[];
  public teamTypesFiltered = [] as TeamType[];

  public isLoading = true;
  public error: string | null = null;
  public searchKey: FormControl = new FormControl('');

  @Output()
  public enabledChange = new EventEmitter<boolean>();

  constructor(
    private dashboardService: UserDashboardService,
    private identityService: IdentityService,
    private teamSelectorStrategyService: TeamSelectorStrategyService,
    private changeDetector: ChangeDetectorRef
  ) {
  }

  public ngOnInit(): void {
    this.identityService.getCurrentUserDetail()
      .pipe(
        take(1),
        tap(userDetail => {
          this.currentUser = userDetail;
          this.myTeamId = this.currentUser.assignment.team.id;
          this.managerId = this.currentUser.managerAvatar.id;
        }),
        switchMap(
          () => this.dashboardService.getTeamDashboard(false, this.managerId).pipe(take(1)),
        ),

      )
      .subscribe(
        teamDashboard => {
          this.teamDashboard = teamDashboard;
          if (this.teamSelectorStrategyService.strategy.getValue() === null) {
            this.teamSelectorStrategyService.strategy.next(new DefaultTeamSelectorStrategy());
          }
          this.initializeTeamStrategyListeners();
        },
        error => this.error = _.get(error, 'error.text', 'Error fetching teams.')
      );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.teamSelectorStrategyService.strategy.next(null);
    this.identityService.clearTeamManagerGroupSelection();
  }

  public switchManager(manager?: Manager): void {
    this.selectedManager = manager || this.defaultSelectedManagerObject as Manager;
    this.updateSelectedTeamAndManager();
  }

  public searchTeam(): void {
    this.teamTypesFiltered[0].team = this.teamTypes[0].team
      .filter(team => (team.name as string).toLowerCase().indexOf(this.searchKey.value.toLowerCase()) >= 0).slice();
    this.teamTypesFiltered[1].team = this.teamTypes[1].team
      .filter(team => (team.name as string).toLowerCase().indexOf(this.searchKey.value.toLowerCase()) >= 0).slice();
    this.teamTypesFiltered[2].team = this.teamTypes[2].team
      .filter(team => (team.name as string).toLowerCase().indexOf(this.searchKey.value.toLowerCase()) >= 0).slice();
  }

  public switchTeam(teamId: number): void {
    const allTeams = this.teamTypes.reduce((carry, teamTypes) => carry.concat(teamTypes.team), [] as Team[]);
    const selectedTeam = allTeams.find(team => team.id === teamId) as Team;
    const selectedTeamReportingManager = _.defaultTo(selectedTeam.reportingManagers, [] as Manager[])
      .find(reportingManagers => reportingManagers.id === this.managerId);
    const managerDefinitionStrategies = [
      {
        condition: () => !selectedTeam.reportingManagers || selectedTeam.reportingManagers.length === 0,
        get: () => this.defaultSelectedManagerObject as Manager,
      },
      {
        condition: () => selectedTeamReportingManager !== undefined,
        get: () => selectedTeamReportingManager as Manager,
      },
      {
        condition: () => selectedTeam.reportingManagers && selectedTeam.reportingManagers.length === 1,
        get: () => selectedTeam.reportingManagers ? selectedTeam.reportingManagers[0] : {} as Manager,
      },
      {
        condition: () => selectedTeam.reportingManagers && selectedTeam.reportingManagers.length > 1,
        get: () => this.defaultSelectedManagerObject as Manager,
      },
    ];
    const manager = managerDefinitionStrategies.filter(entry => entry.condition())[0].get();
    this.selectedTeam = selectedTeam;
    this.selectedManager = manager;
    this.updateSelectedTeamAndManager();
  }

  public showBadge(team: Team, teamType: TeamType): boolean {
    const ALL_DIRECT_REPORT = 'All Direct Reports';
    const MY_TEAM = 'My Team';
    return this.selectedLayout === this.layoutModes.TILE_LAYOUT &&
      (team.members || []).length === 0 && team.name !== ALL_DIRECT_REPORT && teamType.name !== MY_TEAM;
  }

  public showUsersIcon(team: Team, teamType: TeamType): boolean {
    const ALL_DIRECT_REPORT = 'All Direct Reports';
    const MY_TEAM = 'My Team';
    return this.selectedLayout === this.layoutModes.TILE_LAYOUT &&
      (team.name === ALL_DIRECT_REPORT || (teamType.name === MY_TEAM && (team.members || []).length === 0));
  }

  public isTeamSelected(teamId: number): boolean {
    return this.selectedTeam &&
      teamId === this.selectedTeam.id &&
      this.selectedLayout === this.layoutModes.TILE_LAYOUT;
  }

  public getTeamMemberCount(team: Team): number {
    if (team.members) {
      return team.members.length;
    } else {
      return 0;
    }
  }

  private initializeTeamStrategyListeners():void {
    this.identityService.getTeamManagerGroupSelection()
    .pipe(
      takeUntil(this.destroy$),
      debounceTime(this.debounceTime),
      filter(team => !!team),
      map(team => team as TeamManagerGroup)
    )
    .subscribe(
      teamManagerGroup => {
        const team = _.defaultTo(teamManagerGroup.team, {} as Team);
        const reportingManagers = _.defaultTo(team.reportingManagers, [] as Manager[]);
        this.selectedTeam = team;
        this.selectedManager = reportingManagers.filter(entry => entry.id === teamManagerGroup.managerId)[0];
        const isDestroyed = _.get(this.changeDetector, 'destroyed', false);
        if (!isDestroyed) {
          this.changeDetector.detectChanges();
        }
      }
    );

    this.teamSelectorStrategyService.strategy
    .pipe (
      debounceTime(this.debounceTime),
      takeUntil(this.destroy$),
      filter(entry => !!entry),
      map(entry => entry as AbstractTeamSelectorStrategy),
    )
    .subscribe(strategy => {
        this.strategy = strategy;
        const isDestroyed = _.get(this.changeDetector, 'destroyed', false);
        if (!isDestroyed) {
          this.changeDetector.detectChanges();
        }
        this.appendNewTeam();
        this.digestTeamData();
        this.isLoading = false;
      }
    );

    this.teamSelectorStrategyService.currentUserAsTeamOwner
      .pipe(
        debounceTime(this.debounceTime),
        takeUntil(this.destroy$),
      )
      .subscribe(state => {
        if (state) {
          this.teamTypesFiltered = this.teamTypesFiltered.map(teamType => {
            return {
              name: teamType.name,
              team: teamType.name !== 'My Team' ?
                teamType.team.filter(team => !!team.teamOwner && team.teamOwner.id === this.currentUser.managerAvatar.id)
              : teamType.team,
            };
          });
        } else {
          this.teamTypesFiltered = this.teamTypes.map(teamType => {
            return {
              name: teamType.name,
              team: teamType.team,
            };
          });
        }
      });
  }

  private appendNewTeam(): void {
    const dashboard = _.cloneDeep(this.teamDashboard);
    const newTeam = [this.teamSelectorStrategyService.newTeam.getValue()];
    newTeam
      .filter(entry => !!entry)
      .map(entry => entry as Team)
      .forEach(
        team => dashboard.teams = dashboard
        .teams.filter(entry => entry.id !== team.id).concat(team)
      );
    this.teamDashboard = dashboard;
  }

  private getAllTeamList(teamDashboard: TeamDashboard): void {
    teamDashboard.teams.sort((previousTeam, currentTeam) => {
      const previousName = previousTeam.name as string;
      const currentName = currentTeam.name as string;
      return previousName.localeCompare(currentName);
    });

    teamDashboard.teams.map(team => {
      (team.reportingManagers || []).sort((previousManager, currentManger) => {
        const previousName = previousManager.printableName as string;
        const currentName = currentManger.printableName as string;
        return previousName.localeCompare(currentName);
      });
    });

    teamDashboard.assignments.sort((previousAssignment, currentAssignment) => {
      const previousName = previousAssignment.selection ?
        previousAssignment.selection.marketplaceMember.application.candidate.printableName as string : '';
      const currentName = currentAssignment.selection ?
        currentAssignment.selection.marketplaceMember.application.candidate.printableName as string : '';
      return previousName.localeCompare(currentName);
    });

    const myTeam = [{
      name: 'My Team',
      team: this.myTeam,
    }];
    const directTeam = [{
      name: 'Direct Report',
      team: this.getDirectReportedTeams(teamDashboard),
    }];
    const otherTeam = [{
      name: 'Other Team',
      team: this.getOtherTeams(teamDashboard),
    }];

    this.teamTypes = myTeam.concat(directTeam, otherTeam);
    this.setSelectedTeamAndManager();

    this.teamTypesFiltered = this.teamTypes.map(teamType => {
      return {
        name: teamType.name,
        team: teamType.team,
      };
    });

    this.isEnabled = this.strategy.navigationEnabled(this.currentUser);
    this.isManagerSelectionEnabled = this.strategy.managerSelectorEnabled(this.currentUser);
    this.updateSelectedTeamAndManager();

    const isDestroyed = _.get(this.changeDetector, 'destroyed', false);
    if (!isDestroyed) {
      this.changeDetector.detectChanges();
    }
    this.enabledChange.emit(this.isEnabled);
  }

  private digestTeamData(): void {
    if (this.teamDashboard) {
      const dashboard = _.cloneDeep(this.teamDashboard);
      this.myTeam = this.getMyTeams(dashboard, this.myTeamId);
      this.getAllTeamList(dashboard);
    }
  }

  private getMyTeams(teamDashboard: TeamDashboard, myTeamId: number): Team[] {
    const teams = _.cloneDeep(teamDashboard.teams) as Team[];
    let myTeam = teams.filter(team => team.id === myTeamId);
    if (myTeam.length) {
      myTeam
        .map(team => {
          const assignments = teamDashboard.assignments as Assignment[];
          const teamAssignments = assignments.filter(teamAssignment => teamAssignment.team.id === team.id);
          team.members = teamAssignments.map(teamAssignment => teamAssignment.selection.marketplaceMember.application.candidate);
          team.reportingManagers = [
            Object.assign(this.defaultSelectedManagerObject),
            this.currentUser.assignment.manager,
          ] as Manager[];
        });
    } else {
      myTeam = [this.currentUser.assignment.team]
        .map((item) => {
          item.reportingManagers = [
            Object.assign(this.defaultSelectedManagerObject),
            this.currentUser.assignment.manager,
          ] as Manager[];
          return item;
        });
    }

    myTeam.forEach(team => team.reportingManagers = this.strategy.filterManagers(
      team.reportingManagers || [],
      this.currentUser
    ));
    return this.strategy.filterTeams(myTeam, this.currentUser);
  }

  private getDirectReportedTeams(teamDashboard: TeamDashboard): Team[] {
    const teams = _.cloneDeep(teamDashboard.teams) as Team[];
    const directReportedTeams = teams
      .filter(team => _.defaultTo(team.reportingManagers, [] as Manager[])
        .some(manager => manager.id === this.managerId));
    directReportedTeams
      .map(team => {
        const assignments = teamDashboard.assignments as Assignment[];
        const teamAssignments = assignments.filter(teamAssignment => teamAssignment.team.id === team.id);
        team.members = teamAssignments.map(teamAssignment => teamAssignment.selection.marketplaceMember.application.candidate);
        team.reportingManagers = [Object.assign(this.defaultSelectedManagerObject)].concat(
            (team.reportingManagers || [])
            .map(manager => {
              manager.photoUrl = this.getManagerPhotoUrl(assignments, manager.userId);
              return manager;
            })
          );
      });
    if (directReportedTeams.length !== 1) {
      directReportedTeams.unshift(
        {
          name: 'All Direct Reports',
          reportingManagers: [
            Object.assign(this.defaultSelectedManagerObject),
            {
              id: this.managerId,
              printableName: this.currentUser.fullName,
              photoUrl: this.currentUser.photoUrl,
            },
          ],
        } as Team);
    }

    const filteredDirectReportedTeams = this.strategy.filterTeams(directReportedTeams, this.currentUser);
    filteredDirectReportedTeams
      .forEach(team => team.reportingManagers = this.strategy.filterManagers(
        team.reportingManagers || [],
        this.currentUser
      ));

    return filteredDirectReportedTeams;
  }

  private getOtherTeams(teamDashboard: TeamDashboard): Team[] {
    const teams = _.cloneDeep(teamDashboard.teams) as Team[];
    const otherTeams = teams
      .filter(team => !_.defaultTo(team.reportingManagers, [] as Manager[])
        .some(manager => manager.id === this.managerId));
    otherTeams
      .map(team => {
        const assignments = teamDashboard.assignments as Assignment[];
        const teamAssignments = assignments.filter(teamAssignment => teamAssignment.team.id === team.id);
        team.members = teamAssignments.map(teamAssignment => teamAssignment.selection.marketplaceMember.application.candidate);
        team.reportingManagers = [Object.assign(this.defaultSelectedManagerObject)].concat(
            (_.defaultTo(team.reportingManagers, [] as Manager[]))
            .map(manager => {
              manager.photoUrl = this.getManagerPhotoUrl(assignments, manager.userId);
              return manager;
            })
          );
      });

    otherTeams.forEach(team => team.reportingManagers = this.strategy.filterManagers(
      team.reportingManagers || [],
      this.currentUser
    ));
    return this.strategy.filterTeams(otherTeams, this.currentUser);
  }

  private setSelectedTeamAndManager(): void {
    const skipMyTeam = 1;
    const allAvailableTeams = this.teamTypes.slice(skipMyTeam)
      .reduce((carry, item) => carry.concat(item.team), [] as Team[]);
    const newTeam = this.teamSelectorStrategyService.newTeam.getValue();
    this.teamSelectorStrategyService.newTeam.next(null);
    const selectedTeam = _.defaultTo(
      allAvailableTeams.find(entry => entry.id === _.get(this.selectedTeam, 'id', 0)),
      allAvailableTeams[0]
    );

    this.selectedTeam = _.defaultTo(newTeam, selectedTeam);
    this.selectedManager = _.defaultTo(
        _.defaultTo(this.selectedTeam, {} as Team).reportingManagers,
        [] as Manager[]
      )
      .filter(manager => manager.id === this.managerId)[0];
  }

  private updateSelectedTeamAndManager(): void {
    const selectedTeamManagerGroup = {
      managerId: _.get(this.selectedManager, 'id', null) as number,
      team: this.selectedTeam,
      teams: this.teamTypes.reduce((carry, teamTypes) => carry.concat(teamTypes.team), [] as Team[]),
    };
    this.identityService.updateTeamManagerGroupSelection(selectedTeamManagerGroup);
  }

  private getManagerPhotoUrl(assignments: Assignment[], managerId: number): string | undefined {
    const teamAssignments = assignments.filter(assignment => assignment.selection.marketplaceMember.application.candidate.id === managerId);
    return _.get(teamAssignments, `0.selection.marketplaceMember.application.candidate.photoUrl`, undefined);
  }
}
