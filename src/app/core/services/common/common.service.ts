import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { map, retry, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { sprintf } from 'sprintf-js';


import { BlobBuilder } from 'app/core/models/blob-builder';
import { Skill } from 'app/core/models/candidate';
import { Country } from 'app/core/models/country';
import { Timezone } from 'app/core/models/timezone';

const URLs = {
  countries: environment.apiPath + '/common/countries',
  timezones: environment.apiPath + '/common/timeZones',
  skills: environment.apiPath + '/common/skills?name=%(skill)s',
};

@Injectable()
export class CommonService {
  private countries$: Observable<Country[]> | null = null;
  private timezones$: Observable<Timezone[]> | null = null;
  private readonly MIME_TYPE = 'text/csv';
  public windowInstance: Window;

  constructor(private http: HttpClient) {
    this.windowInstance = window;
  }

  public getCountries(): Observable<Country[]> {
     // simple caching
     if (!this.countries$) {
      this.countries$ = this.http.get<Country[]>(URLs.countries)
      .pipe(
        retry(2),
        shareReplay(1),
        map(entries => entries.map(Country.from))
      );
    }
    return this.countries$;
  }

  public getTimezones(): Observable<Timezone[]> {
     // simple caching
     if (!this.timezones$) {
      this.timezones$ = this.http.get<Timezone[]>(URLs.timezones)
      .pipe(
        retry(2),
        shareReplay(1),
        map(entries => entries.map(Timezone.from))
      );
    }
    return this.timezones$;
  }

  public getSkills(skill: string): Observable<Skill[]> {
    return this.http.get<Skill[]>(sprintf(URLs.skills, { skill }))
      .pipe(
        retry(2),
        map(entries => entries.map(Skill.from))
      );
  }

  public generateCsv(headers: string[], data: string[][]): Blob {
    const blob = new BlobBuilder();
    blob.append(this.convert(headers));
    data.forEach(row => blob.append(this.convert(row)));
    return blob.get(this.MIME_TYPE);
  }

  public download(blob: Blob, fileName: string): boolean {
    if (this.windowInstance.navigator.msSaveOrOpenBlob !== undefined) {
      this.windowInstance.navigator.msSaveBlob(blob, fileName);
      return true;
    }

    if (this.windowInstance.document.createElement('a').download !== undefined) {
      const link = this.windowInstance.document.createElement('a');
      link.href = this.windowInstance.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    }

    return false;
  }

  private convert(row: string[]): string {
    const escapedRow = row.reduce((carry, item) => carry.concat(`${item}`), [] as string[]);
    return escapedRow.join(',') + '\n';
  }
}
