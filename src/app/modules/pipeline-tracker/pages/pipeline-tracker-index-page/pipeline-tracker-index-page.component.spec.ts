import { MediaMatcher } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DfModalRef, DfModalService, DfModalSize } from '@devfactory/ngx-df';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito/lib/ts-mockito';

import { JobDetails } from 'app/core/models/hire';
import { JobStatistic } from 'app/core/models/job-statistic';
import { Manager } from 'app/core/models/manager';
import { CommonService } from 'app/core/services/common/common.service';
import { HireService } from 'app/core/services/hire/hire.service';
import { JOB_STATISTICS, JOBS_MOCK, TECH_JOB_DETAIL_TESTS_MOCK, VISIBLE_MANAGERS } from 'app/core/services/mocks/hire.mock';
import { TestService } from 'app/core/services/test/test.service';
import {
  PipelineTrackerIndexPageComponent,
} from 'app/modules/pipeline-tracker/pages/pipeline-tracker-index-page/pipeline-tracker-index-page.component';

describe('PipelineTrackerIndexPageComponent', () => {
  let component: PipelineTrackerIndexPageComponent;
  let fixture: ComponentFixture<PipelineTrackerIndexPageComponent>;
  let hireService: HireService;
  let modalService: DfModalService;
  let jobWithHiringManagers: JobDetails;
  let testService: TestService;
  const MODAL_OPTIONS = { size: DfModalSize.Large };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PipelineTrackerIndexPageComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        MediaMatcher,
        Platform,
        CommonService,
        { provide: DomSanitizer, useValue: {
          bypassSecurityTrustHtml: (value: string) => value,
        } },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        { provide: HireService, useFactory: () => mock(HireService) },
        { provide: TestService, useFactory: () => mock(TestService) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineTrackerIndexPageComponent);

    component = fixture.componentInstance;
    hireService = TestBed.get(HireService);
    modalService = TestBed.get(DfModalService);
    testService = TestBed.get(TestService);

    modalService.open = () => ({} as DfModalRef);

    jobWithHiringManagers = JOBS_MOCK[0];
    jobWithHiringManagers.visibleManagers = VISIBLE_MANAGERS as Manager[];
    hireService.getJobs = () => Observable.of(JOBS_MOCK);
    hireService.getJobStatisticsById = (_jobId, options): Observable<JobStatistic[]> => {
      if (options.types.indexOf('currentStatus') >= 0) {
        return Observable.of(
          [
            {id: 1, type: 'currentStatus', values: [
              {task: 'accountManagerEndorsesApplication', count: 3},
              {task: 'candidateProvidesContactInformation1', count: 10},
              {task: 'candidateSubmits5QTest', count: 8},
              {task: 'candidateVerifiesEmailAddress', count: 1},
              {task: 'recruitmentAnalystGrades5QTest', count: 2},
              {task: 'techTrialUpdatesStatus1', count: 23},
            ]},
            {id: 2, type: 'total', values: []},
            {id: 3, type: 'newInLast7Days', values: []},
          ]
        );
      } else {
        return Observable.of(
          [
            {id: 4, type: 'conversionIn7Days', values: []},
            {id: 5, type: 'conversionIn14Days', values: []},
            {id: 6, type: 'medianConversionTime', values: []},
          ]
        );
      }
    };

    const job = TECH_JOB_DETAIL_TESTS_MOCK;
    hireService.getJob = () => Observable.of(job);

    hireService.getJobStatistics = () => Observable.of(JOB_STATISTICS);

    hireService.getApplicationTest = () => {
      return Observable.of({ id: 3, testDetails: { content: '' } });
    };
  });

  it('should be created', () => {
    spyOn(testService, 'get').and.returnValue(Observable.of({}));
    fixture.detectChanges();
    component.pipelineControl.patchValue({ id: 123 });
    expect(component).toBeTruthy();
  });

  it('should load statistics when job is selected', () => {
    fixture.detectChanges();
    component.pipelineControl.patchValue({ id: 123 });

    expect(component.jobData.length).toBe(6);
  });

  it('should load just main statistics when secondary statistics retrieval fails', () => {
    hireService.getJobStatisticsById = (_id: number, definition: { types: string }) => {
      if (definition.types.indexOf('conversionIn14Days') !== -1) {
        return Observable.throw({});
      }
      return Observable.of(
        [
          {id: 1, type: 'currentStatus', values: [
            {task: 'accountManagerEndorsesApplication', count: 3},
            {task: 'candidateProvidesContactInformation1', count: 10},
            {task: 'candidateSubmits5QTest', count: 8},
            {task: 'candidateVerifiesEmailAddress', count: 1},
            {task: 'recruitmentAnalystGrades5QTest', count: 2},
            {task: 'techTrialUpdatesStatus1', count: 23},
          ]},
          {id: 2, type: 'total', values: []},
          {id: 3, type: 'newInLast7Days', values: []},
        ]
      );
    };

    fixture.detectChanges();
    component.pipelineControl.patchValue({ id: 123 });

    expect(component.jobData.length).toBe(6);
  });

  it('should load jobs', () => {
    fixture.detectChanges();
    expect(component.jobs.length).toBe(JOBS_MOCK.length);
  });

  it('should show error message when load job fails', () => {
    spyOn(hireService, 'getJobs').and.returnValue(Observable.throw(new Error()));
    fixture.detectChanges();
    expect(component.error).toBeTruthy();
  });

  it('should download csv ', () => {
    fixture.detectChanges();
    component.pipelineControl.patchValue('All');

    expect(component.downloadCSV()).toBe(true);
  });

  it('should show error when loading the job details fails', () => {
    spyOn(hireService, 'getJob').and.returnValue(Observable.throw(new Error()));
    fixture.detectChanges();
    component.pipelineControl.patchValue({ id: 123 });

    expect(component.error).not.toBe('');
  });

  it('should show error when loading jobs fails', () => {
    spyOn(hireService, 'getJobs').and.returnValue(Observable.throw(new Error()));
    fixture.detectChanges();

    expect(component.error).not.toBe('');
  });

  it('should show error when loading statistics for all', () => {
    spyOn(hireService, 'getJobStatistics').and.returnValue(Observable.throw(new Error()));
    fixture.detectChanges();
    component.pipelineControl.patchValue('All');

    expect(component.error).not.toBe('');
  });

  it('should open job description', () => {
    fixture.detectChanges();
    component.pipelineControl.patchValue({ id: 123 });

    spyOn(modalService, 'open').and.callThrough();

    component.openJobDescription();

    expect(modalService.open).toHaveBeenCalledWith(component.modalTemplate, MODAL_OPTIONS);
  });

  it('should open project evaluation', () => {
    component.details = Object.assign({
      job: {
        tests: [{
          test: {
            id: 9,
            type: 'ASSIGNMENT',
          },
        }],
        title: 'XO',
      },
    });

    spyOn(modalService, 'open').and.returnValue('');

    component.openProjectEvaluation();
    expect(modalService.open).toHaveBeenCalledWith(component.modalTemplate, MODAL_OPTIONS);
  });

  it('should open written evaluation', () => {
    component.details = Object.assign({
      job: {
        tests: [{
          test: {
            id: 4,
            type: 'FIVEQ',
            questions: [{
              sequenceNumber: 3,
              question: 'is this a question?',
            }, {
              sequenceNumber: 1,
              question: 'is this a question?',
            }],
          },
        }],
        title: 'XO',
      },
    });

    spyOn(modalService, 'open').and.callThrough();

    component.openWrittenEvaluation();
    expect(modalService.open).toHaveBeenCalledWith(component.modalTemplate, MODAL_OPTIONS);
  });

  it('should return as first row when the provided row index is zero', () => {
    expect(component.isFirstRow(0)).toBe(true);
  });

  it('should not return as first row when the provided row index is greater than zero', () => {
    expect(component.isFirstRow(1)).toBe(false);
  });

  it('should retrieve the task number itself', () => {
    const tasksNumber = 23;
    expect(component.checkTasksNumber(tasksNumber)).toBe(tasksNumber);
  });

  it('should return zero when the provided task number is unknown', () => {
    const tasksNumber = undefined;
    expect(component.checkTasksNumber(tasksNumber)).toBe(0);
  });
});
