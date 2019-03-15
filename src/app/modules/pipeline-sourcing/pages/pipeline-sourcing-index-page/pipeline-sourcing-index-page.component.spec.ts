import { BreakpointObserver } from '@angular/cdk/layout';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfToasterService } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { CommonService } from 'app/core/services/common/common.service';
import { PIPELINE_SOURCING } from 'app/core/services/mocks/pipeline-sourcing.mock';
import { PipelineSourcingService } from 'app/core/services/pipeline-sourcing/pipeline-sourcing.service';

import {
  PipelineSourcingIndexPageComponent,
} from 'app/modules/pipeline-sourcing/pages/pipeline-sourcing-index-page/pipeline-sourcing-index-page.component';

describe('PipelineSourcingIndexPageComponent', () => {
  let component: PipelineSourcingIndexPageComponent;
  let fixture: ComponentFixture<PipelineSourcingIndexPageComponent>;
  let pipelineSourcingService: PipelineSourcingService;
  let breakpointObserver: BreakpointObserver;
  let dfToasterService: DfToasterService;
  let commonService: CommonService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PipelineSourcingIndexPageComponent],
      imports: [],
      providers: [
        { provide: PipelineSourcingService, useFactory: () => mock(PipelineSourcingService) },
        { provide: DfToasterService, useFactory: () => mock(DfToasterService) },
        { provide: CommonService, useFactory: () => mock(CommonService) },
        { provide: BreakpointObserver, useFactory: () => mock(BreakpointObserver) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineSourcingIndexPageComponent);
    component = fixture.componentInstance;
    pipelineSourcingService = TestBed.get(PipelineSourcingService);
    breakpointObserver = TestBed.get(BreakpointObserver);
    dfToasterService = TestBed.get(DfToasterService);
    commonService = TestBed.get(CommonService);
    spyOn(breakpointObserver, 'observe').and.returnValue(of([{ matches: true }]));
    spyOn(dfToasterService, 'popError').and.callThrough();
    spyOn(dfToasterService, 'popSuccess').and.callThrough();
  });

  it('check if the component has been created', () => {
    expect(component).toBeTruthy();
  });
  describe('onRowChange', () => {
    it('should update job sourcing when the correct info was provided', () => {
      const jobSourcingRow = {
        jobId: 1,
        jobName: 'test',
        priority: 1,
        daysOpen: 1,
        demand: 1,
        total: 1,
        lastDay: 1,
        last7Days: 1,
        quality: 1,
        quality1d: 1,
        quality7d: 1,
        sourcingInstructions: 'test',
        jbp: true,
        jbpInstructions: 'test',
        outbound: true,
        outboundInstructions: 'test',
      };
      spyOn(pipelineSourcingService, 'updateJobSourcing').and.returnValue(of({ jobName: 'test', jobId: 1 }));

      component.onRowChange(jobSourcingRow);

      expect(pipelineSourcingService.updateJobSourcing).toHaveBeenCalled();
    });

    it('should display an error message when a server error happens during job source update', () => {
      const jobSourcingRow = {
        jobId: 1,
        jobName: 'test',
        priority: 1,
        daysOpen: 1,
        demand: 1,
        total: 1,
        lastDay: 1,
        last7Days: 1,
        quality: 1,
        quality1d: 1,
        quality7d: 1,
        sourcingInstructions: 'test',
        jbp: true,
        jbpInstructions: 'test',
        outbound: true,
        outboundInstructions: 'test',
      };
      spyOn(pipelineSourcingService, 'updateJobSourcing').and.returnValue(Observable.throw({ error: 'server error' }));

      component.onRowChange(jobSourcingRow);

      expect(pipelineSourcingService.updateJobSourcing).toHaveBeenCalled();
      expect(dfToasterService.popError).toHaveBeenCalled();
    });
  });
  describe('[ngOnInit]', () => {
    it('should get sourcing row successfully', () => {
      spyOn(pipelineSourcingService, 'getJobsSourcing').and.returnValue(of(PIPELINE_SOURCING));
      const SOURCINGROW = [{
        jobId: 7,
        jobName: 'Android Software Engineer',
        priority: undefined,
        daysOpen: null,
        demand: 0,
        total: 6580,
        lastDay: 0,
        last7Days: 1,
        quality: 6329,
        quality1d: 0,
        quality7d: 1,
        sourcingInstructions: 'MP',
        jbp: true,
        jbpInstructions: 'Stf',
        outbound: false,
        outboundInstructions: '',
      }];
      fixture.detectChanges();
      expect(pipelineSourcingService.getJobsSourcing).toHaveBeenCalled();
      expect(component.sourcingRow).toEqual(SOURCINGROW);
    });

    it('should display a generic error message when a server error occurs during source row fetching from server', () => {
      spyOn(pipelineSourcingService, 'getJobsSourcing').and.returnValue(Observable.throw({ error: 'server error' }));
      fixture.detectChanges();
      expect(pipelineSourcingService.getJobsSourcing).toHaveBeenCalled();
      expect(component.sourcingRow).toEqual([]);
      expect(component.error).toBe('Error loading pipeline sourcing.');
    });

    it('should display an error message when a server error occurs during source row fetching from server', () => {
      spyOn(pipelineSourcingService, 'getJobsSourcing').and.returnValue(Observable.throw({
        error: {
          errorCode: 400,
          type: 'type',
          httpStatus: 400,
          text: 'error',
        },
      }));
      fixture.detectChanges();
      expect(pipelineSourcingService.getJobsSourcing).toHaveBeenCalled();
      expect(component.sourcingRow).toEqual([]);
      expect(component.error).toBe('error');
    });
  });

  it('should export Csv successfully', () => {
    spyOn(commonService, 'generateCsv').and.returnValue({});
    spyOn(commonService, 'download').and.returnValue({});
    component.sourcingRow = [{
      jobId: 7,
      jobName: 'Android Software Engineer',
      priority: undefined,
      daysOpen: null,
      demand: 0,
      total: 6580,
      lastDay: 0,
      last7Days: 1,
      quality: 6329,
      quality1d: 0,
      quality7d: 1,
      sourcingInstructions: 'MP',
      jbp: true,
      jbpInstructions: 'Stf',
      outbound: false,
      outboundInstructions: '',
    }];
    component.exportCsv();
    expect(commonService.generateCsv).toHaveBeenCalled();
    expect(commonService.download).toHaveBeenCalled();
  });
});
