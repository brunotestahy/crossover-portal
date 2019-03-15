import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { mock } from 'ts-mockito';

import { CandidateService } from 'app/core/services/candidate/candidate.service';
import {
  WrittenEvaluationWelcomeComponent,
} from 'app/modules/application-process/pages/written-evaluation-welcome/written-evaluation-welcome.component';
import Spy = jasmine.Spy;

describe('WrittenEvaluationWelcomeComponent', () => {
  let component: WrittenEvaluationWelcomeComponent;
  let fixture: ComponentFixture<WrittenEvaluationWelcomeComponent>;

  let candidateService: CandidateService;

  let route: ActivatedRoute;
  let router: Router;

  let candidateServiceSpy: Spy;
  const jobApplicationWithOutTestsMock = {
    id: 1521072417,
    applicationFlow: {id: 7, name: '5Q Only', flowDefinitionType: 'FIVEQ'},
    applicationType: 'NATIVE',
    candidate: {},
    job: {},
    resumeFile: {},
    score: 0,
    status: 'IN_PROGRESS',
    task: 'candidateSubmits5QTest',
    testScores: [],
    createdOn: '2018-03-15T23:16:22.000+0000',
    updatedOn: '2018-03-15T23:16:22.000+0000',
    variants: [],
    yearsOfExperience: 0,
    testInstances: [],
  };

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          WrittenEvaluationWelcomeComponent,
        ],
        providers: [
          { provide: CandidateService, useFactory: () => mock(CandidateService) },
          { provide: ActivatedRoute, useFactory: () => mock(ActivatedRoute) },
          { provide: Router, useFactory: () => mock(Router) },
          { provide: RouterLink, useFactory: () => mock(RouterLink) },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WrittenEvaluationWelcomeComponent);
    component = fixture.componentInstance;
    candidateService = TestBed.get(CandidateService);
    route = TestBed.get(ActivatedRoute);
    router = TestBed.get(Router);

    candidateServiceSpy = spyOn(candidateService, 'getCurrentApplication')
      .and.returnValue(of(jobApplicationWithOutTestsMock));
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should get the dependencies', () => {
    expect(candidateService).toBeTruthy();
    expect(router).toBeTruthy();
    expect(route).toBeTruthy();
  });

  it('should call candidate service', () => {
    component.ngOnInit();

    expect(candidateService.getCurrentApplication).toHaveBeenCalled();
  });

  it('should show written evaluation welcome page when test instances are not present', () => {
    spyOn(router, 'navigate');

    component.ngOnInit();

    expect(router.navigate).not.toHaveBeenCalled();
  });


  it('should redirect to written evaluation assignment when test instances are present', () => {
    const testInstances = [{'id': 0, 'test': {'type': 'FIVEQ', 'id': 5015}}];
    const jobApplicationWithTestsMock = {
      id: 1521072417,
      applicationFlow: {id: 7, name: '5Q Only', flowDefinitionType: 'FIVEQ'},
      applicationType: 'NATIVE',
      candidate: {},
      job: {},
      resumeFile: {},
      score: 0,
      status: 'IN_PROGRESS',
      task: 'candidateSubmits5QTest',
      testScores: [],
      createdOn: '2018-03-15T23:16:22.000+0000',
      updatedOn: '2018-03-15T23:16:22.000+0000',
      variants: [],
      yearsOfExperience: 0,
      testInstances: testInstances,
    };
    spyOn(router, 'navigate');
    candidateServiceSpy.and.returnValue(of(jobApplicationWithTestsMock));

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['../written-evaluation-assignment'],
      {relativeTo: route});
  });
});
