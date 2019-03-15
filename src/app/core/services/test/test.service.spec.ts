import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';

import { Test } from 'app/core/models/hire';
import { TestService } from 'app/core/services/test/test.service';
import { environment } from 'environments/environment';

describe('TestService', () => {
  let httpMock: HttpTestingController;
  let testService: TestService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          TestService,
        ],
      });
    })
  );

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    testService = TestBed.get(TestService);
  });

  it('should be created', () => expect(testService).toBeTruthy());

  it('[get] should delegate call the endpoint for response', () => {
    const testId = 1;
    const responseContent = Object.assign({ data: true }) as Test;
    testService.get(testId)
      .pipe(take(1))
      .subscribe(response => expect(response).toBe(responseContent));

    const request = httpMock.expectOne(
      `${environment.apiPath}/applications/tests/${testId}`
    );
    expect(request.request.method).toBe('GET');
    request.flush(responseContent);
    httpMock.verify();
  });
});
