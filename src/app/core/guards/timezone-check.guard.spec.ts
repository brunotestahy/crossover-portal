import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { DfModalService } from '@devfactory/ngx-df';
import * as moment from 'moment';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { TimezoneCheckGuard } from 'app/core/guards/timezone-check.guard';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { LOCAL_STORAGE_TOKEN } from 'app/core/tokens/local-storage.token';

describe('TimezoneCheckGuard', () => {
  let guard: TimezoneCheckGuard;
  let identityService: IdentityService;
  let localStorage: Storage;
  let modalService: DfModalService;
  let router: Router;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
        ],
        providers: [
          TimezoneCheckGuard,
          { provide: Router, useFactory: () => mock(Router) },
          {
            provide: IdentityService,
            useValue: {
              getCurrentUser: () => of(),
            },
          },
          { provide: DfModalService, useFactory: () => mock(DfModalService) },
          {
            provide: LOCAL_STORAGE_TOKEN, useValue: {
              getItem: () => '',
              setItem: () => '',
            },
          },
        ],
      });
    })
  );

  beforeEach(() => {
    guard = TestBed.get(TimezoneCheckGuard);
    identityService = TestBed.get(IdentityService);
    localStorage = TestBed.get(LOCAL_STORAGE_TOKEN);
    modalService = TestBed.get(DfModalService);
    router = TestBed.get(Router);
  });

  it('should be created successfully', () =>
    expect(guard).toBeTruthy()
  );

  it('should force data check when user data is not available', fakeAsync(() => {
    spyOn(identityService, 'getCurrentUser').and.returnValue(of(null));
    guard.shouldCheck = false;
    guard.resetWithoutCurrentUser();

    tick();

    expect(guard.shouldCheck).toBe(true);
  }));

  it('should skip popup display when timezone data is not available', fakeAsync(() => {
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({
      location: {timeZone: null},
    }));
    spyOn(modalService, 'open');
    const canActivate = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    tick();

    expect(canActivate).toEqual(jasmine.any(Observable));
    if (canActivate instanceof Observable) {
      canActivate.pipe(take(1))
        .subscribe(data => expect(data).toBe(true));
      expect(modalService.open).not.toHaveBeenCalled();
    }
  }));

  it('should skip popup display when environment timezone matches user timezone', fakeAsync(() => {
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({
      location: {
        timeZone: {
          hourlyOffset: moment().format('Z'),
        },
      },
    }));
    spyOn(modalService, 'open');
    const canActivate = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    tick();
    expect(canActivate).toEqual(jasmine.any(Observable));

    if (canActivate instanceof Observable) {
      canActivate.pipe(take(1))
        .subscribe(data => {
          expect(data).toBe(true);
          expect(modalService.open).not.toHaveBeenCalled();
        });
      tick();
    }
  }));

  it('should skip popup display when execution data already exists on local storage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('true');

    guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(guard.shouldCheck).toBe(false);
  });

  it('should display the popup and redirect page when environment and user timezone do not match and user accepts change',
  fakeAsync(() => {
    const secondsToMilliseconds = 1000;
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({
      location: {
        timeZone: {
          offset: new Date().getTimezoneOffset() * secondsToMilliseconds * -1,
        },
      },
    }));
    spyOn(modalService, 'open').and.returnValue({ onClose: of(true) });
    spyOn(localStorage, 'setItem');
    spyOn(router, 'navigate');

    const canActivate = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    tick();
    expect(canActivate).toEqual(jasmine.any(Observable));

    if (canActivate instanceof Observable) {
      canActivate.pipe(take(1))
        .subscribe(data => {
          expect(data).toBe(true);
          expect(localStorage.setItem).toHaveBeenCalled();
          expect(router.navigate).toHaveBeenCalled();
        });
      tick();
    }
  }));

  it('should display the popup when environment and user timezone do not match and user rejects change',
  fakeAsync(() => {
    const secondsToMilliseconds = 1000;
    spyOn(identityService, 'getCurrentUser').and.returnValue(of({
      location: {
        timeZone: {
          offset: new Date().getTimezoneOffset() * secondsToMilliseconds * -1,
        },
      },
    }));
    spyOn(modalService, 'open').and.returnValue({ onClose: of(false) });
    spyOn(localStorage, 'setItem');

    const canActivate = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    tick();
    expect(canActivate).toEqual(jasmine.any(Observable));

    if (canActivate instanceof Observable) {
      canActivate.pipe(take(1))
        .subscribe(data => {
          expect(data).toBe(true);
          expect(localStorage.setItem).toHaveBeenCalled();
        });
      tick();
    }
  }));
});
