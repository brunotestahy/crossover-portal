import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';

import { AppsService } from 'app/core/services/apps/apps.service';
import { environment } from 'environments/environment';

describe('AppsService', () => {
  let httpMock: HttpTestingController;
  let appsService: AppsService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          AppsService,
        ],
      });
    })
  );

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    appsService = TestBed.get(AppsService);
  });

  it('should be created', () => expect(appsService).toBeTruthy());

  it('[storeStatisticsFormManagers] should delegate call the endpoint for response', () => {
    const responseContent = Object.assign({});
    const appType = 'SAMPLE_APP_TYPE';
    appsService.storeStatisticsFormManagers(appType)
      .pipe(take(1))
      .subscribe(res => expect(res).toEqual(responseContent));

    const request = httpMock.expectOne(
      `${environment.apiPath}/apps/statistics/usage/managers?appType=${appType}`
    );
    expect(request.request.method).toBe('POST');
    request.flush(responseContent);
    httpMock.verify();
  });
});
