import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import * as _ from 'lodash'
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { mock } from 'ts-mockito';

import * as TeamHistoryConstants from 'app/core/constants/team-history';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { MetricService } from 'app/core/services/metric/metric.service';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { TeamHistoryComponent } from 'app/modules/contractor/pages/team-history/team-history.component';
import {
  TeamSelectorStrategyService,
} from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';


describe('TeamHistoryComponent', () => {
  let component: TeamHistoryComponent;
  let fixture: ComponentFixture<typeof component>;

  let identityService: IdentityService;
  let metricService: MetricService;
  let targetWindow: Window;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TeamHistoryComponent,
      ],
      providers: [
        FormBuilder,
        TeamSelectorStrategyService,
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: MetricService, useFactory: () => mock(MetricService) },
        { provide: WINDOW_TOKEN, useValue: {
          setTimeout: (callback: Function) => callback(),
          location: { href: '' },
        }},
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-06-07T03:00:00'));

    fixture = TestBed.createComponent(TeamHistoryComponent);
    component = fixture.componentInstance;
    identityService = TestBed.get(IdentityService);
    metricService = TestBed.get(MetricService);
    targetWindow = TestBed.get(WINDOW_TOKEN);

    _.set(component, 'chart', Object.assign({
      onResize: jasmine.createSpy('onResize'),
    }));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    component.ngOnDestroy();
  });

  it('should be created', () => expect(component).toBeTruthy());

  it('should initialize weekly data successfully', () => {
    const expectedLength = 52;
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: { id: 1 },
    }));
    spyOn(metricService, 'getTeamStatistics').and.returnValue(of([
      { teamSize: 10 },
      { teamSize: 20 },
    ]));
    fixture.detectChanges();

    expect(component.teamHistory.length).toBe(expectedLength);
  });

  it('should initialize monthly data successfully', () => {
    const expectedLength = 12;
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: { id: 1 },
    }));
    spyOn(metricService, 'getTeamStatistics').and.returnValue(of([
      { teamSize: 10 },
      { teamSize: 20 },
    ]));
    component.periodItems[0] = component.periodItems[1];
    fixture.detectChanges();

    expect(component.teamHistory.length).toBe(expectedLength);
  });

  it('should initialize quartetly data successfully', () => {
    const expectedLength = 4;
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: { id: 1 },
    }));
    spyOn(metricService, 'getTeamStatistics').and.returnValue(of([
      { teamSize: 10 },
      { teamSize: 20 },
    ]));
    component.periodItems[0] = component.periodItems[2];
    fixture.detectChanges();

    expect(component.teamHistory.length).toBe(expectedLength);
  });

  it('should set an error message when an error occurs during data retrieval', () => {
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: { id: 1 },
    }));
    spyOn(metricService, 'getTeamStatistics').and.returnValue(_throw({}));

    fixture.detectChanges();

    expect(component.error).toBe('An unknown error happened while loading metrics data.');
  });

  it('should trigger data fetching when the form data is changed', () => {
    spyOn(component, 'fetchTeamHistory');
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of(null));
    fixture.detectChanges();

    expect(component.fetchTeamHistory).not.toHaveBeenCalled();

    component.formGroup.patchValue({ dimension: 'ANY' });

    expect(component.fetchTeamHistory).toHaveBeenCalledWith();
  });

  it('should retrieve team size dimension key successfully', () => {
    component.formGroup = new FormBuilder().group({
      dimension: [TeamHistoryConstants.COST],
    });
    const result = component.getDimensionKey();

    expect(result).toBe('cost');
  });

  it('should retrieve cost per unit dimension key successfully', () => {
    component.formGroup = new FormBuilder().group({
      dimension: [TeamHistoryConstants.COST_PER_UNIT],
    });
    const result = component.getDimensionKey();

    expect(result).toBe('costPerUnit');
  });

  it('should retrieve metric value dimension key successfully', () => {
    component.formGroup = new FormBuilder().group({
      dimension: [TeamHistoryConstants.METRIC],
    });
    const result = component.getDimensionKey();

    expect(result).toBe('metricValue');
  });

  it('should retrieve team size dimension key successfully', () => {
    component.formGroup = new FormBuilder().group({
      dimension: ['ANY'],
    });
    const result = component.getDimensionKey();

    expect(result).toBe('teamSize');
  });

  it('should retrieve the tooltip info successfully', () => {
    const key = Object.assign({ xKey: '1' });
    component.tooltipInfo = [key];
    const result = component.getTooltipInfo(key.xKey);

    expect(result).toEqual(key);
  });

  it('should set weekly story successfully when the selected year is not the current one', () => {
    const values = Object.assign([
      { metricValue: 10 },
      { metricValue: 20 },
    ]);
    component.selectedYear = 2015;
    component.teamHistoryRecords.push(...values);
    let value = 0;
    spyOn(component, 'getWeeklyFormat').and.callFake(() => ++value);
    component.setWeeklyHistory('metricValue');

    expect(component.teamHistory[0].yKey).toBe(10);
  });

  it('should set monthly story successfully when the selected year is not the current one', () => {
    const values = Object.assign([
      { metricValue: 10 },
      { metricValue: 20 },
    ]);
    component.selectedYear = 2015;
    component.teamHistoryRecords.push(...values);
    let value = 0;
    spyOn(component, 'getWeeklyFormat').and.callFake(() => ++value);
    component.setMonthlyHistory('metricValue');

    expect(component.teamHistory[0].yKey).toBe(10);
  });

  it('should set quarterly story successfully when the selected year is not the current one', () => {
    const values = Object.assign([
      { metricValue: 10 },
      { metricValue: 20 },
    ]);
    component.selectedYear = 2015;
    component.teamHistoryRecords.push(...values);
    let value = 0;
    spyOn(component, 'getWeeklyFormat').and.callFake(() => ++value);
    component.setQuarterlyHistory('metricValue');

    expect(component.teamHistory[0].yKey).toBe(10);
  });

  it('should navigate to the previous year when the previous year is available', () => {
    spyOn(component, 'isPreviousYearAvailable').and.returnValue(true);
    spyOn(component, 'fetchTeamHistory');

    const currentYear = 2018;
    component.selectedYear = currentYear;
    component.previousYear();

    expect(component.selectedYear).toBe(currentYear - 1);
    expect(component.fetchTeamHistory).toHaveBeenCalledWith();
  });

  it('should not navigate to the previous year when the previous year is not available', () => {
    spyOn(component, 'isPreviousYearAvailable').and.returnValue(false);
    spyOn(component, 'fetchTeamHistory');

    const currentYear = 2018;
    component.selectedYear = currentYear;
    component.previousYear();

    expect(component.selectedYear).toBe(currentYear);
    expect(component.fetchTeamHistory).not.toHaveBeenCalledWith();
  });

  it('should navigate to the next year when the next year is available', () => {
    spyOn(component, 'isNextYearAvailable').and.returnValue(true);
    spyOn(component, 'fetchTeamHistory');

    const currentYear = 2018;
    component.selectedYear = currentYear;
    component.nextYear();

    expect(component.selectedYear).toBe(currentYear + 1);
    expect(component.fetchTeamHistory).toHaveBeenCalledWith();
  });

  it('should not navigate to the next year when the next year is not available', () => {
    spyOn(component, 'isNextYearAvailable').and.returnValue(false);
    spyOn(component, 'fetchTeamHistory');

    const currentYear = 2018;
    component.selectedYear = currentYear;
    component.nextYear();

    expect(component.selectedYear).toBe(currentYear);
    expect(component.fetchTeamHistory).not.toHaveBeenCalledWith();
  });

  it('should start the download of the CSV data successfully', () => {
    const targetUrl = 'http:/sample/url';
    component.formGroup = new FormBuilder().group({
      period: ['SAMPLE'],
    });
    spyOn(metricService, 'downloadTeamStatisticsUrl').and.returnValue(targetUrl);
    component.downloadCsv();

    expect(targetWindow.location.href).toBe(targetUrl);
  });

  it('should format the X axis when the period value is weekly', () => {
    component.periodValue = TeamHistoryConstants.WEEKLY;
    const validValue = component.xAxisTickFormatter('10', 3);
    const invalidValue = component.xAxisTickFormatter('10', 1);

    expect(validValue).toBe('10');
    expect(invalidValue).toBe('');
  });

  it('should format the X axis when the period value is not weekly', () => {
    component.periodValue = TeamHistoryConstants.MONTHLY;
    const result = component.xAxisTickFormatter('10', 3);

    expect(result).toBe('10');
  });

  it('should format the Y axis when the dimension is cost per unit', () => {
    component.dimensionValue = TeamHistoryConstants.COST_PER_UNIT;
    const result = component.yAxisTickFormatter(10);

    expect(result).toBe('$10.0');
  });

  it('should format the Y axis when the dimension is not cost per unit', () => {
    component.dimensionValue = TeamHistoryConstants.METRIC;
    const result = component.yAxisTickFormatter(10);

    expect(result).toBe('10.0');
  });
});
