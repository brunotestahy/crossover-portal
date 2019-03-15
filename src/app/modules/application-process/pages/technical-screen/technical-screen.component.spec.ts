import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import 'rxjs/add/observable/empty';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { mock } from 'ts-mockito';

import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { TechnicalScreenComponent } from 'app/modules/application-process/pages/technical-screen/technical-screen.component';

describe('TechnicalScreenComponent', () => {
  let component: TechnicalScreenComponent;
  let fixture: ComponentFixture<TechnicalScreenComponent>;

  let candidateService: CandidateService;

  let buttonEl: DebugElement;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          TechnicalScreenComponent,
        ],
        providers: [
          {provide: CandidateService, useFactory: () => mock(CandidateService)},
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalScreenComponent);
    component = fixture.componentInstance;
    candidateService = TestBed.get(CandidateService);
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should get the dependencies', () => {
    expect(candidateService).toBeTruthy();
  });

  it('should call get current application', () => {
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(empty());

    component.ngOnInit();

    expect(candidateService.getCurrentApplication).toHaveBeenCalled();
  });

  it('should setup username, password and url', () => {
    const usernameMock = 'username-mock';
    const passworMock = 'password-mock';
    const urlMock = 'http://url-mock.com';
    const testInstancesMock = [{
      'id': 0, 'test': {'type': 'HACKER_RANK', 'id': 5015},
      username: usernameMock, password: passworMock, url: urlMock,
    }];
    const jobApplicationMock = {
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
      testInstances: testInstancesMock,
    };
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of(jobApplicationMock));

    component.ngOnInit();

    expect(component.username).toBe(usernameMock);
    expect(component.password).toBe(passworMock);
    expect(component.url).toBe(urlMock);
  });

  it('should call goToTest on test button click', () => {
    spyOn(component, 'goToTest');
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(empty());

    buttonEl = fixture.debugElement.query(By.css('button'));
    buttonEl.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.goToTest).toHaveBeenCalled();
  });
});
