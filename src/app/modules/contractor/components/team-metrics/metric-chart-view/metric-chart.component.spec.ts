import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Assignment } from 'app/core/models/assignment';
import { MetricChartComponent } from 'app/modules/contractor/components/team-metrics/metric-chart-view/metric-chart.component';
import { TeamMetricsService } from 'app/shared/services/team-metrics/team-metrics.service';

describe('MetricChartComponent', () => {
  let component: MetricChartComponent;
  let fixture: ComponentFixture<MetricChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MetricChartComponent,
      ],
      providers: [ TeamMetricsService ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-06-21T05:45:00'));
    fixture = TestBed.createComponent(MetricChartComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => jasmine.clock().uninstall());

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('should create metrics table data', () => {
    beforeEach(() => {
      component.metricInputData = {
        team: {
          id: 1
        },
        managerId: 1,
        metricDescription: 'description1',
        queryOption: 4,
        unitsCostMode: 'Units',
        assignments: [
          {
            id: 1,
            candidate: {
              printableName: 'somename'
            },
            manager: {
              id: 1
            },
            assignmentHistories: [
              {
                id: 1
              }
            ],
            team: {
              id: 1
            }
          }
        ] as Assignment[],
        metricsValues: [
          {
            name: 'name1',
            assignmentId: 1,
            stats: [
              {
                ticketsResolved: 1,
                hoursWorked: 1,
                weekSalary: 10,
                startDate: '2017-06-18',
                assignmentId: 1,
                activeWeek: true,
                queryUsed: 'query1',
                cost: 1,
                isLastWeek: false,
                date: new Date('2017-06-18'),
                teamSize: 2,
              },
            ]
          }
        ],
        metricTarget: 1,
        lastUpdate: new Date(),
        activeTeamMembers: 2,
        viewMode: 'CHART'
      };
    });

    it('should get data in units mode', () => {
      component.ngOnChanges();
      expect(component.metricsTableData.length).toBe(1);
    });

    it('should get data in cost mode', () => {
      component.metricInputData.unitsCostMode = 'Cost';
      component.ngOnChanges();
      expect(component.metricsTableData.length).toBe(1);
    });

    it('should update chart data on current week check change', () => {
      component.ngOnChanges();
      component.currentWeekCheck.setValue(true);
      expect(component.metricsTableData.length).toBe(1);
    });

    it('should update chart data on team average unit change', () => {
      component.ngOnChanges();
      component.teamAverageUnitsCheck.setValue(false);
      expect(component.metricsTableData.length).toBe(1);
    });

    it('should update chart data on team average cost change', () => {
      component.ngOnChanges();
      component.teamAverageCostCheck.setValue(false);
      expect(component.metricsTableData.length).toBe(1);
    });

    it('[getLastUpdate] - get last update date', () => {
      component.ngOnChanges();
      expect(component.getLastUpdate()).not.toBeNull();
    });

    it('[getMetricPercentage] - get metric percentage', () => {
      component.ngOnChanges();
      expect(component.getMetricPercentage(1)).toBe(100);
    });

    it('[getMetricPercentage] - get metric percentage with 0 metrics', () => {
      component.metricInputData.metricTarget = 0;
      component.ngOnChanges();
      expect(component.getMetricPercentage(1)).toBe(0);
    });

    it('[getContractorWeekData] - should return week metrics for contractor', () => {
      component.ngOnChanges();
      const weekMetric = component.getContractorWeekData('somename', new Date('2017-06-18'));
      expect(weekMetric).not.toBeNull();
    });

    it('[getContractorWeekData] - should return null when no contractor selected', () => {
      component.ngOnChanges();
      const weekMetric = component.getContractorWeekData('othername', new Date('2017-06-18'));
      expect(weekMetric).toBeNull();
    });

    it('[getWeekTeamWeekData] - should return week data', () => {
      component.ngOnChanges();
      expect(component.getWeekTeamWeekData(new Date('2017-06-18'))).not.toBeNull();
    });

    it('[colorFn] - should return team record color', () =>
      expect(component.colorFn('Team Average')).toBe('#02a8f3')
    );

    it('[colorFn] - should return metric target color', () =>
      expect(component.colorFn('Metric Target')).toBe('black')
    );

    it('[colorFn] - should return contractor color', () =>
      expect(component.colorFn('somename')).toBe('#ff8a80')
    );

    it('[colorFn] - should return empty color', () =>
      expect(component.colorFn('othername')).toBe('')
    );

    it('[getTeamMetricPercentage] - should return metric target and active members product', () => {
      component.metricInputData.metricTarget = 1;
      component.metricInputData.activeTeamMembers = 2;
      component.ngOnChanges();
      expect(component.getTeamMetricPercentage(4)).toBe(200);
    });

    it('[getTeamMetricPercentage] - should return 0 when metric target is 0', () => {
      component.metricInputData.metricTarget = 0;
      component.metricInputData.activeTeamMembers = 2;
      component.ngOnChanges();
      expect(component.getTeamMetricPercentage(4)).toBe(0);
    });

    it('[getMetricPercentage] - should return metric target', () => {
      component.metricInputData.metricTarget = 1;
      component.ngOnChanges();
      expect(component.getMetricPercentage(1)).toBe(100);
    });

    it('[getMetricPercentage] - should return 0 when metric target is 0', () => {
      component.metricInputData.metricTarget = 0;
      component.ngOnChanges();
      expect(component.getMetricPercentage(1)).toBe(0);
    });

    it('[getSelectedQuery] - should return query option text', () => {
      component.metricInputData.queryOption = 4;
      component.ngOnChanges();
      expect(component.getSelectedQuery()).toBe('4 Weeks');
    });

    it('[getSelectedQuery] - should return empty text when no option found', () => {
      component.metricInputData.queryOption = 5;
      component.ngOnChanges();
      expect(component.getSelectedQuery()).toBe('');
    });

    it('[getMetricPerTeamMember] - should return metric per member', () =>
      expect(component.getMetricPerTeamMember(1, 2)).toBe('0.50')
    );

    it('[getMetricPerTeamMember] - should return 0 when team size is 0', () =>
      expect(component.getMetricPerTeamMember(1, 0)).toBe('0.00')
    );

    it('[getLastUpdate] - should return empty text when no last update found', () => {
      component.metricInputData.lastUpdate = undefined;
      component.ngOnChanges();
      expect(component.getLastUpdate()).toBe('');
    });

    it('[getTeamScoreClass] - should return success class', () =>
      expect(component.getTeamScoreClass(100)).toBe('score-success')
    );
  });
});
