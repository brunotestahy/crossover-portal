import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DfAlertService, DfModalService } from '@devfactory/ngx-df';
import * as _ from 'lodash';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { take } from 'rxjs/operators';
import { mock } from 'ts-mockito';

import { Assignment } from 'app/core/models/assignment';
import { CurrentUserDetail } from 'app/core/models/identity';
import { Manager } from 'app/core/models/manager';
import { Team, TeamManagerGroup } from 'app/core/models/team';
import { AppsService } from 'app/core/services/apps/apps.service';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { CURRENT_USER_DETAIL_MOCK } from 'app/core/services/mocks/current-user-detail.mock';
import { TEAM_DASBOARD_MOCK } from 'app/core/services/mocks/dashboard.mock';
import { ASSIGNMENT_MOCK } from 'app/core/services/mocks/productivity.mock';
import { TeamService } from 'app/core/services/team/team.service';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { OrganizationComponent } from 'app/modules/contractor/pages/organization/organization.component';
import {
TeamSelectorStrategyService,
} from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';

describe('OrganizationComponent', () => {
  let component: OrganizationComponent;
  let fixture: ComponentFixture<typeof component>;
  let assignmentService: AssignmentService;
  let alertService: DfAlertService;
  let appsService: AppsService;
  let identityService: IdentityService;
  let modalService: DfModalService;
  let router: Router;
  let teamService: TeamService;
  let teamSelectorStrategyService: TeamSelectorStrategyService;

  let assignments: Assignment[];
  let teamDashboard: TeamManagerGroup;
  let userDetail: CurrentUserDetail;
  let spyTeamManagerGroupSelection: jasmine.Spy;
  let spyCurrentUserDetail: jasmine.Spy;
  let spyDashboard: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrganizationComponent,
      ],
      providers: [
        { provide: AppsService, useFactory: () => mock(AppsService) },
        { provide: AssignmentService, useFactory: () => mock(AssignmentService) },
        { provide: DfAlertService, useFactory: () => mock(DfAlertService) },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        { provide: ElementRef, useFactory: () => mock(ElementRef) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: Router, useFactory: () => mock(Router) },
        { provide: TeamService, useFactory: () => mock(TeamService) },
        { provide: TeamSelectorStrategyService, useFactory: () => mock(TeamSelectorStrategyService) },
        {
          provide: WINDOW_TOKEN, useValue: {
            setTimeout: (input: Function) => input(),
          },
        },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationComponent);
    component = fixture.componentInstance;
    assignmentService = TestBed.get(AssignmentService);
    alertService = TestBed.get(DfAlertService);
    appsService = TestBed.get(AppsService);
    identityService = TestBed.get(IdentityService);
    modalService = TestBed.get(DfModalService);
    router = TestBed.get(Router);
    teamService = TestBed.get(TeamService);
    teamSelectorStrategyService = TestBed.get(TeamSelectorStrategyService);
    teamSelectorStrategyService.strategy = Object.assign({
      next: () => true,
    });

    assignments = Object.assign(ASSIGNMENT_MOCK.content);
    assignments.forEach(assignment => {
      assignment.selection = Object.assign({
        marketplaceMember: {
          application: {
            candidate: assignment.candidate,
          },
        },
      });
    });
    teamDashboard = Object.assign(TEAM_DASBOARD_MOCK);
    teamDashboard.managerId = 8473;
    teamDashboard.team = { id: 872 };
    userDetail = Object.assign(CURRENT_USER_DETAIL_MOCK);
    userDetail.managerAvatar = Object.assign({ id: 13 });
    userDetail.appFeatures.push({ appFeature: 'POLLS' });
    userDetail.assignment = Object.assign({ id: 13, manager: { id: 13 }, team: { id: 11 } });
    spyCurrentUserDetail = spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of(userDetail));
    spyTeamManagerGroupSelection = spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of(teamDashboard));
    spyDashboard = spyOn(assignmentService, 'getDashboard').and.returnValue(of(teamDashboard));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be initialized successfully', () => {
    spyOn(component, 'getTeams');
    spyOn(component, 'getManagers');

    fixture.detectChanges();

    expect(component.getTeams).toHaveBeenCalledWith();
    expect(component.getManagers).toHaveBeenCalledWith();
  });

  it('should initialize and store modal data sucessfully', () => {
    teamSelectorStrategyService.strategy = Object.assign({
      next: jasmine.createSpy('teamSelectorStrategyService.strategy.next'),
    });
    teamSelectorStrategyService.newTeam = Object.assign({
      next: jasmine.createSpy('teamSelectorStrategyService.newTeam.next'),
    });
    const newModal = {
      instance: {
        data: of({}),
        error: '',
        isLoading: true,
        close: jasmine.createSpy('newModal.close'),
      },
    };
    const hireAppUrl = `/contractor/team-hire`;
    spyOn(identityService, 'getCurrentUserAs').and.returnValue(of({}).pipe(take(1)));
    spyOn(modalService, 'open').and.returnValue(newModal);
    spyOn(teamService, 'store').and.returnValue(of({}).pipe(take(1)));
    spyOn(appsService, 'storeStatisticsFormManagers').and.returnValue(of(null).pipe(take(1)));
    spyOn(router, 'navigate');

    component.openNewTeamModal();

    expect(router.navigate).toHaveBeenCalledWith([hireAppUrl]);
    expect(newModal.instance.close).toHaveBeenCalledWith();
  });

  it('should set error messages when data retrieval / store for modal fails', () => {
    const newModal = {
      instance: {
        data: of({}),
        error: '',
        isLoading: true,
        close: jasmine.createSpy('newModal.close'),
      },
    };
    spyOn(identityService, 'getCurrentUserAs').and.returnValue(_throw({}).pipe(take(1)));
    spyOn(modalService, 'open').and.returnValue(newModal);
    spyOn(teamService, 'store').and.returnValue(_throw({}).pipe(take(1)));
    spyOn(appsService, 'storeStatisticsFormManagers').and.returnValue(of(null).pipe(take(1)));
    spyOn(router, 'navigate');

    component.openNewTeamModal();

    expect(component.error).toBe('An unknown error happened while retrieving manager data.');
    expect(newModal.instance.error).toBe('An unknown error occurred during team storage.');
  });

  it('should set a different team tab successfully', () => {
    const tabId = 0;

    spyOn(_, 'get').and.returnValue(false);
    spyOn(router, 'navigate').and.returnValue('');

    component.teamDetailTabChange(tabId);

    expect(component.selectedTeamDetailTab).toBe(tabId.toString());
    expect(router.navigate).not.toHaveBeenCalledWith();
  });

  it('should navigate to the team summary successfully when productivity tab is clicked', () => {
    const tabId = 1;

    spyOn(_, 'get').and.returnValue(true);
    spyOn(router, 'navigate').and.returnValue('');

    component.teamDetailTabChange(tabId);

    expect(component.selectedTeamDetailTab).toBe(tabId.toString());
    expect(router.navigate).toHaveBeenCalledWith(['/contractor/team-summary']);
  });

  it('should open the contractor modal when the contractor name link is clicked', () => {
    const assignment: Assignment = Object.assign({
      candidate: {},
      id: 13,
      manager: {},
      team: { id: 11 },
    });
    spyOn(modalService, 'open').and.returnValue('');

    component.navigateToContractor(assignment);

    expect(component.currentUserManager).toBe(assignment.manager);
    expect(component.currentUserAssignmentId).toBe(assignment.id);
    expect(component.currentUserTeamId).toBe(assignment.team.id);
    expect(component.currentContractor).toBe(assignment.candidate as CurrentUserDetail);
    expect(modalService.open).toHaveBeenCalledWith(component.profileModal, { customClass: 'full-screen' });
  });

  it('should not move the contractor to a new team when no new team is provided', () => {
    spyOn(alertService, 'createDialog');

    const event = Object.assign({});
    component.moveContractorToTeam(event);

    expect(alertService.createDialog).not.toHaveBeenCalledWith();
  });

  it('should not move the contractor a team is provided but drag data does not match criteria', () => {
    spyOn(alertService, 'createDialog');
    const event = Object.assign({
      dragData: {
        oldTeam: { id: 1 },
      },
    });
    const newTeam = Object.assign({ id: 1 });
    component.moveContractorToTeam(event, newTeam);

    expect(alertService.createDialog).not.toHaveBeenCalledWith();
  });

  it('should move the contractor successfully', () => {
    spyOn(alertService, 'createDialog').and.returnValue(of(['ok']).pipe(take(1)));
    spyOn(assignmentService, 'updateTeamManager').and.returnValue(of({}).pipe(take(1)));
    component.currentUser = Object.assign({ fullName: 'John Doe' });
    component.currentManagerId = 11;
    const event = Object.assign({
      dragData: {
        assignment: {
          id: 11,
          candidate: {
            printableName: 'Test',
          },
        },
        oldTeam: { id: 1, activeAssignments: [{ id: 13 }] },
      },
    });
    const newTeam = Object.assign({ id: 2, activeAssignments: [] });
    component.moveContractorToTeam(event, newTeam);

    expect(alertService.createDialog).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('should get teams data successfully', () => {
    spyOn(assignmentService, 'getUserTeams').and.returnValue(of(teamDashboard.teams));
    component.getTeams();

    expect(component.isTeamsLoading).toBe(false);
    expect(component.myTeams.length).toBeGreaterThan(0);
  });

  it('should get other teams data successfully', () => {
    const teams: Team[] = Object.assign([{
      id: 13,
      reportingManagers: null,
    }]);
    spyDashboard.and.returnValue(of({ teams }));
    spyOn(assignmentService, 'getUserTeams').and.returnValue(of(teams));
    component.getTeams();

    expect(component.isTeamsLoading).toBe(false);
    expect(Object.keys(component.otherTeams).length).toBeGreaterThan(0);
  });

  it('should throw an error when the teams data is loaded', () => {
    spyCurrentUserDetail.and.returnValue(_throw({ text: 'Error' }));

    component.getTeams();

    expect(component.isTeamsLoading).toBe(false);
    expect(component.error).toBe('Error trying to load the teams.');
  });

  it('should throw an error when the managers are loaded', () => {
    spyOn(assignmentService, 'getManagers').and.returnValue(_throw({ text: 'Error' }));

    component.getManagers();

    expect(component.error).toBe('Error trying to load the managers.');
  });

  it('should not get teams data when no team  / manager info is available', () => {
    spyTeamManagerGroupSelection.and.returnValue(of(null));
    component.getTeams();

    expect(assignmentService.getDashboard).not.toHaveBeenCalled();
  });

  it('should get managers data sorted successfully', () => {
    spyOn(assignmentService, 'getManagers').and.returnValue(of([
      { id: 1 },
      { id: 2 },
    ]));
    component.getManagers();

    expect(component.managersIds[0]).toBe(1);
  });

  it('should get managers data sorted by company name successfully', () => {
    spyOn(assignmentService, 'getManagers').and.returnValue(of([
      { id: 1, company: { name: 'Company Z' } },
      { id: 2, company: { name: 'Company A' } },
    ]));
    component.getManagers();

    expect(component.managersIds[0]).toBe(2);
  });

  it('should set the last manager company sucessfully', () => {
    const company = Object.assign({
      id: 1,
    });
    const trueResult = component.isNewManagersCompany(company);
    expect(trueResult).toBe(true);

    const falseResult = component.isNewManagersCompany(company);
    expect(falseResult).toBe(false);
  });

  it('should change the role to Manager when the same is selected', () => {
    const assignment: Assignment = Object.assign({
      candidate: { avatarTypes: [], userId: 13 },
      type: '',
    });
    const type = 'Manager';
    spyOn(identityService, 'updateUserAvatars').and.returnValue(of({}));

    component.roleSelected(assignment, type);

    expect(assignment.type).toBe(type);
  });

  it('should change the role to Admin when the same is selected', () => {
    const assignment: Assignment = Object.assign({
      candidate: { avatarTypes: ['PERSONAL'], userId: 13 },
      type: '',
    });
    const type = 'Admin';
    spyOn(identityService, 'updateUserAvatars').and.returnValue(of({}));

    component.roleSelected(assignment, type);

    expect(assignment.type).toBe(type);
  });

  it('should throw an error when the role is updated', () => {
    const assignment: Assignment = Object.assign({
      candidate: { avatarTypes: ['PERSONAL'], userId: 13 },
      type: '',
    });
    const type = 'Admin';
    spyOn(identityService, 'updateUserAvatars').and.returnValue(_throw({ text: '' }));

    component.roleSelected(assignment, type);

    expect(component.error).toBe('Error trying to update the user avatars.');
  });

  it('should update the job title when the same is edited and saved', () => {
    const assignment: Assignment = Object.assign({
      id: 13,
      jobTitle: 'Architect',
    });
    component.myTeams = Object.assign([{ id: 11, activeAssignments: [{ id: 13, jobTitle: 'Engineer' }] }]);
    component.selectedTeam = Object.assign({ id: 11 });
    spyOn(assignmentService, 'updateAssignment').and.returnValue(of({}));

    component.updateActiveAssignment(assignment);

    expect((component.myTeams[0].activeAssignments as Assignment[])[0].jobTitle).toBe(assignment.jobTitle);
  });

  it('should throw an error when the job title is updated', () => {
    const assignment: Assignment = Object.assign({
      id: 13,
      jobTitle: 'Architect',
    });
    component.myTeams = Object.assign([{ id: 11, activeAssignments: [{ id: 13, jobTitle: 'Engineer' }] }]);
    component.selectedTeam = Object.assign({ id: 11 });
    spyOn(assignmentService, 'updateAssignment').and.returnValue(_throw({ text: '' }));

    component.updateActiveAssignment(assignment);

    expect(component.error).toBe('Error trying to update the assignment.');
  });

  it('should update the team name when the same is edited and saved from my teams', () => {
    const teamName = 'Easier';
    component.isOtherTeamSelected = false;
    component.myTeams = Object.assign([{ id: 11, name: '' }]);
    component.selectedTeam = Object.assign({ id: 11, name: 'XO' });
    spyOn(assignmentService, 'updateTeam').and.returnValue(of(component.selectedTeam));

    component.onTeamNameChange(teamName);

    expect(component.myTeams[0].name).toBe(component.selectedTeam.name);
  });

  it('should update the team name when the same is edited and saved from other teams', () => {
    const teamName = 'Easier';
    component.isOtherTeamSelected = true;
    component.otherTeams = Object.assign([{ id: 11, name: '' }]);
    component.selectedTeam = Object.assign({ id: 11, name: 'XO' });
    spyOn(assignmentService, 'updateTeam').and.returnValue(of(component.selectedTeam));

    component.onTeamNameChange(teamName);

    expect(component.otherTeams[0].name).toBe(component.selectedTeam.name);
  });

  it('should throw an error when the team name is updated', () => {
    const teamName = 'XO';
    component.selectedTeam = Object.assign({ id: 11, name: 'XO' });
    spyOn(assignmentService, 'updateTeam').and.returnValue(_throw({ text: '' }));

    component.onTeamNameChange(teamName);

    expect(assignmentService.updateTeam).not.toHaveBeenCalledWith();
  });

  it('should do nothing when team name is not updated', () => {
    const teamName = 'Easier';
    component.isOtherTeamSelected = true;
    component.otherTeams = Object.assign([{ id: 11, name: '' }]);
    component.selectedTeam = Object.assign({ id: 11, name: 'XO' });
    spyOn(assignmentService, 'updateTeam').and.returnValue(_throw({ text: '' }));

    component.onTeamNameChange(teamName);

    expect(component.error).toBe('Error trying to update the Team name.');
  });

  it('should update the team owner when the same is selected and saved', () => {
    const selectedTeamOwnerId = 1;
    component.managers = { '1': Object.assign({ id: 13 }) };
    component.selectedTeam = Object.assign({ id: 11, name: 'XO' });
    spyOn(assignmentService, 'getTeam').and.returnValue(of(component.selectedTeam));
    spyOn(assignmentService, 'updateTeam').and.returnValue(of(component.selectedTeam));

    component.onTeamOwnerChange(selectedTeamOwnerId);

    expect(component.selectedTeam.teamOwner).toBe(component.managers[selectedTeamOwnerId]);
  });

  it('should throw an error when the team owner is updated', () => {
    const selectedTeamOwnerId = 1;
    component.managers = { '1': Object.assign({ id: 13 }) };
    component.selectedTeam = Object.assign({ id: 11, name: 'XO' });
    spyOn(assignmentService, 'getTeam').and.returnValue(_throw({ text: '' }));

    component.onTeamOwnerChange(selectedTeamOwnerId);

    expect(component.error).toBe('Error trying to update the Team owner.');
  });

  it('should update the manager when the same is selected and saved', () => {
    const index = 0;
    const manager: Manager = Object.assign({ id: 13, printableName: 'Sri' });
    component.myTeams = Object.assign([{ id: 23, name: '', activeAssignments: [{ id: 11 }] }]);
    component.selectedTeam = Object.assign({ id: 23 });
    component.teamAssignments = [Object.assign({ id: 11, candidate: { printableName: 'John' }, team: { id: 2, name: 'XO' } })];
    spyOn(alertService, 'createDialog').and.returnValue(of(['ok']).pipe(take(1)));
    spyOn(component, 'selectTeam').and.returnValue('');
    spyOn(assignmentService, 'updateTeamManager').and.returnValue(of({}));

    component.onManagerChange(index, manager);

    expect(component.teamAssignments[index].manager).toBe(manager);
  });

  it('should throw an error when the manager is updated', () => {
    const index = 0;
    const manager: Manager = Object.assign({ id: 13, printableName: 'Sri' });
    component.managers = { '1': Object.assign({ id: 13 }) };
    component.selectedTeam = Object.assign({ id: 11, name: 'XO' });
    component.teamAssignments = [Object.assign({ id: 11, candidate: { printableName: 'John' }, team: { id: 2, name: 'XO' } })];
    spyOn(alertService, 'createDialog').and.returnValue(of(['ok']).pipe(take(1)));
    spyOn(assignmentService, 'updateTeamManager').and.returnValue(_throw({ text: 11 }));

    component.onManagerChange(index, manager);

    expect(component.error).toBe('Error trying to update the manager.');
  });

  it('should select a team correctly when the screen is loaded', () => {
    const team: Team = Object.assign({ id: 11, teamOwner: { id: 3 } });
    component.currentManagerId = 23;
    spyOn(assignmentService, 'getTeamAssignments').and.returnValue(of([{ manager: { id: 23 } }]));
    spyOn(assignmentService, 'getTeam').and.returnValue(of({ activeAssignments: [] }));
    spyOn(component, 'areDifferentAssignments').and.returnValue(false);
    spyOn(component, 'setUserType').and.returnValue('Manager');

    component.selectTeam(team);

    expect(component.teamAssignments[0].type).toBe('Manager');
  });

  it('should set the user type to Admin when the page is loaded', () => {
    const assignment: Assignment = Object.assign({ candidate: { avatarTypes: [component.avatarTypes.CompanyAdmin] } });

    expect(component.setUserType(assignment)).toBe('Admin');
  });

  it('should set the user type to Manager when the page is loaded', () => {
    const assignment: Assignment = Object.assign({ candidate: { avatarTypes: [component.avatarTypes.Manager] } });

    expect(component.setUserType(assignment)).toBe('Manager');
  });

  it('should set the user type to Contractor when the page is loaded', () => {
    const assignment: Assignment = Object.assign({ candidate: { avatarTypes: [component.avatarTypes.Candidate] } });

    expect(component.setUserType(assignment)).toBe('Contractor');
  });

  it('should return equal assignments when there are not active assignments selected', () => {
    const assignArray1: Assignment[] = Object.assign([{ id: 11 }]);
    const assignArray2: Assignment[] = Object.assign([{ id: 11 }]);
    component.selectedTeam = Object.assign({ activeAssignments: null });

    expect(component.areDifferentAssignments(assignArray1, assignArray2)).toBe(false);
  });

  it('should return different assignments when they have different sizes', () => {
    const assignArray1: Assignment[] = Object.assign([{ id: 11 }, { id: 13 }]);
    const assignArray2: Assignment[] = Object.assign([{ id: 11 }]);
    component.selectedTeam = Object.assign({ activeAssignments: [] });

    expect(component.areDifferentAssignments(assignArray1, assignArray2)).toBe(true);
  });

  it('should return different assignments when they have different Ids', () => {
    const assignArray1: Assignment[] = Object.assign([{ id: 11 }]);
    const assignArray2: Assignment[] = Object.assign([{ id: 13 }]);
    component.selectedTeam = Object.assign({ activeAssignments: [] });

    expect(component.areDifferentAssignments(assignArray1, assignArray2)).toBe(true);
  });

  it('should return equal assignments when they have same Ids', () => {
    const assignArray1: Assignment[] = Object.assign([{ id: 11 }]);
    const assignArray2: Assignment[] = Object.assign([{ id: 11 }]);
    component.selectedTeam = Object.assign({ activeAssignments: [] });

    expect(component.areDifferentAssignments(assignArray1, assignArray2)).toBe(false);
  });

  it('should get a single team correctly when the same is selected', () => {
    const team: Team = Object.assign({ id: 13 });
    component.currentManagerId = 872;
    spyOn(assignmentService, 'getTeamAssignments').and.returnValue(of([{ manager: { id: 872 } }]));

    component.getTeam(team);

    expect(team.activeAssignments).toBeDefined();
  });

  it('should throw an error when the team is loaded', () => {
    const team: Team = Object.assign({ id: 13 });
    component.currentManagerId = 872;
    spyOn(assignmentService, 'getTeamAssignments').and.returnValue(_throw({ text: '' }));

    component.getTeam(team);

    expect(team.activeAssignments).toBeUndefined();
    expect(component.error).toBe('Error trying to load the team assignments.');
  });
});
