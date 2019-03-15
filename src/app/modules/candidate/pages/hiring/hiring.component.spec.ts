import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { Assignment } from 'app/core/models/assignment/assignment.model';
import { InterviewDetailsResponse } from 'app/core/models/interview/interview-details-response.model';
import { Task } from 'app/core/models/task';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { InterviewService } from 'app/core/services/interview/interview.service';

import { HiringComponent } from './hiring.component';

describe('HiringComponent', () => {
  let component: HiringComponent;
  let fixture: ComponentFixture<HiringComponent>;
  let interviewService: InterviewService;
  let assignmentService: AssignmentService;
  let identityService: IdentityService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [HiringComponent],
      providers: [
        { provide: InterviewService, useFactory: () => mock(InterviewService) },
        { provide: AssignmentService, useFactory: () => mock(AssignmentService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiringComponent);
    component = fixture.componentInstance;
    interviewService = TestBed.get(InterviewService);
    assignmentService = TestBed.get(AssignmentService);
    identityService = TestBed.get(IdentityService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit] get all data success', () => {
    const interviewList = [<InterviewDetailsResponse>{
      status: 'INITIAL',
      selection: {
        status: 'IN_PROGRESS',
      },
    }];
    const assignmentList = [<Assignment>{
      id: 1,
      status: 'CANDIDATE_ACCEPTED',
    }];
    const tasks = [<Task>{
      taskType: 'candidateProvidesResidenceInfo',
      object: {
        id: 1,
      },
    }];
    spyOn(interviewService, 'getInterviewList').and.returnValue(of(interviewList));
    spyOn(assignmentService, 'getAssignmentList').and.returnValue(of(assignmentList));
    spyOn(identityService, 'getCurrentUserTasks').and.returnValue(of(tasks));
    fixture.detectChanges();
    expect(component.acceptedAssignments[0].currentStep).toEqual(2);
    expect(component.isLoading).toBeFalsy();
  });

  it('[ngOnInit] get all data no tasks', () => {
    const interviewList = [<InterviewDetailsResponse>{
      status: 'INITIAL',
      selection: {
        status: 'IN_PROGRESS',
      },
    }];
    const assignmentList = [<Assignment>{
      id: 1,
      status: 'CANDIDATE_ACCEPTED',
    }];
    const tasks = <Task[]>[];
    spyOn(interviewService, 'getInterviewList').and.returnValue(of(interviewList));
    spyOn(assignmentService, 'getAssignmentList').and.returnValue(of(assignmentList));
    spyOn(identityService, 'getCurrentUserTasks').and.returnValue(of(tasks));
    fixture.detectChanges();
    expect(component.isLoading).toBeFalsy();
    expect(component.acceptedAssignments[0].currentStep).toEqual(5);
  });

  it('[ngOnInit] get all data no matched assignments', () => {
    const interviewList = [<InterviewDetailsResponse>{
      status: 'INITIAL',
      selection: {
        status: 'IN_PROGRESS',
      },
    }];
    const assignmentList = [<Assignment>{
      id: 1,
      status: 'CANDIDATE_ACCEPTED',
    }];
    const tasks = [<Task>{
      taskType: 'candidateProvidesResidenceInfo',
      object: {
        id: 2,
      },
    }];
    spyOn(interviewService, 'getInterviewList').and.returnValue(of(interviewList));
    spyOn(assignmentService, 'getAssignmentList').and.returnValue(of(assignmentList));
    spyOn(identityService, 'getCurrentUserTasks').and.returnValue(of(tasks));
    fixture.detectChanges();
    expect(component.isLoading).toBeFalsy();
  });

  it('[ngOnInit] get all data and get error on interviews', () => {
    spyOn(interviewService, 'getInterviewList').and.returnValue(of(Observable.throw({})));
    fixture.detectChanges();
    expect(component.error).toEqual('Error loading data.');
    expect(component.isLoading).toBeFalsy();
  });

});
