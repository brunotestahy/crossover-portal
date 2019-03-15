import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SignInResponse } from 'app/core/models/google';
import { environment } from 'environments/environment';

const URLs = {
  userdata: environment.apiPath + '/google/userdata',
  testConnection: environment.apiPath + '/google/test',
  disconnect: environment.apiPath + '/google/userdata',
  signIn: environment.apiPath + '/google/signin',
};

@Injectable()
export class GoogleService {

  constructor(
    private http: HttpClient
  ) {
  }

  public disconnect(): Observable<{}> {
    return this.http.delete<{}>(URLs.disconnect);
  }

  public getUserData(): Observable<SignInResponse> {
    return this.http.get<SignInResponse>(URLs.userdata);
  }

  public testConnection(): Observable<{}> {
    return this.http.get<{}>(URLs.testConnection);
  }

  public signIn(code: string): Observable<SignInResponse> {
    return this.http.get<SignInResponse>(`${URLs.signIn}?code=${code}`);
  }
}
