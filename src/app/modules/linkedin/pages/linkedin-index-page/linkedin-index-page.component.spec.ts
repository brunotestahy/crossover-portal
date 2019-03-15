import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { mock } from 'ts-mockito';

import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { JobApplicationService } from 'app/core/services/job-application/job-application.service';
import { LinkedInService } from 'app/core/services/linkedin/linkedin.service';
import { LinkedinIndexPageComponent } from 'app/modules/linkedin/pages/linkedin-index-page/linkedin-index-page.component';

describe('LinkedinIndexPageComponent', () => {
  let component: LinkedinIndexPageComponent;
  let fixture: ComponentFixture<typeof component>;
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let assignmentService: AssignmentService;
  let authTokenService: AuthTokenService;
  let linkedinService: LinkedInService;
  let identityService: IdentityService;
  let jobApplicationService: JobApplicationService;

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        LinkedinIndexPageComponent,
      ],
      imports: [
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {
          snapshot: {
            queryParams: {
              error: undefined,
              code: undefined,
            },
          },
        } },
        { provide: Router, useFactory: () => mock(Router) },
        { provide: AssignmentService, useFactory: () => mock(AssignmentService) },
        { provide: AuthTokenService, useFactory: () => mock(AuthTokenService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: JobApplicationService, useFactory: () => mock(JobApplicationService) },
        { provide: LinkedInService, useFactory: () => mock(LinkedInService) },
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(LinkedinIndexPageComponent);
      component = fixture.componentInstance;
      activatedRoute = TestBed.get(ActivatedRoute);
      router = TestBed.get(Router);
      assignmentService = TestBed.get(AssignmentService);
      authTokenService = TestBed.get(AuthTokenService);
      linkedinService = TestBed.get(LinkedInService);
      identityService = TestBed.get(IdentityService);
      jobApplicationService = TestBed.get(JobApplicationService);
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should redirect the user back to home page when the authentication was cancelled', () => {
    activatedRoute.snapshot.queryParams['error'] = true;
    spyOn(router, 'navigate');

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should redirect the user back to home page when a session token is already available', () => {
    spyOn(authTokenService, 'getToken').and.returnValue(true);
    spyOn(router, 'navigate');

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should authenticate the user successfully', async(() => {
    const linkedinToken = 'LINKEDIN_TOKEN';
    const defaultRedirectionRoute = '/candidate';

    activatedRoute.snapshot.queryParams['code'] = linkedinToken;
    spyOn(authTokenService, 'getToken').and.returnValue(null);
    spyOn(assignmentService, 'getDefaultRedirectionState').and.returnValue(defaultRedirectionRoute);
    spyOn(assignmentService, 'getCurrentUserActiveAssignments').and.returnValue(of({
      content: [],
    }));
    spyOn(linkedinService, 'authenticate').and.returnValue(of({
      token: linkedinToken,
      agreementNotAccepted: false,
    }));
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({
      location: { city: 'Orlando' },
    }));
    spyOn(identityService, 'loginWithToken').and.returnValue(of({}));
    spyOn(jobApplicationService, 'list').and.returnValue(of({
      content: [],
    }));
    spyOn(assignmentService, 'getRedirectionState').and.returnValue(defaultRedirectionRoute);
    spyOn(router, 'navigate');

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith([ defaultRedirectionRoute ]);
  }));

  it('should redirect the page when the user has not accepted the agreement terms yet', async(() => {
    const linkedinToken = 'LINKEDIN_TOKEN';
    const defaultRedirectionRoute = '/candidate';

    activatedRoute.snapshot.queryParams['code'] = linkedinToken;
    spyOn(authTokenService, 'getToken').and.returnValue(null);
    spyOn(assignmentService, 'getDefaultRedirectionState').and.returnValue(defaultRedirectionRoute);
    spyOn(assignmentService, 'getCurrentUserActiveAssignments').and.returnValue(null);
    spyOn(linkedinService, 'authenticate').and.returnValue(of({
      token: linkedinToken,
      agreementNotAccepted: true,
    }));
    spyOn(router, 'navigate');

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/candidate/terms']);
  }));

  it('should redirect the page when the user has not provided a city yet', async(() => {
    const linkedinToken = 'LINKEDIN_TOKEN';
    const defaultRedirectionRoute = '/candidate';

    activatedRoute.snapshot.queryParams['code'] = linkedinToken;
    spyOn(authTokenService, 'getToken').and.returnValue(null);
    spyOn(assignmentService, 'getDefaultRedirectionState').and.returnValue(defaultRedirectionRoute);
    spyOn(assignmentService, 'getCurrentUserActiveAssignments').and.returnValue(null);
    spyOn(linkedinService, 'authenticate').and.returnValue(of({
      token: linkedinToken,
      agreementNotAccepted: false,
    }));
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({
      location: { city: null },
    }));
    spyOn(identityService, 'loginWithToken').and.returnValue(of({}));
    spyOn(router, 'navigate');

    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/signup/location']);
  }));

  it('should show an error message when the LinkedIn email address does not exist on API DB', async(() => {
    const linkedinToken = 'LINKEDIN_TOKEN';
    const defaultRedirectionRoute = '/candidate';
    const errorCode = 'CROS-0001';

    activatedRoute.snapshot.queryParams['code'] = linkedinToken;
    spyOn(authTokenService, 'getToken').and.returnValue(null);
    spyOn(assignmentService, 'getDefaultRedirectionState').and.returnValue(defaultRedirectionRoute);
    spyOn(assignmentService, 'getCurrentUserActiveAssignments').and.returnValue(null);
    spyOn(linkedinService, 'authenticate').and.returnValue(
      ErrorObservable.create({ error: { errorCode } })
    );

    fixture.detectChanges();

    expect(component.errorStatus.userNotFound).toBe(true);
  }));

  it('should show an error message when the LinkedIn email address is associated with a hiring manager account', async(() => {
    const linkedinToken = 'LINKEDIN_TOKEN';
    const defaultRedirectionRoute = '/candidate';
    const errorCode = 'CROS-0003';

    activatedRoute.snapshot.queryParams['code'] = linkedinToken;
    spyOn(authTokenService, 'getToken').and.returnValue(null);
    spyOn(assignmentService, 'getDefaultRedirectionState').and.returnValue(defaultRedirectionRoute);
    spyOn(assignmentService, 'getCurrentUserActiveAssignments').and.returnValue(null);
    spyOn(linkedinService, 'authenticate').and.returnValue(
      ErrorObservable.create({ error: { errorCode } })
    );

    fixture.detectChanges();

    expect(component.errorStatus.hiringManagerAccount).toBe(true);
  }));

  it('should show an error message when a non-identifiable error occurs', async(() => {
    const linkedinToken = 'LINKEDIN_TOKEN';
    const defaultRedirectionRoute = '/candidate';

    activatedRoute.snapshot.queryParams['code'] = linkedinToken;
    spyOn(authTokenService, 'getToken').and.returnValue(null);
    spyOn(assignmentService, 'getDefaultRedirectionState').and.returnValue(defaultRedirectionRoute);
    spyOn(assignmentService, 'getCurrentUserActiveAssignments').and.returnValue(null);
    spyOn(linkedinService, 'authenticate').and.returnValue(
      ErrorObservable.create({})
    );

    fixture.detectChanges();

    expect(component.errorStatus.unknownError).toBe(true);
  }));
});
