import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfLoadingSpinnerModule, DfLoadingSpinnerService, DfToasterService } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { JobApplication } from 'app/core/models/application';
import { CandidateService } from 'app/core/services/candidate/candidate.service';

import { MarketplaceComponent } from './marketplace.component';

describe('MarketplaceComponent', () => {
  let component: MarketplaceComponent;
  let fixture: ComponentFixture<MarketplaceComponent>;
  let candidateService: CandidateService;
  let loadingSpinnerService: DfLoadingSpinnerService;
  let toasterService: DfToasterService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [MarketplaceComponent],
      imports: [
        DfLoadingSpinnerModule,
      ],
      providers: [
        { provide: CandidateService, useFactory: () => mock(CandidateService) },
        { provide: DfLoadingSpinnerService, useFactory: () => mock(DfLoadingSpinnerService) },
        { provide: DfToasterService, useFactory: () => mock(DfToasterService) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceComponent);
    component = fixture.componentInstance;
    candidateService = TestBed.get(CandidateService);
    loadingSpinnerService = TestBed.get(DfLoadingSpinnerService);
    toasterService = TestBed.get(DfToasterService);
    spyOn(document, 'querySelector').and.returnValue({
      scrollTop: null,
      scrollIntoView: jasmine.createSpy(),
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit]', () => {
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of({
      id: 1,
      applicationType: 'NATIVE',
      status: 'ACCEPTED',
    }));
    spyOn(loadingSpinnerService, 'showLoader');
    spyOn(loadingSpinnerService, 'hide');
    component.ngOnInit();
    expect(loadingSpinnerService.hide).toHaveBeenCalled();
  });


  describe('[send]', () => {
    beforeEach(() => {
      spyOn(loadingSpinnerService, 'showLoader');
      spyOn(loadingSpinnerService, 'hide');
      component.application = <JobApplication> {
        id: 1,
        applicationType: 'NATIVE',
        status: 'ACCEPTED',
        job: {
          id: 2,
        },
      };
    });

    it('success', () => {
      spyOn(candidateService, 'sendQuestions').and.returnValue(of(true));
      spyOn(toasterService, 'popSuccess');
      component.send();
      expect(toasterService.popSuccess).toHaveBeenCalledWith('Message sent to Talent Advocate');
    });

    it('error', () => {
      spyOn(candidateService, 'sendQuestions').and.returnValue(Observable.throw({}));
      component.send();
      expect(component.error).toEqual('Error happened while sending your questions. Please try again later');
    });
  });
});
