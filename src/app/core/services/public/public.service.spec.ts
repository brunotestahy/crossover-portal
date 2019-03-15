import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { environment } from 'environments/environment';

import { Industry, Language } from 'app/core/models/candidate';

import { PublicService } from './public.service';

describe('PublicService', () => {
  let service: PublicService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ PublicService ],
    });
  }));

  beforeEach(() => {
    service = TestBed.get(PublicService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created successfully', () =>
    expect(service).toBeTruthy()
  );

  it('should retrieve industries successfully', () => {
    const RESPONSE = [{
      id: 1,
      name: 'Sample Industry',
    }] as Industry[];

    service.getIndustries()
      .subscribe(res =>
        expect(res).toContain(jasmine.objectContaining(RESPONSE[0]))
      );

    const request = httpMock.expectOne(
      environment.apiPath + '/public/industries'
    );
    expect(request.request.method).toBe('GET');
    request.flush(RESPONSE);
    httpMock.verify();

    service.getIndustries()
      .subscribe(res =>
        expect(res).toContain(jasmine.objectContaining(RESPONSE[0]))
      );
  });

  it('should retrieve languages successfully', () => {
    const RESPONSE = [{
      id: 1,
      name: 'Portuguese',
    }] as Language[];

    service.getLanguages()
      .subscribe(res =>
        expect(res).toContain(jasmine.objectContaining(RESPONSE[0]))
      );

    const request = httpMock.expectOne(
      environment.apiPath + '/public/languages'
    );
    expect(request.request.method).toBe('GET');
    request.flush(RESPONSE);
    httpMock.verify();

    service.getLanguages()
      .subscribe(res =>
        expect(res).toContain(jasmine.objectContaining(RESPONSE[0]))
      );
  });
});
