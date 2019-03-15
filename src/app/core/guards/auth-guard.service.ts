import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import * as AvatarTypes from 'app/core/constants/avatar-types';
import { IdentityService } from 'app/core/services/identity/identity.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private managerURLs: string[] = ['/applicants/tracking', '/pipeline-tracker'];

  constructor(
    protected router: Router,
    protected identityService: IdentityService
  ) {}

  public canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    const states = [
      {
         condition: () => this.identityService.isUserLogged() &&
          this.identityService.hasAvatarType(this.identityService.getCurrentUserValue(), AvatarTypes.Manager),
         authorized: true,
      },
      {
         condition: () => this.identityService.isUserLogged() &&
          !this.identityService.hasAvatarType(this.identityService.getCurrentUserValue(), AvatarTypes.Manager) &&
          !this.managerURLs.some(url => url === state.url),
         authorized: true,
      },
      // Default condition
      {
         condition: () => true,
         authorized: false,
      },
     ];
     const authorized = states.filter(entry => entry.condition())[0].authorized;

     if (!authorized) {
      this.router.navigate(['/auth/login'], { queryParams: { redirectUrl: state.url } });
     }
     return authorized;
  }
}
