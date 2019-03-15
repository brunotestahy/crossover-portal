import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { mock } from 'ts-mockito';

import * as METRIC_TYPE from 'app/core/constants/team-metric-setup/metric-setup-type';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { MetricService } from 'app/core/services/metric/metric.service';
import { METRIC_SETUP } from 'app/core/services/mocks/metric-setup.mock';
import { TEAM_METRICS_SETTING } from 'app/core/services/mocks/team-metric-setting.mock';
import { TeamMetricsSettingsComponent } from 'app/modules/contractor/pages/team-metrics/settings/team-metrics-settings.component';

describe('TeamMetricsSettingsComponent', () => {
  let component: TeamMetricsSettingsComponent;
  let fixture: ComponentFixture<typeof component>;
  let identityService: IdentityService;
  let metricService: MetricService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TeamMetricsSettingsComponent,
      ],
      providers: [
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: MetricService, useFactory: () => mock(MetricService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMetricsSettingsComponent);
    component = fixture.componentInstance;
    identityService = TestBed.get(IdentityService);
    metricService = TestBed.get(MetricService);
  });

  it('should be created', () => expect(component).toBeTruthy());

  it('should get team and manager selection successfully', () => {
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
      team: {
        id: 1,
      },
      managerId: 1,
    }));
    spyOn(identityService, 'currentUserIsAdmin').and.returnValue(of(true));
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({}));
    spyOn(component, 'getMetricsSetup');
    fixture.detectChanges();
    expect(identityService.getTeamManagerGroupSelection).toHaveBeenCalled();
    expect(component.teamId).toBe(1);
    expect(component.managerId).toBe(1);
    expect(component.getMetricsSetup).toHaveBeenCalledWith(component.teamId);
  });

  it('should get undefined while fetching team and manager selection successfully', () => {
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of(undefined));
    spyOn(identityService, 'currentUserIsAdmin').and.returnValue(of(true));
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({}));
    spyOn(component, 'getMetricsSetup');
    fixture.detectChanges();
    expect(identityService.getTeamManagerGroupSelection).toHaveBeenCalled();
    expect(component.teamId).toBe(null);
    expect(component.managerId).toBe(null);
    expect(component.getMetricsSetup).toHaveBeenCalledWith(component.teamId);
  });

  it('should get error while fetching team and manager selection', () => {
    spyOn(identityService, 'currentUserIsAdmin').and.returnValue(of(true));
    spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(ErrorObservable.create({}));
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({}));
    fixture.detectChanges();
    expect(identityService.getTeamManagerGroupSelection).toHaveBeenCalled();
    expect(component.error).toBe('Error loading selected team and manager.');
  });

  it('should get metrics setup successfully', () => {
    const teamId = 1;
    spyOn(metricService, 'getMetricsSetup').and.returnValue(of(METRIC_SETUP));
    spyOn(component, 'getTeamMetricSetting');
    component.getMetricsSetup(teamId);
    expect(metricService.getMetricsSetup).toHaveBeenCalledWith(teamId);
    expect(component.getTeamMetricSetting).toHaveBeenCalled();
  });

  it('should get no metrics setup successfully', () => {
    const teamId = 1;
    spyOn(metricService, 'getMetricsSetup').and.returnValue(of([]));
    spyOn(component, 'getTeamMetricSetting');
    component.getMetricsSetup(teamId);
    expect(metricService.getMetricsSetup).toHaveBeenCalledWith(teamId);
    expect(component.getTeamMetricSetting).toHaveBeenCalled();
  });

  it('should get error while fetching metrics setup', () => {
    const teamId = 1;
    spyOn(metricService, 'getMetricsSetup').and.returnValue(ErrorObservable.create({}));
    component.getMetricsSetup(teamId);
    expect(metricService.getMetricsSetup).toHaveBeenCalledWith(teamId);
    expect(component.error).toBe('Error getting metrics setup');
  });

  it('should get team metric setting successfully', () => {
    component.teamId = 1;
    component.managerId = 1;
    spyOn(metricService, 'getTeamMetricSetting').and.returnValues(of(TEAM_METRICS_SETTING));
    component.getTeamMetricSetting();
    expect(metricService.getTeamMetricSetting).toHaveBeenCalledWith(component.teamId, component.managerId);
  });

  it('should set error while fething team metric setting', () => {
    component.teamId = 1;
    component.managerId = 1;
    spyOn(metricService, 'getTeamMetricSetting').and.returnValue(ErrorObservable.create({}));
    component.getTeamMetricSetting();
    expect(metricService.getTeamMetricSetting).toHaveBeenCalledWith(component.teamId, component.managerId);
    expect(component.error).toBe('Error getting team metric settings');
  });

  it('should emit close function successfully', () => {
    spyOn(component.close, 'emit').and.returnValue({});
    component.onClose();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should show jira modal if showSouce is false and modal name is jira', () => {
    component.showSources = false;
    component.activeMetric = { type: METRIC_TYPE.JIRA, active: true, currentTeamMetric: true };
    const isVisible = component.isModalVisible(METRIC_TYPE.JIRA);
    expect(isVisible).toBe(true);
  });

  it('should not show jira modal if showSouce is true and modal name is jira', () => {
    component.showSources = true;
    const isVisible = component.isModalVisible(METRIC_TYPE.JIRA);
    expect(isVisible).toBe(false);
  });

  it('should change modal successfully', () => {
    const modalName = METRIC_TYPE.JIRA;
    const newActiveMetric = {
      type: modalName,
      active: true,
      currentTeamMetric: true
    };
    component.activeMetric = { type: METRIC_TYPE.SALESFORCE, active: true, currentTeamMetric: true };
    component.onChangeModal(modalName);
    expect(component.activeMetric).toEqual(newActiveMetric);
    expect(component.showSources).toBe(false);
  });

  it('should show setting sources', () => {
    component.showSettingSources();
    expect(component.showSources).toBe(true);
  });
});
