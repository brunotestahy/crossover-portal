import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { LinkedInService } from 'app/core/services/linkedin';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { decodeErrorMessage } from 'app/utils/api-utilities';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  private static HOME_URL = '/contractor/dashboard';

  public form: FormGroup;
  public pending = false;
  public error: string | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    protected authTokenService: AuthTokenService,
    private formBuilder: FormBuilder,
    private identityService: IdentityService,
    private linkedinService: LinkedInService,
    private router: Router,
    @Inject(WINDOW_TOKEN) private window: Window
  ) {
  }

  public ngOnInit(): void {
    this.redirectIfUserLoggedIn();
    this.form = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.required],
    });
  }

  public onSubmit(): void {
    if (this.form.valid && !this.pending) {
      this.pending = true;
      this.error = null;
      this.identityService.login(this.form.value.email, this.form.value.password)
        .subscribe(
          () => {
            this.pending = false;
            const redirectUrl = this.activatedRoute.snapshot.queryParams['redirectUrl'];
            this.router.navigate([LoginPageComponent.HOME_URL], { queryParams: { redirectUrl } });
          },
          (error) => {
            this.pending = false;
            this.error = decodeErrorMessage(error, 'Invalid email and/or password!');
          }
        );
    }
  }

  public loginWithLinkedIn(): void {
    const redirectUrl = this.linkedinService.generateAuthorizationUrl('', 'auth');
    this.window.location.replace(redirectUrl);
  }

  private redirectIfUserLoggedIn(): void {
    const token = this.authTokenService.getToken();
    // if token is defined, redirect
    if (token) {
      this.router.navigateByUrl(LoginPageComponent.HOME_URL);
    }
  }
}
