import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, retry, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { Industry, Language } from 'app/core/models/candidate';

import { environment } from 'environments/environment';

const URLs = {
  industries: environment.apiPath + '/public/industries',
  languages: environment.apiPath + '/public/languages',
};

@Injectable()
export class PublicService {
  private industries$: Observable<Industry[]>;
  private languages$: Observable<Language[]>;

  constructor(
    private http: HttpClient
  ) {
  }

  public getIndustries(): Observable<Industry[]> {
    if (!this.industries$) {
      this.industries$ = this.http.get<Industry[]>(URLs.industries)
        .pipe(
          retry(2),
          shareReplay(1),
          map(entries => entries.map(Industry.from) as Industry[])
        );
    }
    return this.industries$;
  }

  public getLanguages(): Observable<Language[]> {
    if (!this.languages$) {
      this.languages$ = this.http.get<Language[]>(URLs.languages)
        .pipe(
          retry(2),
          shareReplay(1),
          map(entries => entries.map(Language.from) as Language[])
        );
    }
    return this.languages$;
  }
}
