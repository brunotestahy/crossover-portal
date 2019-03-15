import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { GoogleSheetsComponent } from 'app/modules/contractor/pages/team-metrics/settings/google-sheets/google-sheets-settings.component';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { mock } from 'ts-mockito';

import { GOOGLESHEETS } from 'app/core/constants/team-metric-setup/metric-setup-type';
import { MetricSetup } from 'app/core/models/metric';
import { MetricService } from 'app/core/services/metric/metric.service';

describe('GoogleSheetsComponent', () => {
  let component: GoogleSheetsComponent;
  let fixture: ComponentFixture<GoogleSheetsComponent>;
  let metricService: MetricService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [GoogleSheetsComponent],
      imports: [],
      providers: [
        { provide: MetricService, useFactory: () => mock(MetricService) },
        FormBuilder
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleSheetsComponent);
    component = fixture.componentInstance;
    metricService = TestBed.get(MetricService);
  });


  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit] should create form and get QAuth Url successfully', () => {
    const qAuthUrl = 'test url';
    spyOn(metricService, 'getQAuthUrl').and.returnValue(of(qAuthUrl));
    fixture.detectChanges();
    expect(component.formGroup).toBeTruthy();
    expect(metricService.getQAuthUrl).toHaveBeenCalledWith();
  });

  it('[ngOnInit] should create form and get error while fetching QAuth Url', () => {
    spyOn(metricService, 'getQAuthUrl').and.returnValue(ErrorObservable.create({}));
    fixture.detectChanges();
    expect(component.formGroup).toBeTruthy();
    expect(metricService.getQAuthUrl).toHaveBeenCalledWith();
    expect(component.error).toBe('Error fetching QAuth Url.');
  });

  it('[ngOnInit] should set validation on password control when accessMethod is SHARED', () => {
    const SHARED = 'SHARED';
    const OAUTH = 'OAUTH';
    const qAuthUrl = 'test url';
    spyOn(metricService, 'getQAuthUrl').and.returnValue(of(qAuthUrl));
    component.metricSetup = { spreadsheetAccess: SHARED } as MetricSetup;
    fixture.detectChanges();
    component.formGroup.patchValue(
      { accessMethod: OAUTH }
    );
    expect(component.formGroup).toBeTruthy();
    expect(metricService.getQAuthUrl).toHaveBeenCalledWith();
  });

  it('[ngOnInit] should cclear validation on password control when accessMethod is OAUTH', () => {
    const SHARED = 'SHARED';
    const OAUTH = 'OAUTH';
    const qAuthUrl = 'test url';
    spyOn(metricService, 'getQAuthUrl').and.returnValue(of(qAuthUrl));
    component.metricSetup = { spreadsheetAccess: SHARED } as MetricSetup;
    fixture.detectChanges();
    component.formGroup.patchValue(
      { accessMethod: OAUTH }
    );
    component.formGroup.patchValue(
      { accessMethod: SHARED }
    );
    expect(component.formGroup).toBeTruthy();
    expect(metricService.getQAuthUrl).toHaveBeenCalledWith();
  });

  it('should close settings model successfully', () => {
    spyOn(component.close, 'emit');
    component.onClose();
    expect(component.close.emit).toHaveBeenCalledWith();
  });

  it('should show metric sources successfully', () => {
    spyOn(component.showSources, 'emit');
    component.showMetricSources();
    expect(component.showSources.emit).toHaveBeenCalledWith();
  });

  it('should setup metric successfully when accessMethod is SHARED', () => {
    const qAuthUrl = 'test url';
    const teamId = 1;
    spyOn(metricService, 'getQAuthUrl').and.returnValue(of(qAuthUrl));
    spyOn(metricService, 'setupOrUpdateMetrics').and.returnValue(of({}));
    spyOn(component.update, 'emit');
    spyOn(component, 'onClose');
    component.teamId = teamId;
    component.metricSetup = {
      type: GOOGLESHEETS,
      active: true,
      currentTeamMetric: true
    };
    fixture.detectChanges();
    const SHARED = 'SHARED';
    component.formGroup.patchValue({
      sheetUrl: 'test url',
      name: 'test name',
      host: 'test host',
      metricName: 'test name',
      metricTarget: 'test target',
      accessMethod: SHARED,
      template: 'test worksheet',
    });
    const teamMetric = {
      id: component.metricSetup.id,
      active: true,
      currentTeamMetric: true,
      host: component.formGroup.controls.sheetUrl.value,
      metricName: component.formGroup.controls.name.value,
      metricTarget: component.formGroup.controls.metricTarget.value,
      spreadsheetAccess: component.formGroup.controls.accessMethod.value,
      type: GOOGLESHEETS,
      worksheetName: component.formGroup.controls.template.value
    };
    component.saveSetup();
    expect(metricService.setupOrUpdateMetrics).toHaveBeenCalledWith(teamId, teamMetric);
    expect(component.update.emit).toHaveBeenCalledWith();
    expect(component.onClose).toHaveBeenCalledWith();
  });

  it('should setup metric successfully when accessMethod is OAUTH', () => {
    const qAuthUrl = 'test url';
    const teamId = 1;
    spyOn(metricService, 'getQAuthUrl').and.returnValue(of(qAuthUrl));
    spyOn(metricService, 'setupOrUpdateMetrics').and.returnValue(of({}));
    spyOn(component.update, 'emit');
    spyOn(component, 'onClose');
    component.teamId = teamId;
    component.metricSetup = {
      type: GOOGLESHEETS,
      active: true,
      currentTeamMetric: true
    };
    fixture.detectChanges();
    const OAUTH = 'OAUTH';
    component.formGroup.patchValue({
      sheetUrl: 'test url',
      name: 'test name',
      host: 'test host',
      metricName: 'test name',
      metricTarget: 'test target',
      accessMethod: OAUTH,
      template: 'test worksheet',
      password: 'test password'
    });
    const teamMetric = {
      id: component.metricSetup.id,
      active: true,
      currentTeamMetric: true,
      host: component.formGroup.controls.sheetUrl.value,
      metricName: component.formGroup.controls.name.value,
      metricTarget: component.formGroup.controls.metricTarget.value,
      spreadsheetAccess: component.formGroup.controls.accessMethod.value,
      type: GOOGLESHEETS,
      worksheetName: component.formGroup.controls.template.value,
      password: component.formGroup.controls.password.value
    };
    component.saveSetup();
    expect(metricService.setupOrUpdateMetrics).toHaveBeenCalledWith(teamId, teamMetric);
    expect(component.update.emit).toHaveBeenCalledWith();
    expect(component.onClose).toHaveBeenCalledWith();
  });

  it('should throw error while setup metric', () => {
    const qAuthUrl = 'test url';
    const teamId = 1;
    spyOn(metricService, 'getQAuthUrl').and.returnValue(of(qAuthUrl));
    spyOn(metricService, 'setupOrUpdateMetrics').and.returnValue(ErrorObservable.create({}));
    component.teamId = teamId;
    component.metricSetup = {
      type: GOOGLESHEETS,
      active: true,
      currentTeamMetric: true
    };
    fixture.detectChanges();
    const SHARED = 'SHARED';
    component.formGroup.patchValue({
      sheetUrl: 'test url',
      name: 'test name',
      host: 'test host',
      metricName: 'test name',
      metricTarget: 'test target',
      accessMethod: SHARED,
      template: 'test worksheet',
    });
    const teamMetric = {
      id: component.metricSetup.id,
      active: true,
      currentTeamMetric: true,
      host: component.formGroup.controls.sheetUrl.value,
      metricName: component.formGroup.controls.name.value,
      metricTarget: component.formGroup.controls.metricTarget.value,
      spreadsheetAccess: component.formGroup.controls.accessMethod.value,
      type: GOOGLESHEETS,
      worksheetName: component.formGroup.controls.template.value
    };
    component.saveSetup();
    expect(metricService.setupOrUpdateMetrics).toHaveBeenCalledWith(teamId, teamMetric);
    expect(component.error).toBe('Error updating metric setup.');
  });

  it('should throw error with error text while setup metric', () => {
    const qAuthUrl = 'test url';
    const teamId = 1;
    spyOn(metricService, 'getQAuthUrl').and.returnValue(of(qAuthUrl));
    spyOn(metricService, 'setupOrUpdateMetrics').and.returnValue(ErrorObservable.create({
      error: {
        errorCode: 'CROS-0027',
        httpStatus: 400,
        type: 'ERROR',
        text: 'Sample error text',
      },
    }));
    component.teamId = teamId;
    component.metricSetup = {
      type: GOOGLESHEETS,
      active: true,
      currentTeamMetric: true
    };
    fixture.detectChanges();
    const SHARED = 'SHARED';
    component.formGroup.patchValue({
      sheetUrl: 'test url',
      name: 'test name',
      host: 'test host',
      metricName: 'test name',
      metricTarget: 'test target',
      accessMethod: SHARED,
      template: 'test worksheet',
    });
    const teamMetric = {
      id: component.metricSetup.id,
      active: true,
      currentTeamMetric: true,
      host: component.formGroup.controls.sheetUrl.value,
      metricName: component.formGroup.controls.name.value,
      metricTarget: component.formGroup.controls.metricTarget.value,
      spreadsheetAccess: component.formGroup.controls.accessMethod.value,
      type: GOOGLESHEETS,
      worksheetName: component.formGroup.controls.template.value
    };
    component.saveSetup();
    expect(metricService.setupOrUpdateMetrics).toHaveBeenCalledWith(teamId, teamMetric);
    expect(component.error).toBe('Sample error text');
  });
});
