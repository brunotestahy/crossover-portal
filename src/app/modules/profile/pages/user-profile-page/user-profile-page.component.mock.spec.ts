import { take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { CANDIDATE_MOCK } from 'app/core/services/mocks/candidate.mock';
import { COUNTRIES_MOCK_DATA } from 'app/core/services/mocks/countries.mock';
import { ENUM_MOCK_DATA } from 'app/core/services/mocks/enums.mock';
import { JOB_SEARCH_MOCK } from 'app/core/services/mocks/hire.mock';
import { INDUSTRIES_MOCK_DATA, LANGUAGE_MOCK_DATA } from 'app/core/services/public/public.mock';

export class ActivatedRouteMock {
  public queryParams = Observable.of({});
}

export class EnumsServiceMock {
  public getEnums(): Observable<typeof ENUM_MOCK_DATA> {
    return Observable.of(ENUM_MOCK_DATA)
      .pipe(take(1));
  }
}

export class IdentityServiceMock {
  public getCurrentUser(): Observable<{}> {
    return Observable.of({})
      .pipe(take(1));
  }

  public getCurrentUserAs(): Observable<typeof CANDIDATE_MOCK> {
    return Observable.of(CANDIDATE_MOCK)
      .pipe(take(1));
  }

  public getCandidate(): Observable<{}> {
    return Observable.of({})
        .pipe(take(1));
  }

  public saveProfile(): Observable<{}> {
    return Observable.of({})
      .pipe(take(1));
  }

  public deleteImage(): Observable<{}> {
    return Observable.of({})
      .pipe(take(1));
  }

  public patchCurrentUser(): void {
  }
}

export class CandidateServiceMock {
  public importProfile(): void {
  }
}

export class CommonServiceMock {

  public getCountries(): Observable<{}> {
    return Observable.of(COUNTRIES_MOCK_DATA)
      .pipe(take(1));
  }

  public getSkills(): Observable<{}> {
    return Observable.of([]).pipe(take(1));
  }
}

export class HireServiceMock {
  public static applicationFileUrl = 'http://www.crossover.com';
  public static fileUploadUrl = 'http://www.fileuploaded.com/test/';

  public searchCurrentUserApplications(): Observable<{}> {
    return Observable.of(JOB_SEARCH_MOCK);
  }

  public getApplicationFile(): Observable<{}> {
    return Observable.of(HireServiceMock.applicationFileUrl);
  }

  public putApplicationFile(applicationId: number, fileId: number): Observable<{}> {
    return Observable.of({
      applicationId,
      id: fileId,
      signedUrl: HireServiceMock.fileUploadUrl,
    });
  }
}

export class PublicServiceMock {

  public getIndustries(): Observable<{}> {
    return Observable.of(INDUSTRIES_MOCK_DATA);
  }

  public getLanguages(): Observable<{}> {
    return Observable.of(LANGUAGE_MOCK_DATA);
  }
}
