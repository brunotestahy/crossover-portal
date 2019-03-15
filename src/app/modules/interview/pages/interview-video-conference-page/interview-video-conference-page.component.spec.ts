import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { mock } from 'ts-mockito';

import { InterviewService } from 'app/core/services/interview/interview.service';
import {
InterviewVideoConferencePageComponent,
} from 'app/modules/interview/pages/interview-video-conference-page/interview-video-conference-page.component';

describe('InterviewVideoConferencePageComponent', () => {
  let component: InterviewVideoConferencePageComponent;
  let fixture: ComponentFixture<InterviewVideoConferencePageComponent>;

  let interviewService: InterviewService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InterviewVideoConferencePageComponent,
      ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ id: '977' }) } },
        { provide: InterviewService, useFactory: () => mock(InterviewService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewVideoConferencePageComponent);
    component = fixture.componentInstance;

    interviewService = TestBed.get(InterviewService);
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    spyOn(component, 'ngOnInit').and.returnValue('');
    expect(component).toBeTruthy();
  });

  it('should fetch the interview details successfully', () => {
    spyOn(interviewService, 'getInterviewDetails').and.returnValue(of({ id: 1 }));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.interview).toBeDefined();
  });

  it('should fetch the interview details and throw an error', () => {
    spyOn(interviewService, 'getInterviewDetails').and.returnValue(_throw({ error: { text: 'Error' } }));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('Error');
  });

  it('should redirect to the interview view page when the interview\'s status is not allowed', () => {
    const interviewMock = { id: 1, status: 'INITIAL' };
    spyOn(interviewService, 'getInterviewDetails').and.returnValue(of(interviewMock));
    spyOn(router, 'navigate');

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([`interview/${interviewMock.id}/view`]);
  });
});
