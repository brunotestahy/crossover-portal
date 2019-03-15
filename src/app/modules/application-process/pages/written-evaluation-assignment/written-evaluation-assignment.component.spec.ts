import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { DfAlertService, DfLoadingSpinnerService } from '@devfactory/ngx-df';
import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { JOB_APPLICATION_MOCK, WRITTEN_ASSIGNMENT_MOCK } from '../../../../core/services/mocks/job-application.mock';
import { EscapeHtmlPipe } from '../../../../shared/pipes/keep-html.pipe';

import { WrittenEvaluationAssignmentComponent } from './written-evaluation-assignment.component';

describe('WrittenEvaluationAssignmentComponent', () => {
  let component: WrittenEvaluationAssignmentComponent;
  let fixture: ComponentFixture<WrittenEvaluationAssignmentComponent>;

  let candidateService: CandidateService;
  let loader: DfLoadingSpinnerService;
  let alert: DfAlertService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          WrittenEvaluationAssignmentComponent,
          EscapeHtmlPipe,
        ],
        providers: [
          {provide: CandidateService, useFactory: () => mock(CandidateService)},
          {provide: DfLoadingSpinnerService, useFactory: () => mock(DfLoadingSpinnerService)},
          {provide: DfAlertService, useFactory: () => mock(DfAlertService)},
          {provide: Router, useFactory: () => mock(Router)},
          {provide: ActivatedRoute, useFactory: () => mock(ActivatedRoute)},
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WrittenEvaluationAssignmentComponent);
    component = fixture.componentInstance;
    candidateService = TestBed.get(CandidateService);
    loader = TestBed.get(DfLoadingSpinnerService);
    alert = TestBed.get(DfAlertService);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);

    spyOn(candidateService, 'getCurrentApplication')
      .and.returnValue(of(JOB_APPLICATION_MOCK));

    spyOn(candidateService, 'getWrittenEvaluationAssignment')
      .and.returnValue(of(WRITTEN_ASSIGNMENT_MOCK));
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should get the dependencies', () => {
    expect(candidateService).toBeTruthy();
    expect(loader).toBeTruthy();
    expect(alert).toBeTruthy();
    expect(router).toBeTruthy();
    expect(route).toBeTruthy();
  });

  it('should call candidate service', () => {
    component.ngOnInit();

    expect(candidateService.getCurrentApplication).toHaveBeenCalled();
    expect(candidateService.getWrittenEvaluationAssignment).toHaveBeenCalled();
  });

  it('should toggle selected question', () => {
    component.questionSelectedIndex = 1;
    component.onToggleChange(component.questionButtons[2]);

    expect(component.questionSelectedIndex).toBe(2);
  });

  it('should set previous question as active and scroll into view', () => {
    spyOn(component.card.nativeElement, 'scrollIntoView');
    component.questionSelectedIndex = 2;
    component.previous();

    expect(component.questionSelectedIndex).toBe(1);
    expect(component.card.nativeElement.scrollIntoView).toHaveBeenCalledWith({
      inline: 'start',
      block: 'start',
      behavior: 'smooth',
    });
  });

  it('should set next question as active and scroll into view', () => {
    spyOn(component.card.nativeElement, 'scrollIntoView');
    component.questionSelectedIndex = 1;
    component.next();

    expect(component.questionSelectedIndex).toBe(2);
    expect(component.card.nativeElement.scrollIntoView).toHaveBeenCalledWith({
      inline: 'start',
      block: 'start',
      behavior: 'smooth',
    });
  });

  describe('on save draft written evaluation test call (without flag)', () => {

    it('should hide loader on save success', () => {
      spyOn(candidateService, 'saveWrittenEvaluationAssignmentDraft').and.returnValue(of(WRITTEN_ASSIGNMENT_MOCK));
      spyOn(loader, 'reveal');
      spyOn(loader, 'hide');
      const applicationId = JOB_APPLICATION_MOCK.id;

      fixture.detectChanges();
      component.saveDraft();

      expect(candidateService.saveWrittenEvaluationAssignmentDraft).toHaveBeenCalledWith(applicationId, component.data);
      expect(loader.reveal).toHaveBeenCalled();
      expect(loader.hide).toHaveBeenCalled();
    });

    it('should hide loader when on save error', () => {
      spyOn(candidateService, 'saveWrittenEvaluationAssignmentDraft').and.returnValue(Observable.throw('error'));
      spyOn(loader, 'reveal');
      spyOn(loader, 'hide');
      const applicationId = JOB_APPLICATION_MOCK.id;

      fixture.detectChanges();
      component.saveDraft();

      expect(candidateService.saveWrittenEvaluationAssignmentDraft).toHaveBeenCalledWith(applicationId, component.data);
      expect(loader.reveal).toHaveBeenCalled();
      expect(loader.hide).toHaveBeenCalled();
    });
  });

  describe('on save draft written evaluation test call with \'true\' flag', () => {
    it('should not show loader on save success', () => {
      spyOn(candidateService, 'saveWrittenEvaluationAssignmentDraft').and.returnValue(of(WRITTEN_ASSIGNMENT_MOCK));
      spyOn(loader, 'reveal');
      spyOn(loader, 'hide');
      const applicationId = JOB_APPLICATION_MOCK.id;

      fixture.detectChanges();
      component.saveDraft(true);

      expect(candidateService.saveWrittenEvaluationAssignmentDraft).toHaveBeenCalledWith(applicationId, component.data);
      expect(loader.reveal).not.toHaveBeenCalled();
      expect(loader.hide).not.toHaveBeenCalled();
    });

    it('should not show loader on save error', () => {
      spyOn(candidateService, 'saveWrittenEvaluationAssignmentDraft').and.returnValue(Observable.throw('error'));
      spyOn(loader, 'reveal');
      spyOn(loader, 'hide');
      const applicationId = JOB_APPLICATION_MOCK.id;

      fixture.detectChanges();
      component.saveDraft(true);

      expect(candidateService.saveWrittenEvaluationAssignmentDraft).toHaveBeenCalledWith(applicationId, component.data);
      expect(loader.reveal).not.toHaveBeenCalled();
      expect(loader.hide).not.toHaveBeenCalled();
    });
  });

  it('should submit written evaluation test and redirect to submitted page', () => {
    spyOn(candidateService, 'submitWrittenEvaluationAssignment').and.returnValue(of(WRITTEN_ASSIGNMENT_MOCK));
    spyOn(loader, 'hide');
    spyOn(router, 'navigate');
    const applicationId = JOB_APPLICATION_MOCK.id;

    fixture.detectChanges();
    component.doSubmit();

    expect(candidateService.submitWrittenEvaluationAssignment).toHaveBeenCalledWith(applicationId, component.data);
    expect(loader.hide).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['../written-evaluation-submitted'],
      {relativeTo: route});
  });

  it('should show error if submit written evaluation test failed', () => {
    const expectedError = {error: {error: {text: 'error message'}}};
    spyOn(candidateService, 'submitWrittenEvaluationAssignment').and.returnValue(Observable.throw(expectedError));
    spyOn(router, 'navigate');
    spyOn(loader, 'hide');
    const applicationId = JOB_APPLICATION_MOCK.id;

    fixture.detectChanges();
    component.doSubmit();

    expect(candidateService.submitWrittenEvaluationAssignment).toHaveBeenCalledWith(applicationId, component.data);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.error).toBe(expectedError.error.error.text);
    expect(loader.hide).toHaveBeenCalled();
  });

  it('should submit test if ok is clicked inside submit dialog', () => {
    spyOn(alert, 'createDialog').and.returnValue(of(['ok']));
    spyOn(component, 'doSubmit');

    fixture.detectChanges();
    component.submit();

    expect(alert.createDialog).toHaveBeenCalled();
    expect(component.doSubmit).toHaveBeenCalled();
  });


  it('should not submit test if cancel is clicked inside submit dialog', () => {
    spyOn(alert, 'createDialog').and.returnValue(of(['not-ok']));
    spyOn(component, 'doSubmit');

    fixture.detectChanges();
    component.submit();

    expect(alert.createDialog).toHaveBeenCalled();
    expect(component.doSubmit).not.toHaveBeenCalled();
  });
});


