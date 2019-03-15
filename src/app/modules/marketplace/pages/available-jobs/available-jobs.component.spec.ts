import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { JobLabel, VisibleCorePipeline } from 'app/core/models/hire';
import { HireService } from 'app/core/services/hire/hire.service';
import { JOBS_MOCK } from 'app/core/services/mocks/hire.mock';
import { AvailableJobsComponent } from 'app/modules/marketplace/pages/available-jobs/available-jobs.component';

describe('AvailableJobsComponent', () => {
  let component: AvailableJobsComponent;
  let fixture: ComponentFixture<AvailableJobsComponent>;
  let hireService: HireService;

  class MockedHireService implements Partial<HireService> {
    public getJobLabels(): Observable<JobLabel[]> {
      return of([
        {
          id: 3,
          name: 'Software Development',
        },
        {
          id: 1,
          name: 'Java',
          parent: {
            id: 1,
            name: 'Software Development',
          },
        },
        {
          id: 2,
          name: 'Sales',
        },
      ]);
    }

    public getJobs(): Observable<typeof JOBS_MOCK> {
      return of(JOBS_MOCK);
    }

    public getVisibleCorePipelines(): Observable<VisibleCorePipeline[]> {
      return of([
        {
          id: 1,
          title: 'Pipeline1',
        },
      ]);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AvailableJobsComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: HireService, useClass: MockedHireService },
        FormBuilder,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableJobsComponent);
    component = fixture.componentInstance;
    hireService = TestBed.get(HireService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize data when jobs > 25', () => {
    spyOn(hireService, 'getJobLabels').and.callThrough();
    spyOn(hireService, 'getJobs').and.callThrough();
    spyOn(hireService, 'getVisibleCorePipelines').and.callThrough();
    fixture.detectChanges();
    expect(component.jobs.length).toEqual(JOBS_MOCK.length + 1);
    expect(component.isLoading).toBeFalsy();
    expect(component.error).toBeNull();
    expect(component.message).toBeNull();
    expect(component.shouldLoadNextPage).toBeTruthy();
  });

  it('should initialize data when jobs < 25', () => {
    spyOn(hireService, 'getJobLabels').and.callThrough();
    spyOn(hireService, 'getJobs').and.returnValue(of([
      {
        id: 1,
        title: 'Job1',
      },
    ]));
    spyOn(hireService, 'getVisibleCorePipelines').and.callThrough();
    fixture.detectChanges();
    expect(component.jobs.length).toEqual(2);
    expect(component.shouldLoadNextPage).toBeFalsy();
  });

  it('[reset] should reset data', () => {
    spyOn(hireService, 'getJobs').and.callThrough();
    spyOn(hireService, 'getVisibleCorePipelines').and.callThrough();
    component.reset();
    expect(component.jobs.length).toEqual(JOBS_MOCK.length + 1);
  });

  describe('[submit]', () => {
    beforeEach(() => {
      spyOn(hireService, 'getJobLabels').and.callThrough();
    });
    it('should submit form and get no results', () => {
      spyOn(hireService, 'getJobs').and.returnValue(of([]));
      spyOn(hireService, 'getVisibleCorePipelines').and.returnValue(of([]));
      component.form.controls['text'].setValue('sometext');
      component.submit();
      expect(component.jobs.length).toEqual(0);
    });
    it('should submit form and get results based on text', () => {
      spyOn(hireService, 'getJobs').and.returnValue(of([
        {
          id: 1,
          title: 'Job1',
        },
      ]));
      spyOn(hireService, 'getVisibleCorePipelines').and.callThrough();
      component.form.controls['text'].setValue('sometext');
      component.submit();
      expect(component.jobs.length).toEqual(2);
    });
    it('should submit form and get results based on label', () => {
      spyOn(hireService, 'getJobs').and.returnValue(of([
        {
          id: 1,
          title: 'Job1',
        },
      ]));
      spyOn(hireService, 'getVisibleCorePipelines').and.callThrough();
      component.form.controls['label'].setValue('Sales');
      component.submit();
      expect(component.jobs.length).toEqual(2);
    });
    it('should submit form and get results based on label and return no result', () => {
      spyOn(hireService, 'getJobs').and.returnValue(of([]));
      spyOn(hireService, 'getVisibleCorePipelines').and.returnValue(of([]));
      component.form.controls['label'].setValue('Sales');
      component.submit();
      expect(component.jobs.length).toEqual(0);
    });
    it('should submit form and get results based on label and text', () => {
      spyOn(hireService, 'getJobs').and.returnValue(of([
        {
          id: 1,
          title: 'Job1',
        },
      ]));
      spyOn(hireService, 'getVisibleCorePipelines').and.callThrough();
      component.form.controls['label'].setValue('Sales');
      component.form.controls['text'].setValue('sometext');
      component.submit();
      expect(component.jobs.length).toEqual(2);
    });
    it('should submit form and get results based on label and text and get no result', () => {
      spyOn(hireService, 'getJobs').and.returnValue(of([]));
      spyOn(hireService, 'getVisibleCorePipelines').and.returnValue(of([]));
      component.form.controls['label'].setValue('Sales');
      component.form.controls['text'].setValue('sometext');
      component.submit();
      expect(component.jobs.length).toEqual(0);
    });
    it('should submit form and get api error', () => {
      spyOn(hireService, 'getJobs').and.returnValue(Observable.throw({
        error: {
          errorCode: 400,
          type: 'type',
          httpStatus: 400,
          text: 'error',
        },
      }));
      component.submit();
      expect(component.error).toBeTruthy();
    });
    it('should submit form and get custom error', () => {
      spyOn(hireService, 'getJobs').and.returnValue(Observable.throw({}));
      component.submit();
      expect(component.error).toBeTruthy();
    });
  });

  describe('[onScroll]', () => {
    beforeEach(() => {
      component.shouldLoadNextPage = true;
      component.jobs = [];
    });
    it('should load next page', () => {
      spyOn(hireService, 'getJobs').and.callThrough();
      component.onScroll();
      expect(component.currentOptions.page).toEqual(1);
    });
    it('should not load next page', () => {
      spyOn(hireService, 'getJobs').and.returnValue(of([]));
      component.onScroll();
      component.form.controls['label'].setValue('Sales');
      expect(component.currentOptions.page).toEqual(1);
    });
  });

  describe('[onLabelChange]', () => {
    beforeEach(() => {
      spyOn(hireService, 'getJobLabels').and.callThrough();
    });
    it('should changes results on label change and jobs exist', () => {
      spyOn(hireService, 'getJobs').and.callThrough();
      spyOn(hireService, 'getVisibleCorePipelines').and.callThrough();
      fixture.detectChanges();
      component.form.controls['label'].setValue('Sales');
      const labelField = Object.assign(component.form.controls['label']);
      component.onLabelChange(labelField);
      expect(component.jobs.length).toEqual(JOBS_MOCK.length + 1);
    });
    it('should changes results on label change and jobs don\'t exist', () => {
      spyOn(hireService, 'getJobs').and.returnValue(of([]));
      spyOn(hireService, 'getVisibleCorePipelines').and.returnValue(of([]));
      fixture.detectChanges();
      component.form.controls['label'].setValue('Sales');
      const labelField = Object.assign(component.form.controls['label']);
      component.onLabelChange(labelField);
      expect(component.jobs.length).toEqual(0);
    });
    it('should changes results on label and text change and jobs exist', () => {
      spyOn(hireService, 'getJobs').and.returnValue(of([
        {
          id: 1,
          title: 'Job1',
        },
      ]));
      spyOn(hireService, 'getVisibleCorePipelines').and.callThrough();
      fixture.detectChanges();
      component.form.controls['text'].setValue('Java');
      component.form.controls['label'].setValue('Sales');
      const labelField = Object.assign(component.form.controls['label']);
      component.onLabelChange(labelField);
      expect(component.jobs.length).toEqual(2);
    });
    it('should changes results on label and text change and jobs don\'t exist', () => {
      spyOn(hireService, 'getJobs').and.returnValue(of([]));
      spyOn(hireService, 'getVisibleCorePipelines').and.returnValue(of([]));
      fixture.detectChanges();
      component.form.controls['text'].setValue('Java');
      component.form.controls['label'].setValue('Sales');
      const labelField = Object.assign(component.form.controls['label']);
      component.onLabelChange(labelField);
      expect(component.jobs.length).toEqual(0);
    });
    it('should get api error', () => {
      fixture.detectChanges();
      spyOn(hireService, 'getJobs').and.returnValue(Observable.throw({
        error: {
          errorCode: 400,
          type: 'type',
          httpStatus: 400,
          text: 'error',
        },
      }));
      component.form.controls['label'].setValue('Sales');
      const labelField = Object.assign(component.form.controls['label']);
      component.onLabelChange(labelField);
      expect(component.error).toBeTruthy();
    });
    it('should get api error', () => {
      fixture.detectChanges();
      spyOn(hireService, 'getJobs').and.returnValue(Observable.throw({}));
      component.form.controls['label'].setValue('Sales');
      const labelField = Object.assign(component.form.controls['label']);
      component.onLabelChange(labelField);
      expect(component.error).toBeTruthy();
    });
    it('should reset', () => {
      spyOn(hireService, 'getJobs').and.returnValue(of([]));
      spyOn(hireService, 'getVisibleCorePipelines').and.returnValue(of([]));
      component.onLabelChange(undefined);
      expect(hireService.getJobs).toHaveBeenCalled();
    });
  });
});
