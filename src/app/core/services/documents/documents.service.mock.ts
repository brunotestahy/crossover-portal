import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

export class DocumentsServiceMock {

  public getPrivacyPolicyDocument(): Observable<string> {
    return of('Sample privacy_policy');
  }

  public getSupportDocument(): Observable<string> {
    return of('Sample support');
  }

  public getBestPracticesDocument(): Observable<string> {
    return of('Sample best_practices');
  }
}
