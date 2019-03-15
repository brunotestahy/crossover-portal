import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { Observable } from 'rxjs/Observable';

import { ForgotPasswordPageComponent } from './forgot-password-page.component';

class IdentityServiceMock implements Partial<IdentityService> {

  public forgotPassword(): Observable<void> {
    return Object.assign(of(null));
  }
}

describe('ForgotPasswordPageComponent', () => {
  let component: ForgotPasswordPageComponent;
  let fixture: ComponentFixture<ForgotPasswordPageComponent>;
  let identityService: Partial<IdentityService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [ ForgotPasswordPageComponent ],
        imports: [ ReactiveFormsModule ],
        providers: [
            { provide: IdentityService, useClass: IdentityServiceMock },
        ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    identityService = TestBed.get(IdentityService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call identityService.forgotPassword once form is submitted', () => {
    const forgotPasswordSpy = spyOn(identityService, 'forgotPassword').and.callThrough();
    const SAMPLE_DATA = { email: 'test@example.org' };
    component.form.setValue(SAMPLE_DATA);
    component.onSubmit();

    expect(forgotPasswordSpy).toHaveBeenCalledWith(SAMPLE_DATA);
    expect(component.pending).toBeFalsy();
    expect(component.success).toBeTruthy();
  });

  it('should not submit if the form is pending', () => {
    const forgotPasswordSpy = spyOn(identityService, 'forgotPassword').and.callThrough();
    component.form.setValue({ email: 'test@example.org' });
    component.pending = true;
    component.success = false;
    component.onSubmit();

    expect(forgotPasswordSpy).not.toHaveBeenCalled();
    expect(component.pending).toBeTruthy();
    expect(component.success).toBeFalsy();
  });

  it('should not submit on invalid email', () => {
    const forgotPasswordSpy = spyOn(identityService, 'forgotPassword').and.callThrough();
    component.form.setValue({ email: 'test' });
    component.pending = false;
    component.success = false;
    fixture.detectChanges();
    component.onSubmit();

    expect(forgotPasswordSpy).not.toHaveBeenCalled();
    expect(component.pending).toBeFalsy();
    expect(component.success).toBeFalsy();
  });

  it('should not submit on empty email', () => {
    const forgotPasswordSpy = spyOn(identityService, 'forgotPassword').and.callThrough();
    component.form.setValue({ email: '' });
    component.pending = false;
    component.success = false;
    fixture.detectChanges();
    component.onSubmit();

    expect(forgotPasswordSpy).not.toHaveBeenCalled();
    expect(component.pending).toBeFalsy();
    expect(component.success).toBeFalsy();
  });

  it('should handle identityService.forgotPassword error for ApiErrors', () => {
    const forgotPasswordSpy = spyOn(identityService, 'forgotPassword')
      .and.returnValue(_throw({
        error: {
          errorCode: 'CROS-0027',
          httpStatus: 400,
          type: 'ERROR',
          text: 'Sample error text',
        },
      }));
    const SAMPLE_DATA = { email: 'test@example.org' };
    component.form.setValue(SAMPLE_DATA);
    component.onSubmit();

    expect(forgotPasswordSpy).toHaveBeenCalledWith(SAMPLE_DATA);
    expect(component.pending).toBeFalsy();
    expect(component.error).toBe('Sample error text');
  });

  it('should handle identityService.forgotPassword error for other errors', () => {
    const forgotPasswordSpy = spyOn(identityService, 'forgotPassword')
      .and.returnValue(_throw({ error: 'Other error' }));
    const SAMPLE_DATA = { email: 'test@example.org' };
    component.form.setValue(SAMPLE_DATA);
    component.onSubmit();

    expect(forgotPasswordSpy).toHaveBeenCalledWith(SAMPLE_DATA);
    expect(component.pending).toBeFalsy();
    expect(component.error).toBe('Error requesting the forgot password email.');
  });

});
