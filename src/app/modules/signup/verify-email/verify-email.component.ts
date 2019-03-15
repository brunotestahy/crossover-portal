import { Component, HostBinding, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { map, tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators/catchError';
import { switchMap } from 'rxjs/operators/switchMap';

import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { isApiError } from 'app/core/type-guards/is-api-error';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'flex-item-align-center';

  public isBadToken = false;
  public isTokenExpired = false;
  public isAlreadyActive = false;
  public testExists = false;
  public isUnknowError = false;
  public isLoading = false;
  public isSuccessed = false;
  public showResend = false;
  public isResent = false;

  public startUrl = '';

  public form: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private identityService: IdentityService,
    private formBuilder: FormBuilder,
    private candidateService: CandidateService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        map(params => params.token),
        tap(() => {
          // when token changes sets loader
          this.isLoading = true;
        }),
        switchMap(token => {
          return this.identityService.verifyEmail(token).pipe(
            switchMap(response => {
              return this.identityService.loginWithToken(response.token);
            })
          );
        }),
        catchError(error => {
          if (isApiError(error)) {
            switch (error.error.errorCode) {
              case 'CROS-0022':
                this.isBadToken = true;
                break;
              case 'CROS-0023':
                this.isTokenExpired = true;
                break;
              case 'CROS-0071':
                this.isAlreadyActive = true;
                break;
              case 'CROS-7009':
              case 'CROS-7004':
                this.testExists = true;
                break;
              default:
                this.isUnknowError = true;
                break;
            }
          } else {
            this.isUnknowError = true;
          }
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe(user => {
        this.isLoading = false;
        // got error
        if (!user) {
          this.isSuccessed = false;
          return;
        }
        const userData = Object.assign(user);
        const isCompany = userData.profile ? !userData.profile.band : userData.company;
        this.startUrl = isCompany
          ? '/dashboard/team/all/'
          : '/dashboard/contractor';
        if (!isCompany) {
          this.candidateService
            .getCurrentApplication()
            .subscribe((application) => {
              this.isSuccessed = true;
              if (application.applicationType === 'NATIVE') {
                this.router.navigateByUrl('/candidate');
              }
            });
        } else {
          this.isSuccessed = true;
        }
      });

    this.form = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
    });
  }

  public showResendForm(): void {
    this.showResend = true;
  }

  public resend(): void {
    if (this.form.valid) {
      this.isLoading = true;

      const resendActivationRequest = this.identityService.resendActivation(
        this.form.value
      );

      resendActivationRequest.subscribe(
        () => {
          this.isResent = true;
          this.isTokenExpired = false;
        },
        () => this.isUnknowError = true,
        () => this.isLoading = false
      );
    }
  }
}
