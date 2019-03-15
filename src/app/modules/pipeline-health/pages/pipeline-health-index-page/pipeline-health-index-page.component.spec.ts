import { BreakpointObserver } from '@angular/cdk/layout';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DfGroupToggleItem, DfModalOptions, DfModalService, DfModalSize } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { mock } from 'ts-mockito';

import { JobHealthJob } from 'app/core/models/job-health/job-health-job.model';
import {
  PIPELINE_HEALTH_DATA_MOCK,
  PIPELINE_HEALTH_DATA_MOCK_INDICATORS,
} from 'app/core/services/mocks/pipeline-health.mock';
import { PipelineHealthService } from 'app/core/services/pipeline-health/pipeline-health.service';
import {
  PipelineHealthIndexPageComponent,
} from 'app/modules/pipeline-health/pages/pipeline-health-index-page/pipeline-health-index-page.component';

describe('PipelineHealthIndexPageComponent', () => {
  let component: PipelineHealthIndexPageComponent;
  let fixture: ComponentFixture<PipelineHealthIndexPageComponent>;
  let pipelineHealthService: PipelineHealthService;
  let breakpointObserver: BreakpointObserver;
  let modalService: DfModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PipelineHealthIndexPageComponent],
      imports: [
        ReactiveFormsModule,
      ],
      providers: [
        { provide: PipelineHealthService, useFactory: () => mock(PipelineHealthService) },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        { provide: BreakpointObserver, useFactory: () => mock(BreakpointObserver) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineHealthIndexPageComponent);
    component = fixture.componentInstance;
    pipelineHealthService = TestBed.get(PipelineHealthService);
    breakpointObserver = TestBed.get(BreakpointObserver);
    modalService = TestBed.get(DfModalService);
    spyOn(breakpointObserver, 'observe').and.returnValue(of([{ matches: true }]));
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-04-11T03:24:00'));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('check if the component has been created', () => {
    expect(component).toBeTruthy();
  });

  it('[weekFormatFn] returns date range', () => {
    expect(component.weekFormatFn(new Date('2018-04-04T03:24:00'))).toEqual('Apr 02 - Apr 08, 2018');
  });

  it('[ngOnInit] switch to daily data', () => {
    spyOn(component, 'search');
    component.ngOnInit();
    component.form.controls['period'].patchValue(<DfGroupToggleItem> {
      text: 'Total',
      id: 'TOTAL',
    });
    expect(component.search).toHaveBeenCalled();
  });

  it('[ngOnInit] switch job type', () => {
    spyOn(component, 'search');
    component.ngOnInit();
    component.form.controls['jobType'].patchValue(<DfGroupToggleItem> {
      text: 'Custom',
      id: 'CUSTOM',
    });
    expect(component.search).toHaveBeenCalled();
  });

  it('[ngOnInit] switch job type', () => {
    spyOn(component, 'search');
    component.ngOnInit();
    component.form.controls['week'].patchValue(new Date('2018-04-04T03:24:00'));
    expect(component.search).toHaveBeenCalled();
  });

  it('[ngOnInit] get weekly data', () => {
    spyOn(pipelineHealthService, 'getJobsHealthWeek').and.returnValue(of(PIPELINE_HEALTH_DATA_MOCK));
    component.ngOnInit();
    expect(component.data.length).toEqual(2);
  });

  it('[ngOnInit] get total data', () => {
    spyOn(pipelineHealthService, 'getJobsHealth').and.returnValue(of(PIPELINE_HEALTH_DATA_MOCK_INDICATORS));
    spyOn(pipelineHealthService, 'getJobsHealthWeek').and.returnValue(of(PIPELINE_HEALTH_DATA_MOCK_INDICATORS));
    component.ngOnInit();
    component.form.controls['period'].patchValue(component.periodItems[0]);
    expect(component.data.length).toEqual(6);
  });

  it('[progressBarTextGenerator] returns progress bar function', () => {
    spyOn(pipelineHealthService, 'getJobsHealthWeek').and.returnValue(of(PIPELINE_HEALTH_DATA_MOCK));
    component.ngOnInit();
    expect(component.progressBarTextGenerator(component.data[0], 'marketplace')).toBeDefined();
  });

  it('[isCustom] returns true id custom jobs are selected', () => {
    spyOn(component, 'search');
    component.ngOnInit();
    component.form.controls['jobType'].patchValue(component.jobTypeItems[1]);
    expect(component.isCustom).toBeTruthy();
  });

  it('[sortByPayband] returns pipeline health row sorted by payband', () => {
    spyOn(pipelineHealthService, 'getJobsHealthWeek').and.returnValue(of(PIPELINE_HEALTH_DATA_MOCK));
    component.ngOnInit();
    component.sortByPayband(component.data, '', 1);
    expect(component.data[0].job.yearSalary).toEqual(60);
    expect(component.data[1].job.yearSalary).toEqual(50);
  });

  it('[sortbyDaysOpen] returns pipeline health row sorted by days open', () => {
    spyOn(pipelineHealthService, 'getJobsHealthWeek').and.returnValue(of(PIPELINE_HEALTH_DATA_MOCK));
    component.ngOnInit();
    component.sortbyDaysOpen(component.data, '', 1);
    expect(component.data[0].job.activationDate).toEqual('2017-12-12T03:06:01Z');
    expect(component.data[1].job.activationDate).toEqual('2017-12-13T03:06:01Z');
  });

  it('[sortbyTechnicalScreen] returns pipeline health row sorted by technical screen', () => {
    spyOn(pipelineHealthService, 'getJobsHealthWeek').and.returnValue(of(PIPELINE_HEALTH_DATA_MOCK));
    component.ngOnInit();
    component.sortbyTechnicalScreen(component.data, '', 1);
    expect(component.data[0].technicalScreen).toEqual(1);
    expect(component.data[1].technicalScreen).toEqual(0);
  });

  it('[openHiringManagersModal] should open hiring managers modal', () => {
    spyOn(modalService, 'open').and.returnValue(of(PIPELINE_HEALTH_DATA_MOCK));
    component.openHiringManagersModal(<JobHealthJob> {});
    expect(modalService.open).toHaveBeenCalledWith(
      component.hiringManagersModalTemplate,
      <DfModalOptions>{ size: DfModalSize.Large }
    );
  });
});
