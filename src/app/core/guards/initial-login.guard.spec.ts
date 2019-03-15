import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { DfPortalService } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { mock } from 'ts-mockito';

import { InitialLoginGuard } from 'app/core/guards/initial-login.guard';
import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { CookiesService } from 'app/shared/services/cookies/cookies.service';

describe('InitialLoginGuard', () => {
  let guard: InitialLoginGuard;
  let identityService: IdentityService;
  let authTokenService: AuthTokenService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
        ],
        providers: [
          InitialLoginGuard,
          CookiesService,
          { provide: IdentityService, useFactory: () => mock(IdentityService) },
          { provide: AuthTokenService, useFactory: () => mock(AuthTokenService) },
          { provide: DfPortalService, useFactory: () => mock(DfPortalService) },
          { provide: WINDOW_TOKEN, useValue: {
            location: {},
          } },
        ],
      });
    })
  );

  beforeEach(() => {
    guard = TestBed.get(InitialLoginGuard);
    identityService = TestBed.get(IdentityService);
    authTokenService = TestBed.get(AuthTokenService);
  });

  it('should be created successfully', () =>
    expect(guard).toBeTruthy()
  );

  it('[canActivate] should return observable', fakeAsync(() => {
    spyOn(authTokenService, 'getToken').and.returnValue(of('sometoken'));
    spyOn(identityService, 'loginWithToken').and.returnValue(of(true));
    const canActivate = guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    tick();
    expect(canActivate).toEqual(jasmine.any(Observable));
  }));
});
