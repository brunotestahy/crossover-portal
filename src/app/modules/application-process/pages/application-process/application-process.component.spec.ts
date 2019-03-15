import { BreakpointObserver } from '@angular/cdk/layout';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DfAlertService, DfLoadingSpinnerService } from '@devfactory/ngx-df';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { mock } from 'ts-mockito';

import { APPLICATION_FLOW_STEPS } from '../../../../core/constants/application-process/application-flow-steps';
import { CandidateService } from '../../../../core/services/candidate/candidate.service';
import { HireService } from '../../../../core/services/hire/hire.service';
import { JOB_DATA_MOCK } from '../../../../core/services/mocks/job-data.mock';
import { ApplicationProcessService } from '../../shared/application-process.service';

import { ApplicationProcessComponent } from './application-process.component';


describe('ApplicationProcessComponent', () => {
  let component: ApplicationProcessComponent;
  let fixture: ComponentFixture<ApplicationProcessComponent>;

  let candidateService: CandidateService;
  let hireService: HireService;
  let applicationProcessService: ApplicationProcessService;
  let router: Router;
  let breakpointObserver: BreakpointObserver;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationProcessComponent],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: CandidateService, useFactory: () => mock(CandidateService) },
        { provide: HireService, useFactory: () => mock(HireService) },
        { provide: ApplicationProcessService, useFactory: () => mock(ApplicationProcessService) },
        { provide: DfLoadingSpinnerService, useFactory: () => mock(DfLoadingSpinnerService) },
        { provide: DfAlertService, useFactory: () => mock(DfAlertService) },
        { provide: BreakpointObserver, useFactory: () => mock(BreakpointObserver) },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationProcessComponent);
    component = fixture.componentInstance;
    candidateService = TestBed.get(CandidateService);
    hireService = TestBed.get(HireService);
    applicationProcessService = TestBed.get(ApplicationProcessService);
    router = TestBed.get(Router);
    breakpointObserver = TestBed.get(BreakpointObserver);

    spyOn(candidateService, 'getSteps')
      .and.returnValue(of(APPLICATION_FLOW_STEPS));

    spyOn(hireService, 'getJob')
      .and.returnValue(of(JOB_DATA_MOCK));

    applicationProcessService.moveToStepSubmission$ = empty();

    spyOn(applicationProcessService, 'currentStep');
    spyOn(applicationProcessService, 'moveToStep');

    spyOn(breakpointObserver, 'observe')
      .and.returnValue(of({}));
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should get the dependencies', () => {
    expect(candidateService).toBeTruthy();
    expect(hireService).toBeTruthy();
    expect(applicationProcessService).toBeTruthy();
    expect(breakpointObserver).toBeTruthy();
  });

  it('should navigate to application and show no applications', () => {
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of(null));
    fixture.detectChanges();
    expect(component.isOpenApplication).toBeFalsy();
  });

  it('should navigate to application process Pending Tests', () => {
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of({
      id: 1,
      applicationType: 'NATIVE',
      status: 'IN_PROGRESS',
      applicationFlow: {
        id: 5,
      },
      job: {
        id: 2,
      },
      task: 'candidateWaitsTestSetup',
    }));
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    fixture.detectChanges();

    expect(navigateByUrlSpy.calls.mostRecent().args[0].toString())
      .toEqual('/1/job/2/testing-invite-pending');
  });

  it('should navigate to application process Welcome', () => {
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of({
      id: 1,
      applicationType: 'NATIVE',
      status: 'IN_PROGRESS',
      applicationFlow: {
        id: 5,
      },
      job: {
        id: 2,
      },
      task: 'candidateProvidesContactInformation1',
    }));
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    fixture.detectChanges();

    expect(navigateByUrlSpy.calls.mostRecent().args[0].toString())
      .toEqual('/1');
  });

  it('should redirect to application process Welcome', fakeAsync(() => {
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of({
      id: 1,
      applicationType: 'NATIVE',
      status: 'IN_PROGRESS',
      applicationFlow: {
        id: 5,
      },
      job: {
        id: 2,
      },
      task: 'candidateProvidesContactInformation1',
    }));
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    fixture.detectChanges();

    expect(navigateByUrlSpy.calls.mostRecent().args[0].toString())
      .toEqual('/1');
  }));

  it('should redirect from Welcome page to application process Create Basic Profile', fakeAsync(() => {
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of({
      id: 1,
      applicationType: 'NATIVE',
      status: 'IN_PROGRESS',
      applicationFlow: {
        id: 5,
      },
      job: {
        id: 2,
      },
      task: 'candidateProvidesContactInformation1',
    }));
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    fixture.detectChanges();

    router.navigateByUrl('/1/job/2/create-basic-profile');
    tick();
    fixture.detectChanges();

    expect(navigateByUrlSpy.calls.mostRecent().args[0].toString())
      .toEqual('/1/job/2/create-basic-profile');
  }));

  it('should navigate to application process Written Evaluation Welcome page for written evaluation only job application', () => {
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of({
      id: 1,
      applicationType: 'NATIVE',
      status: 'IN_PROGRESS',
      applicationFlow: {
        id: 7,
        name: '5Q Only',
        flowDefinitionType: 'FIVEQ',
      },
      job: {
        id: 2,
      },
      task: 'candidateSubmits5QTest',
    }));
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    fixture.detectChanges();

    expect(navigateByUrlSpy.calls.mostRecent().args[0].toString())
      .toEqual('/1/job/2/written-evaluation-welcome');
  });

  it('should navigate to application process Technical Screen', () => {
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of({
      id: 1,
      applicationType: 'NATIVE',
      status: 'IN_PROGRESS',
      applicationFlow: {
        id: 5,
      },
      job: {
        id: 2,
      },
      task: 'techTrialUpdatesStatus1',
    }));
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    fixture.detectChanges();

    expect(navigateByUrlSpy.calls.mostRecent().args[0].toString())
      .toEqual('/1/job/2/technical-screen');
  });

  it('should navigate to application process Marketplace', () => {
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of({
      id: 1,
      applicationType: 'NATIVE',
      status: 'ACCEPTED',
      applicationFlow: {
        id: 5,
      },
      job: {
        id: 2,
      },
    }));
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    fixture.detectChanges();

    expect(navigateByUrlSpy.calls.mostRecent().args[0].toString())
      .toEqual('/1/job/2/marketplace');
  });

  it('should navigate to application process Rejected', () => {
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of({
      id: 1,
      applicationType: 'NATIVE',
      status: 'REJECTED',
      applicationFlow: {
        id: 5,
      },
      job: {
        id: 2,
      },
    }));
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    fixture.detectChanges();

    expect(navigateByUrlSpy.calls.mostRecent().args[0].toString())
      .toEqual('/1/job/2/rejected');
  });

  it('should navigate to application process Cancel', fakeAsync(() => {
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of({
      id: 1,
      applicationType: 'NATIVE',
      status: 'IN_PROGRESS',
      applicationFlow: {
        id: 5,
      },
      job: {
        id: 2,
      },
      task: 'candidateProvidesContactInformation1',
    }));
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');

    fixture.detectChanges();

    router.navigateByUrl('/cancel');
    tick();
    fixture.detectChanges();

    expect(navigateByUrlSpy.calls.mostRecent().args[0].toString())
      .toEqual('/cancel');
  }));
});
