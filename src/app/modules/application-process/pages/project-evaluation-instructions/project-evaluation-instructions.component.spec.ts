import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DfAlertService, DfLoadingSpinnerService, DfModalService } from '@devfactory/ngx-df';
import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { of } from 'rxjs/observable/of';
import { mock } from 'ts-mockito';

import { JOB_APPLICATION_MOCK } from '../../../../core/services/mocks/job-application.mock';
import { PROJECT_EVALUATION_INVITATION_MOCK } from '../../../../core/services/mocks/project-evaluation.mock';
import { EscapeHtmlPipe } from '../../../../shared/pipes/keep-html.pipe';

import { ProjectEvaluationInstructionsComponent } from './project-evaluation-instructions.component';

describe('ProjectEvaluationInstructionsComponent', () => {
  let component: ProjectEvaluationInstructionsComponent;
  let fixture: ComponentFixture<ProjectEvaluationInstructionsComponent>;

  let candidateService: CandidateService;
  let loader: DfLoadingSpinnerService;
  let modal: DfModalService;
  let alert: DfAlertService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          ProjectEvaluationInstructionsComponent,
          EscapeHtmlPipe,
        ],
        providers: [
          {provide: CandidateService, useFactory: () => mock(CandidateService)},
          {provide: DfLoadingSpinnerService, useFactory: () => mock(DfLoadingSpinnerService)},
          {provide: DfModalService, useFactory: () => mock(DfModalService)},
          {provide: DfAlertService, useFactory: () => mock(DfAlertService)},
          {provide: Router, useFactory: () => mock(Router)},
          {provide: ActivatedRoute, useFactory: () => mock(ActivatedRoute)},
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEvaluationInstructionsComponent);
    component = fixture.componentInstance;
    candidateService = TestBed.get(CandidateService);
    loader = TestBed.get(DfLoadingSpinnerService);
    modal = TestBed.get(DfModalService);
    alert = TestBed.get(DfAlertService);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);

    spyOn(candidateService, 'getCurrentApplication')
      .and.returnValue(of(JOB_APPLICATION_MOCK));

    spyOn(candidateService, 'getProjectEvaluationInvitation')
      .and.returnValue(of(PROJECT_EVALUATION_INVITATION_MOCK));
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should get the dependencies', () => {
    expect(candidateService).toBeTruthy();
    expect(loader).toBeTruthy();
    expect(modal).toBeTruthy();
    expect(alert).toBeTruthy();
    expect(router).toBeTruthy();
    expect(route).toBeTruthy();
  });

  it('should call candidate service', () => {
    component.ngOnInit();

    expect(candidateService.getCurrentApplication).toHaveBeenCalled();
    expect(candidateService.getProjectEvaluationInvitation).toHaveBeenCalled();
  });

  it('should open prerequisites modal', () => {
    spyOn(modal, 'open');

    fixture.detectChanges();
    component.data.prerequisites = 'Mock Prerequisites';
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('button:first-child'));

    buttonEl.triggerEventHandler('click', null);

    expect(modal.open).toHaveBeenCalled();
  });

  it('should start project evaluation if ok is clicked inside ready for trial dialog', () => {
    spyOn(alert, 'createDialog').and.returnValue(of(['ok']));
    spyOn(component, 'doStartProject');

    fixture.detectChanges();
    component.startProject();

    expect(alert.createDialog).toHaveBeenCalled();
    expect(component.doStartProject).toHaveBeenCalled();
  });


  it('should not start project evaluation if cancel is clicked inside ready for trial dialog', () => {
    spyOn(alert, 'createDialog').and.returnValue(of(['not-ok']));
    spyOn(component, 'doStartProject');

    fixture.detectChanges();
    component.startProject();

    expect(alert.createDialog).toHaveBeenCalled();
    expect(component.doStartProject).not.toHaveBeenCalled();
  });

  it('should start project evaluation and redirect to project evaluation assignment page', () => {
    spyOn(candidateService, 'startProjectEvaluation').and.returnValue(of({}));
    spyOn(loader, 'hide');
    spyOn(router, 'navigate');
    const applicationId = JOB_APPLICATION_MOCK.id;

    fixture.detectChanges();
    component.doStartProject();

    expect(candidateService.startProjectEvaluation).toHaveBeenCalledWith(applicationId);
    expect(loader.hide).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['../project-evaluation-assignment'],
      {relativeTo: route});
  });
});


