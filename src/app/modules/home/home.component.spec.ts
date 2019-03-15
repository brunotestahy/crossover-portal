import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { mock } from 'ts-mockito';

import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';

import { HomeComponent } from './home.component';

describe('LoginPageComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authTokenService: AuthTokenService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ HomeComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: AuthTokenService, useFactory: () => mock(AuthTokenService) },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: { redirectUrl: 'someurl' } } } },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    authTokenService = TestBed.get(AuthTokenService);
    activatedRoute = TestBed.get(ActivatedRoute);
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit] should redirect to login page when no token or stored URL were provided', () => {
    spyOn(authTokenService, 'getToken').and.returnValue(null);
    spyOn(router, 'navigateByUrl');
    fixture.detectChanges();
    expect(router.navigateByUrl).toHaveBeenCalledWith('auth/login');
  });

  it('[ngOnInit] should redirect to candidate home page when a valid token was provided', () => {
    spyOn(authTokenService, 'getToken').and.returnValue('someToken');
    activatedRoute.snapshot.queryParams = { redirectUrl: null };
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
    fixture.detectChanges();
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/candidate');
  });

  it('[ngOnInit] should redirect to a custom page when a stored URL and a valid token were provided', () => {
    spyOn(authTokenService, 'getToken').and.returnValue('someToken');
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
    fixture.detectChanges();
    expect(navigateByUrlSpy).toHaveBeenCalledWith('someurl');
  });
});
