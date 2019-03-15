import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { sprintf } from 'sprintf-js';

import { Test } from 'app/core/models/hire';
import { environment } from 'environments/environment';

const URLs = {
  get: `${environment.apiPath}/applications/tests/%(id)s`,
};

@Injectable()
export class TestService {

  constructor(
    private http: HttpClient
  ) {
  }

  public get(id: number): Observable<Test> {
    return this.http.get<Test>(sprintf(URLs.get, { id }));
  }
}
