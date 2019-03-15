import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import 'rxjs/add/operator/map';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { Observable } from 'rxjs/Observable';

import { Country } from 'app/core/models/country';
import { CommonService } from 'app/core/services/common/common.service';
import { HireService } from 'app/core/services/hire/hire.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { EscapeHtmlPipe } from 'app/shared/pipes/keep-html.pipe';

import { JobDescriptionComponent } from './job-description.component';

class CommonServiceMock {

  public getCountries(): Observable<Country[]> {
    return of([
      {
        'id': 1,
        'timezones': [
          {
            'id': 234,
            'name': 'Asia/Kabul',
            'offset': 16200000,
            'standardOffset': 16200000,
            'hourlyOffset': '+04:30',
          },
        ], 'name': 'Afghanistan',
        'code': 'af',
        'allowed': true,
      },
    ]);
  }
}

class IdentityServiceMock {

  public currentUserIsManager(): Observable<boolean> {
    return of(true);
  }

  public getCurrentUser(): Observable<{}> {
    return Observable.of({
      'headline': 'Frontend  Developer',
      'summary': 'MASKED Lorem ipsum dolor sit',
      'id': 11648,
      'email': 'rashvish18@gmail.com',
      'firstName': 'Rashmi',
      'lastName': 'Kumari',
      'createdOn': '2015-04-14T17:32:17.000+0000',
      'busySlots': [],
      'photoUrl': 'https://crossover-uploads-production.s3.amazonaws.com/images/c8c14ec6c2ed301a6a826a74ae0a2fec.jpeg',
      'appFeatures': [],
      'avatarTypes': ['CANDIDATE', 'PERSONAL'],
      'userAvatars': [
        { 'id': 11648, 'type': 'CANDIDATE' },
        { 'id': 770114, 'type': 'PERSONAL' },
      ],
      'userSecurity': {
        'securityQuestion': 'Your favorite sports team',
        'linkedInLogin': false,
        'enabled': false,
        'accountNonExpired': true,
        'accountNonLocked': true,
        'credentialsNonExpired': true,
      },
      'location': {
        'country': {
          'id': 101, 'name': 'India', 'code': 'in', 'allowed': true, 'zipFormat': '\\d{6}',
        }, 'timeZone': {
          'id': 419, 'name': 'Asia/Kolkata', 'offset': 19800000, 'standardOffset': 19800000, 'hourlyOffset': '+05:30',
        }, 'latitude': 12.971599, 'longitude': 77.594563,
      },
      'infoShared': true,
      'printableName': 'Rashmi Kumari',
    });
  }

  public isUserLogged(): boolean {
    return true;
  }

  public checkEmailExistence(): Observable<boolean> {
    return of(true);
  }
}

class HireServiceMock {

  public getJob(): Observable<{id: number}> {
    return Observable.of({ id: 1 });
  }

  public getPrerequisitesForJob(): Observable<{}> {
    return Observable.of({});
  }

  public applyToJobAsAuthenticatedUser(): Observable<{}> {
    return Observable.of({ response: { id: 1 } });
  }

  public applyToJobAsAnonymousUser(): Observable<{}> {
    return Observable.of({ response: { id: 1 } });
  }
}

describe('JobDescriptionComponent', () => {
  let component: JobDescriptionComponent;
  let fixture: ComponentFixture<JobDescriptionComponent>;
  let identityService: Partial<IdentityService>;
  let hireService: Partial<HireService>;
  let commonService: Partial<CommonService>;
  const SAMPLE_TOKEN = 'f126b1c3-391b-4157-b687-8b0fcc74a4f6';

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [JobDescriptionComponent, EscapeHtmlPipe],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: IdentityService, useClass: IdentityServiceMock },
        { provide: HireService, useClass: HireServiceMock },
        { provide: CommonService, useClass: CommonServiceMock },
        { provide: ActivatedRoute, useValue: { params: of({ token: SAMPLE_TOKEN }) } },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDescriptionComponent);

    component = fixture.componentInstance;
    identityService = TestBed.get(IdentityService);
    hireService = TestBed.get(HireService);
    commonService = TestBed.get(CommonService);
    component.createForm();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call the pattern method from the passwordMessages variable and to return the right message', () => {
    expect(component.passwordMessages.pattern({ validationObject: '', value: {} }))
      .toBe('At least 8 characters, 1 letter and a number or symbol');
  });

  it('should call the pattern method from the nameMessages variable and to return the right message', () => {
    expect(component.nameMessages.pattern({ validationObject: '', value: {} }))
      .toBe('First name and last name are required');
  });

  it('ngOnInit - should call all required function', () => {
    spyOn(component, 'createForm');
    spyOn(component, 'getCurrentUser');
    spyOn(component, 'getCountryList');
    spyOn(component, 'getJobDetails');
    component.ngOnInit();
    expect(component.createForm).toHaveBeenCalled();
    expect(component.getCurrentUser).toHaveBeenCalled();
    expect(component.getCountryList).toHaveBeenCalled();
    expect(component.getJobDetails).toHaveBeenCalled();
  });

  it('getCountryList - should load country list ', () => {
    spyOn(commonService, 'getCountries').and.returnValue(of([{
      id: 1,
      timezones: [],
      allowed: false,
      code: 'US',
      name: 'USA',
    },
    {
      id: 2,
      timezones: [],
      allowed: true,
      code: 'US',
      name: 'USA',
    }]));
    component.getCountryList();
    expect(component.forbiddenCountries.length).toBe(1);
    expect(component.allowedCountries.length).toBe(1);
    expect(component.forbiddenCountries.length).toBe(1);
  });

  it('should call getCurrentUser and retun logged user info', () => {
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({}));
    spyOn(component, 'disableFormFields');
    component.getCurrentUser();
    expect(identityService.getCurrentUser).toHaveBeenCalled();
    expect(component.disableFormFields).toHaveBeenCalled();
  });

  it('should call getCurrentUser and retun logged out info', () => {
    spyOn(identityService, 'isUserLogged').and.returnValue(false);
    component.getCurrentUser();
    expect(component.isAnonymous).toBe(true);
  });

  it('should call getCurrentUser and retun auth error', () => {
    spyOn(identityService, 'getCurrentUser').and.callThrough()
      .and.returnValue(_throw({ error: 'Auth error' }));
    component.getCurrentUser();
    expect(identityService.getCurrentUser).toHaveBeenCalled();
    expect(component.isAnonymous).toBe(true);
  });

  it('should call getCurrentUser and retun anonymous', () => {
    spyOn(identityService, 'isUserLogged').and.returnValue(false);
    component.getCurrentUser();
    expect(component.isAnonymous).toBe(true);
  });

  it('disableFormFields', () => {
    component.disableFormFields();
    expect(component.form.controls.name.status).toBe('DISABLED');
    expect(component.form.controls.password.status).toBe('DISABLED');
    expect(component.form.controls.password.status).toBe('DISABLED');
    expect(component.form.controls.country.status).toBe('DISABLED');
    expect(component.form.controls.recaptcha.status).toBe('DISABLED');
  });

  it('getJobDetails - when not logged in', () => {
    spyOn(hireService, 'getJob').and.returnValue([{}]);
    component.getJobDetails();
    expect(hireService.getJob).toHaveBeenCalled();
  });

  it('getJobDetails - when logged in - should call getPrerequisitesForJob service', () => {
    spyOn(hireService, 'getJob').and.returnValue([{}]);
    spyOn(component, 'getPrerequisitesForJob');
    component.getCurrentUser();
    component.getJobDetails();
    expect(hireService.getJob).toHaveBeenCalled();
    expect(component.getPrerequisitesForJob).toHaveBeenCalled();
  });

  it('should call getPrerequisitesForJob and retun success result', () => {
    spyOn(hireService, 'getPrerequisitesForJob').and.callThrough();
    component.getPrerequisitesForJob(1);
    expect(hireService.getPrerequisitesForJob).toHaveBeenCalled();
    expect(component.isApplicationAllowed).toBe(true);
  });

  it('should call getCurrentUser and retun not allowed return', () => {
    spyOn(hireService, 'getPrerequisitesForJob').and.callThrough()
      .and.returnValue(_throw({
        error: {
          type: 'ERROR',
        },
      }));
    component.getPrerequisitesForJob(1);
    expect(hireService.getPrerequisitesForJob).toHaveBeenCalled();
    expect(component.isApplicationAllowed).toBe(false);
  });

  it('should call getCurrentUser and retun empty error', () => {
    spyOn(hireService, 'getPrerequisitesForJob').and.callThrough()
      .and.returnValue(_throw({}));
    component.getPrerequisitesForJob(1);
    expect(hireService.getPrerequisitesForJob).toHaveBeenCalled();
    expect(component.isApplicationAllowed).toBe(true);
  });

  it('scrollToApply', () => {
    component.applyElement = { nativeElement: { scrollIntoView: () => true } };
    component.scrollToApply();
    expect(component.applyElement.nativeElement.scrollIntoView()).toBe(true);
  });

  it('scrollToTop', () => {
    component.topElement = { nativeElement: { scrollIntoView: () => true } };
    component.scrollToTop();
    expect(component.topElement.nativeElement.scrollIntoView()).toBe(true);
  });

  it('should call isEmailUnique and retun true', () => {
    spyOn(identityService, 'checkEmailExistence').and.callThrough();
    const input = {
      valid: true,
      value: 'test@test.com',
    };
    component.createForm();
    component.isEmailUnique(input);
    expect(identityService.checkEmailExistence).toHaveBeenCalled();
    expect(component.isEmailExist).toBe(true);
  });

  it('should load the onFileChange method with a valid file inserted and update the form', () => {
    const event = Object.assign({
      target: {
        files: [{ id: 'file1', name: 'file.txt', size: 400 }],
      },
    }) as Event;
    spyOn(component.form, 'patchValue');
    component.onFileChange(event);
    expect(component.form.patchValue).toHaveBeenCalledWith({ resume: { id: 'file1', name: 'file.txt', size: 400 } });
  });

  it('should load the onFileChange method with a invalid file inserted and update the form', () => {
    const event = Object.assign({
      target: {},
    }) as Event;
    spyOn(component.form, 'patchValue');
    component.onFileChange(event);
    expect(component.form.patchValue).toHaveBeenCalledWith({ resume: null });
  });

  it('clearFile - should clear resume field', () => {
    const e = new Event('MouseEvent');
    component.clearFile(e);
    expect(component.form.controls['resume'].value).toBe(null);
  });

});
