import { Inject, Injectable } from '@angular/core';
import {
  addYears,
} from 'date-fns';
import * as Cookies from 'es-cookie';

import * as CookieConstants from 'app/core/constants/cookies';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';

@Injectable()
export class CookiesService {

  constructor(@Inject(WINDOW_TOKEN) private window: Window) { }

  public getCookie(name: string): string | undefined {
    return Cookies.get(name);
  }

  public setCookie(name: string, value: string): void {
    Cookies.set(name, value, {
      expires: addYears(new Date(), CookieConstants.COOKIES_EXPIRATION_YEARS),
      domain: this.window.location.hostname,
      path: '/',
    });
  }
}
