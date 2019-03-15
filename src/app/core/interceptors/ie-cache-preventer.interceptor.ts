import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { WINDOW_TOKEN } from 'app/core/tokens/window.token';

@Injectable()
export class IeCachePreventerInterceptor implements HttpInterceptor {
  constructor(
    @Inject(WINDOW_TOKEN) private window: Window
  ) {
  }

  public intercept(
    request: HttpRequest<{}>,
    next: HttpHandler
  ): Observable<HttpEvent<{}>> {
    const userAgent = this.window.navigator.userAgent;
    const isIE = userAgent.indexOf('MSIE ') !== -1;
    if (isIE && request.method === 'GET') {
      const time = new Date().getTime().toString();
      request = request.clone({
        setParams: {
          [`random${time}`]: time
        }
      });
    }
    return next.handle(request);
  }
}
