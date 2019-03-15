import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Assignment } from 'app/core/models/assignment';
import { TeamMetricRecord, WeekMetrics } from 'app/core/models/metric';
import { MetricTableComponent } from 'app/modules/contractor/components/team-metrics/metric-table-view/metric-table.component';
import { TeamMetricsService } from 'app/shared/services/team-metrics/team-metrics.service';

describe('MetricTableComponent', () => {
  let component: MetricTableComponent;
  let fixture: ComponentFixture<MetricTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MetricTableComponent,
      ],
      providers: [TeamMetricsService ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-06-21T05:45:00'));
    fixture = TestBed.createComponent(MetricTableComponent);
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
            manager: {
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
        ],
        metricTarget: 1,
        lastUpdate: new Date(),
        activeTeamMembers: 2,
        viewMode: 'TABLE'
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

    it('[getMetricTargetTooltip] - get message', () => {
      component.ngOnChanges();
      expect(component.getMetricTargetTooltip()).toBe('Metric Target: 1');
    });

    it('[getTooltipPlacement] - get tooltip placement', () => {
      component.ngOnChanges();
      expect(component.getTooltipPlacement(1)).toBe('right');
      expect(component.getTooltipPlacement(4)).toBe('left');
    });
  });

  it('[getContractorTerminationTooltip] - get message', () =>
    expect(component.getContractorTerminationTooltip(new Date())).toBe('This person left the team on June, 21, 2018')
  );

  it('[getCostPerUnitTooltip] - get message', () =>
    expect(component.getCostPerUnitTooltip(1)).toBe('Cost per Unit: $1.00')
  );

  it('[openJira] - naviate to jira', () => {
    spyOn(window, 'open');
    component.openJira('');
    expect(window.open).not.toHaveBeenCalled();
    component.openJira('url');
    expect(window.open).toHaveBeenCalledWith('url', '_blank');
  });

  it('[getUnitsPerWeekTooltip] - get message', () => {
    const item1 = {
      metric: 1
    } as TeamMetricRecord;
    expect(component.getUnitsPerWeekTooltip(item1)).toBe('Units per Week: 1.00');
    const item2 = {
      metric: 0
    } as TeamMetricRecord;
    expect(component.getUnitsPerWeekTooltip(item2)).toBe('Units per Week: 0.00');
  });

  it('[getCostAndTotalsTooltip] - get message', () => {
    const item = {
      weeks: {
        'week1': {
          ticketsResolved: 1,
          weekSalary: 1
        } as WeekMetrics
      } as { [key: string]: WeekMetrics }
    } as TeamMetricRecord;
    expect(component.getCostAndTotalsTooltip(item, 'week1')).toBe('Total Units: 1.00<br>Salary: $1.00' );
  });

  it('[columnSortName] - sort by name', () => {
    const item1 = [
      {
        teamRecord: true,
        name: 'a'
      },
      {
        teamRecord: false,
        name: 'b'
      }
    ] as TeamMetricRecord[];
    component.columnSortName(item1, '', 1);
    expect(item1[0].name).toBe('a');
    const item2 = [
      {
        teamRecord: false,
        name: 'a'
      },
      {
        teamRecord: true,
        name: 'b'
      }
    ] as TeamMetricRecord[];
    component.columnSortName(item2, '', 1);
    expect(item2[0].name).toBe('b');
    const item3 = [
      {
        teamRecord: false,
        name: 'a'
      },
      {
        teamRecord: false,
        name: 'b'
      }
    ] as TeamMetricRecord[];
    component.columnSortName(item3, '', 1);
    expect(item3[0].name).toBe('a');
    const item4 = [
      {
        teamRecord: false,
        name: 'b'
      },
      {
        teamRecord: false,
        name: 'a'
      }
    ] as TeamMetricRecord[];
    component.columnSortName(item4, '', 1);
    expect(item4[0].name).toBe('a');
  });

  it('[columnSortMetric] - sort by metric', () => {
    const item1 = [
      {
        teamRecord: true,
        metric: 1
      },
      {
        teamRecord: false,
        metric: 2
      }
    ] as TeamMetricRecord[];
    component.columnSortMetric(item1, '', 1);
    expect(item1[0].metric).toBe(1);
    const item2 = [
      {
        teamRecord: false,
        metric: 1
      },
      {
        teamRecord: true,
        metric: 2
      }
    ] as TeamMetricRecord[];
    component.columnSortMetric(item2, '', 1);
    expect(item2[0].metric).toBe(2);
    const item3 = [
      {
        teamRecord: false,
        metric: 1
      },
      {
        teamRecord: false,
        metric: 2
      }
    ] as TeamMetricRecord[];
    component.columnSortMetric(item3, '', 1);
    expect(item3[0].metric).toBe(1);
    const item4 = [
      {
        teamRecord: false,
        metric: 2
      },
      {
        teamRecord: false,
        metric: 1
      }
    ] as TeamMetricRecord[];
    component.columnSortMetric(item4, '', 1);
    expect(item4[0].metric).toBe(1);
  });

  it('[columnSortTicketsResolved] - sort by tickets resolved', () => {
    const item = [
      {
        weeks: {
          'week1': {
            ticketsResolved: 1
          } as WeekMetrics
        } as { [key: string]: WeekMetrics }
      },
      {
        weeks: {
          'week1': {
            ticketsResolved: 2
          } as WeekMetrics
        } as { [key: string]: WeekMetrics }
      }
    ] as TeamMetricRecord[];
    component.columnSortTicketsResolved(item, 'week1', 1);
  });

  it('[columnSortWeekSalary] - sort by week salary', () => {
    const item = [
      {
        weeks: {
          'week1': {
            cost: 1
          } as WeekMetrics
        } as { [key: string]: WeekMetrics }
      },
      {
        weeks: {
          'week1': {
            cost: 2
          } as WeekMetrics
        } as { [key: string]: WeekMetrics }
      }
    ] as TeamMetricRecord[];
    component.columnSortWeekSalary(item, 'week1', 1);
  });

  it('[columnSortCost] - sort by cost', () => {
    const item1 = [
      {
        teamRecord: true,
        cost: 1
      },
      {
        teamRecord: false,
        cost: 2
      }
    ] as TeamMetricRecord[];
    component.columnSortCost(item1, '', 1);
    expect(item1[0].cost).toBe(1);
    const item2 = [
      {
        teamRecord: false,
        cost: 1
      },
      {
        teamRecord: true,
        cost: 2
      }
    ] as TeamMetricRecord[];
    component.columnSortCost(item2, '', 1);
    expect(item2[0].cost).toBe(2);
    const item3 = [
      {
        teamRecord: false,
        cost: 1
      },
      {
        teamRecord: false,
        cost: 2
      }
    ] as TeamMetricRecord[];
    component.columnSortCost(item3, '', 1);
    expect(item3[0].cost).toBe(1);
    const item4 = [
      {
        teamRecord: false,
        cost: 2
      },
      {
        teamRecord: false,
        cost: 1
      }
    ] as TeamMetricRecord[];
    component.columnSortCost(item4, '', 1);
    expect(item4[0].cost).toBe(1);
  });
});
