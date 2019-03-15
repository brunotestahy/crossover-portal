import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { IdentityService } from 'app/core/services/identity/identity.service';
import { TeamService } from 'app/core/services/team/team.service';
import { WorkflowsService } from 'app/core/services/workflows/workflows.service';
import { WorkflowsWidgetComponent } from 'app/modules/contractor/components/dashboard/workflows/widget/workflows-widget.component';

describe('WorkflowsWidgetComponent', () => {
  let component: WorkflowsWidgetComponent;
  let fixture: ComponentFixture<WorkflowsWidgetComponent>;

  let teamService: TeamService;
  let identityService: IdentityService;
  let workflowsService: WorkflowsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WorkflowsWidgetComponent,
      ],
      imports: [],
      providers: [
        { provide: TeamService, useFactory: () => mock(TeamService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: WorkflowsService, useFactory: () => mock(WorkflowsService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowsWidgetComponent);
    component = fixture.componentInstance;

    teamService = TestBed.get(TeamService);
    identityService = TestBed.get(IdentityService);
    workflowsService = TestBed.get(WorkflowsService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should init properly with failed goals', () => {
    component.teamId = 123;
    const currentUser = Object.assign({
      id: 1,
      managerAvatar: {
        id: 2
      }
    });
    const currentTeam = Object.assign({
      team: {
        teamOwner: {
          id: 4
        }
      }
    });
    const teamStatistics = Object.assign({
      overdueIssuesCount: 2,
      totalGroupItems: [
        {status: 'Pre-Work', count: 2},
        {status: 'Working', count: 3},
        {status: 'Ready for Testing', count: 4}
      ],
      workflowAssignmentStatistics: [
        {
          workflowStatusStatistics: [
            {status: 'Backlog', count: 1},
            {status: 'In Progress', count: 2}
          ]
        },
        {
          workflowStatusStatistics: [
            {status: 'In Progress', count: 1},
            {status: 'Released', count: 2}
          ]
        },
      ],
      workflowNonAssignmentStatistics: [
        {
          workflowStatusStatistics: [
            {status: 'Released', count: 1},
            {status: 'In Progress', count: 2},
          ]
        }
      ],
    });
    const workflowGoals = Object.assign({
      wipPerPerson: 3,
      leadTime: 26
    });
    const workflowStates = Object.assign([
      {jiraStatusName: 'In Progress', workflowState:{name: 'Working'}},
      {jiraStatusName: 'Released', workflowState:{name: 'Done'}},
      {jiraStatusName: 'Backlog', workflowState:{name: 'Pre-Work'}}
    ]);
    spyOn(identityService, 'getCurrentUserValue').and.returnValue(currentUser);
    spyOn(identityService, 'getTeamManagerGroupSelectionValue').and.returnValue(currentTeam);
    spyOn(teamService, 'getTeamStatistics').and.returnValue(of(teamStatistics));
    spyOn(workflowsService, 'getWorkflowGoals').and.returnValue(of(workflowGoals));
    spyOn(workflowsService, 'getWorkflowStates').and.returnValue(of(workflowStates));

    fixture.detectChanges();

    expect(component.overdueIssues).toBe(2);
    expect(component.leadTime).toBe('1d2h');
    expect(component.overdueIssuesColors[0]).toBe('#ea5a5a');

    expect(component.wipSize).toBe(3);
    expect(component.wipSizeGoal).toBe(6);
    expect(component.wipColors[0]).toBe('#ea5a5a');

    expect(component.headerColumns.length).toBe(2);
    expect(component.headerColumns[0]).toEqual({
      name: 'Pre-Work',
      shortName: 'PRE',
      count: 2
    });
    expect(component.headerColumns[1]).toEqual({
      name: 'In Progress',
      shortName: 'IP',
      count: 5
    });
  });

  it('should init properly when no actual progress specified', () => {
    component.teamId = 123;
    const currentUser = Object.assign({
      id: 1,
      managerAvatar: {
        id: 2
      }
    });
    const currentTeam = Object.assign({
      team: {
        teamOwner: {
          id: 4
        }
      }
    });
    const teamStatistics = Object.assign({
      overdueIssuesCount: 2,
      totalGroupItems: [
        {status: 'Pre-Work', count: 3},
        {status: 'Ready for Testing', count: 5}
      ],
      workflowAssignmentStatistics: []
    });
    const workflowGoals = Object.assign({
      wipPerPerson: 3,
      leadTime: 0
    });
    const workflowStates = Object.assign([{}]);
    spyOn(identityService, 'getCurrentUserValue').and.returnValue(currentUser);
    spyOn(identityService, 'getTeamManagerGroupSelectionValue').and.returnValue(currentTeam);
    spyOn(teamService, 'getTeamStatistics').and.returnValue(of(teamStatistics));
    spyOn(workflowsService, 'getWorkflowGoals').and.returnValue(of(workflowGoals));
    spyOn(workflowsService, 'getWorkflowStates').and.returnValue(of(workflowStates));

    fixture.detectChanges();

    expect(component.overdueIssues).toBe(2);
    expect(component.leadTime).toBe('0h');
    expect(component.overdueIssuesColors[0]).toBe('#23b1f7');

    expect(component.wipSize).toBe(0);
    expect(component.wipSizeGoal).toBe(0);
    expect(component.wipColors[0]).toBe('#23b1f7');

    expect(component.headerColumns.length).toBe(1);
    expect(component.headerColumns[0]).toEqual({
      name: 'Pre-Work',
      shortName: 'PRE',
      count: 3
    });
  });

  it('should init properly when progress is minimal', () => {
    component.teamId = 123;
    const currentUser = Object.assign({
      id: 1,
      managerAvatar: {
        id: 2
      }
    });
    const currentTeam = Object.assign({
      team: {
        teamOwner: {
          id: 4
        }
      }
    });
    const teamStatistics = Object.assign({
      overdueIssuesCount: 1,
      totalGroupItems: [
        {status: 'Pre-Work', count: 3},
        {status: 'Working', count: 85},
        {status: 'Ready for Testing', count: 5}
      ],
      workflowAssignmentStatistics: [
        {},
        {},
      ]
    });
    const workflowGoals = Object.assign({
      wipPerPerson: 50,
      leadTime: 2
    });
    const workflowStates = Object.assign([{}]);
    spyOn(identityService, 'getCurrentUserValue').and.returnValue(currentUser);
    spyOn(identityService, 'getTeamManagerGroupSelectionValue').and.returnValue(currentTeam);
    spyOn(teamService, 'getTeamStatistics').and.returnValue(of(teamStatistics));
    spyOn(workflowsService, 'getWorkflowGoals').and.returnValue(of(workflowGoals));
    spyOn(workflowsService, 'getWorkflowStates').and.returnValue(of(workflowStates));

    fixture.detectChanges();

    expect(component.overdueIssues).toBe(1);
    expect(component.leadTime).toBe('2h');
    expect(component.overdueIssuesColors[0]).toBe('#ff9800');

    expect(component.wipSize).toBe(85);
    expect(component.wipSizeGoal).toBe(100);
    expect(component.wipColors[0]).toBe('#ff9800');

    expect(component.headerColumns.length).toBe(1);
    expect(component.headerColumns[0]).toEqual({
      name: 'Pre-Work',
      shortName: 'PRE',
      count: 3
    });
  });

  it('should init properly when progress is good', () => {
    component.teamId = 123;
    const currentUser = Object.assign({
      id: 1,
      managerAvatar: {
        id: 2
      }
    });
    const currentTeam = Object.assign({
      team: {
        teamOwner: {
          id: 4
        }
      }
    });
    const teamStatistics = Object.assign({
      overdueIssuesCount: 0,
      totalGroupItems: [
        {status: 'Pre-Work', count: 3},
        {status: 'Working', count: 95},
        {status: 'Ready for Testing', count: 5}
      ],
      workflowAssignmentStatistics: [
        {},
        {},
      ]
    });
    const workflowGoals = Object.assign({
      wipPerPerson: 50,
      leadTime: 2
    });
    const workflowStates = Object.assign([{}]);
    spyOn(identityService, 'getCurrentUserValue').and.returnValue(currentUser);
    spyOn(identityService, 'getTeamManagerGroupSelectionValue').and.returnValue(currentTeam);
    spyOn(teamService, 'getTeamStatistics').and.returnValue(of(teamStatistics));
    spyOn(workflowsService, 'getWorkflowGoals').and.returnValue(of(workflowGoals));
    spyOn(workflowsService, 'getWorkflowStates').and.returnValue(of(workflowStates));

    fixture.detectChanges();

    expect(component.overdueIssues).toBe(0);
    expect(component.leadTime).toBe('2h');
    expect(component.overdueIssuesColors[0]).toBe('');

    expect(component.wipSize).toBe(95);
    expect(component.wipSizeGoal).toBe(100);
    expect(component.wipColors[0]).toBe('');

    expect(component.headerColumns.length).toBe(1);
    expect(component.headerColumns[0]).toEqual({
      name: 'Pre-Work',
      shortName: 'PRE',
      count: 3
    });
  });

  it('should handle error correctly', () => {
    component.teamId = 123;
    const currentUser = Object.assign({
      id: 1,
      managerAvatar: {
        id: 2
      }
    });
    const currentTeam = Object.assign({
      team: {
        teamOwner: {
          id: 4
        }
      }
    });
    const teamStatistics = Object.assign({
      overdueIssuesCount: 0,
      totalGroupItems: [
        {status: 'Pre-Work', count: 3},
        {status: 'Working', count: 95},
        {status: 'Ready for Testing', count: 5}
      ],
      workflowAssignmentStatistics: [
        {},
        {},
      ]
    });
    const workflowGoals = Object.assign({
      wipPerPerson: 50,
      leadTime: 2
    });
    spyOn(identityService, 'getCurrentUserValue').and.returnValue(currentUser);
    spyOn(identityService, 'getTeamManagerGroupSelectionValue').and.returnValue(currentTeam);
    spyOn(teamService, 'getTeamStatistics').and.returnValue(of(teamStatistics));
    spyOn(workflowsService, 'getWorkflowGoals').and.returnValue(of(workflowGoals));
    spyOn(workflowsService, 'getWorkflowStates').and.returnValue(Observable.throw('test error'));

    fixture.detectChanges();

    expect(component.error).toBe('Error loading workflows for selected team.');
  });

  it('should get bars for chart correctly', () => {
    expect(component.getBars(Object.assign({count: 1})).length).toBe(1);
    expect(component.getBars(Object.assign({count: 5})).length).toBe(5);
    expect(component.getBars(Object.assign({count: 7})).length).toBe(6);
  });
});
