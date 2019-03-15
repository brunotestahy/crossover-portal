import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms/src/model';
import { ActivatedRoute } from '@angular/router';
import { ConfirmForgotPasswordTokenResponse, IdentityService } from 'app/core/services/identity/identity.service';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { Observable } from 'rxjs/Observable';

import { UpdatePasswordPageComponent } from './update-password-page.component';

class IdentityServiceMock implements Partial<IdentityService> {

  public confirmForgotPasswordToken(): Observable<ConfirmForgotPasswordTokenResponse> {
    return of(<ConfirmForgotPasswordTokenResponse>{});
  }

  public updatePassword(): Observable<void> {
    return Object.assign(of(null));
  }
}

describe('UpdatePasswordPageComponent', () => {
  let component: UpdatePasswordPageComponent;
  let fixture: ComponentFixture<UpdatePasswordPageComponent>;
  let identityService: Partial<IdentityService>;

  const SAMPLE_TOKEN = 'f126b1c3-391b-4157-b687-8b0fcc74a4f6';

  beforeEach(async(() => {

    TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [ UpdatePasswordPageComponent ],
        imports: [ ReactiveFormsModule ],
        providers: [
            { provide: IdentityService, useClass: IdentityServiceMock },
            { provide: ActivatedRoute, useValue: { params: of({ token: SAMPLE_TOKEN }) }},
        ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePasswordPageComponent);
    component = fixture.componentInstance;
    identityService = TestBed.get(IdentityService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set the token and confirm it on ngInit', () => {
    const confirmForgotPasswordTokenSpy =
      spyOn(identityService, 'confirmForgotPasswordToken')
        .and.returnValue(of({ securityQuestion: 'sample-question' }));

    component.ngOnInit();

    expect(component.token).toBe(SAMPLE_TOKEN);
    expect(confirmForgotPasswordTokenSpy).toHaveBeenCalledWith(SAMPLE_TOKEN);
    expect(component.form.value.question).toBe('sample-question');
    expect(component.error).toBeNull();
  });

  it('should should display the error message if token not confirmed on ngInit', () => {
    const confirmForgotPasswordTokenSpy =
      spyOn(identityService, 'confirmForgotPasswordToken')
        .and.returnValue(_throw({
          error: {
            errorCode: 'CROS-0027',
            httpStatus: 400,
            type: 'ERROR',
            text: 'Sample error text',
          },
        }));

    component.ngOnInit();

    expect(component.token).toBe(SAMPLE_TOKEN);
    expect(confirmForgotPasswordTokenSpy).toHaveBeenCalledWith(SAMPLE_TOKEN);
    expect(component.form.value.question).toBe('');
    expect(component.error).toBe('Sample error text');
  });

  it('should be invalid and not submit on empty fields', () => {
    const updatePasswordSpy = spyOn(identityService, 'updatePassword').and.callThrough();
    component.ngOnInit();
    component.form.setValue({ question: '', answer: '', passwordGroup: { password: '', confirm: '' }});
    fixture.detectChanges();

    component.onSubmit();

    expect(component.form.valid).toBeFalsy();
    expect(updatePasswordSpy).not.toHaveBeenCalled();
  });

  it('should call identityService.updatePassword once form is submitted and succeed', () => {
    const updatePasswordSpy = spyOn(identityService, 'updatePassword').and.callThrough();
    fixture.detectChanges();
    component.form.controls['question'].setValue('Sample');
    component.form.controls['answer'].setValue('test');
    (<FormGroup> component.form.controls.passwordGroup).controls['password'].setValue('sample11');
    (<FormGroup> component.form.controls.passwordGroup).controls['confirm'].setValue('sample11');

    component.onSubmit();

    expect(updatePasswordSpy).toHaveBeenCalledWith({
      passwordResetToken: SAMPLE_TOKEN,
      rawPassword: 'sample11',
      securityQuestion: 'Sample',
      securityQuestionAnswer: 'test',
    });
    expect(component.pending).toBeFalsy();
    expect(component.success).toBeTruthy();
  });

  it('should handle identityService.updatePassword error for ApiErrors', () => {
    const updatePasswordSpy = spyOn(identityService, 'updatePassword')
      .and.callThrough()
      .and.returnValue(_throw({
        error: {
          errorCode: 'CROS-0027',
          httpStatus: 400,
          type: 'ERROR',
          text: 'Sample error text',
        },
      }));
    fixture.detectChanges();
    component.form.controls['question'].setValue('Sample');
    component.form.controls['answer'].setValue('test');
    (<FormGroup> component.form.controls.passwordGroup).controls['password'].setValue('sample11');
    (<FormGroup> component.form.controls.passwordGroup).controls['confirm'].setValue('sample11');

    component.onSubmit();

    expect(updatePasswordSpy).toHaveBeenCalledWith({
      passwordResetToken: SAMPLE_TOKEN,
      rawPassword: 'sample11',
      securityQuestion: 'Sample',
      securityQuestionAnswer: 'test',
    });
    expect(component.pending).toBeFalsy();
    expect(component.success).toBeFalsy();
    expect(component.error).toBe('Sample error text');
  });

  it('should handle identityService.updatePassword error for other errors', () => {
    const updatePasswordSpy = spyOn(identityService, 'updatePassword')
      .and.callThrough()
      .and.returnValue(_throw({ error: 'Other error' }));
    fixture.detectChanges();
    component.form.controls['question'].setValue('Sample');
    component.form.controls['answer'].setValue('test');
    (<FormGroup> component.form.controls.passwordGroup).controls['password'].setValue('sample11');
    (<FormGroup> component.form.controls.passwordGroup).controls['confirm'].setValue('sample11');

    component.onSubmit();

    expect(updatePasswordSpy).toHaveBeenCalledWith({
      passwordResetToken: SAMPLE_TOKEN,
      rawPassword: 'sample11',
      securityQuestion: 'Sample',
      securityQuestionAnswer: 'test',
    });
    expect(component.pending).toBeFalsy();
    expect(component.success).toBeFalsy();
    expect(component.error).toBe('Error updating the password.');
  });

});
