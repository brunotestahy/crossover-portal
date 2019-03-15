import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { mock } from 'ts-mockito';

import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { LinkedInService } from 'app/core/services/linkedin/linkedin.service';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { LoginPageComponent } from 'app/modules/auth/pages/login-page/login-page.component';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let identityService: IdentityService;
  let authTokenService: AuthTokenService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ LoginPageComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: AuthTokenService, useFactory: () => mock(AuthTokenService) },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: { redirectUrl: 'someurl' } } } },
        { provide: LinkedInService, useFactory: () => mock(LinkedInService) },
        { provide: WINDOW_TOKEN, useValue: {
          location: {
            replace: () => true,
          },
        } },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    identityService = TestBed.get(IdentityService);
    authTokenService = TestBed.get(AuthTokenService);
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit] no token', () => {
    spyOn(authTokenService, 'getToken').and.returnValue(null);
    spyOn(router, 'navigateByUrl');
    component.ngOnInit();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('[ngOnInit] valid token / stored url', () => {
    spyOn(authTokenService, 'getToken').and.returnValue('someToken');
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
    component.ngOnInit();
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/contractor/dashboard');
  });

  it('[onSubmit] should be invalid and not submit on empty fields', () => {
    const loginSpy = spyOn(identityService, 'login').and.returnValue({});
    spyOn(authTokenService, 'getToken').and.returnValue(null);
    component.ngOnInit();
    component.form.setValue({ email: '', password: '' });
    component.onSubmit();
    expect(component.form.valid).toBeFalsy();
    expect(loginSpy).not.toHaveBeenCalled();
  });

  it('[onSubmit] should call identityService.login once form is submitted and succeed', () => {
    const loginSpy = spyOn(identityService, 'login').and.returnValue(of({}));
    spyOn(authTokenService, 'getToken').and.returnValue(null);
    const navigateSpy = spyOn(router, 'navigate');
    fixture.detectChanges();
    component.form.setValue({ email: 'admin@admin', password: 'sample' });

    component.onSubmit();

    expect(loginSpy).toHaveBeenCalledWith('admin@admin', 'sample');
    expect(component.pending).toBeFalsy();
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('should handle identityService.login error for ApiErrors', () => {
    const loginSpy = spyOn(identityService, 'login')
      .and.callThrough()
      .and.returnValue(_throw({
        error: {
          errorCode: 'CROS-0027',
          httpStatus: 400,
          type: 'ERROR',
          text: 'Sample error text',
        },
      }));
    spyOn(authTokenService, 'getToken').and.returnValue(null);
    fixture.detectChanges();
    component.form.setValue({ email: 'admin@admin', password: 'sample' });

    component.onSubmit();

    expect(loginSpy).toHaveBeenCalledWith('admin@admin', 'sample');
    expect(component.pending).toBeFalsy();
    expect(component.error).toBe('Sample error text');
  });

  it('should handle identityService.login error for other errors', () => {
    const loginSpy = spyOn(identityService, 'login')
      .and.callThrough()
      .and.returnValue(_throw({ error: 'Other error' }));
    spyOn(authTokenService, 'getToken').and.returnValue(null);
    fixture.detectChanges();
    component.form.setValue({ email: 'admin@admin', password: 'sample' });

    component.onSubmit();

    expect(loginSpy).toHaveBeenCalledWith('admin@admin', 'sample');
    expect(component.pending).toBeFalsy();
    expect(component.error).toBe('Invalid email and/or password!');
  });
});
