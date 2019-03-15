import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DfLoadingSpinnerService } from '@devfactory/ngx-df';
import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { APPLICATION_DATA_MOCK } from 'app/core/services/mocks/application-data.mock';
import 'rxjs/add/observable/of';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { MeetYourAdvocateComponent } from './meet-your-advocate.component';

describe('MeetYourAdvocateComponent', () => {
  let component: MeetYourAdvocateComponent;
  let fixture: ComponentFixture<MeetYourAdvocateComponent>;
  let candidateService: CandidateService;
  let loaderService: DfLoadingSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetYourAdvocateComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CandidateService, useFactory: () => mock(CandidateService) },
        { provide: DfLoadingSpinnerService, useFactory: () => mock(DfLoadingSpinnerService) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetYourAdvocateComponent);
    component = fixture.componentInstance;
    candidateService = TestBed.get(CandidateService);
    loaderService = TestBed.get(DfLoadingSpinnerService);

    spyOn(document, 'querySelector').and.returnValue({ scrollTop: null });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load ngOnInit, fetch the application data, set the skype id on input and hide the loading', () => {
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of({ candidate: { skypeId: 'john.doe' } }));
    spyOn(loaderService, 'hide');
    spyOn(component.skypeId, 'setValue');

    component.ngOnInit();

    expect(component.application).toBeDefined();
    expect(loaderService.hide).toHaveBeenCalled();
    expect(component.skypeId.setValue).toHaveBeenCalledWith('john.doe');
  });

  it('should call updateSkypeId method and update with success', () => {
    component.application = APPLICATION_DATA_MOCK;
    spyOn(candidateService, 'updateCandidate').and.returnValue(of({}));
    spyOn(loaderService, 'hide');

    component.updateSkypeId();

    expect(loaderService.hide).toHaveBeenCalled();
    expect(component.error).toBeFalsy();
    expect(component.success).toBe(MeetYourAdvocateComponent.SUCCESS);
  });

  it('should call updateSkypeId method and throw an error', () => {
    component.application = APPLICATION_DATA_MOCK;
    spyOn(candidateService, 'updateCandidate').and.returnValue(Observable.throw({}));
    spyOn(loaderService, 'hide');

    component.updateSkypeId();

    expect(loaderService.hide).toHaveBeenCalled();
    expect(component.error).toBe(MeetYourAdvocateComponent.ERROR);
    expect(component.success).toBeFalsy();
  });
});
