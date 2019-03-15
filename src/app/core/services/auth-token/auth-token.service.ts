import { Inject, Injectable } from '@angular/core';

import { LOCAL_STORAGE_TOKEN } from '../../tokens/local-storage.token';

@Injectable()
export class AuthTokenService {

  public static readonly TOKEN_LOCAL_STORAGE_KEY = 'xo_token';

  constructor(@Inject(LOCAL_STORAGE_TOKEN) private localStorage: Storage) { }

  public getToken(): string | null {
    const token = this.localStorage.getItem(
      AuthTokenService.TOKEN_LOCAL_STORAGE_KEY
    );
    if (token === 'undefined') {
      return null;
    } else {
      return token;
    }
  }

  public setToken(token: string): void {
    this.localStorage.setItem(AuthTokenService.TOKEN_LOCAL_STORAGE_KEY, token);
  }

  public removeToken(): void {
    this.localStorage.removeItem(AuthTokenService.TOKEN_LOCAL_STORAGE_KEY);
  }

}
