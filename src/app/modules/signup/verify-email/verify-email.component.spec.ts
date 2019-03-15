import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { CurrentUserDetail } from 'app/core/models/identity';
import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { IdentityService } from 'app/core/services/identity/identity.service';

import { VerifyEmailComponent } from './verify-email.component';

describe('VerifyEmailComponent', () => {
  let component: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;
  let identityService: IdentityService;
  let candidateService: CandidateService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ VerifyEmailComponent ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ token: 'sometoken' }) }},
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: CandidateService, useFactory: () => mock(CandidateService) },
        FormBuilder,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyEmailComponent);
    component = fixture.componentInstance;
    identityService = TestBed.get(IdentityService);
    candidateService = TestBed.get(CandidateService);
    router = TestBed.get(Router);
  });

  it('should not redirect if user is undefined', () => {
    spyOn(identityService, 'verifyEmail').and.callThrough();
    spyOn(identityService, 'loginWithToken');
    fixture.detectChanges();
    expect(component.isSuccessed).toBeFalsy();
  });

  it('should not redirect if user is company', () => {
    const currentUser = {
      profile: 'someProfile',
    };
    spyOn(identityService, 'verifyEmail').and.returnValue(of({
      token: 'sometoken',
    }));
    spyOn(identityService, 'loginWithToken').and.returnValue(of(currentUser));

    fixture.detectChanges();
    expect(component.isSuccessed).toBeTruthy();
  });

  it('should redirect to candidate route if user is defined and not company', () => {
    const application = {
      id: 1,
      applicationFlow : {
        id: 5,
      },
      job: {
        id: 2,
      },
      applicationType: 'NATIVE',
    };
    const currentUser = <CurrentUserDetail> {
      id: 1,
    };
    spyOn(identityService, 'verifyEmail').and.returnValue(of({
      token: 'sometoken',
    }));
    spyOn(identityService, 'loginWithToken').and.returnValue(of(currentUser));
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(of(application));
    spyOn(router, 'navigateByUrl');
    fixture.detectChanges();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/candidate');
    expect(component.isSuccessed).toBeTruthy();
  });

  it('should throw bad token error', () => {
    spyOn(identityService, 'verifyEmail').and.returnValue(Observable.throw({
      error: {
        errorCode: 'CROS-0022',
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    fixture.detectChanges();
    expect(component.isBadToken).toBeTruthy();
  });

  it('should throw expired token error', () => {
    spyOn(identityService, 'verifyEmail').and.returnValue(Observable.throw({
      error: {
        errorCode: 'CROS-0023',
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    fixture.detectChanges();
    expect(component.isTokenExpired).toBeTruthy();
  });

  it('should throw already active user error', () => {
    spyOn(identityService, 'verifyEmail').and.returnValue(Observable.throw({
      error: {
        errorCode: 'CROS-0071',
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    fixture.detectChanges();
    expect(component.isAlreadyActive).toBeTruthy();
  });

  it('should throw test exists error', () => {
    spyOn(identityService, 'verifyEmail').and.returnValue(Observable.throw({
      error: {
        errorCode: 'CROS-7004',
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    fixture.detectChanges();
    expect(component.testExists).toBeTruthy();
  });

  it('should throw unknown api error', () => {
    spyOn(identityService, 'verifyEmail').and.returnValue(Observable.throw({
      error: {
        errorCode: 'unknown',
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    fixture.detectChanges();
    expect(component.isUnknowError).toBeTruthy();
  });

  it('should throw unknown error', () => {
    spyOn(identityService, 'verifyEmail').and.returnValue(Observable.throw({}));
    fixture.detectChanges();
    expect(component.isUnknowError).toBeTruthy();
  });

  it('[showResendForm] should show resend form', () => {
    component.showResendForm();
    expect(component.showResend).toBeTruthy();
  });

  it('[resend] should resend email', () => {
    spyOn(identityService, 'verifyEmail').and.callThrough();
    spyOn(identityService, 'loginWithToken');
    spyOn(identityService, 'resendActivation').and.returnValue(of(true));
    fixture.detectChanges();
    component.form.controls['email'].setValue('test@test.com');
    component.resend();
    expect(component.isLoading).toBeFalsy();
  });

  it('[resend] should get error', () => {
    spyOn(identityService, 'verifyEmail').and.callThrough();
    spyOn(identityService, 'loginWithToken');
    spyOn(identityService, 'resendActivation').and.returnValue(Observable.throw({}));
    fixture.detectChanges();
    component.form.controls['email'].setValue('test@test.com');
    component.resend();
    expect(component.isUnknowError).toBeTruthy();
  });

  it('[resend] should do nothing', () => {
    spyOn(identityService, 'resendActivation');
    fixture.detectChanges();
    component.form.controls['email'].setValue('');
    component.resend();
    expect(identityService.resendActivation).not.toHaveBeenCalled();
  });
});
