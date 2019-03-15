import { async, TestBed } from '@angular/core/testing';

import { Assignment, AssignmentHistory } from 'app/core/models/assignment';
import { CurrentUserDetail } from 'app/core/models/identity';
import { RawMetrics } from 'app/core/models/metric';
import { Team } from 'app/core/models/team';
import { TeamMetricsService } from 'app/shared/services/team-metrics/team-metrics.service';

describe('TeamMetricsService', () => {
  let service: TeamMetricsService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        providers: [
          TeamMetricsService,
        ],
      })
      .compileComponents()
      .then(() => service = TestBed.get(TeamMetricsService));
    })
  );

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-05-17T03:24:00'));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create an instance successfully', () => {
    expect(service).toBeTruthy();
  });

  it('should get authorization as teamOwner with edit and save rights', () => {
    const currentUserDetail = <CurrentUserDetail>{
      userAvatars : [
        {
          id: 1,
          type: 'MANAGER'
        },
      ]
    };
    const team = <Team>{
      teamOwner: {
        id: 1
      }
    };
    const assignments = <Assignment[]> [
      {
        manager: {
          id: 1
        }
      }
    ];
    expect(service.getMetricsAuthorization(currentUserDetail, team, assignments)).toEqual({
      canEditMetrics: true,
      canSaveMetrics: true,
    });
  });

  it('should get authorization as watcher with edit and save rights', () => {
    const currentUserDetail = <CurrentUserDetail>{
      userAvatars : [
        {
          id: 1,
          type: 'COMPANY_ADMIN'
        },
      ]
    };
    const team = <Team>{};
    const assignments = <Assignment[]> [
      {
        manager: {
          id: 1
        }
      }
    ];
    expect(service.getMetricsAuthorization(currentUserDetail, team, assignments)).toEqual({
      canEditMetrics: true,
      canSaveMetrics: true,
    });
  });

  it('should get authorization with no edit and save rights', () => {
    expect(service.getMetricsAuthorization(null, {} as Team , [])).toEqual({
      canEditMetrics: false,
      canSaveMetrics: false,
    });
  });

  it('should calculate denormalized weekly team metrics', () => {
    const metricsValues = <RawMetrics[]> [
      {
        name: 'name1',
        assignmentId: 1,
        stats: [
          {
            ticketsResolved: 1,
            hoursWorked: 1,
            weekSalary: 10,
            startDate: '2017-01-01',
            assignmentId: 1,
            activeWeek: true,
            queryUsed: 'query1',
            cost: 1,
            isLastWeek: false,
            date: new Date('2017-01-01'),
            teamSize: 2,
          },
        ]
      }
    ];
    expect(service.calculateWeeklyTeamMetrics(metricsValues, 1, false).name).toBe('Team');
  });

  it('should calculate normalized weekly team metrics', () => {
    const metricsValues = <RawMetrics[]> [
      {
        name: 'name1',
        assignmentId: 1,
        stats: [
          {
            ticketsResolved: 0,
            hoursWorked: 1,
            weekSalary: 10,
            startDate: '2017-01-01',
            assignmentId: 1,
            activeWeek: false,
            queryUsed: 'query1',
            cost: 1,
            isLastWeek: true,
            date: new Date('2017-01-01'),
            teamSize: 2,
          },
        ]
      }
    ];
    expect(service.calculateWeeklyTeamMetrics(metricsValues, 0, true).name).toBe('Team');
  });

  it('should calculate denormalized weekly individual metrics', () => {
    const assignments = <Assignment[]> [
      {
        id: 1,
        candidate: {
          printableName: 'name1'
        },
        manager: {
          id: 1
        },
        team: {
          id: 1
        },
        assignmentHistories: [] as AssignmentHistory[]
      }
    ];
    const metricsValues = <RawMetrics[]> [
      {
        name: 'name1',
        assignmentId: 1,
        stats: [
          {
            ticketsResolved: 1,
            hoursWorked: 1,
            weekSalary: 10,
            startDate: '2017-01-01',
            assignmentId: 1,
            activeWeek: true,
            queryUsed: 'query1',
            cost: 1,
            isLastWeek: false,
            date: new Date(),
            teamSize: 2,
          },
        ]
      }
    ];
    expect(service.calculateStatsPerAssignments(assignments, metricsValues, 1, false, 1, 1).length).toBe(1);
  });

  it('should calculate normalized weekly individual metrics', () => {
    const assignments = <Assignment[]> [
      {
        id: 1,
        candidate: {
          printableName: 'name1'
        },
        manager: {
          id: 1
        },
        team: {
          id: 1
        },
        assignmentHistories: [] as AssignmentHistory[]
      }
    ];
    const metricsValues = <RawMetrics[]> [
      {
        name: 'name1',
        assignmentId: 1,
        stats: [
          {
            ticketsResolved: 0,
            hoursWorked: 0,
            weekSalary: 10,
            startDate: '2017-01-01',
            assignmentId: 1,
            activeWeek: true,
            queryUsed: 'query1',
            cost: 1,
            isLastWeek: false,
            date: new Date(),
            teamSize: 2,
          },
        ]
      }
    ];
    expect(service.calculateStatsPerAssignments(assignments, metricsValues, 0, true, 1, 1).length).toBe(1);
  });

  it('should get score class warning', () =>
    expect(service.getScoreClass(0.6)).toEqual('score-warning')
  );

  it('should get score class danger', () =>
    expect(service.getScoreClass(0.4)).toEqual('score-danger')
  );
});
