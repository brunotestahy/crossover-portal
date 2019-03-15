import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  TeamSummaryChartComponent,
} from 'app/modules/contractor/components/team-summary-chart/team-summary-chart.component';

describe('TeamSummaryChartComponent', () => {
  let component: TeamSummaryChartComponent;
  let fixture: ComponentFixture<typeof component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TeamSummaryChartComponent,
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamSummaryChartComponent);
    component = fixture.componentInstance;
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-06-21T05:45:00'));
  });

  afterEach(() => jasmine.clock().uninstall());

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve the success trending class when the value is over 69% of the max value', () => {
    const result = TeamSummaryChartComponent.getTrendClass(70, 100);

    expect(result.cssClass).toBe('success');
  });

  it('should retrieve normalized bar value successfully', () => {
    const result = TeamSummaryChartComponent.normalizeBarValue(70, 1000);

    expect(result).toBe(700);
  });

  it('should format data successfully', () => {
    const value = 5;
    const result = component.tickFormatter(value);

    expect(result).toEqual(value.toString());
  });

  it('should initialize the component successfully', () => {
    const data = {
      productivitySummary: {
        intensityScoreAvg: [1, 2, 3, 4, 5],
        focusScoreAvg: [1, 2, 3, 4, 5],
        activityMetricsAvg: [1, 2, 3, 4, 5],
        metricsStatsAvg: [1, 2, 3, 4, 5],
        weeklyHoursAvg: [1, 2, 3, 4, 5],
        activeAssignmentsCount: [10],
      },
    };
    component.summary = Object.assign(data);
    component.chunkSize = 5;
    component.endDate = new Date();

    fixture.detectChanges();

    expect(component.chartEntries[0].group).toBe('May 24');
  });

  it('should trigger a chart click when a team is associated to the component', () => {
    const teamId = 1;
    component.teamId = teamId;
    component.clickOnChart.subscribe((value: number) => expect(value).toBe(teamId));

    component.onChartClick();
  });

  it('should not trigger a chart click when no team is associated to the component', () => {
    const listener = jasmine.createSpy('listener');
    component.clickOnChart.subscribe(listener);

    component.onChartClick();
    expect(listener).not.toHaveBeenCalled();
  });
});
