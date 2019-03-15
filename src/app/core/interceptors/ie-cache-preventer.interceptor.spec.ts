import { async, TestBed } from '@angular/core/testing';
import { set } from 'lodash';

import { IeCachePreventerInterceptor } from 'app/core/interceptors/ie-cache-preventer.interceptor';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';

describe('IeCachePreventerInterceptor', () => {
  let interceptor: IeCachePreventerInterceptor;
  let targetWindow: Window;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
        ],
        providers: [
          IeCachePreventerInterceptor,
          { provide: WINDOW_TOKEN, useValue: {
            navigator: {
              userAgent: 'MSIE 11',
            },
          }}
        ],
      });
    })
  );

  beforeEach(() => {
    interceptor = TestBed.get(IeCachePreventerInterceptor);
    targetWindow = TestBed.get(WINDOW_TOKEN);
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-06-20T05:45:00'));
  });

  afterEach(() => jasmine.clock().uninstall());

  it('should be created successfully', () =>
    expect(interceptor).toBeTruthy()
  );

  it('should set a random query string value when a GET request is sent from IE browser', () => {
    const clonedValue = Object.assign({});
    const request = {
        method: 'GET',
        clone: jasmine.createSpy('request.clone').and.returnValue(clonedValue),
    };
    const next = { handle: jasmine.createSpy('next.handler') };
    const time = new Date().getTime().toString();
    interceptor.intercept(Object.assign(request), Object.assign(next));

    expect(request.clone).toHaveBeenCalledWith({
      setParams: {
        [`random${time}`]: time,
      },
    });
    expect(next.handle).toHaveBeenCalledWith(clonedValue);
  });

  it('should not set a random query string value when not submitting a POST request from IE browser', () => {
    const request = {
        method: 'POST',
        clone: jasmine.createSpy('request.clone'),
    };
    const next = { handle: jasmine.createSpy('next.handler') };
    interceptor.intercept(Object.assign(request), Object.assign(next));

    expect(request.clone).not.toHaveBeenCalled();
    expect(next.handle).toHaveBeenCalledWith(request);
  });

  it('should not set a random query string value when not submitting a GET request from a non-IE browser', () => {
    set(targetWindow.navigator, 'userAgent', 'NON-IE BROWSER');
    const request = {
        method: 'GET',
        clone: jasmine.createSpy('request.clone'),
    };
    const next = { handle: jasmine.createSpy('next.handler') };
    interceptor.intercept(Object.assign(request), Object.assign(next));

    expect(request.clone).not.toHaveBeenCalled();
    expect(next.handle).toHaveBeenCalledWith(request);
  });
});
