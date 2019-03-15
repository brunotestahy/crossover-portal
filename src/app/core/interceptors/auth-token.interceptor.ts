import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(protected authToken: AuthTokenService) {}

  public intercept(
    request: HttpRequest<{}>,
    next: HttpHandler
  ): Observable<HttpEvent<{}>> {
    const token = this.authToken.getToken();
    // if token is defined, add appropriate header
    if (token) {
      request = request.clone({
        setHeaders: {
          'X-Auth-Token': token,
        },
      });
    }
    return next.handle(request);
  }
}
