import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';

import { SlackTestResponse, SlackUserDataResponse } from 'app/core/models/slack';

const URLs = {
  disconnect: environment.apiPath + '/slack/userdata',
  userdata: environment.apiPath + '/slack/userdata',
  testConnection: environment.apiPath + '/slack/test',
};

@Injectable()
export class SlackService {
  constructor(
    private http: HttpClient
  ) {
  }

  public disconnect(): Observable<void> {
    return this.http.delete<void>(URLs.disconnect);
  }

  public getUserData(): Observable<SlackUserDataResponse> {
    return this.http.get<SlackUserDataResponse>(URLs.userdata);
  }

  public testConnection(): Observable<SlackTestResponse> {
    return this.http.get<SlackTestResponse>(URLs.testConnection);
  }
}
