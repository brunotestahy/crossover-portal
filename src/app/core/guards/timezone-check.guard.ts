import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { DfModalOptions, DfModalService } from '@devfactory/ngx-df';
import { format } from 'date-fns';
import * as moment from 'moment';
import { of } from 'rxjs/observable/of';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { CurrentUserDetail } from 'app/core/models/identity';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { LOCAL_STORAGE_TOKEN } from 'app/core/tokens/local-storage.token';
import {
  TimezoneUpdateModalComponent,
} from 'app/shared/components/timezone-update-modal/timezone-update-modal.component';

@Injectable()
export class TimezoneCheckGuard implements CanActivate {
  private timezoneCheckKey = 'timezoneCheckGuard';
  public shouldCheck = true;

  constructor(
    protected router: Router,
    protected identityService: IdentityService,
    protected modalService: DfModalService,
    @Inject(LOCAL_STORAGE_TOKEN) protected localStorage: Storage
  ) {
    this.resetWithoutCurrentUser();
  }

  public resetWithoutCurrentUser(): void {
    this
      .redefineCheckStatus()
      .identityService
      .getCurrentUser()
      .pipe(filter(user => !user))
      .subscribe(
        () => this.shouldCheck = true,
        () => this.shouldCheck = false
      );
  }

  public canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    if (!this.redefineCheckStatus().shouldCheck) {
      return true;
    }
    this.shouldCheck = false;
    const currentTimezone = format(new Date(), 'Z');
    const userTimezone$ = this.identityService
      .getCurrentUser()
      .pipe(
        take(1),
        map(user => (user as CurrentUserDetail).location.timeZone)
      );
    return userTimezone$.pipe(
      switchMap(timezone => {
        const currentHourlyOffset = moment().format('Z');
        if (!timezone || currentHourlyOffset === timezone.hourlyOffset) {
          return of(true);
        }
        const modalRef = this.modalService.open(TimezoneUpdateModalComponent, <DfModalOptions>{
          data: {
            currentTimezone: currentTimezone,
            user: timezone,
          },
        });
        return modalRef.onClose.pipe(
          take(1),
          map((shouldNavigate: boolean | undefined) => {
            if (shouldNavigate) {
              this.router.navigate(['settings', 'location-info']);
            }
            this.localStorage.setItem(this.timezoneCheckKey, 'true');
            return true;
          })
        );
      })
    );
  }

  protected redefineCheckStatus(): TimezoneCheckGuard {
    this.shouldCheck = this.localStorage.getItem(this.timezoneCheckKey) !== 'true';
    return this;
  }
}
