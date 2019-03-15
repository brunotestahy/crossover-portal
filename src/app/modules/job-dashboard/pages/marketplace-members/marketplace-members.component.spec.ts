import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { DfModalService } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { Units } from 'app/core/constants/hire/salary-unit';
import { HireService } from 'app/core/services/hire/hire.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { JobDescriptionModalComponent } from 'app/modules/job-dashboard/components/job-description-modal/job-description-modal.component';
import { MarketplaceMembersComponent } from 'app/modules/job-dashboard/pages/marketplace-members/marketplace-members.component';

describe('MarketplaceMembersComponent', () => {
  let component: MarketplaceMembersComponent;
  let fixture: ComponentFixture<typeof component>;
  let dfModalService: DfModalService;
  let hireService: HireService;
  let identityService: IdentityService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [MarketplaceMembersComponent],
      imports: [],
      providers: [
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        { provide: HireService, useFactory: () => mock(HireService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                id: '123',
              },
            },
          },
        },
        {
          provide: WINDOW_TOKEN,
          useValue: {
            setTimeout: () => true,
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceMembersComponent);
    component = fixture.componentInstance;
    dfModalService = TestBed.get(DfModalService);
    hireService = TestBed.get(HireService);
    identityService = TestBed.get(IdentityService);
  });

  it('check if the component has been created', () => {
    expect(component).toBeTruthy();
  });

  it('should strip style tags successfully', () => {
    const originalHtmlData = '<p style="font-size: 16px"></p>';
    const strippedHtmlData = '<p></p>';
    const jobDetails = Object.assign({
      candidateDescription: originalHtmlData,
      managerDescription: originalHtmlData,
    });

    spyOn(hireService, 'getJob').and.returnValue(of(jobDetails));
    spyOn(identityService, 'getCurrentUserAs').and.returnValue(of(null));

    fixture.detectChanges();

    expect(component.job.candidateDescription).toBe(strippedHtmlData);
    expect(component.job.managerDescription).toBe(strippedHtmlData);
  });

  it('should mark a user not subscribed to the current job', () => {
    spyOn(hireService, 'getJob').and.returnValue(of({}));
    spyOn(identityService, 'getCurrentUserAs').and.returnValue(of({subscriptionJobs: [{id: 1},{id: 2}]}));

    fixture.detectChanges();

    expect(component.isSubscribed).toBeFalsy();
  });

  it('should mark a user subscribed to the current job', () => {
    spyOn(hireService, 'getJob').and.returnValue(of({}));
    spyOn(identityService, 'getCurrentUserAs').and.returnValue(of({subscriptionJobs: [{id: 1},{id: 123}]}));

    fixture.detectChanges();

    expect(component.isSubscribed).toBeTruthy();
  });

  it('should set an error message when an error occurs on job retrieval', () => {
    spyOn(hireService, 'getJob').and.returnValue(Observable.throw('error!'));
    spyOn(identityService, 'getCurrentUserAs').and.returnValue(of(null));

    fixture.detectChanges();

    expect(component.error).toBe('Unknown identifier 123 specified. Retry the operation with a valid identifier.');
  });

  it('should subscribe to job pipeline successfully', async(() => {
    spyOn(hireService, 'getJob').and.returnValue(of({id: 123}));
    spyOn(identityService, 'getCurrentUserAs').and.returnValue(of({}));
    spyOn(hireService, 'subscribeToJobPipeline').and.returnValue(of(null));

    fixture.detectChanges();

    component.subscribeToJobPipeline();
    fixture.detectChanges();

    expect(component.isSubscribed).toBeTruthy();
    expect(hireService.subscribeToJobPipeline).toHaveBeenCalledWith(123);
  }));

  it('should return a salary unit abbreviation successfully', () => {
    const salaryUnit = 'WEEK';
    const result = component.getSalaryUnitAbbreviation(salaryUnit);

    expect(result).toBe(Units.WEEK.abbreviation);
  });

  it('should return an empty salary unit abbreviation when the provided code is invalid', () => {
    const unknownSalaryUnit = Object.assign({ value: 'UNKNOWNSALARYUNIT' }).value;
    const result = component.getSalaryUnitAbbreviation(unknownSalaryUnit);

    expect(result).toBeUndefined();
  });

  it('should open the job details modal successfully', () => {
    const jobData = Object.assign({});
    spyOn(dfModalService, 'open');
    component.openJobDescriptionModal(jobData);

    expect(dfModalService.open).toHaveBeenCalledWith(JobDescriptionModalComponent, jasmine.any(Object));
  });
});
