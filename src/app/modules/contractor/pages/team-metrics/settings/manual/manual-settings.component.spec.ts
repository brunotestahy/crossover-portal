import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { endOfWeek, format, startOfWeek, subWeeks } from 'date-fns';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { mock } from 'ts-mockito';

import { EventWithInputTarget } from 'app/core/models/browser';
import { MetricSetup } from 'app/core/models/metric';
import { MetricService } from 'app/core/services/metric/metric.service';
import { TEAM_METRIC_VALUES } from 'app/core/services/mocks/team-metric-values.mock';
import { ManualSettingsComponent } from 'app/modules/contractor/pages/team-metrics/settings/manual/manual-settings.component';

describe('ManualSettingsComponent', () => {
  let component: ManualSettingsComponent;
  let fixture: ComponentFixture<ManualSettingsComponent>;
  let metricService: MetricService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ManualSettingsComponent],
      imports: [],
      providers: [
        { provide: MetricService, useFactory: () => mock(MetricService) },
        FormBuilder
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-06-18'));

    fixture = TestBed.createComponent(ManualSettingsComponent);
    component = fixture.componentInstance;
    metricService = TestBed.get(MetricService);
  });

  afterEach(() => jasmine.clock().uninstall());

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit] should get metric values successfully', () => {
    const startOfIsoWeek = { weekStartsOn: 1 };
    const from = subWeeks(startOfWeek(component.todaysDate, startOfIsoWeek), component.maxWeekCount);
    const to = endOfWeek(component.todaysDate, startOfIsoWeek);
    const params = {
      teamId: component.teamId,
      from: format(from, 'YYYY-MM-DD'),
      to: format(to, 'YYYY-MM-DD'),
      costInclusive: false,
      managerId: component.managerId,
    };
    spyOn(metricService, 'getTeamMetricsValuesV2').and.returnValue(of(TEAM_METRIC_VALUES));
    component.metricSetup = { metricName: 'test', metricTarget: 1 } as MetricSetup;
    fixture.detectChanges();
    expect(component.formGroup).toBeTruthy();
    expect(metricService.getTeamMetricsValuesV2).toHaveBeenCalledWith(params);
  });

  it('should show metric sources successfully', () => {
    spyOn(component.showSources, 'emit');
    component.showMetricSources();
    expect(component.showSources.emit).toHaveBeenCalledWith();
  });

  it('should get metric values successfully', () => {
    const startOfIsoWeek = { weekStartsOn: 1 };
    const from = subWeeks(startOfWeek(component.todaysDate, startOfIsoWeek), component.maxWeekCount);
    const to = endOfWeek(component.todaysDate, startOfIsoWeek);
    const params = {
      teamId: component.teamId,
      from: format(from, 'YYYY-MM-DD'),
      to: format(to, 'YYYY-MM-DD'),
      costInclusive: false,
      managerId: component.managerId,
    };
    spyOn(metricService, 'getTeamMetricsValuesV2').and.returnValue(of(TEAM_METRIC_VALUES));
    component.getMetricValues(from, to);
    expect(metricService.getTeamMetricsValuesV2).toHaveBeenCalledWith(params);
  });

  it('should throw error while getting metric values', () => {
    const startOfIsoWeek = { weekStartsOn: 1 };
    const from = subWeeks(startOfWeek(component.todaysDate, startOfIsoWeek), component.maxWeekCount);
    const to = endOfWeek(component.todaysDate, startOfIsoWeek);
    const params = {
      teamId: component.teamId,
      from: format(from, 'YYYY-MM-DD'),
      to: format(to, 'YYYY-MM-DD'),
      costInclusive: false,
      managerId: component.managerId,
    };
    spyOn(metricService, 'getTeamMetricsValuesV2').and.returnValue(ErrorObservable.create({}));
    component.getMetricValues(from, to);
    expect(metricService.getTeamMetricsValuesV2).toHaveBeenCalledWith(params);
    expect(component.error).toBe('Error fetching metric values.');
  });

  it('should show next Four Weeks when selectedWeekIndex is 0', () => {
    component.selectedWeekIndex = 0;
    const newWeekIndex = 1;
    const startWeekIndex = 4;
    const endWeekIndex = 8;
    component.nextFourWeeks();
    expect(component.selectedWeekIndex).toBe(newWeekIndex);
    expect(component.startWeekIndex).toBe(startWeekIndex);
    expect(component.endWeekIndex).toBe(endWeekIndex);
  });

  it('should show next Four Weeks when selectedWeekIndex is 1', () => {
    component.selectedWeekIndex = 1;
    const newWeekIndex = 2;
    const startWeekIndex = 8;
    const endWeekIndex = 13;
    component.nextFourWeeks();
    expect(component.selectedWeekIndex).toBe(newWeekIndex);
    expect(component.startWeekIndex).toBe(startWeekIndex);
    expect(component.endWeekIndex).toBe(endWeekIndex);
  });

  it('should disable nextFourWeeks button when selectedWeekIndex is 2', () => {
    component.selectedWeekIndex = 2;
    component.nextFourWeeks();
    expect(component.selectedWeekIndex).toBe(component.selectedWeekIndex);
  });

  it('should set start and end weeK index successfully', () => {
    component.startWeekIndex = 0;
    component.endWeekIndex = 4;
    component.selectedWeekIndex = 3;
    component.startEndWeeKIndex();
    expect(component.startWeekIndex).toBe(0);
    expect(component.endWeekIndex).toBe(4);
  });

  it('should disable previousFourWeeks button when selectedWeekIndex is 0', () => {
    component.selectedWeekIndex = 0;
    component.previousFourWeeks();
    expect(component.selectedWeekIndex).toBe(component.selectedWeekIndex);
  });

  it('should show previous Four Weeks when selectedWeekIndex is 1', () => {
    component.selectedWeekIndex = 1;
    const newWeekIndex = 0;
    const startWeekIndex = 0;
    const endWeekIndex = 4;
    component.previousFourWeeks();
    expect(component.selectedWeekIndex).toBe(newWeekIndex);
    expect(component.startWeekIndex).toBe(startWeekIndex);
    expect(component.endWeekIndex).toBe(endWeekIndex);
  });

  it('should show previous Four Weeks when selectedWeekIndex is 2', () => {
    component.selectedWeekIndex = 2;
    const newWeekIndex = 1;
    const startWeekIndex = 4;
    const endWeekIndex = 8;
    component.previousFourWeeks();
    expect(component.selectedWeekIndex).toBe(newWeekIndex);
    expect(component.startWeekIndex).toBe(startWeekIndex);
    expect(component.endWeekIndex).toBe(endWeekIndex);
  });

  it('should disable Previous button when selectedWeekIndex is 0', () => {
    component.selectedWeekIndex = 0;
    expect(component.isPreviousDisabled()).toBe(true);
  });

  it('should enable Previous button when selectedWeekIndex is greater then 0', () => {
    component.selectedWeekIndex = 1;
    expect(component.isPreviousDisabled()).toBe(false);
  });

  it('should disable next button when selectedWeekIndex is 2', () => {
    component.selectedWeekIndex = 2;
    expect(component.isNextDisabled()).toBe(true);
  });

  it('should enable next button when selectedWeekIndex is less then 2', () => {
    component.selectedWeekIndex = 1;
    expect(component.isNextDisabled()).toBe(false);
  });

  it('should update metric Setup successfully', () => {
    spyOn(metricService, 'setupOrUpdateMetrics').and.returnValue(of({}));
    spyOn(metricService, 'saveContractorManualMetric').and.returnValue(of({}));
    spyOn(metricService, 'getTeamMetricsValuesV2').and.returnValue(of(TEAM_METRIC_VALUES));
    component.metricSetup = { metricName: 'test', metricTarget: 1, id: 1 } as MetricSetup;
    fixture.detectChanges();
    component.saveSetup();
    const teamId = component.teamId;
    const teamMetric = { active: true, currentTeamMetric: true, metricName: 'test', metricTarget: 1, type: 'MANUAL', id: 1 };
    expect(metricService.setupOrUpdateMetrics).toHaveBeenCalledWith(teamId, teamMetric);
    expect(metricService.saveContractorManualMetric).toHaveBeenCalledTimes(1);
  });

  it('should set metric Setup successfully', () => {
    spyOn(metricService, 'setupOrUpdateMetrics').and.returnValue(of({}));
    spyOn(metricService, 'saveContractorManualMetric').and.returnValue(of({}));
    spyOn(metricService, 'getTeamMetricsValuesV2').and.returnValue(of(TEAM_METRIC_VALUES));
    component.metricSetup = { metricName: 'test', metricTarget: 1 } as MetricSetup;
    fixture.detectChanges();
    component.saveSetup();
    const teamId = component.teamId;
    const teamMetric = { active: true, currentTeamMetric: true, metricName: 'test', metricTarget: 1, type: 'MANUAL' };
    expect(metricService.setupOrUpdateMetrics).toHaveBeenCalledWith(teamId, teamMetric);
    expect(metricService.saveContractorManualMetric).toHaveBeenCalledTimes(1);
  });

  it('should throw error while saving metric Setup', () => {
    spyOn(metricService, 'setupOrUpdateMetrics').and.returnValue(ErrorObservable.create({}));
    spyOn(metricService, 'saveContractorManualMetric').and.returnValue(ErrorObservable.create({}));
    spyOn(metricService, 'getTeamMetricsValuesV2').and.returnValue(of(TEAM_METRIC_VALUES));
    component.metricSetup = { metricName: 'test', metricTarget: 1, id: 1 } as MetricSetup;
    fixture.detectChanges();
    component.saveSetup();
    const teamId = component.teamId;
    const teamMetric = { active: true, currentTeamMetric: true, metricName: 'test', metricTarget: 1, type: 'MANUAL', id: 1 };
    expect(metricService.setupOrUpdateMetrics).toHaveBeenCalledWith(teamId, teamMetric);
    expect(metricService.saveContractorManualMetric).toHaveBeenCalledTimes(1);
    expect(component.error).toBe('Error updating metric setup.');
  });

  it('should getFieldValue successfully', () => {
    component.selectedWeekIndex = 0;
    const item = {
      name: 'test',
      contractorId: 1,
      weeks: {
        week0: {
          activeWeek: true,
          hoursWorked: 0,
          id: 1,
          startDate: 'test',
          ticketsResolved: 1,
          type: 'test',
          weekSalary: 0,
          cost: 0
        }
      }
    };
    const index = 0;
    expect(component.getFieldValue(item, index)).toBe(1);
  });

  it('should retun zero when no weeks available while getting getFieldValue', () => {
    component.selectedWeekIndex = 0;
    const item = {
      name: 'test',
      contractorId: 1,
      weeks: {
        week0: {
          activeWeek: true,
          hoursWorked: 0,
          id: 1,
          startDate: 'test',
          ticketsResolved: 0,
          type: 'test',
          weekSalary: 0,
          cost: 0
        }
      }
    };
    const index = 0;
    expect(component.getFieldValue(item, index)).toBe(0);
  });

  it('should isCellEditable successfully', () => {
    component.selectedWeekIndex = 0;
    const item = {
      name: 'test',
      contractorId: 1,
      weeks: {
        week0: {
          activeWeek: true,
          hoursWorked: 0,
          id: 1,
          startDate: 'test',
          ticketsResolved: 0,
          type: 'test',
          weekSalary: 0,
          cost: 0
        }
      }
    };
    const index = 0;
    expect(component.isCellEditable(item, index)).toBe(true);
  });

  it('should return false if week not available', () => {
    component.selectedWeekIndex = 0;
    const item = {
      name: 'test',
      contractorId: 1,
      weeks: {
        week0: {
          activeWeek: false,
          hoursWorked: 0,
          id: 1,
          startDate: 'test',
          ticketsResolved: 0,
          type: 'test',
          weekSalary: 0,
          cost: 0
        }
      }
    };
    const index = 0;
    expect(component.isCellEditable(item, index)).toBe(false);
  });

  it('should update row successfully', () => {
    spyOn(metricService, 'setupOrUpdateMetrics').and.returnValue(of({}));
    spyOn(metricService, 'saveContractorManualMetric').and.returnValue(of({}));
    spyOn(metricService, 'getTeamMetricsValuesV2').and.returnValue(of(TEAM_METRIC_VALUES));
    component.selectedWeekIndex = 0;
    component.metricSetup = { metricName: 'test', metricTarget: 1 } as MetricSetup;
    fixture.detectChanges();
    const event = { target: { value: '2' } } as EventWithInputTarget;
    const item = {
      name: 'test',
      contractorId: 41277,
      weeks: {
        week0: {
          activeWeek: true,
          hoursWorked: 0,
          id: 1,
          startDate: 'test',
          ticketsResolved: 0,
          type: 'test',
          weekSalary: 0,
          cost: 0
        }
      }
    };
    const index = 0;
    component.updateRow(event, item, index);
    expect(component.teamMetrics[0].weeks.week0.ticketsResolved).toBe(2);
  });
});
