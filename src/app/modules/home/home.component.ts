import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';

@Component({
  selector: 'app-home',
  template: '',
})
export class HomeComponent implements OnInit {

  private static AUTH_LOGIN_URL = 'auth/login';
  private static CANDIDATE_HOME_URL = '/candidate';

  constructor(
    protected authTokenService: AuthTokenService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    const token = this.authTokenService.getToken();
    // if token is defined, redirect
    if (token) {
      this.retrieveDataAndRedirect();
    } else {
      this.router.navigateByUrl(HomeComponent.AUTH_LOGIN_URL);
    }
  }

  private retrieveDataAndRedirect(): void {
    const storedUrl = this.activatedRoute.snapshot.queryParams['redirectUrl'];
    if (storedUrl) {
      this.router.navigateByUrl(storedUrl);
      return;
    }
    // TODO: The specific redirection will be handled by https://jira.devfactory.com/browse/AWORK-32207
    /* istanbul ignore else */
    if (this.router.url === '/') {
      this.router.navigateByUrl(HomeComponent.CANDIDATE_HOME_URL);
    }
  }
}
