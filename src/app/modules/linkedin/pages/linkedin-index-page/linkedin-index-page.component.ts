import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { ApiError } from 'app/core/models/error';
import { CurrentUserDetail } from 'app/core/models/identity';
import { Token } from 'app/core/models/identity';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { JobApplicationService } from 'app/core/services/job-application/job-application.service';
import { LinkedInService } from 'app/core/services/linkedin/linkedin.service';

@Component({
  selector: 'app-linkedin-index-page',
  templateUrl: 'linkedin-index-page.component.html',
  styleUrls: ['linkedin-index-page.component.scss'],
})
export class LinkedinIndexPageComponent implements OnInit {
  public errorStatus = {
    userNotFound: false,
    hiringManagerAccount: false,
    unknownError: false,
  };
  public loading = true;
  public year = new Date().getFullYear();

  constructor(
    private activatedRoute: ActivatedRoute,
    private assignmentService: AssignmentService,
    private authTokenService: AuthTokenService,
    private identityService: IdentityService,
    private jobApplicationService: JobApplicationService,
    private linkedinService: LinkedInService,
    private router: Router
  ) {
  }

  public ngOnInit(): void {
    const requestDeniedByUser = this.activatedRoute.snapshot.queryParams['error'] !== undefined;
    const token = this.activatedRoute.snapshot.queryParams['code'];
    if (requestDeniedByUser || this.authTokenService.getToken()) {
      this.router.navigate(['/']);
      return;
    }
    this.authenticate(token);
  }

  public authenticate(token: string): void {
    const defaultRedirectRoute = this.assignmentService.getDefaultRedirectionState();
    let redirectRoute = defaultRedirectRoute; // TODO: redirect route redefinition support
    const errorHandlers = {
      'CROS-0001': () => this.errorStatus.userNotFound = true,
      'CROS-0003': () => this.errorStatus.hiringManagerAccount = true,
      'cityNotProvided': () => this.router.navigate(['/signup/location']),
      // TODO: this route must be implemented
      'termsNotAccepted': () => this.router.navigate(['/candidate/terms']),
      'default': () => this.errorStatus.unknownError = true,
    } as {[key: string]: () => void};


    this.linkedinService.authenticate(token, 'auth')
      .pipe(
        map(data => {
          if (data.agreementNotAccepted) {
            throw {error: { errorCode: 'termsNotAccepted' }};
          }
          return data;
        }),
        switchMap((data: Token) => this.identityService.loginWithToken(data.token)),
        switchMap(() => this.identityService.getCurrentUser() as Observable<CurrentUserDetail>),
        map(data => {
          if (!data.location.city) {
            throw {error: { errorCode: 'cityNotProvided' }};
          }
          return data;
        }),
        switchMap(() =>
          forkJoin(
            this.jobApplicationService.list({ avatarType: 'CANDIDATE' }),
            this.assignmentService.getCurrentUserActiveAssignments()
          )
        )
      )
      .subscribe(
        ([applications, assignments]) => {
          redirectRoute = this.assignmentService.getRedirectionState(
            assignments.content,
            applications.content
          );
          this.router.navigate([redirectRoute]);
        },
        (response: ApiError) => {
          const errorDetail = response.error || {};
          const errorHandler = errorHandlers[errorDetail.errorCode] || errorHandlers['default'];
          this.authTokenService.removeToken();
          this.identityService.patchCurrentUser(null);
          errorHandler();
          this.loading = false;
        }
      );
  }
}
