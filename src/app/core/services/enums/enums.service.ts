import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnumsResponse } from 'app/core/models/enums';
import { environment } from 'environments/environment';
import { map, retry } from 'rxjs/operators';
import { shareReplay } from 'rxjs/operators/shareReplay';
import { Observable } from 'rxjs/Observable';

const URLs = {
  enums: `${environment.apiPath}/public/enums`,
};

@Injectable()
export class EnumsService {

  constructor(private httpClient: HttpClient) {}

  public getSecurityQuestions(): Observable<string[]> {
    return this.getEnums()
      .pipe(map(enumItem => enumItem.securityQuestions));
  }

  /**
   * @deprecated Do not use this function, introduce an specific function to isolate what you are getting from the backend
   */
  public getEnums(): Observable<EnumsResponse> {
    return this.httpClient.get<EnumsResponse>(URLs.enums)
      .pipe(
        retry(2),
        shareReplay(1)
      );
  }

}
