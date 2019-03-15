import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { InterviewService } from 'app/core/services/interview/interview.service';
import { SAMPLE_INTERVIEW } from 'app/core/services/mocks/interview.mock';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { ViewInterviewComponent } from './view-interview.component';

describe('ViewInterviewComponent', () => {
  let component: ViewInterviewComponent;
  let fixture: ComponentFixture<ViewInterviewComponent>;
  let interviewService: InterviewService;
  let identityService: IdentityService;
  const SAMPLE_TOKEN = 'f126b1c3-391b-4157-b687-8b0fcc74a4f6';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ViewInterviewComponent],
      imports: [],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ token: SAMPLE_TOKEN }) } },
        { provide: InterviewService, useFactory: () => mock(InterviewService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInterviewComponent);
    component = fixture.componentInstance;
    interviewService = TestBed.get(InterviewService);
    identityService = TestBed.get(IdentityService);
  });

  it('check if the component has been created', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit - should get Interview Details', () => {
    spyOn(interviewService, 'getInterviewDetails').and.returnValue(of(SAMPLE_INTERVIEW));
    spyOn(identityService, 'currentUserIsManager').and.returnValue(of(false));
    component.ngOnInit();
    expect(component.interview).toEqual(SAMPLE_INTERVIEW);
  });

  it('ngOnInit - should throw server error', () => {
    spyOn(interviewService, 'getInterviewDetails').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    spyOn(identityService, 'currentUserIsManager').and.returnValue(of(false));
    component.ngOnInit();
    expect(component.error).toBe('error');
  });

  it('ngOnInit - should throw server error without error text', () => {
    spyOn(interviewService, 'getInterviewDetails').and.returnValue(Observable.throw({
      error: {},
    }));
    spyOn(identityService, 'currentUserIsManager').and.returnValue(of(false));
    component.ngOnInit();
    expect(component.error).toBe('Error fetching interview detail.');
  });

});
