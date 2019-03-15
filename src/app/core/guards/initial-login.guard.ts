import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { DfPortalOptions, DfPortalOrientation, DfPortalService } from '@devfactory/ngx-df/portal';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import * as CookieConstants from 'app/core/constants/cookies';
import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { CookieAlertComponent } from 'app/shared/components/cookie-alert/cookie-alert.component';
import { CookiesService } from 'app/shared/services/cookies/cookies.service';

@Injectable()
export class InitialLoginGuard implements CanActivate {

  constructor(
    protected identityService: IdentityService,
    protected authTokenService: AuthTokenService,
    private cookiesService: CookiesService,
    protected portalService: DfPortalService
  ) {
    this.checkCookie();
  }

  public canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
      // lets check token
      const token = this.authTokenService.getToken();
      // if token is defined, try to authenticate user
      if (token) {
        return this.identityService.loginWithToken(token).pipe(map(Boolean));
      }
      return true;
  }

  public checkCookie(): void {
    if (!this.cookiesService.getCookie(CookieConstants.COOKIE_NAME)) {
      this.cookiesService.setCookie(CookieConstants.COOKIE_NAME, CookieConstants.COOKIES_ADS_LEVEL);
      this.openComponentPortal();
    }
  }

  private openComponentPortal(): void {
    const options = new DfPortalOptions();
    options.showBackdrop = false;
    options.orientation = DfPortalOrientation.Bottom;
    this.portalService.open(CookieAlertComponent, options);
  }
}
