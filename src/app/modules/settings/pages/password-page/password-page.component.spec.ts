import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DfToasterService } from '@devfactory/ngx-df';
import { IdentityService } from 'app/core/services/identity/identity.service';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { anyString, mock, verify } from 'ts-mockito';

import { PasswordPageComponent } from './password-page.component';

describe('PasswordPageComponent', () => {
  let component: PasswordPageComponent;
  let fixture: ComponentFixture<PasswordPageComponent>;
  let identityService: IdentityService;
  let toasterService: DfToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: DfToasterService, useFactory: () => mock(DfToasterService) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordPageComponent);
    component = fixture.componentInstance;
    identityService = TestBed.get(IdentityService);
    toasterService = TestBed.get(DfToasterService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call the pattern method from the passwordMessages variable and to return the right message', () => {
    expect(component.passwordMessages.pattern({
      validationObject: '',
      value: {},
    })).toBe('At least 8 characters, 1 letter and a number or symbol');
  });

  it('should be invalid and not submit on empty fields', () => {
    component.ngOnInit();
    component.form.setValue({ oldPassword: '', newPassword: '', newPasswordRetype: '' });

    component.onSubmit();

    expect(component.form.valid).toBeFalsy();
    verify(identityService.changeCurrentUserPassword(anyString(), anyString())).never();
  });

  it('should be invalid and not submit on passwords shorter than 8 characters', () => {
    component.ngOnInit();
    component.form.setValue({ oldPassword: 'test123', newPassword: 'short', newPasswordRetype: 'short' });

    component.onSubmit();

    expect(component.form.valid).toBeFalsy();
    verify(identityService.changeCurrentUserPassword(anyString(), anyString())).never();
  });

  it('should be invalid and not submit on passwords not matching', () => {
    component.ngOnInit();
    component.form.setValue({ oldPassword: 'test123', newPassword: 'test1234', newPasswordRetype: 'test4321' });

    component.onSubmit();

    expect(component.form.valid).toBeFalsy();
    verify(identityService.changeCurrentUserPassword(anyString(), anyString())).never();
  });

  it('should call identityService.changeCurrentUserPassword once form is submitted and succeed', () => {
    spyOn(identityService, 'changeCurrentUserPassword').and.returnValue(of({}));
    spyOn(toasterService, 'popSuccess');
    component.ngOnInit();
    fixture.detectChanges();
    component.form.setValue({ oldPassword: 'test123', newPassword: 'test1234', newPasswordRetype: 'test1234' });

    component.onSubmit();

    expect(component.form.valid).toBeTruthy();
    expect(identityService.changeCurrentUserPassword).toHaveBeenCalledWith('test123', 'test1234');
    expect(component.saving).toBeFalsy();
    expect(toasterService.popSuccess).toHaveBeenCalledWith('Password changed successfully!');
  });

  it('should handle identityService.changeCurrentUserPassword error for ApiErrors', () => {
    spyOn(identityService, 'changeCurrentUserPassword')
      .and.callThrough()
      .and.returnValue(_throw({
      error: {
        errorCode: 'CROS-0027',
        httpStatus: 400,
        type: 'ERROR',
        text: 'Sample error text',
      },
    }));
    component.ngOnInit();
    fixture.detectChanges();
    component.form.setValue({ oldPassword: 'test123', newPassword: 'test1234', newPasswordRetype: 'test1234' });

    component.onSubmit();

    expect(component.form.valid).toBeTruthy();
    expect(identityService.changeCurrentUserPassword).toHaveBeenCalledWith('test123', 'test1234');
    expect(component.saving).toBeFalsy();
    expect(component.error).toBe('Sample error text');
  });

  it('should handle identityService.changeCurrentUserPassword error for other errors', () => {
    spyOn(identityService, 'changeCurrentUserPassword')
      .and.callThrough()
      .and.returnValue(_throw({ error: 'Other error' }));
    component.ngOnInit();
    fixture.detectChanges();
    component.form.setValue({ oldPassword: 'test123', newPassword: 'test1234', newPasswordRetype: 'test1234' });

    component.onSubmit();

    expect(component.form.valid).toBeTruthy();
    expect(identityService.changeCurrentUserPassword).toHaveBeenCalledWith('test123', 'test1234');
    expect(component.saving).toBeFalsy();
    expect(component.error).toBe('Error changing password.');
  });

});
