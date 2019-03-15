import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { DfModalService } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { mock } from 'ts-mockito/lib/ts-mockito';

import { Job } from 'app/core/models/hire';
import { HireService } from 'app/core/services/hire/hire.service';
import { SAMPLE_JOB } from 'app/core/services/mocks/jobs.mock';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { FiveQGradingComponent } from 'app/modules/grading/components/five-q/grading/five-q-grading.component';
import { GradingPageComponent } from 'app/modules/grading/pages/grading-page/grading-page.component';

describe('GradingPageComponent', () => {
  let component: GradingPageComponent;
  let fixture: ComponentFixture<GradingPageComponent>;
  let hireService: HireService;
  let modalService: DfModalService;
  let sanitizer: DomSanitizer;

  const job = {
    id: 1,
    title: 'Job 1',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GradingPageComponent,
      ],
      providers: [
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        { provide: HireService, useFactory: () => mock(HireService) },
        { provide: DomSanitizer, useFactory: () => mock(DomSanitizer) },
        { provide: WINDOW_TOKEN, useValue: { location: {}, } },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradingPageComponent);
    component = fixture.componentInstance;
    hireService = TestBed.get(HireService);
    modalService = TestBed.get(DfModalService);
    sanitizer = TestBed.get(DomSanitizer);


    spyOn(hireService, 'getJobs').and.returnValue(of([job]));
    spyOn(hireService, 'getJob').and.returnValue(of({}));
  });

  it('should be created', () => expect(component).toBeTruthy());

  it('should check for unsaved changes', () => {
    fixture.detectChanges();
    component.pipelineControl.setValue(job);
    expect(component.testControl.value).toBe(null);

    component.testControl.setValue(component.tests[0]);
    expect(component.previousTestSelection).toBe(component.tests[0]);

    component.fiveQGradingComponent = new FiveQGradingComponent(modalService, hireService, sanitizer);
    component.fiveQGradingComponent.changesSaved = false;

    spyOn(component, 'openSaveConfirmationModal').and.callThrough();

    component.checkForUnsavedChanges(SAMPLE_JOB[1] as Job, null);
    component.checkForUnsavedChanges(null, component.tests[0]);

    expect(component.openSaveConfirmationModal).toHaveBeenCalledTimes(2);
    expect(component.canDeactivate()).toBe(false);
  });

  it('should show save grades button as disabled', () => {
    fixture.detectChanges();
    component.pipelineControl.setValue(job);
    component.testControl.setValue(component.tests[1]);
    expect(component.isSaveGradesDisabled()).toBe(true);
  });

  it('should cancel save', () => {
    fixture.detectChanges();
    component.pipelineControl.setValue(job);
    component.testControl.setValue(component.tests[1]);
    component.cancelSave(() => {});

    expect(component.unconfirmedPipelineSelection).toBe(null);
  });

  it('should filter candidates', () => {
    const jobMock = {
      id: 1,
      title: 'Job 1',
      trackerRequired: true,
      applicationFlow: {
        id: 1,
        name: 'flow',
        flowDefinitionType: 'default_flow'
      }
    };
    const ENTER_KEY = 'Enter';
    const NAME = 'contractor name';

    spyOn(hireService, 'searchApplicants').and.returnValue(of({ content: [] }));

    fixture.detectChanges();
    component.pipelineControl.setValue(jobMock);
    component.testControl.setValue(component.tests[1]);

    component.fiveQGradingComponent = new FiveQGradingComponent(modalService, hireService, sanitizer);
    component.fiveQGradingComponent.selectedJob = SAMPLE_JOB[1] as Job;
    spyOn(component.fiveQGradingComponent, 'fetchData').and.callThrough();
    component.emailNameControl.setValue(NAME);
    component.filterFiveQCandidates({ key: ENTER_KEY });

    expect(component.fiveQGradingComponent.fetchData).toHaveBeenCalledWith(NAME);

    component.filterFiveQCandidates({ key: '' });
    expect(component.fiveQGradingComponent.fetchData).toHaveBeenCalledTimes(1);
  });

  it('should open save confirmation', () => {
    spyOn(modalService, 'open').and.returnValue({});

    fixture.detectChanges();

    component.openSaveConfirmationModal();
    expect(modalService.open).toHaveBeenCalledWith(component.saveConfirmationModal);
  });

  it('should save and leave', () => {
    spyOn(hireService, 'saveEvaluations').and.returnValue(of(true));
    fixture.detectChanges();
    component.fiveQGradingComponent = new FiveQGradingComponent(modalService, hireService, sanitizer);
    component.fiveQGradingComponent.changesSaved = true;
    component.fiveQGradingComponent.selectedJob = SAMPLE_JOB[1] as Job;

    component.unconfirmedPipelineSelection = component.pipelines[0];
    component.unconfirmedTestSelection = component.tests[0];

    const close = () => {};
    component.saveAndLeave(close);

    expect(component.pipelineControl.value).toBe(component.pipelines[0]);
    expect(component.testControl.value).toBe(component.tests[0]);

    expect(component.fiveQGradingComponent.changesSaved).toBe(true);
  });

});
