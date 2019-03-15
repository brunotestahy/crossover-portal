import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DfModalService, DfToasterService } from '@devfactory/ngx-df';

import { InterviewDetailsResponse } from 'app/core/models/interview';
import { InterviewService } from 'app/core/services/interview/interview.service';
import { ViewInterviewComponent } from 'app/modules/interview/pages/view-interview/view-interview.component';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { InterviewResponseComponent } from './interview-response.component';

class InterviewServiceMock {
  public declineInterview(): Observable<{}> {
    return Observable.of({});
  }

  public getInterviewDetails(): Observable<{}> {
    return Observable.of({
      'id': 21104,
      'status': 'ACTIVE',
      'createdOn': '2018-03-30T15:06:18.000+0000',
      'updatedOn': '2018-03-30T15:06:18.000+0000',
      'durationInMinutes': 30,
      'interviewSlots': [
        {
          'id': 164221,
          'startDateTime': '2018-04-04T06:30:00.000+0000',
          'endDateTime': '2018-04-04T07:30:00.000+0000',
        },
        {
          'id': 164222,
          'startDateTime': '2018-04-02T22:30:00.000+0000',
          'endDateTime': '2018-04-02T23:00:00.000+0000',
        },
        {
          'id': 164223,
          'startDateTime': '2018-04-04T00:00:00.000+0000',
          'endDateTime': '2018-04-04T02:30:00.000+0000',
        },
        {
          'id': 164224,
          'startDateTime': '2018-04-03T00:00:00.000+0000',
          'endDateTime': '2018-04-03T00:30:00.000+0000',
        },
        {
          'id': 164225,
          'startDateTime': '2018-04-03T02:00:00.000+0000',
          'endDateTime': '2018-04-03T02:30:00.000+0000',
        },
        {
          'id': 164226,
          'startDateTime': '2018-04-04T03:30:00.000+0000',
          'endDateTime': '2018-04-04T04:30:00.000+0000',
        },
        {
          'id': 164227,
          'startDateTime': '2018-04-03T01:00:00.000+0000',
          'endDateTime': '2018-04-03T01:30:00.000+0000',
        },
      ],
      'managerBusySlots': [
        {
          'startDateTime': '2018-04-04T03:30:00.000+0000',
          'endDateTime': '2018-04-04T04:00:00.000+0000',
        },
      ],
      'interviewee': {
        'type': 'CANDIDATE',
        'userAvatars': [
          {
            'id': 1044737,
            'type': 'PERSONAL',
          },
          {
            'id': 434311,
            'type': 'CANDIDATE',
          },
        ],
        'id': 434311,
        'averageRatings': 0,
        'workedHours': 0,
        'billedHours': 0,
        'connections': [
        ],
        'skypeId': 'sergthedeveloper',
        'agreementAccepted': false,
        'intercomId': '586b204c1ef41cc7573f5d1d',
        'printableName': 'Sergey Petrov',
        'userSecurity': {
          'linkedInLogin': false,
          'enabled': false,
          'accountNonLocked': true,
          'credentialsNonExpired': true,
          'accountNonExpired': true,
        },
        'candidate': true,
        'personal': false,
        'email': 'sergthedeveloper@gmail.com',
        'location': {
          'country': {
            'id': 180,
            'name': 'Russian Federation',
            'code': 'ru',
            'allowed': true,
            'zipFormat': '\\d{6}',
          },
          'timeZone': {
            'id': 502,
            'name': 'Asia/Krasnoyarsk',
            'offset': 25200000,
            'standardOffset': 25200000,
            'hourlyOffset': '+07:00',
          },
          'latitude': 61.52401,
          'longitude': 105.318756,
        },
        'userId': 435130,
        'firstName': 'Sergey',
        'lastName': 'Petrov',
        'manager': false,
        'companyAdmin': false,
        'photoUrl': 'https://crossover-uploads-production.s3.amazonaws.com/images/bd7285c0faf7a32bc89b5b1d40b24c67.jpeg',
        'busySlots': [
        ],
        'headline': 'Mobile Developer (iOS/Android) at ANKO Technologies Corp',
        'avatarTypes': [
          'CANDIDATE',
          'PERSONAL',
        ],
        'appFeatures': [
        ],
      },
      'selection': {
        'id': 29145,
        'status': 'IN_PROGRESS',
        'manager': {
          'type': 'MANAGER',
          'userAvatars': [
            {
              'id': 197943,
              'type': 'ACCOUNT_MANAGER',
            },
            {
              'id': 771837,
              'type': 'PERSONAL',
            },
            {
              'id': 15234,
              'type': 'CANDIDATE',
            },
            {
              'id': 88502,
              'type': 'ADMIN',
            },
            {
              'id': 39998,
              'type': 'COMPANY_ADMIN',
            },
            {
              'id': 39998,
              'type': 'MANAGER',
            },
          ],
          'id': 39998,
          'company': {
            'id': 11,
            'name': 'Aurea',
            'internal': false,
            'xoPercentage': 0,
            'currentBalance': 0,
          },
          'availableSlots': [
          ],
          'manualTimeNotificationsEnabled': true,
          'email': 'rajeshgupthar@gmail.com',
          'userId': 15234,
          'firstName': 'Rajesh',
          'lastName': 'Guptha',
          'printableName': 'Rajesh Guptha',
          'manager': true,
          'companyAdmin': false,
          'candidate': false,
          'photoUrl': 'https://crossover-uploads-production.s3.amazonaws.com/images/d263060c-e3d9-4545-972a-c6e03008e54b.jpg',
          'busySlots': [
          ],
          'personal': false,
          'headline': 'Principle Engineer, Development',
          'avatarTypes': [
            'CANDIDATE',
            'MANAGER',
            'COMPANY_ADMIN',
            'ADMIN',
            'ACCOUNT_MANAGER',
            'PERSONAL',
          ],
          'appFeatures': [
            {
              'appFeature': 'TEAM_DASHBOARD',
            },
            {
              'appFeature': 'POLLS',
            },
          ],
          'location': {
            'country': {
              'id': 101,
              'name': 'India',
              'code': 'in',
              'allowed': true,
              'zipFormat': '\\d{6}',
            },
            'timeZone': {
              'id': 419,
              'name': 'Asia/Kolkata',
              'offset': 19800000,
              'standardOffset': 19800000,
              'hourlyOffset': '+05:30',
            },
            'city': 'Bangalore',
            'latitude': 12.971599,
            'longitude': 77.594563,
          },
        },
        'createdOn': '2018-03-29T12:46:47.000+0000',
        'marketplaceMember': {
          'id': 816170,
          'application': {
            'id': 816170,
            'completedOn': '2018-03-30T15:15:44.692+0000',
            'candidate': {
              'type': 'CANDIDATE',
              'userAvatars': [
                {
                  'id': 1044737,
                  'type': 'PERSONAL',
                },
                {
                  'id': 434311,
                  'type': 'CANDIDATE',
                },
              ],
              'id': 434311,
              'averageRatings': 0,
              'workedHours': 0,
              'billedHours': 0,
              'connections': [
              ],
              'skypeId': 'sergthedeveloper',
              'agreementAccepted': false,
              'intercomId': '586b204c1ef41cc7573f5d1d',
              'printableName': 'Sergey Petrov',
              'candidate': true,
              'personal': false,
              'email': 'sergthedeveloper@gmail.com',
              'location': {
                'country': {
                  'id': 180,
                  'name': 'Russian Federation',
                  'code': 'ru',
                  'allowed': true,
                  'zipFormat': '\\d{6}',
                },
                'timeZone': {
                  'id': 502,
                  'name': 'Asia/Krasnoyarsk',
                  'offset': 25200000,
                  'standardOffset': 25200000,
                  'hourlyOffset': '+07:00',
                },
                'latitude': 61.52401,
                'longitude': 105.318756,
              },
              'userId': 435130,
              'firstName': 'Sergey',
              'lastName': 'Petrov',
              'manager': false,
              'companyAdmin': false,
              'photoUrl': 'https://crossover-uploads-production.s3.amazonaws.com/images/bd7285c0faf7a32bc89b5b1d40b24c67.jpeg',
              'busySlots': [
              ],
              'headline': 'Mobile Developer (iOS/Android) at ANKO Technologies Corp',
              'avatarTypes': [
                'CANDIDATE',
                'PERSONAL',
              ],
              'appFeatures': [
              ],
            },
            'job': {
              'id': 2645,
              'imageUrl': 'crossover-uploads-production/images/job_2645_image_9ac5eec70b6a35d543f106d3b81cc96e.png',
              'title': 'Android Chief Software Architect',
              'trackerRequired': false,
              'jbpEnabled': false,
              'outboundEnabled': false,
              'autoEndorse': false,
              'testSetupCompleted': false,
            },
            'status': 'ACCEPTED',
            'score': 0,
            'yearsOfExperience': 0,
            'variants': [
            ],
          },
        },
      },
      'type': 'CANDIDATE',
    });
  }
}

class ModalServiceMock {
  public open(): void {
  }
}

class ToasterServiceMock {
  public popSuccess(): void {
  }
}

describe('InterviewResponseComponent', () => {
  let component: InterviewResponseComponent;
  let fixture: ComponentFixture<InterviewResponseComponent>;
  let interviewService: InterviewService;
  let modalService: DfModalService;
  let activatedRoute: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [InterviewResponseComponent, ViewInterviewComponent],
      imports: [RouterTestingModule.withRoutes([{ path: 'interview/3211/view', component: ViewInterviewComponent}])],
      providers: [
        { provide: InterviewService, useClass: InterviewServiceMock },
        { provide: DfModalService, useClass: ModalServiceMock },
        { provide: DfToasterService, useClass: ToasterServiceMock },
        { provide: ActivatedRoute, useValue: {
          params: of({ id: 2343 }),
          snapshot: {
            queryParams: { action: ''},
          },
        } },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewResponseComponent);

    component = fixture.componentInstance;
    interviewService = TestBed.get(InterviewService);
    activatedRoute = TestBed.get(ActivatedRoute);
    modalService = TestBed.get(DfModalService);

  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load interview info', () => {
    component.ngOnInit();
    spyOn(modalService, 'open').and.callThrough();
    component.decline();
    expect(component.interview).toBeTruthy();
  });

  it('should decline interview', () => {
    component.form.patchValue({ reason: 'the reasons for declining' });
    component.isSaving = false;
    component.interview = { } as InterviewDetailsResponse;
    component.id = 3211;

    spyOn(interviewService, 'declineInterview').and.callThrough();

    component.declineInterview(() => {});
    expect(interviewService.declineInterview).toHaveBeenCalled();
  });

  it ('should show error on interview fetch fail', () => {
    spyOn(interviewService, 'getInterviewDetails').and.returnValue(Observable.throw(new Error()));
    component.ngOnInit();

    expect(component.error).toBeTruthy();
  });

  it('should show error on interview decline fail', () => {
    spyOn(interviewService, 'declineInterview').and.returnValue(Observable.throw(new Error()));
    component.form.patchValue({ reason: 'the reasons for declining' });
    component.isSaving = false;
    component.interview = { } as InterviewDetailsResponse;
    component.id = 3211;

    component.declineInterview(() => {});

    expect(component.modalError).toBeTruthy();
  });

  it('should show decline pop-up when action is decline', () => {
    activatedRoute.snapshot.queryParams.action = 'decline';
    spyOn(component, 'decline').and.callThrough();

    component.ngOnInit();

    expect(component.decline).toHaveBeenCalled();
  });
});
