import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import * as _ from 'lodash';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { Manager } from 'app/core/models/manager';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { CURRENT_USER_DETAIL_MANAGER_MOCK } from 'app/core/services/mocks/current-user-detail.mock';
import { TEAMS_MOCK } from 'app/core/services/mocks/dashboard.mock';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { TeamSelectorComponent } from 'app/shared/components/team-selector/team-selector.component';
import {
  TeamSelectorStrategyService,
} from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';
import { UserDashboardService } from 'app/shared/services/user-dashboard/user-dashboard.service';

describe('TeamSelectorComponent', () => {
  let component: TeamSelectorComponent;
  let fixture: ComponentFixture<TeamSelectorComponent>;
  let userDashboardService: UserDashboardService;
  let identityService: IdentityService;
  let teamSelectorStrategyService: TeamSelectorStrategyService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TeamSelectorComponent],
      providers: [
        { provide: UserDashboardService, useFactory: () => mock(UserDashboardService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        TeamSelectorStrategyService,
        { provide: WINDOW_TOKEN, useValue: {
          setTimeout: (input: Function) => input(),
        } },
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(TeamSelectorComponent);
      component = fixture.componentInstance;
      userDashboardService = TestBed.get(UserDashboardService);
      identityService = TestBed.get(IdentityService);
      teamSelectorStrategyService = TestBed.get(TeamSelectorStrategyService);
    });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit] should get current user detail and team dashboard successfully', () => {
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of(_.cloneDeep(CURRENT_USER_DETAIL_MANAGER_MOCK)));
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        reportingManagers: [{ id: 1 }],
      },
      managerId: 1,
    }));
    spyOn(userDashboardService, 'getTeamDashboard').and.returnValue(of(_.cloneDeep(TEAMS_MOCK)));
    fixture.detectChanges();
    expect(identityService.getCurrentUserDetail).toHaveBeenCalledWith();
    expect(userDashboardService.getTeamDashboard).toHaveBeenCalledWith(false, 1);
  });

  it('[ngOnInit] should get server error with error text', () => {
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of(_.cloneDeep(CURRENT_USER_DETAIL_MANAGER_MOCK)));
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        reportingManagers: [{ id: 1 }],
      },
      managerId: 1,
    }));
    spyOn(userDashboardService, 'getTeamDashboard').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    fixture.detectChanges();
    expect(identityService.getCurrentUserDetail).toHaveBeenCalledWith();
    expect(userDashboardService.getTeamDashboard).toHaveBeenCalledWith(false, 1);
    expect(component.error).toBe('error');
  });

  it('[ngOnInit] should get server error without error text', () => {
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of(_.cloneDeep(CURRENT_USER_DETAIL_MANAGER_MOCK)));
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        reportingManagers: [{ id: 1 }],
      },
      managerId: 1,
    }));
    spyOn(userDashboardService, 'getTeamDashboard').and.returnValue(
      Observable.throw({
        error: 'text',
      }).pipe(take(1))
    );
    fixture.detectChanges();
    expect(identityService.getCurrentUserDetail).toHaveBeenCalledWith();
    expect(userDashboardService.getTeamDashboard).toHaveBeenCalledWith(false, 1);
    expect(component.error).toBe('Error fetching teams.');
  });

  it('[ngOnInit] should ignore team manager switch when no data is provided', () => {
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(_throw({}));
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of(null));
    fixture.detectChanges();

    teamSelectorStrategyService.strategy.next(
      Object.assign({ data: null }).data
    );
  });

  it('switch manager successfully', () => {
    const manager = { id: 1, name: 'test' } as Manager;
    spyOn(identityService, 'updateTeamManagerGroupSelection').and.returnValue(of({}));
    component.switchManager(manager);
    expect(component.selectedManager).toEqual(manager);
    expect(identityService.updateTeamManagerGroupSelection).toHaveBeenCalledWith({
      team: {},
      managerId: manager.id,
      teams: [],
    });
  });

  it('should switch to the default manager when no option is provided', () => {
    spyOn(identityService, 'updateTeamManagerGroupSelection').and.returnValue({});
    const defaultManagerObject = Object.assign({});
    const teamTypes = Object.assign([
      {team: {}}
    ]);
    const selectedManager = Object.assign({ id: 1 });
    component.defaultSelectedManagerObject = defaultManagerObject;
    component.selectedManager = selectedManager;
    component.teamTypes = teamTypes;

    component.switchManager();

    expect(identityService.updateTeamManagerGroupSelection).toHaveBeenCalled();
  });

  it('switch team successfully', fakeAsync(() => {
    spyOn(userDashboardService, 'getTeamDashboard')
      .and.returnValue(of(_.cloneDeep(TEAMS_MOCK)));
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        reportingManagers: [{ id: 1 }],
      },
      managerId: 1,
    }));
    const teamId = 226;
    const selectedManager = Object.assign({id: 341551});
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of({
      assignment: {
        team: { id: teamId },
        manager: { id: selectedManager.id, printableName: 'Any Name' },
      },
      managerAvatar: { id: selectedManager.id },
    }));
    spyOn(identityService, 'updateTeamManagerGroupSelection').and.returnValue(true);
    fixture.detectChanges()
    tick(component.debounceTime * 10);
    component.switchTeam(teamId);
    const expectedManager = component.selectedManager as Manager;
    const expectedTeam = TEAMS_MOCK.teams.filter(team => team.name === 'Account Management')[0];

    expect(expectedManager.id).toEqual(selectedManager.id);
    expect(identityService.updateTeamManagerGroupSelection).toHaveBeenCalledWith(jasmine.objectContaining({
      team: jasmine.objectContaining({ id: expectedTeam.id }),
      managerId: selectedManager.id,
    }));
  }));

  it('search team successfully', fakeAsync(() => {
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of(_.cloneDeep(CURRENT_USER_DETAIL_MANAGER_MOCK)));
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        reportingManagers: [{ id: 1 }],
      },
      managerId: 1,
    }));
    spyOn(userDashboardService, 'getTeamDashboard').and.returnValue(of(_.cloneDeep(TEAMS_MOCK)));
    fixture.detectChanges();
    tick(component.debounceTime * 10);
    component.searchKey.setValue('test');
    component.searchTeam();
    expect(component.teamTypesFiltered[0].team.length).toBe(1);
    expect(component.teamTypesFiltered[1].team.length).toBe(0);
    expect(component.teamTypesFiltered[2].team.length).toBe(0);
  }));
});
