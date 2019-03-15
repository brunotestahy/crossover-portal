import { BreakpointObserver } from '@angular/cdk/layout';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { DFAlertButtonType, DfAlertService, DfModalService, DfToasterService } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { mock } from 'ts-mockito';

import { CandidateRow } from 'app/core/models/candidate';
import { TalentAvocateTest } from 'app/core/models/hire';
import { HireService } from 'app/core/services/hire/hire.service';
import { JOB_APPLICATION_MOCK } from 'app/core/services/mocks/job-application.mock';
import {
  TalentAdvocacyIndexPageComponent,
} from 'app/modules/talent-advocacy/pages/talent-advocacy-index-page/talent-advocacy-index-page.component';

describe('TalentAdvocacyIndexPageComponent', () => {
  let component: TalentAdvocacyIndexPageComponent;
  let fixture: ComponentFixture<TalentAdvocacyIndexPageComponent>;

  let alertService: DfAlertService;
  let breakpointObserver: BreakpointObserver;
  let hireService: HireService;
  let toasterService: DfToasterService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TalentAdvocacyIndexPageComponent,
      ],
      providers: [
        { provide: DfAlertService, useFactory: () => mock(DfAlertService) },
        { provide: BreakpointObserver, useFactory: () => mock(BreakpointObserver) },
        { provide: HireService, useFactory: () => mock(HireService) },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        { provide: DfToasterService, useFactory: () => mock(DfToasterService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentAdvocacyIndexPageComponent);
    component = fixture.componentInstance;

    alertService = TestBed.get(DfAlertService);
    breakpointObserver = TestBed.get(BreakpointObserver);
    hireService = TestBed.get(HireService);
    toasterService = TestBed.get(DfToasterService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load ngOnInit method and fetch all the applicants successfully', () => {
    const applicationMock = Object.assign(
      {...JOB_APPLICATION_MOCK, content: [JOB_APPLICATION_MOCK]}
    );
    spyOn(breakpointObserver, 'observe').and.returnValue(of([{ matches: true }]));
    spyOn(hireService, 'searchApplicants').and.returnValue(of(applicationMock));

    fixture.detectChanges();

    breakpointObserver.observe([])
      .subscribe(() => {
        expect(component.isLoading).toBe(false);
        expect(component.candidates).toBeDefined();
      });
  });

  it('should load the canAccept method and return true', () => {
    const candidateRow = Object.assign({
      testsEvaluations: [{
        type: 'TALENT_ADVOCATE_EVALUATION',
      }],
    }) as CandidateRow;

    expect(component.canAccept(candidateRow)).toBe(true);
  });

  it('should load the accept method and accept talent advocate successfully', () => {
    const candidateRow = Object.assign({ applicationId: 23 }) as CandidateRow;
    spyOn(component, 'ngOnInit').and.returnValue('');
    spyOn(hireService, 'acceptRejectTalentAdvocateAnswers').and.returnValue(of({}));

    component.accept(candidateRow);

    expect(component.isLoading).toBe(false);
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should load the accept method and throw an error covered by the API', () => {
    const candidateRow = Object.assign({ applicationId: 23 }) as CandidateRow;
    spyOn(hireService, 'acceptRejectTalentAdvocateAnswers').and.returnValue(_throw({ error: { text: 'Error' } }));

    component.accept(candidateRow);

    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('Error');
  });

  it('should load the accept method and throw an error not covered by the API', () => {
    const candidateRow = Object.assign({ applicationId: 23 }) as CandidateRow;
    spyOn(hireService, 'acceptRejectTalentAdvocateAnswers').and.returnValue(_throw({ error: {} }));

    component.accept(candidateRow);

    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('Error accepting candidate.');
  });

  it('should load the reject method and reject talent advocate successfully', () => {
    const candidateRow = Object.assign({ applicationId: 23 }) as CandidateRow;
    spyOn(component, 'ngOnInit').and.returnValue('');
    spyOn(hireService, 'acceptRejectTalentAdvocateAnswers').and.returnValue(of({}));
    spyOn(alertService, 'createDialog').and.returnValue(of([DFAlertButtonType.OK]));

    component.reject(candidateRow);

    expect(component.isLoading).toBe(false);
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should load the reject method and throw an error covered by the API', () => {
    const candidateRow = Object.assign({ applicationId: 23 }) as CandidateRow;
    spyOn(hireService, 'acceptRejectTalentAdvocateAnswers').and.returnValue(_throw({ error: { text: 'Error' } }));
    spyOn(alertService, 'createDialog').and.returnValue(of([DFAlertButtonType.OK]));

    component.reject(candidateRow);

    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('Error');
  });

  it('should load the reject method and throw an error not covered by the API', () => {
    const candidateRow = Object.assign({ applicationId: 23 }) as CandidateRow;
    spyOn(hireService, 'acceptRejectTalentAdvocateAnswers').and.returnValue(_throw({ error: {} }));
    spyOn(alertService, 'createDialog').and.returnValue(of([DFAlertButtonType.OK]));

    component.reject(candidateRow);

    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('Error accepting candidate.');
  });

  it('should load the reject method and do nothing after clicking in the Cancel button', () => {
    const candidateRow = Object.assign({ applicationId: 23 }) as CandidateRow;
    spyOn(hireService, 'acceptRejectTalentAdvocateAnswers').and.returnValue(of({}));
    spyOn(alertService, 'createDialog').and.returnValue(of([DFAlertButtonType.Cancel]));

    component.reject(candidateRow);

    expect(hireService.acceptRejectTalentAdvocateAnswers).not.toHaveBeenCalled();
  });

  it('should load the openForm method and build the form correctly', () => {
    const candidateRow = Object.assign({ applicationId: 23 }) as CandidateRow;
    const test = Object.assign({
      answers: [{
        question: { id: 23 },
      }],
    });
    spyOn(hireService, 'getPreHireApplicationTest').and.returnValue(of(test));

    component.openForm(candidateRow);

    expect(component.isLoadingForm).toBe(false);
    expect(component.callFormGroup).toBeDefined();
    expect(component.formData).toEqual(test);
  });

  it('should load the openForm method and build the form correctly with a mandatory test', () => {
    const candidateRow = Object.assign({ applicationId: 23 }) as CandidateRow;
    const test = Object.assign({
      answers: [{
        question: { id: 23, mandatory: true },
      }],
    });
    spyOn(hireService, 'getPreHireApplicationTest').and.returnValue(of(test));

    component.openForm(candidateRow);

    expect(component.isLoadingForm).toBe(false);
    expect(component.callFormGroup).toBeDefined();
    expect(component.formData).toEqual(test);
  });

  it('should load and build the form correctly with a mandatory test and the type as Select List', () => {
    const candidateRow = Object.assign({ applicationId: 23 }) as CandidateRow;
    const test = Object.assign({
      answers: [{
        answer: 'Correct',
        question: { id: 23, mandatory: true, type: 'SELECT_LIST' },
      }],
    });
    spyOn(hireService, 'getPreHireApplicationTest').and.returnValue(of(test));

    component.openForm(candidateRow);

    expect(component.isLoadingForm).toBe(false);
    expect(component.callFormGroup).toBeDefined();
    expect(component.formData).toEqual(test);
  });

  it('should load the openForm method and throw an error when trying to build the form', () => {
    const candidateRow = Object.assign({ applicationId: 23 }) as CandidateRow;
    spyOn(hireService, 'getPreHireApplicationTest').and.returnValue(_throw({ error: { text: 'Error' } }));

    component.openForm(candidateRow);

    expect(component.isLoadingForm).toBe(false);
    expect(component.errorForm).toBe('Error');
  });

  it('should load the onFormSubmit method and save the form correctly', () => {
    const candidateRow = Object.assign({ applicationId: 23 }) as CandidateRow;
    component.callFormGroup.addControl('id', new FormControl(null, Validators.required));
    component.selectedCandidate = candidateRow;
    component.formData = Object.assign({
      answers: [{
        answer: 'Correct',
        question: { id: 23, mandatory: true, type: 'SELECT_LIST' },
      }],
    }) as TalentAvocateTest;
    spyOn(component, 'ngOnInit').and.returnValue('');
    spyOn(hireService, 'updateHireApplicationTest').and.returnValue(of({}));

    component.callFormGroup.patchValue({ id: 23 });

    component.onFormSubmit(component.ngOnInit);

    expect(component.isSavingForm).toBe(false);
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should load the onFormSubmit method and throw an error when trying to save the form', () => {
    const candidateRow = Object.assign({ applicationId: 23 }) as CandidateRow;
    component.callFormGroup.addControl('id', new FormControl(null, Validators.required));
    component.selectedCandidate = candidateRow;
    component.formData = Object.assign({
      answers: [{
        answer: 'Correct',
        question: { id: 23, mandatory: true, type: 'SELECT_LIST' },
      }],
    }) as TalentAvocateTest;
    spyOn(component, 'ngOnInit').and.returnValue('');
    spyOn(hireService, 'updateHireApplicationTest').and.returnValue(_throw({ error: { text: 'Error' } }));

    component.callFormGroup.patchValue({ id: 23 });

    component.onFormSubmit(component.ngOnInit);

    expect(component.isSavingForm).toBe(false);
    expect(component.error).toBe('Error');
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('should load the onFormSubmit method and do nothing with an invalid form', fakeAsync(() => {
    component.callFormGroup.addControl('id', new FormControl(null, Validators.required));
    spyOn(component, 'ngOnInit').and.returnValue('');

    component.onFormSubmit(component.ngOnInit);

    tick(2500);

    expect(component.ngOnInit).not.toHaveBeenCalled();
  }));

  it('should load the uploadTournamentCandidatesFile method and upload the file successfully', () => {
    const file = Object.assign({ id: 23 }) as File;
    spyOn(hireService, 'uploadCandidatesFile').and.returnValue(of({}));
    spyOn(toasterService, 'popSuccess');

    component.uploadTournamentCandidatesFile(file);

    expect(toasterService.popSuccess).toHaveBeenCalledWith('File is uploaded, you will get an email soon with the import results.');
  });

  it('should load the uploadTournamentCandidatesFile method and throw an error', () => {
    const file = Object.assign({ id: 23 }) as File;
    spyOn(hireService, 'uploadCandidatesFile').and.returnValue(_throw({ error: { text: 'Error' } }));

    component.uploadTournamentCandidatesFile(file);

    expect(component.error).toBe('Error');
  });

  it('should load the uploadTournamentCandidatesFile method and do nothing with a null file', () => {
    const file = Object.assign({ entry: null });
    spyOn(hireService, 'uploadCandidatesFile');

    component.uploadTournamentCandidatesFile(file.entry);

    expect(hireService.uploadCandidatesFile).not.toHaveBeenCalled();
  });
});
