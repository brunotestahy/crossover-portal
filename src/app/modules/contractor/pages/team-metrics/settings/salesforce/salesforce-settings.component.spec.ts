import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { mock } from 'ts-mockito';

import { SALESFORCE } from 'app/core/constants/team-metric-setup/metric-setup-type';
import { MetricSetup, TeamSetup } from 'app/core/models/metric';
import { MetricService } from 'app/core/services/metric/metric.service';
import { SalesforceSettingsComponent } from 'app/modules/contractor/pages/team-metrics/settings/salesforce/salesforce-settings.component';

describe('SalesforceSettingsComponent', () => {
  let component: SalesforceSettingsComponent;
  let fixture: ComponentFixture<SalesforceSettingsComponent>;
  let metricService: MetricService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SalesforceSettingsComponent],
      imports: [],
      providers: [
        { provide: MetricService, useFactory: () => mock(MetricService) },
        FormBuilder
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesforceSettingsComponent);
    component = fixture.componentInstance;
    metricService = TestBed.get(MetricService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit] should create form', () => {
    fixture.detectChanges();
    expect(component.formGroup).toBeTruthy();
  });

  it('should show metric sources', () => {
    spyOn(component.showSources, 'emit');
    component.showMetricSources();
    expect(component.showSources.emit).toHaveBeenCalledWith();
  });
  describe('[saveMetricSetup] when user is team owner/admin', () => {
    beforeEach(() => {
      component.isTeamOwnerOrAdmin = true;
      component.teamId = 1;
      fixture.detectChanges();
      component.formGroup.controls['name'].setValue('test name');
      component.formGroup.controls['metricTarget'].setValue('test target');
    });

    it('should create metric setup successfully', () => {
      spyOn(metricService, 'setupOrUpdateMetrics').and.returnValue(of({}));
      const teamMetric = {
        active: true,
        currentTeamMetric: true,
        id: component.metricSetup.id,
        metricName: component.formGroup.controls.name.value,
        metricTarget: component.formGroup.controls.metricTarget.value,
        type: SALESFORCE,
      } as TeamSetup;
      component.saveMetricSetup();
      expect(metricService.setupOrUpdateMetrics).toHaveBeenCalledWith(component.teamId, teamMetric);
    });

    it('should throw error while creating metric setup', () => {
      spyOn(metricService, 'setupOrUpdateMetrics').and.returnValue(ErrorObservable.create({}));
      const teamMetric = {
        active: true,
        currentTeamMetric: true,
        id: component.metricSetup.id,
        metricName: component.formGroup.controls.name.value,
        metricTarget: component.formGroup.controls.metricTarget.value,
        type: SALESFORCE,
      } as TeamSetup;

      component.saveMetricSetup();

      expect(metricService.setupOrUpdateMetrics).toHaveBeenCalledWith(component.teamId, teamMetric);
      expect(component.error).toBe('Error updating metric config.');
    });

    it('should update metric setup successfully', () => {
      spyOn(metricService, 'setupOrUpdateMetrics').and.returnValue(of({}));
      component.metricSetup = { id: 1 } as MetricSetup;
      const teamMetric = {
        active: true,
        currentTeamMetric: true,
        id: component.metricSetup.id,
        metricName: component.formGroup.controls.name.value,
        metricTarget: component.formGroup.controls.metricTarget.value,
        type: SALESFORCE,
      } as TeamSetup;

      component.saveMetricSetup();

      expect(metricService.setupOrUpdateMetrics).toHaveBeenCalledWith(component.teamId, teamMetric);
    });

    it('should throw error while creating metric setup', () => {
      spyOn(metricService, 'setupOrUpdateMetrics').and.returnValue(ErrorObservable.create({}));
      component.metricSetup = { id: 1 } as MetricSetup;
      const teamMetric = {
        active: true,
        currentTeamMetric: true,
        id: component.metricSetup.id,
        metricName: component.formGroup.controls.name.value,
        metricTarget: component.formGroup.controls.metricTarget.value,
        type: SALESFORCE,
      } as TeamSetup;

      component.saveMetricSetup();

      expect(metricService.setupOrUpdateMetrics).toHaveBeenCalledWith(component.teamId, teamMetric);
      expect(component.error).toBe('Error updating metric config.');
    });
  });

  it('should close modal successfully when user in not owner of team and user is empty or not changed', () => {
    component.isTeamOwnerOrAdmin = false;
    component.teamId = 1;
    fixture.detectChanges();
    component.formGroup.controls['name'].setValue('test name');
    component.formGroup.controls['metricTarget'].setValue('test target');
    spyOn(component.update, 'emit');
    spyOn(component, 'onClose');
    spyOn(metricService, 'updateContractorMetricConfig').and.returnValue(of({}));
    component.isTeamOwnerOrAdmin = false;
    component.users = [];

    component.saveMetricSetup();

    expect(component.onClose).toHaveBeenCalledWith();
  });
});
