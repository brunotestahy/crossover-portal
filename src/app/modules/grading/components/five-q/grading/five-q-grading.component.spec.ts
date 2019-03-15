import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfModalService, DfModalSize } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { mock } from 'ts-mockito/lib/ts-mockito';

import { Job } from 'app/core/models/hire';
import { HireService } from 'app/core/services/hire/hire.service';
import { GRADING_DATA } from 'app/core/services/mocks/application-data.mock';
import { FIVEQ_CANDIDATE_GRADING_MOCK, FIVEQ_JOB_MOCK } from 'app/core/services/mocks/jobs.mock';
import { FiveQGradingComponent } from 'app/modules/grading/components/five-q/grading/five-q-grading.component';

describe('FiveQGradingComponent', () => {
  let component: FiveQGradingComponent;
  let fixture: ComponentFixture<FiveQGradingComponent>;
  let hireService: HireService;
  let modalService: DfModalService;
  const jobDetails = FIVEQ_JOB_MOCK as Job;
  const mockedUrl = 'mocked-url';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FiveQGradingComponent,
      ],
      providers: [
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        { provide: HireService, useFactory: () => mock(HireService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiveQGradingComponent);
    component = fixture.componentInstance;
    hireService = TestBed.get(HireService);
    modalService = TestBed.get(DfModalService);
    component.selectedJob = jobDetails;
    spyOn(hireService, 'searchApplicants').and.returnValue(of({ content:
      GRADING_DATA
    }));
    spyOn(modalService, 'open').and.returnValue({});
    spyOn(hireService, 'getApplicationFile').and.returnValue(of(mockedUrl));
  });

  it('should be created', () => expect(component).toBeTruthy());

  it('should load candidates and questions', () => {

    fixture.detectChanges();
    expect(component.candidates.length).toBe(1);
    expect(component.lowResumeScoreCandidates.length).toBe(1);
    expect(component.questions.length).toBe(6);
  });

  it('should finalize candidate grading', () => {
    spyOn(hireService, 'finalizeFiveQEvaluation').and.returnValue(of(true));
    fixture.detectChanges();
    component.finalizeCandidateGrading(component.candidates[0]);
    expect(hireService.finalizeFiveQEvaluation).toHaveBeenCalledWith(component.candidates[0].id);
  });

  it('should show all answers modal', () => {
    fixture.detectChanges();
    component.showAllAnswersModal(component.candidates[0]);
    expect(modalService.open).toHaveBeenCalledWith(component.allAnswersModal, {
      size: DfModalSize.Large
    });
  });

  it('should show questions modal', () => {
    fixture.detectChanges();
    component.showQuestionModal(0);
    expect(modalService.open).toHaveBeenCalledWith(component.questionModal, {
      size: DfModalSize.Large
    });
  });

  it('should update and get answer value', () => {
    fixture.detectChanges();
    component.updateAnswerValue({ target: { value : '5'}}, component.candidates[0], 0);
    expect(component.getAnswerValue(component.candidates[0], 0)).toBe('5');
  });

  it('should open resume file', () => {
    const url = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(mockedUrl)}`;
    spyOn(window, 'open').and.returnValue({ location: { href: url }})
    fixture.detectChanges();
    component.openResumeFile(fixture.componentInstance.candidates[0]);
    expect(component.newTab !== null && component.newTab.location.href === url).toBe(true);
  });

  it('should not open resume file when there is not a resume file', () => {
    const url = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(mockedUrl)}`;
    spyOn(window, 'open').and.returnValue({ location: { href: url }});
    fixture.detectChanges();
    delete fixture.componentInstance.candidates[0].resumeFileId;
    component.openResumeFile(fixture.componentInstance.candidates[0]);
    expect(component.newTab).toBeUndefined();
  });

  it('should not open resume file when there is no new tab', () => {
    spyOn(window, 'open').and.returnValue(null);
    fixture.detectChanges();
    component.openResumeFile(fixture.componentInstance.candidates[0]);
    expect(component.newTab).toBeNull();
  });

  it('should format date', () => {
    const date = new Date(2018, 5, 22);
    expect(component.formatDate(date)).toBe('Jun 22');
  });

  it('should toggle low resume score candidates', () => {
    fixture.detectChanges();
    component.showLowResumeScore = false;
    component.toggleLowResumeScoreCandidates();
    expect(component.showLowResumeScore).toBe(true);
  });

  it('should save grades', () => {
    fixture.detectChanges();
    spyOn(hireService, 'saveEvaluations').and.returnValue(of(true));
    expect(component.isDoneDisabled(component.candidates[0])).toBe(true);

    component.saveGrades();
    expect(hireService.saveEvaluations).toHaveBeenCalledWith([FIVEQ_CANDIDATE_GRADING_MOCK, FIVEQ_CANDIDATE_GRADING_MOCK]);
  });
});
