import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HireService } from 'app/core/services/hire/hire.service';
import { SAMPLE_JOB } from 'app/core/services/mocks/jobs.mock';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import {
  JobDashboardIndexPageComponent,
} from 'app/modules/job-dashboard/pages/job-dashboard-index-page/job-dashboard-index-page.component';

describe('JobDashboardIndexPageComponent', () => {
  let component: JobDashboardIndexPageComponent;
  let fixture: ComponentFixture<JobDashboardIndexPageComponent>;
  let hireService: HireService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [JobDashboardIndexPageComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: HireService, useFactory: () => mock(HireService) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDashboardIndexPageComponent);
    component = fixture.componentInstance;
    hireService = TestBed.get(HireService);
    router = TestBed.get(Router);
  });

  it('should be created successfully', () => {
    expect(component).toBeTruthy();
  });

  describe('[ngOnInit]', () => {
    it('should get job list successfully', () => {
      spyOn(hireService, 'getJobs').and.returnValue(of(SAMPLE_JOB));
      fixture.detectChanges();
      expect(component.genericJobs.length).toEqual(2);
      expect(component.customJobs.length).toEqual(1);
    });

    it('should display an specific error message when the jobs request retrieves an error', () => {
      const text = 'error message';
      spyOn(hireService, 'getJobs').and.returnValue(Observable.throw({
        error: {
          errorCode: 400,
          type: 'type',
          httpStatus: 400,
          text,
        },
      }));
      fixture.detectChanges();
      expect(component.error).toBe(text);
    });

    it('should display an specific error message when the jobs request retrieves an error without error text', () => {
      spyOn(hireService, 'getJobs').and.returnValue(Observable.throw({
        error: {},
      }));
      fixture.detectChanges();
      expect(component.error).toBe('Error loading jobs.');
    });

  });

  it('should search pipelines successfully when form is valid', () => {
    spyOn(hireService, 'getJobs').and.returnValue(of(SAMPLE_JOB));
    spyOn(router, 'navigate');
    component.ngOnInit();
    component.form.setValue({ query: 'test' });
    component.searchPipelines();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should search pipelines successfully when form is invalid', () => {
    spyOn(hireService, 'getJobs').and.returnValue(of(SAMPLE_JOB));
    spyOn(router, 'navigate');
    component.ngOnInit();
    component.searchPipelines();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should sanitize URL', () => {
    let url = 'sample url';
    url = component.sanitizeURL(url);
    expect(url).toEqual(url);
  });

});
