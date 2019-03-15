import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DfCheckboxChange, DfGroupToggleItem } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { DownloadService } from 'app/core/services/download/download.service';
import { MetricService } from 'app/core/services/metric/metric.service';
import { METRICS_SUMMARY } from 'app/core/services/mocks/metrics-summary.mock';
import { TEAM_ASSIGNMENT_HISTORIES } from 'app/core/services/mocks/team-assignment-histories.mock';
import { MyMetricPageComponent } from 'app/modules/my-dashboard/pages/my-metric-page/my-metric-page.component';

describe('MyMetricPageComponent', () => {
  let component: MyMetricPageComponent;
  let fixture: ComponentFixture<MyMetricPageComponent>;

  let metricService: MetricService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyMetricPageComponent,
      ],
      providers: [
        { provide: MetricService, useFactory: () => mock(MetricService) },
        { provide: DownloadService, useFactory: () => mock(DownloadService) },
        FormBuilder,
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMetricPageComponent);
    component = fixture.componentInstance;

    metricService = TestBed.get(MetricService);
    component.userDetail = Object.assign({ firstName: 'test', lastName: 'test' });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit] should get current user detail and team assignment histories', () => {
    spyOn(metricService, 'getTeamAssignmentHistories').and.returnValue(of(TEAM_ASSIGNMENT_HISTORIES));
    spyOn(metricService, 'getTeamAssignmentMetricsSummary').and.returnValue(of(METRICS_SUMMARY));
    fixture.detectChanges();
    expect(metricService.getTeamAssignmentHistories).toHaveBeenCalled();
    expect(metricService.getTeamAssignmentMetricsSummary).toHaveBeenCalled();
    expect(component.metricSetups).toEqual(['# tiles on track', '# tiles on track']);
    expect(component.managers).toEqual([{ name: 'Mircea Strugaru', id: 8473 }]);
    expect(component.teams).toEqual([{ name: 'Eng.CoreSEM', id: 872 }, { name: 'Eng.ProductSEM', id: 873 }]);
    expect(component.metricDesc).toEqual('# tiles on track');
  });

  it('should get metrics summary when form value is changed', () => {
    spyOn(metricService, 'getTeamAssignmentHistories').and.returnValue(of(TEAM_ASSIGNMENT_HISTORIES));
    spyOn(metricService, 'getTeamAssignmentMetricsSummary').and.returnValue(of(METRICS_SUMMARY));
    spyOn(component, 'getTeamAssignmentMetricsSummary');
    component.ngOnInit();
    component.form.patchValue({
      range: '8',
    });
    expect(component.getTeamAssignmentMetricsSummary).toHaveBeenCalled();
  });

  it('should handle team change', () => {
    const teamId = 872;
    component.teams = [{ name: 'Eng.CoreSEM', id: 872 }, { name: 'Eng.ProductSEM', id: 873 }];
    component.metricSetups = ['# tiles on track', '# tiles on track'];
    component.handleTeamChange(teamId);
    expect(component.metricDesc).toBe('# tiles on track');
  });

  it('[ngOnInit] should throw api error on getting histories', () => {
    spyOn(metricService, 'getTeamAssignmentHistories').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    fixture.detectChanges();
    expect(component.error).toBeTruthy();
  });

  it('[ngOnInit] should throw custom error on getting histories', () => {
    spyOn(metricService, 'getTeamAssignmentHistories').and.returnValue(Observable.throw({}));
    fixture.detectChanges();
    expect(component.error).toBeTruthy();
  });

  it('[ngOnInit] should throw api error on getting summary', () => {
    spyOn(metricService, 'getTeamAssignmentHistories').and.returnValue(of(TEAM_ASSIGNMENT_HISTORIES));
    spyOn(metricService, 'getTeamAssignmentMetricsSummary').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    fixture.detectChanges();
    expect(component.error).toBeTruthy();
  });

  it('[ngOnInit] should throw custom error on getting summary', () => {
    spyOn(metricService, 'getTeamAssignmentHistories').and.returnValue(of(TEAM_ASSIGNMENT_HISTORIES));
    spyOn(metricService, 'getTeamAssignmentMetricsSummary').and.returnValue(Observable.throw({}));
    fixture.detectChanges();
    expect(component.error).toBeTruthy();
  });

  it('[exportCsv] should throw api error on exporting csv', () => {
    spyOn(metricService, 'getTeamAssignmentHistories').and.returnValue(of(TEAM_ASSIGNMENT_HISTORIES));
    spyOn(metricService, 'getTeamAssignmentMetricsSummary').and.returnValue(of(METRICS_SUMMARY));
    fixture.detectChanges();
    spyOn(metricService, 'exportMetricReport').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    component.exportCsv();
    expect(component.error).toBeTruthy();
  });

  it('[exportCsv] should throw custom error on exporting csv', () => {
    spyOn(metricService, 'getTeamAssignmentHistories').and.returnValue(of(TEAM_ASSIGNMENT_HISTORIES));
    spyOn(metricService, 'getTeamAssignmentMetricsSummary').and.returnValue(of(METRICS_SUMMARY));
    fixture.detectChanges();
    spyOn(metricService, 'exportMetricReport').and.returnValue(Observable.throw({}));
    component.exportCsv();
    expect(component.error).toBeTruthy();
  });

  it('[onViewChange] should change view', () => {
    component.onViewChange({} as DfGroupToggleItem);
    expect(component.view).toBe('chart');
  });

  it('[toggleCurrentWeek] should check current week', () => {
    component.metrics = [1];
    component.toggleCurrentWeek({ checked: true} as DfCheckboxChange);
  });

  it('[toggleCurrentWeek] should uncheck current week', () => {
    component.metrics = [1];
    component.toggleCurrentWeek({ checked: false} as DfCheckboxChange);
  });
});
