import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfModalService } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators';
import { mock } from 'ts-mockito';

import { MetricAuthorization, MetricSetup, TeamOverview } from 'app/core/models/metric';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { DownloadService } from 'app/core/services/download/download.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { MetricService } from 'app/core/services/metric/metric.service';
import { TEAM_ASSIGNMENT_MOCK } from 'app/core/services/mocks/assignment.mock';
import { CURRENT_USER_DETAIL_MANAGER_MOCK } from 'app/core/services/mocks/current-user-detail.mock';
import { TeamMetricsComponent } from 'app/modules/contractor/pages/team-metrics/team-metrics.component';
import { TeamMetricsService } from 'app/shared/services/team-metrics/team-metrics.service';
import {
  TeamSelectorStrategyService,
} from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';


describe('TeamMetricsComponent', () => {
  let component: TeamMetricsComponent;
  let fixture: ComponentFixture<TeamMetricsComponent>;

  let assignmentService: AssignmentService;
  let identityService: IdentityService;
  let metricService: MetricService;
  let teamMetricsService: TeamMetricsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TeamMetricsComponent,
      ],
      providers: [
        { provide: AssignmentService, useFactory: () => mock(AssignmentService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: MetricService, useFactory: () => mock(MetricService) },
        { provide: TeamMetricsService, useFactory: () => mock(TeamMetricsService) },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        TeamSelectorStrategyService,
        DownloadService
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-05-01T03:24:00'));
    fixture = TestBed.createComponent(TeamMetricsComponent);
    component = fixture.componentInstance;

    assignmentService = TestBed.get(AssignmentService);
    identityService = TestBed.get(IdentityService);
    metricService = TestBed.get(MetricService);
    teamMetricsService = TestBed.get(TeamMetricsService);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('[ngOnInit]', () => {
    beforeEach(() => {
      spyOn(assignmentService, 'getTeamAssignmentsAsManager').and.returnValue(of(TEAM_ASSIGNMENT_MOCK).pipe(take(1)));
      spyOn(teamMetricsService, 'getMetricsAuthorization').and.returnValue({} as MetricAuthorization);
      spyOn(metricService, 'getTeamMetricsValues').and.returnValue(of([]).pipe(take(1)));
      spyOn(identityService, 'getCurrentUserValue').and.returnValue(CURRENT_USER_DETAIL_MANAGER_MOCK);
    });
    it('should show error when app not available', () => {
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
        team: {
          id: 1,
        },
        managerId: 1,
      }).pipe(take(1)));
      fixture.detectChanges();
      expect(component.error).toBe('Metrics are not available for this team, please change team from team selector.');
    });
    it('should show no settings when no metrics available', () => {
      const teamOverview = <TeamOverview>{
        id: 2,
        metricsSetups: [] as MetricSetup[]
      };
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
        team: {
          id: 2,
        },
        managerId: 1,
      }).pipe(take(1)));
      spyOn(metricService, 'getTeamOverview').and.returnValue(of(teamOverview).pipe(take(1)));
      fixture.detectChanges();
      expect(component.noSettings).toBe(true);
    });
    it('should get data with settings enabled', () => {
      const teamOverview = <TeamOverview>{
        id: 1,
        metricsSetups: [
          {
            active: true,
            currentTeamMetric: true,
            metricTarget: 3,
            metricUpdatedOn: '2018-04-24T00:59:06.000+0000',
            metricName: 'metric1',
            type: 'sometype'
          }
        ] as MetricSetup[]
      };
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
        team: {
          id: 2,
        },
        managerId: 1,
      }).pipe(take(1)));
      spyOn(metricService, 'getTeamOverview').and.returnValue(of(teamOverview).pipe(take(1)));
      fixture.detectChanges();
      expect(component.metricInputData).toBeDefined();
    });
  });
});
