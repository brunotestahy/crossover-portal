import { BreakpointObserver } from '@angular/cdk/layout';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfModalService } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { take } from 'rxjs/operators';
import { mock } from 'ts-mockito';

import { HireService } from 'app/core/services/hire/hire.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { APPLICANTS_RESPONSE } from 'app/core/services/mocks/applicants.mock';
import { TECH_JOB_DETAIL_TESTS_MOCK } from 'app/core/services/mocks/hire.mock';
import { EndorsementCommentsComponent } from 'app/modules/account-manager/pages/endorsement-comments/endorsement-comments.component';
import { EndorsementFilterComponent } from 'app/modules/account-manager/pages/endorsement-filter/endorsement-filter.component';
import { EndorsementNotesComponent } from 'app/modules/account-manager/pages/endorsement-notes/endorsement-notes.component';
import { EndorsementComponent } from 'app/modules/account-manager/pages/endorsement/endorsement.component';
import { EndorsementService } from 'app/modules/account-manager/shared/endorsement.service';

describe('EndorsementComponent', () => {
  let component: EndorsementComponent;
  let fixture: ComponentFixture<EndorsementComponent>;

  let breakpointService: BreakpointObserver;
  let endorsementService: EndorsementService;
  let hireService: HireService;
  let identityService: IdentityService;
  let modalService: DfModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EndorsementComponent,
      ],
      providers: [
        { provide: BreakpointObserver, useFactory: () => mock(BreakpointObserver) },
        { provide: EndorsementService, useFactory: () => mock(EndorsementService) },
        { provide: HireService, useFactory: () => mock(HireService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorsementComponent);
    component = fixture.componentInstance;

    breakpointService = TestBed.get(BreakpointObserver);
    endorsementService = TestBed.get(EndorsementService);
    hireService = TestBed.get(HireService);
    identityService = TestBed.get(IdentityService);
    modalService = TestBed.get(DfModalService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load the jobs as a Manager when the screen is initialized', () => {
    component.isMobile = true;
    const breakPoint = { matches: false };
    const jobs = Object.assign([
      { status: component.pipelineStatus.active },
      { status: component.pipelineStatus.onHold },
      { status: component.pipelineStatus.closed },
      ]);
    spyOn(breakpointService, 'observe').and.returnValue(of(breakPoint).pipe(take(1)));
    spyOn(hireService, 'getJobs').and.returnValue(of(jobs).pipe(take(1)));
    spyOn(identityService, 'currentUserIsAccountManager').and.returnValue(of(true).pipe(take(1)));

    fixture.detectChanges();

    expect(component.isMobile).toBe(false);
    expect(component.avatarType).toBe(component.accountManager);
    expect(component.jobs.length).toBe(2);
  });

  it('should throw an error as a Recruiter when the the jobs are loaded', () => {
    component.isMobile = true;
    const breakPoint = { matches: false };
    spyOn(breakpointService, 'observe').and.returnValue(of(breakPoint).pipe(take(1)));
    spyOn(hireService, 'getJobs').and.returnValue(ErrorObservable.create({ error: 'Error' }));
    spyOn(identityService, 'currentUserIsAccountManager').and.returnValue(of(false).pipe(take(1)));

    fixture.detectChanges();

    expect(component.isMobile).toBe(false);
    expect(component.avatarType).toBe(component.recruitmentAnalyst);
    expect(component.jobs).toBeUndefined();
  });

  it('should search for the applicants when a specific job is selected', () => {
    const option = Object.assign({ id: 13 });
    const job = Object.assign({ visibleManagers: {} });
    component.jobs = Object.assign([{ id: 11 }, { id: 13 }]);
    spyOn(hireService, 'getJob').and.returnValue(of(job).pipe(take(1)));
    spyOn(endorsementService, 'getRubrics').and.returnValue('');
    spyOn(component, 'searchApplicants').and.returnValue('');

    component.jobChange(option);

    expect(component.jobVisibleManagers).toBe(job.visibleManagers);
    expect(component.selectedJob).toBeDefined();
    expect(endorsementService.getRubrics).toHaveBeenCalledWith(job);
    expect(component.searchApplicants).toHaveBeenCalledWith(option);
  });

  it('should throw an error when a specific job is selected', () => {
    const option = Object.assign({ id: 13 });
    spyOn(hireService, 'getJob').and.returnValue(ErrorObservable.create({ error: 'Error' }));
    spyOn(endorsementService, 'getRubrics').and.returnValue('');
    spyOn(component, 'searchApplicants').and.returnValue('');

    component.jobChange(option);

    expect(component.selectedJob).toBeUndefined();
    expect(component.isLoading).toBe(false);
    expect(endorsementService.getRubrics).not.toHaveBeenCalledWith();
    expect(component.searchApplicants).toHaveBeenCalledWith(option);
  });

  it('should search the applicants and load the table when the job is selected', () => {
    component.isLoading = true;
    component.isTableLoading = true;
    component.isTableContentLoading = true;
    component.selectedJob = TECH_JOB_DETAIL_TESTS_MOCK;
    spyOn(hireService, 'searchApplicantsV2').and.returnValue(of(APPLICANTS_RESPONSE).pipe(take(1)));
    spyOn(endorsementService, 'createDataModels').and.returnValue('');

    component.searchApplicants(Object.assign({ id: 13 }));

    expect(component.isLoading).toBe(false);
    expect(component.isTableLoading).toBe(false);
    expect(component.isTableContentLoading).toBe(false);
    expect(endorsementService.createDataModels).toHaveBeenCalledWith(component.data);
  });

  it('should not search the applicants when the table is scrolled until the end by the first time', () => {
    component.data = [];
    component.selectedJob = TECH_JOB_DETAIL_TESTS_MOCK;
    component.selectedJob.tests = Object.assign({ value: null }).value;
    if (component.selectedJob.rubricTest) {
      component.selectedJob.rubricTest.test.resumeRubrics = Object.assign({ value: null }).value;
    }
    spyOn(hireService, 'searchApplicantsV2').and.returnValue(of(APPLICANTS_RESPONSE).pipe(take(1)));
    spyOn(endorsementService, 'createDataModels').and.returnValue('');

    component.onScrollEnd();

    expect(endorsementService.createDataModels).not.toHaveBeenCalledWith();
  });

  // TODO: temporary test to cover the infinite scroll issue in the df-grid
  it('should increase more 50 rows when the table is scrolled until the end', () => {
    component.isLoading = true;
    component.showMoreRecords = true;
    component.isTableLoading = true;
    component.isTableContentLoading = true;
    component.isFirstInfiniteScroll = false;
    component.data = [];
    component.selectedJob = TECH_JOB_DETAIL_TESTS_MOCK;
    component.selectedJob.tests = Object.assign({ value: null }).value;
    if (component.selectedJob.rubricTest) {
      component.selectedJob.rubricTest.test.resumeRubrics = Object.assign({ value: null }).value;
    }
    spyOn(hireService, 'searchApplicantsV2').and.returnValue(of(APPLICANTS_RESPONSE).pipe(take(1)));
    spyOn(endorsementService, 'createDataModels').and.returnValue('');

    component.onScrollEnd();

    expect(component.isTableLoading).toBe(false);
    expect(component.isTableContentLoading).toBe(false);
    expect(endorsementService.createDataModels).toHaveBeenCalledWith(component.data);
  });

  it('should throw an error when the table is loaded', () => {
    component.isLoading = true;
    component.isTableLoading = true;
    component.isTableContentLoading = true;
    spyOn(hireService, 'searchApplicantsV2').and.returnValue(ErrorObservable.create({ error: 'Error' }));

    component.searchApplicants(Object.assign({ id: 13 }));

    expect(component.isLoading).toBe(false);
    expect(component.isTableLoading).toBe(false);
    expect(component.isTableContentLoading).toBe(false);
  });

  it('should filter the table by name when the user focus out the name input', () => {
    component.jobForm.patchValue({
      searchWord: 'test',
    });
    component.temporaryFilterValues.searchWord = '';
    spyOn(component, 'searchApplicants').and.returnValue('');

    component.onBlurNameFilterInput();

    expect(component.isTableLoading).toBe(true);
    expect(component.searchApplicants).toHaveBeenCalledWith();
  });

  it('should not filter the table by name when the user leaves the input without changing its value', () => {
    component.jobForm.patchValue({
      searchWord: 'test',
    });
    component.temporaryFilterValues.searchWord = 'test';
    spyOn(component, 'searchApplicants').and.returnValue('');

    component.onBlurNameFilterInput();

    expect(component.isTableLoading).toBe(false);
    expect(component.searchApplicants).not.toHaveBeenCalledWith();
  });

  it('should filter the table by keyword when the user focus out the keyword input', () => {
    component.jobForm.patchValue({
      resumeSearchQuery: 'test',
    });
    component.temporaryFilterValues.resumeSearchQuery = '';
    spyOn(component, 'searchApplicants').and.returnValue('');

    component.onBlurKeywordFilterInput();

    expect(component.isTableLoading).toBe(true);
    expect(component.searchApplicants).toHaveBeenCalledWith();
  });

  it('should not filter the table by keyword when the user leaves the input without changing its value', () => {
    component.jobForm.patchValue({
      searchWord: 'test',
    });
    component.temporaryFilterValues.searchWord = 'test';
    spyOn(component, 'searchApplicants').and.returnValue('');

    component.onBlurKeywordFilterInput();

    expect(component.isTableLoading).toBe(false);
    expect(component.searchApplicants).not.toHaveBeenCalledWith();
  });

  it('should filter the table by keyword when the user presses enter', () => {
    component.jobForm.patchValue({
      resumeSearchQuery: 'test',
    });
    spyOn(component, 'searchApplicants').and.returnValue('');

    component.onEnterPressKeywordFilterInput();

    expect(component.isTableLoading).toBe(true);
    expect(component.temporaryFilterValues.resumeSearchQuery).toBe('test');
    expect(component.searchApplicants).toHaveBeenCalledWith();
  });

  it('should filter the table by name when the user presses enter', () => {
    component.jobForm.patchValue({
      searchWord: 'test',
    });
    spyOn(component, 'searchApplicants').and.returnValue('');

    component.onEnterPressNameFilterInput();

    expect(component.isTableLoading).toBe(true);
    expect(component.temporaryFilterValues.searchWord).toBe('test');
    expect(component.searchApplicants).toHaveBeenCalledWith();
  });

  it('should open the filter modal and reload the table when it is closed with filter params', () => {
    const filterOptions = Object.assign({ id: 13 });
    spyOn(modalService, 'open').and.returnValue({
      onClose: of(filterOptions),
    });
    spyOn(component, 'searchApplicants').and.returnValue('');

    component.showFilter();

    expect(modalService.open).toHaveBeenCalledWith(EndorsementFilterComponent, {
      customClass: 'endorsement-filter-modal',
      data: [component.selectedJob, {}],
    });

    modalService.open({}).onClose.pipe(take((1)))
      .subscribe(() => {
        expect(component.hasFilter).toBe(true);
        expect(component.isTableLoading).toBe(true);
        expect(component.filterOptions).toBe(filterOptions);
        expect(component.searchApplicants).toHaveBeenCalledWith(undefined, true, filterOptions);
      });
  });

  it('should open the filter modal and not reload the table when it is closed without filter params', () => {
    const filterOptions = null;
    spyOn(modalService, 'open').and.returnValue({
      onClose: of(filterOptions),
    });
    spyOn(component, 'searchApplicants').and.returnValue('');

    component.showFilter();

    modalService.open({}).onClose.pipe(take((1)))
      .subscribe(() => {
        expect(component.hasFilter).toBe(false);
        expect(component.searchApplicants).not.toHaveBeenCalledWith();
      });
  });

  it('should open the filter modal and reload the table when there are some selected tasks', () => {
    const filterOptions = { applicationStatus: 'ACCEPTED', tasks: ['task'] };
    spyOn(modalService, 'open').and.returnValue({
      onClose: of(filterOptions),
    });
    spyOn(component, 'searchApplicants').and.returnValue('');

    component.showFilter();

    modalService.open({}).onClose.pipe(take((1)))
      .subscribe(() => {
        expect(component.hasFilter).toBe(true);
        expect(!!filterOptions.tasks).toBe(false);
        expect(component.searchApplicants).not.toHaveBeenCalledWith();
      });
  });

  it('should open the notes modal and and update the applicant notes when the modal is closed', () => {
    const application = Object.assign({ id: 13, lastNote: '' });
    const note = 'note';
    component.avatarType = component.accountManager;
    spyOn(modalService, 'open').and.returnValue({
      onClose: of(note),
    });

    component.showNotes(application);

    expect(modalService.open).toHaveBeenCalledWith(EndorsementNotesComponent, {
      customClass: 'endorsement-notes-modal',
      data: {
        id: application.id,
        avatarType: component.avatarType,
        noteType: 'AM_RA',
      },
    });

    modalService.open({}).onClose.pipe(take((1))).subscribe(() => expect(application.lastNote).toBe(note));
  });

  it('should open the note modal and do nothing when it is closed without notes', () => {
    const application = Object.assign({ id: 13, lastNote: '' });
    const note = 'note';
    component.avatarType = component.accountManager;
    spyOn(modalService, 'open').and.returnValue({
      onClose: of(''),
    });

    component.showNotes(application);

    modalService.open({}).onClose.pipe(take((1))).subscribe(() => expect(application.lastNote).not.toBe(note));
  });

  it('should open the comment modal when the the View Comment link is clicked', () => {
    const application = Object.assign({ id: 13, candidate: { printableName: 'John' } });
    component.avatarType = component.accountManager;
    component.selectedJob = Object.assign({ title: 'Title' });
    component.jobVisibleManagers = Object.assign({});
    spyOn(modalService, 'open').and.returnValue('');

    component.showComments(application);

    expect(modalService.open).toHaveBeenCalledWith(EndorsementCommentsComponent, {
      customClass: 'endorsement-comments-modal',
      data: {
        id: application.id,
        avatarType: component.avatarType,
        type: 'AM_HM',
        candidateName: application.candidate.printableName,
        jobTitle: component.selectedJob.title,
        managers: component.jobVisibleManagers,
      },
    });
  });

  it('should check if the avatar is Manager when requested', () => {
    component.avatarType = component.accountManager;

    expect(component.isAccountManager).toBe(true);
  });

  it('should enable/disable the endorsement button when the table is loaded', () => {
    component.data = Object.assign([{ id: 1 }]);

    expect(component.allowEndorse).toBe(true);

    component.data = Object.assign([]);
    component.selectedRows = Object.assign([{ status: component.applicationStatus.inProgress }]);

    expect(component.allowEndorse).toBe(true);
  });

  it('should enable the endorsement button or not when a row is selected', () => {
    component.selectedRows = Object.assign([]);

    expect(component.hasSelectedInEndorsementPhase).toBe(true);

    component.selectedRows = Object.assign([{
      status: component.applicationStatus.inProgress,
      task: component.taskStatus.recruiterConductsPreMarketplaceInterview.value,
    }]);

    expect(component.hasSelectedInEndorsementPhase).toBe(true);
  });

  it('should enable the preview button or not when a row is selected', () => {
    component.selectedRows = Object.assign([]);

    expect(component.hasSelectedNotInPreview).toBe(true);

    component.selectedRows = Object.assign([{
      previewToHiringManager: false,
    }]);

    expect(component.hasSelectedNotInPreview).toBe(false);
  });

  it('should show the keyboard success label when each row is loaded', () =>  {
    const rkTestScore = Object.assign({});
    const rkScore = 65;
    const normalizedNumber = 13;
    const matTestScore = Object.assign({});
    const matScore = 1;

    expect(component.hasKeywordSuccessLabel(rkTestScore, rkScore, normalizedNumber, matTestScore, matScore)).toBe(true);
  });

  it('should show the keyboard warning label when each row is loaded', () =>  {
    const rkTestScore = Object.assign({});
    const rkScore = 13;
    const normalizedNumber = 50;
    const matTestScore = Object.assign({});
    const matScore = 1;

    expect(component.hasKeywordWarningLabel(rkTestScore, rkScore, normalizedNumber, matTestScore, matScore)).toBe(true);
  });

  it('should display the overall resume score when the table is loaded', () => {
    let applicant = Object.assign({ overAllResumeGrad: 10 });

    expect(component.getOverAllResumeGrad(applicant)).toBe(applicant.overAllResumeGrad);

    applicant = Object.assign({ overAllResumeGrad: null });

    expect(component.getOverAllResumeGrad(applicant)).toBe('-');
  });

  it('should display the answer score when the table is loaded and the answers are provided', () => {
    let answers = Object.assign([{ sequenceNumber: 10, score: 3 }]);

    expect(component.getFiveQAnswer(answers, 10)).toBe(3);

    answers = Object.assign([{ value: null }]).value;

    expect(component.getFiveQAnswer(answers, 10)).toBe('-');
  });

  it('should enable/disable the passers preview button when a row is selected', () => {
    component.selectedRows = Object.assign([]);

    expect(component.hasSelectedForPassersPreview).toBe(true);

    component.selectedRows = Object.assign([{
      flowType: 'HACKERRANK_FIVEQ',
    }]);

    expect(component.hasSelectedForPassersPreview).toBe(true);

    component.selectedRows = Object.assign([{
      task: component.taskStatus.accountManagerEndorsesApplication.value,
    }]);

    expect(component.hasSelectedForPassersPreview).toBe(true);

    component.selectedRows = Object.assign([{
      previewTestPasser: true,
    }]);

    expect(component.hasSelectedForPassersPreview).toBe(true);
  });

  it('should display or not the endorsement button for each row when the table is loaded', () => {
    const applicant = Object.assign({ task: component.taskStatus.accountManagerEndorsesApplication.value });

    expect(component.shouldShowEndorsementButton(applicant)).toBe(true);
  });

  it('should display or not the reject button for each row when the table is loaded', () => {
    let applicant = Object.assign({ task: component.taskStatus.accountManagerEndorsesApplication.value });

    expect(component.shouldShowRejectButton(applicant)).toBe(true);

    applicant = Object.assign({ task: component.taskStatus.recruiterConductsPreMarketplaceInterview.value });

    expect(component.shouldShowRejectButton(applicant)).toBe(true);
  });

  it('should open the close action', () => {
    // TODO: this test will be updated once its component be available
    component.close();
  });

  it('should open the reject action', () => {
    // TODO: this test will be updated once its component be available
    component.reject();
  });

  it('should open the endorsement action', () => {
    // TODO: this test will be updated once its component be available
    component.endorsement();
  });

  it('should open the viewFiveLink action', () => {
    // TODO: this test will be updated once its component be available
    component.viewFiveLink();
  });

  it('should update the selected applicants to preview when the Preview Resume button is clicked', () => {
    component.selectedRows = Object.assign([{ id: 13, previewToHiringManager: false }]);
    component.data = [];
    spyOn(hireService, 'addNewPreview').and.returnValue(of({}).pipe(take(1)));

    component.previewResumes();

    expect(component.isTableLoading).toBe(false);
    expect(component.selectedRows[0].previewToHiringManager).toBe(true);
  });

  it('should throw an error when the Preview Resume button is clicked', () => {
    component.selectedRows = Object.assign([{ id: 13, previewToHiringManager: false }]);
    spyOn(hireService, 'addNewPreview').and.returnValue(ErrorObservable.create({ error: { text: 'Error' } }));

    component.previewResumes();

    expect(component.error).toBe('Error');
    expect(component.isTableLoading).toBe(false);
    expect(component.selectedRows[0].previewToHiringManager).toBe(false);
  });

  it('should update the selected applicants to test passer when the Preview Passers button is clicked', () => {
    component.selectedRows = Object.assign([{ id: 13, previewTestPasser: false }]);
    component.data = [];
    spyOn(hireService, 'addNewPreview').and.returnValue(of({}).pipe(take(1)));

    component.previewPassers();

    expect(component.isTableLoading).toBe(false);
    expect(component.selectedRows[0].previewTestPasser).toBe(true);
  });

  it('should throw an error when the Preview Passers button is clicked', () => {
    component.selectedRows = Object.assign([{ id: 13, previewTestPasser: false }]);
    spyOn(hireService, 'addNewPreview').and.returnValue(ErrorObservable.create({ error: { text: 'Error' } }));

    component.previewPassers();

    expect(component.error).toBe('Error');
    expect(component.isTableLoading).toBe(false);
    expect(component.selectedRows[0].previewTestPasser).toBe(false);
  });

  it('should remove the preview for the selected applicant when the icon is clicked', () => {
    const applicant = Object.assign({ id: 13, previewTestPasser: true, previewToHiringManager: true });
    component.data = [];
    spyOn(hireService, 'removePreview').and.returnValue(of({}).pipe(take(1)));

    component.removePreview(applicant);

    expect(component.isTableLoading).toBe(false);
    expect(applicant.previewTestPasser).toBe(false);
    expect(applicant.previewToHiringManager).toBe(false);
  });

  it('should throw an error when trying to remove the preview', () => {
    const applicant = Object.assign({ id: 13, previewTestPasser: true, previewToHiringManager: true });
    component.data = [];
    spyOn(hireService, 'removePreview').and.returnValue(ErrorObservable.create({ error: { text: 'Error' } }));

    component.removePreview(applicant);

    expect(component.error).toBe('Error');
  });

  it('should update rubric scores when the rubric scores already exist', () => {
    const value = '20';
    const applicant = Object.assign({ id: 2, overAllResumeGrad: 13 });
    component.rubricScoresArray = Object.assign([{
      id: 2,
      testsEvaluations: [
        { resumeRubricScores: [{ score: 11 }] },
      ],
    }]);

    component.addRubricScores(applicant, value);

    expect(component.rubricScoresArray[0].testsEvaluations[0].resumeRubricScores[0].score).toBe(parseInt(value, 10));
  });

  it('should create a new rubric scores when the rubric score does not exist', () => {
    const value = '20';
    const applicant = Object.assign({ id: 2, overAllResumeGrad: 13, rubricEval: { resumeRubricScores: [{ score: 11 }] } });
    component.rubricScoresArray = Object.assign([]);

    component.addRubricScores(applicant, value);

    expect(component.rubricScoresArray[0].id).toBe(applicant.id);
    expect(component.rubricScoresArray[0].testsEvaluations[0].resumeRubricScores[0].score).toBe(parseInt(value, 10));
  });

  it('should delete a rubric score when the input is empty', () => {
    const value = '';
    const applicant = Object.assign({ id: 2, overAllResumeGrad: 13, rubricEval: { resumeRubricScores: [{ score: 11 }] } });
    component.rubricScoresArray = Object.assign([applicant]);

    component.addRubricScores(applicant, value);

    expect(component.rubricScoresArray.length).toBe(0);
  });

  it('should create a new rubric score with 0 as initial value when the fist score will be updated', () => {
    const value = '';
    const applicant = Object.assign({ id: 2, overAllResumeGrad: 13, rubricEval: { resumeRubricScores: [{ score: 11 }] } });
    component.rubricScoresArray = Object.assign([]);

    component.addRubricScores(applicant, value);

    expect(component.rubricScoresArray[0].testsEvaluations[0].resumeRubricScores[0].score).toBe(0);
  });

  it('should not create a new rubric score when the score has a negative value', () => {
    const value = '-2';
    const applicant = Object.assign({ id: 2, overAllResumeGrad: 13, rubricEval: { resumeRubricScores: [{ score: 11 }] } });
    component.rubricScoresArray = Object.assign([]);

    component.addRubricScores(applicant, value);

    expect(component.rubricScoresArray.length).toBe(0);
  });

  it('should not create a new rubric score when the score has a negative value and scores array not empty', () => {
    const value = '-2';
    const applicant = Object.assign({ id: 2, overAllResumeGrad: 13, rubricEval: { resumeRubricScores: [{ score: 11 }] } });
    component.rubricScoresArray = Object.assign([{ id: 5, rubricEval: {} }]);

    component.addRubricScores(applicant, value);

    expect(component.rubricScoresArray.length).toBe(1);
  });

  it('should do nothing when the input value has the same score already defined', () => {
    const value = '20';
    const applicant = Object.assign({ id: 2, overAllResumeGrad: 20 });
    component.rubricScoresArray = Object.assign([]);

    component.addRubricScores(applicant, value);

    expect(component.rubricScoresArray.length).toBe(0);
  });

  it('should save the scores and reload the table when they are changed in the inputs', () => {
    component.rubricScoresArray = Object.assign([{
      id: 2,
      testsEvaluations: [
        { resumeRubricScores: [{ score: 11 }] },
      ],
    }]);
    spyOn(hireService, 'updateResumeRubricScore').and.returnValue(of({}));
    spyOn(component, 'searchApplicants').and.returnValue('');

    component.saveScores();

    expect(component.isTableLoading).toBe(true);
    expect(component.rubricScoresArray.length).toBe(0);
    expect(component.searchApplicants).toHaveBeenCalled();
  });

  it('should throw an error when trying to save the scores', () => {
    component.rubricScoresArray = Object.assign([{
      id: 2,
      testsEvaluations: [
        { resumeRubricScores: [{ score: 11 }] },
      ],
    }]);
    spyOn(hireService, 'updateResumeRubricScore').and.returnValue(ErrorObservable.create({ error: { text: 'Error' } }));
    spyOn(component, 'searchApplicants').and.returnValue('');

    component.saveScores();

    expect(component.error).toBe('Error');
    expect(component.searchApplicants).not.toHaveBeenCalled();
  });

  it('should display the rubric description when the descriptive rubric link is clicked', () => {
    const rubric = Object.assign({});
    const template = Object.assign({});
    spyOn(modalService, 'open').and.returnValue('');

    component.openRubricDescriptionModal(template, rubric);

    expect(modalService.open).toHaveBeenCalledWith(template, { data: rubric });
  });

  it('should load the table sorted by a column when it is clicked', () => {
    const tableGrid = Object.assign({ sortField: 'Name', sortOrder: 1 });
    spyOn(component, 'searchApplicants').and.returnValue('');

    component.onTableSort(tableGrid);

    expect(component.isTableContentLoading).toBe(true);
    expect(component.searchField).toBe(tableGrid.sortField);
    expect(component.searchOrder).toBe('ASC');
    expect(component.searchApplicants).toHaveBeenCalledWith();
  });

  it('should load the table sorted by the task status column when it is clicked', () => {
    const tableGrid = Object.assign({ sortField: 'taskStatus', sortOrder: -1 });
    spyOn(component, 'searchApplicants').and.returnValue('');

    component.onTableSort(tableGrid);

    expect(component.isTableContentLoading).toBe(true);
    expect(component.searchField).toBe('Status');
    expect(component.searchOrder).toBe('DESC');
    expect(component.searchApplicants).toHaveBeenCalledWith();
  });
});
