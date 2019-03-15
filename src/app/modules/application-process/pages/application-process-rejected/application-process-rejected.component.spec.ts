import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { mock } from 'ts-mockito';

import { CandidateService } from '../../../../core/services/candidate/candidate.service';
import { IdentityService } from '../../../../core/services/identity/identity.service';
import { ApplicationProcessService } from '../../shared/application-process.service';

import { ApplicationProcessRejectedComponent } from './application-process-rejected.component';


describe('ApplicationProcessRejectedComponent', () => {
  let component: ApplicationProcessRejectedComponent;
  let fixture: ComponentFixture<ApplicationProcessRejectedComponent>;
  let identityService: IdentityService;
  let candidateService: CandidateService;
  let applicationProcessService: ApplicationProcessService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ApplicationProcessRejectedComponent],
      providers: [
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: CandidateService, useFactory: () => mock(CandidateService) },
        { provide: ApplicationProcessService, useFactory: () => mock(ApplicationProcessService) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationProcessRejectedComponent);
    component = fixture.componentInstance;
    candidateService = TestBed.get(CandidateService);
    identityService = TestBed.get(IdentityService);
    applicationProcessService = TestBed.get(ApplicationProcessService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit]', () => {
    spyOn(applicationProcessService, 'currentStep');
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({}));
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of({}));
    component.ngOnInit();
    expect(component.isLoading).toBeFalsy();
  });
});
