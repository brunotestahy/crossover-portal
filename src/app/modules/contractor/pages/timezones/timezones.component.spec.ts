import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as moment from 'moment';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { take } from 'rxjs/operators';
import { mock } from 'ts-mockito';

import { Assignment } from 'app/core/models/assignment';
import { Candidate } from 'app/core/models/candidate';
import { CurrentUserDetail } from 'app/core/models/identity';
import { Manager } from 'app/core/models/manager';
import { Timezone } from 'app/core/models/timezone';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { CURRENT_USER_DETAIL_MOCK } from 'app/core/services/mocks/current-user-detail.mock';
import { ASSIGNMENTS_MOCK } from 'app/core/services/mocks/identity.mock';
import { TimezonesComponent } from 'app/modules/contractor/pages/timezones/timezones.component';

describe('TimezonesComponent', () => {
  let component: TimezonesComponent;
  let fixture: ComponentFixture<TimezonesComponent>;

  let assignmentService: AssignmentService;
  let identityService: IdentityService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimezonesComponent,
      ],
      providers: [
        { provide: AssignmentService, useFactory: () => mock(AssignmentService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimezonesComponent);
    component = fixture.componentInstance;

    assignmentService = TestBed.get(AssignmentService);
    identityService = TestBed.get(IdentityService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch candidates and timezones correctly when the page is loaded and manager\'s and teamOwner\'s id are different', () => {
    const userDetail = CURRENT_USER_DETAIL_MOCK;
    let assignmentsMock: Assignment[] = [Object.assign(ASSIGNMENTS_MOCK[0]) as Assignment];
    assignmentsMock = [
      {
        ...assignmentsMock[0],
        candidate: Object.assign({ firstName: 'John', userId: 580778, location: { timeZone: { offset: -180 } } }) as Candidate,
      },
      {
        ...assignmentsMock[0],
        candidate: Object.assign({ firstName: 'James', userId: 11, location: { timeZone: { offset: -150 } } }) as Candidate,
      },
      {
        ...assignmentsMock[0],
        candidate: Object.assign({ firstName: 'Alex', userId: 13, location: { timeZone: { offset: 270 } } }) as Candidate,
      },
    ];
    userDetail.assignment = Object.assign({
      manager: { id: 11 },
      team: { id: 13, teamOwner: { id: 11 } },
    }) as Assignment;

    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of(userDetail).pipe(take(1)));
    spyOn(assignmentService, 'getTeamAssignments').and.returnValue(of(assignmentsMock).pipe(take(1)));
    spyOn(component, 'getManagerToShow').and.returnValue(assignmentsMock[0].candidate);

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.currentUserDetail).toBe(userDetail);
    expect(component.getManagerToShow).toHaveBeenCalledWith(assignmentsMock[0].manager);
  });

  it('should fetch candidates and timezones correctly when the page is loaded and manager\'s and teamOwner\'s id are equal', () => {
    const userDetail: CurrentUserDetail = CURRENT_USER_DETAIL_MOCK;
    let assignmentsMock: Assignment[] = [Object.assign(ASSIGNMENTS_MOCK[0]) as Assignment];
    assignmentsMock = [
      {
        ...assignmentsMock[0],
        candidate: Object.assign({ firstName: 'John', userId: 580778, location: { timeZone: { offset: -180 } } }) as Candidate,
      },
      {
        ...assignmentsMock[0],
        candidate: Object.assign({ firstName: 'James', userId: 11, location: { timeZone: { offset: -150 } } }) as Candidate,
      },
      {
        ...assignmentsMock[0],
        candidate: Object.assign({ firstName: 'Alex', userId: 13, location: { timeZone: { offset: 270 } } }) as Candidate,
      },
    ];
    userDetail.assignment = Object.assign({
      manager: { id: 11 },
      team: { id: 13, teamOwner: { id: 11 } },
    }) as Assignment;

    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of(userDetail).pipe(take(1)));
    spyOn(assignmentService, 'getTeamAssignments').and.returnValue(of(assignmentsMock).pipe(take(1)));
    spyOn(component, 'getManagerToShow').and.returnValue(assignmentsMock[0].candidate);

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.currentUserDetail).toBe(userDetail);
    expect(component.getManagerToShow).toHaveBeenCalledWith(assignmentsMock[0].manager);
  });

  it('should fetch candidates when the page is initialized without a valid assignment', () => {
    const userDetail: CurrentUserDetail = CURRENT_USER_DETAIL_MOCK;
    const assignmentsMock: Assignment[] = [];
    userDetail.assignment = Object.assign({
      team: { id: 13, teamOwner: { id: 11 } },
    }) as Assignment;
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of(userDetail).pipe(take(1)));
    spyOn(assignmentService, 'getTeamAssignments').and.returnValue(of(assignmentsMock).pipe(take(1)));
    spyOn(component, 'getManagerToShow').and.returnValue([]);

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.getManagerToShow).not.toHaveBeenCalledWith();
  });

  it('should fetch the candidates when the page is initialized without a team owner', () => {
    const userDetail: CurrentUserDetail = CURRENT_USER_DETAIL_MOCK;
    const assignmentsMock: Assignment[] = [];
    userDetail.assignment = Object.assign({
      team: { id: 13, teamOwner: null },
    }) as Assignment;
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(of(userDetail).pipe(take(1)));
    spyOn(assignmentService, 'getTeamAssignments').and.returnValue(of(assignmentsMock).pipe(take(1)));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(assignmentService.getTeamAssignments).not.toHaveBeenCalledWith();
  });

  it('should set an error message when user details retrieval fails during page initialization', () => {
    const errorObject = {
      error: {
        errorCode: '400',
        httpStatus: '400',
        text: 'Error',
        type: 'error',
      },
    };
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(ErrorObservable.create(errorObject));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.error).toBe(errorObject.error.text);
  });

  it('should display a generic error message when an error occurs during current user details retrieval', () => {
    spyOn(identityService, 'getCurrentUserDetail').and.returnValue(ErrorObservable.create({}));

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
    expect(component.error).toBe('Error loading team timezones.');
  });

  it('should return the candidate\'s manager when the current user is not a manager', () => {
    component.currentUserDetail = Object.assign({
      userAvatars: [{ type: 'CANDIDATE' }],
    }) as CurrentUserDetail;
    const assignmentManager = Object.assign({ id: 13 }) as Manager;

    expect(component.getManagerToShow(assignmentManager)).toBe(assignmentManager);
  });

  it('should return the candidate\'s manager when the user is a manager and its ID is different from the assignment manager\'s ID', () => {
    component.currentUserDetail = Object.assign({
      id: 11,
      userAvatars: [{ type: 'MANAGER' }],
    }) as CurrentUserDetail;
    const assignmentManager = Object.assign({ id: 13 }) as Manager;

    expect(component.getManagerToShow(assignmentManager)).toBe(assignmentManager);
  });

  it('should return null when the assignment manager is not provided', () => {
    component.currentUserDetail = Object.assign({
      id: 11,
      userAvatars: [{ type: 'CANDIDATE' }],
    }) as CurrentUserDetail;

    expect(component.getManagerToShow()).toBe(null);
  });

  it('should get the bar position when a minimum value is provided', () => {
    const minimumValue = 0;
    const timeZone = Object.assign({
      offset: -180,
    }) as Timezone;
    spyOn(component, 'getUTC').and.returnValue(moment().hour(22).minute(0).second(0).toDate());

    expect(component.getBarPosition(timeZone, minimumValue)).toBe(minimumValue);
  });

  it('should get the difference between max bar width (100) and bar width when the bar position is lower than 37.35', () => {
    const barPosition = 70;
    const timezone = Object.assign({}) as Timezone;

    spyOn(component, 'getBarPosition').and.returnValue(barPosition);

    expect(component.getMaxWidth(timezone)).toBe(30);
  });

  it('should get the sum between the bar width (37.35) and bar position when the bar position is lower than 0', () => {
    const barPosition = -10;
    const timezone = Object.assign({}) as Timezone;

    spyOn(component, 'getBarPosition').and.returnValue(barPosition);

    expect(component.getMaxWidth(timezone)).toBe(27.35);
  });

  it('should return the UTC plus timezone when a offset is provided in milliseconds', () => {
    const offsetMilli = 7200 * 1000;

    expect(component.getUtcDifference(offsetMilli)).toBe('UTC+2');
  });

  it('should return only UTC when the provided offset is equal to 0', () => {
    const offsetMilli = 0;

    expect(component.getUtcDifference(offsetMilli)).toBe('UTC');
  });
});
