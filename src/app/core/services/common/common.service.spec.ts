import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { Observable } from 'rxjs/Observable';

import { environment } from 'app/../environments/environment';
import { Skill } from 'app/core/models/candidate';
import { Country } from 'app/core/models/country';
import { Timezone } from 'app/core/models/timezone';
import { BLOB_DATA_MOCK, BLOB_HEADERS_MOCK } from 'app/core/services/mocks/blob.mock';

import { CommonService } from './common.service';

describe('CommonService', () => {
  let service: CommonService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ CommonService, IdentityService ],
    });
  }));

  beforeEach(() => {
    service = TestBed.get(CommonService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get countries', () => {
    const RESPONSE = [{
      allowed: true,
      code: 'af',
      id: 1,
      name: 'Afghanistan',
    }] as Country[];
    service.getCountries().subscribe(res => {
      const country = Object.assign(RESPONSE[0]) as Partial<Country>;
      expect(res).toContain(jasmine.objectContaining(country));
      expect(service.getCountries()).toEqual(jasmine.any(Observable));
    });

    const request = httpMock.expectOne(
      environment.apiPath + '/common/countries'
    );
    expect(request.request.method).toBe('GET');
    request.flush(RESPONSE);
    httpMock.verify();
  });

  it('should get timezones successfully', () => {
    const RESPONSE = [{
      id: 1,
      name: 'UTC',
      offset: 0,
      standardOffset: 0,
      hourlyOffset: '0',
    }] as Timezone[];
    service.getTimezones()
    .pipe()
    .subscribe(res => {
      const timezone = Object.assign(RESPONSE[0]) as Partial<Timezone>;
      expect(res).toContain(jasmine.objectContaining(timezone));
      expect(service.getTimezones()).toEqual(jasmine.any(Observable));
    });

    const request = httpMock.expectOne(
      environment.apiPath + '/common/timeZones'
    );
    expect(request.request.method).toBe('GET');
    request.flush(RESPONSE);
    httpMock.verify();
  });

  it('should get skills successfully', () => {
    const RESPONSE = [{
      id: 1,
      name: 'Angular',
    }] as Skill[];
    service.getSkills('ANY').subscribe(res => {
      expect(res).toContain(jasmine.objectContaining(RESPONSE[0]));
      expect(service.getSkills('ANY')).toEqual(jasmine.any(Observable));
    });

    const request = httpMock.expectOne(
      environment.apiPath + '/common/skills?name=ANY'
    );
    expect(request.request.method).toBe('GET');
    request.flush(RESPONSE);
    httpMock.verify();
  });

  it('should download blob when browser is not IE', () => {
    const blob = service.generateCsv(BLOB_HEADERS_MOCK, BLOB_DATA_MOCK);
    spyOn(service.windowInstance.URL, 'createObjectURL').and.callThrough();

    service.download(blob, 'file');
    expect(service.windowInstance.URL.createObjectURL).toHaveBeenCalled();
  });

  it('should download blob when browser is IE', () => {
    service.windowInstance.navigator.msSaveOrOpenBlob = () => true;
    service.windowInstance.navigator.msSaveBlob = () => true;
    const blob = service.generateCsv(BLOB_HEADERS_MOCK, BLOB_DATA_MOCK);

    spyOn(service.windowInstance.navigator, 'msSaveBlob').and.callThrough();
    service.download(blob, 'file');
    expect(service.windowInstance.navigator.msSaveBlob).toHaveBeenCalled();
  });
});
