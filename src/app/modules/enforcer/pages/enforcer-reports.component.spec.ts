import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs/observable/of';
import { mock } from 'ts-mockito';

import { EnforcerService } from 'app/core/services/enforcer/enforcer.service';
import { ReportService } from 'app/core/services/report/report.service';
import { EnforcerReportsComponent } from 'app/modules/enforcer/pages/enforcer-reports.component';

describe('EnforcerReportsComponent', () => {
  let component: EnforcerReportsComponent;
  let reportService: ReportService;
  let fixture: ComponentFixture<EnforcerReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [EnforcerReportsComponent],
      imports: [],
      providers: [
        { provide: EnforcerService, useFactory: () => mock(EnforcerService) },
        { provide: ReportService, useFactory: () => mock(ReportService) },
        FormBuilder,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnforcerReportsComponent);
    component = fixture.componentInstance;
    reportService = TestBed.get(ReportService);
    spyOn(reportService, 'getTeams').and.returnValue(of([]));
  });

  it('check if the component has been created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit] should build form successfully', () => {
    spyOn(component, 'getTeams');
    fixture.detectChanges();
    expect(component.form).toBeTruthy();
    expect(component.getTeams).toHaveBeenCalledWith();
  });

  it('should change date successfully', () => {
    fixture.detectChanges();
    const date = new Date();
    component.onDateChange(date);
    expect(component.date).toEqual(date);
  });

  it('should get team list successfully', () => {
    const projection = 'COLLECTION_0';
    const activeAssignments = true;
    const avatarType = 'ENFORCER';
    const direct = true;
    component.getTeams();
    expect(reportService.getTeams).toHaveBeenCalledWith(projection, direct, avatarType, activeAssignments);
  });
});
