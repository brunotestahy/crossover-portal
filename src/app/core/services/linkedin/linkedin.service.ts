import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { sprintf } from 'sprintf-js';

import { Token } from 'app/core/models/identity';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { environment } from 'environments/environment';

const URLs = {
  authenticate: `${environment.apiPath}/identity/authentication/linkedin?v2ui=%(v2ui)s`,
};

@Injectable()
export class LinkedInService {
  protected static authorizationRedirectMapping = {
    'assets': '/assets/linkedin.html',
    'auth': '/y/linkedin',
  };

  constructor(
    private httpClient: HttpClient,
    @Inject(WINDOW_TOKEN) private window: Window
  ) {
  }

  public generateAuthorizationUrl(
    importProfileType: string,
    targetType: keyof typeof LinkedInService.authorizationRedirectMapping
  ): string {
    const targetUrl = LinkedInService.authorizationRedirectMapping[targetType];
    const params = {
      base: environment.linkedIn.oauthUrl,
      clientId: environment.linkedIn.apiKey,
      scope: [
        'r_fullprofile',
        'r_emailaddress',
        'r_contactinfo',
      ],
      state: this.generateRandomString(),
      redirectUri: `${this.getBasePath()}${targetUrl}`,
    };
    const url = `${params.base}&client_id=${params.clientId}` +
    `&scope=${params.scope.join(' ')}&state=${params.state}${importProfileType}` +
    `&redirect_uri=${params.redirectUri}`;
    return url;
  }

  public authenticate(
    token: string,
    v2ui: keyof typeof LinkedInService.authorizationRedirectMapping
  ): Observable<Token> {
    const url = sprintf(URLs.authenticate, { v2ui });
    return this.httpClient.post<Token>(url, { token });
  }

  private generateRandomString(): string {
    const alphaNumerics = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let length = 16, i = length; i > 0; --i) {
      result += alphaNumerics[Math.round(Math.random() * (alphaNumerics.length - 1))];
    }
    return result;
  }

  private getBasePath(): string {
    const port = this.window.location.port ? `:${this.window.location.port}` : '';
    return `${this.window.location.protocol}//${this.window.location.hostname}${port}`;
  }
}
