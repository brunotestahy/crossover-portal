import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { mock } from 'ts-mockito';

import { Country } from 'app/core/models/country';
import { Timezone } from 'app/core/models/timezone';
import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { CommonService } from 'app/core/services/common/common.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import {
  LocationDataPageComponent,
} from 'app/modules/signup/pages/location-data-page/location-data-page.component';

describe('LocationDataPageComponent', () => {
  let component: LocationDataPageComponent;
  let fixture: ComponentFixture<typeof component>;
  let candidateService: CandidateService;
  let commonService: CommonService;
  let identityService: IdentityService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [
        LocationDataPageComponent,
        GooglePlaceDirective,
      ],
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ token: 'sometoken' }) }},
        { provide: CommonService, useFactory: () => mock(CommonService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: CandidateService, useFactory: () => mock(CandidateService) },
        { provide: WINDOW_TOKEN, useValue: {
          google: {},
        } },
        FormBuilder,
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(LocationDataPageComponent);
      component = fixture.componentInstance;
      commonService = TestBed.get(CommonService);
      identityService = TestBed.get(IdentityService);
      candidateService = TestBed.get(CandidateService);
      router = TestBed.get(Router);
      component.cityAutocomplete = Object.assign({
        options: { componentRestrictions: { country: null } },
        reset: () => true,
      }) as GooglePlaceDirective;
    });
  }));

  it('should create successfully', () => expect(component).toBeTruthy());

  it('should load initialization data successfully', () => {
    const timeZone = Object.assign({ id: 1, name: 'America/Sao_Paulo', offset: 0, standardOffset: 0, hourlyOffset: '-03:00' }) as Timezone;
    const country = Object.assign({ id: 1, name: 'Brazil', timezones: [timeZone] }) as Country;
    const location = { country, timeZone  };

    spyOn(identityService, 'getCurrentUserAs').and.returnValue(of({ location }));
    spyOn(commonService, 'getCountries').and.returnValue(of([ country ]));
    spyOn(commonService, 'getTimezones').and.returnValue(of([ timeZone ]));

    fixture.detectChanges();

    expect(component.countries$.getValue()).toContain(country);
    expect(component.timezones$.getValue()).toContain(timeZone);
  });

  it('should leave candidate info empty when no candidate is found during data initialization', () => {
    const country = Object.assign({ id: 1, name: 'Brazil' }) as Country;
    const timeZone = Object.assign({ id: 1, name: 'America/Sao_Paulo' }) as Timezone;

    spyOn(identityService, 'getCurrentUserAs').and.returnValue(of(null));
    spyOn(commonService, 'getCountries').and.returnValue(of([ country ]));
    spyOn(commonService, 'getTimezones').and.returnValue(of([ timeZone ]));

    fixture.detectChanges();

    expect(component.countries$.getValue()).toContain(country);
    expect(component.timezones$.getValue()).toContain(timeZone);
    expect(component.candidate).toBeUndefined();
  });

  it('should leave candidate location empty when the current user info does not contain location data', () => {
    const country = { id: 1, name: 'Brazil' };
    const timeZone = { id: 1, name: 'America/Sao_Paulo' };

    spyOn(identityService, 'getCurrentUserAs').and.returnValue(of({}));
    spyOn(commonService, 'getCountries').and.returnValue(of([ country ]));
    spyOn(commonService, 'getTimezones').and.returnValue(of([ timeZone ]));

    fixture.detectChanges();

    expect(component.form.controls['country'].value).toBe(null);
    expect(component.form.controls['timeZone'].value).toBe(null);
  });

  it('should leave candidate location empty when the user\'s current country is not part of the available country list', () => {
    const country = { id: 1, name: 'Brazil' };
    const missingCountry = Object.assign({ id: 2, name: 'Missing Country' }) as Country;
    const timeZone = { id: 1, name: 'America/Sao_Paulo' };

    spyOn(identityService, 'getCurrentUserAs').and.returnValue(of({
      location: {
        country: missingCountry,
        timeZone,
      },
    }));
    spyOn(commonService, 'getCountries').and.returnValue(of([ country ]));
    spyOn(commonService, 'getTimezones').and.returnValue(of([ timeZone ]));

    fixture.detectChanges();

    expect(component.countries$.getValue()).not.toContain(missingCountry);
  });

  it('should set an error message when an error occurs during data initialization', () => {
    const country = { id: 1, name: 'Brazil' };
    const timeZone = { id: 1, name: 'America/Sao_Paulo' };

    spyOn(identityService, 'getCurrentUserAs').and.returnValue(ErrorObservable.create({}));
    spyOn(commonService, 'getCountries').and.returnValue(of([ country ]));
    spyOn(commonService, 'getTimezones').and.returnValue(of([ timeZone ]));

    fixture.detectChanges();

    expect(component.error).toBe('An error occurred while retrieving current user data.');
  });

  it('should change the target country and set the timezone automatically when a single timezone is available', () => {
    const timeZone = { id: 1, name: 'America/Sao_Paulo', offset: 0, standardOffset: 0, hourlyOffset: '-03:00' };
    const country = { id: 1, name: 'Brazil', code: 'BR', allowed: true, timezones: [timeZone] };
    const location = { country, timeZone  };

    spyOn(identityService, 'getCurrentUserAs').and.returnValue(of({ location }));
    spyOn(commonService, 'getCountries').and.returnValue(of([ country ]));
    spyOn(commonService, 'getTimezones').and.returnValue(of([ timeZone ]));

    fixture.detectChanges();
    component.countryChange(country);

    expect(component.form.controls['timeZone'].value).toBe(timeZone);
  });

  it('should clear the timezone info when the country was changed and no timezone entry matches the current value', () => {
    const timeZones = [
      { id: 1, name: 'America/Sao_Paulo', offset: 0, standardOffset: 0, hourlyOffset: '-03:00' },
      { id: 2, name: 'America/New_York', offset: 0, standardOffset: 0, hourlyOffset: '-05:00' },
    ];
    const unknownTimezone = { id: 3, name: 'America/Chicago', offset: 0, standardOffset: 0, hourlyOffset: '-06:00' };
    const country = { id: 1, name: 'Brazil', code: 'BR', allowed: true, timezones: timeZones };
    const location = { country, timeZone: unknownTimezone };

    spyOn(identityService, 'getCurrentUserAs').and.returnValue(of({ location }));
    spyOn(commonService, 'getCountries').and.returnValue(of([ country ]));
    spyOn(commonService, 'getTimezones').and.returnValue(of(timeZones));

    fixture.detectChanges();
    component.countryChange(country);

    expect(component.form.controls['timeZone'].value).toBeUndefined();
  });

  it('should change the timezone info when timezone is changed', () => {
    const country = { id: 1, name: 'Brazil', code: 'BR', allowed: true, timezones: [] };
    const timeZones = [
      { id: 1, name: 'America/Sao_Paulo', offset: 0, standardOffset: 0, hourlyOffset: '-03:00', countries: [] },
      { id: 2, name: 'America/New_York', offset: 0, standardOffset: 0, hourlyOffset: '-05:00' },
    ];
    const location = { country, timeZone: null };

    spyOn(identityService, 'getCurrentUserAs').and.returnValue(of({ location }));
    spyOn(commonService, 'getCountries').and.returnValue(of([ country ]));
    spyOn(commonService, 'getTimezones').and.returnValue(of(timeZones));

    fixture.detectChanges();
    component.timezoneChange(timeZones[0]);

    expect(component.form.controls['timeZone'].value).toEqual(timeZones[0]);
  });

  it('should change the timezone and country info when timezone is changed to an entry with a single country associated', () => {
    const country = { id: 1, name: 'Brazil', code: 'BR', allowed: true, timezones: [] };
    const timeZones = [
      { id: 1, name: 'America/Sao_Paulo', offset: 0, standardOffset: 0, hourlyOffset: '-03:00', countries: [country] },
      { id: 2, name: 'America/New_York', offset: 0, standardOffset: 0, hourlyOffset: '-05:00' },
    ];
    const location = { country, timeZone: null };

    spyOn(identityService, 'getCurrentUserAs').and.returnValue(of({ location }));
    spyOn(commonService, 'getCountries').and.returnValue(of([ country ]));
    spyOn(commonService, 'getTimezones').and.returnValue(of(timeZones));

    fixture.detectChanges();
    component.timezoneChange(timeZones[0]);

    expect(component.form.controls['country'].value).toEqual(country);
  });

  it('should change the city info successfully', () => {
    const cityInfo = {
      address_components: [
        {long_name: 'New York', types: ['locality']},
        {long_name: 'New York', types: ['administrative_area_level_1']},
        {long_name: 'United Stated of America', short_name: 'USA', types: ['country']},
      ],
    } as typeof GooglePlaceDirective.prototype.place;
    const country = { id: 1, name: 'Brazil', code: 'BR', allowed: true, timezones: [] };
    const timeZones = [
      { id: 1, name: 'America/Sao_Paulo', offset: 0, standardOffset: 0, hourlyOffset: '-03:00', countries: [country] },
      { id: 2, name: 'America/New_York', offset: 0, standardOffset: 0, hourlyOffset: '-05:00' },
    ];
    const location = {};

    spyOn(identityService, 'getCurrentUserAs').and.returnValue(of({ location }));
    spyOn(commonService, 'getCountries').and.returnValue(of([ country ]));
    spyOn(commonService, 'getTimezones').and.returnValue(of(timeZones));

    fixture.detectChanges();
    component.cityChange(cityInfo);

    expect(component.form.controls['city'].value).toBe(cityInfo.address_components[0].long_name);
    expect(component.form.controls['country'].value).toBeUndefined();
  });

  it('should change the city and country info when associated country exists on list', () => {
    const cityInfo = {
      address_components: [
        {long_name: 'São Paulo', types: ['administrative_area_level_3']},
        {long_name: 'São Paulo', types: ['administrative_area_level_1']},
        {long_name: 'Brazil', short_name: 'BR', types: ['country']},
      ],
    } as typeof GooglePlaceDirective.prototype.place;
    const country = { id: 1, name: 'Brazil', code: 'BR', allowed: true, timezones: [] };
    const timeZones = [
      { id: 1, name: 'America/Sao_Paulo', offset: 0, standardOffset: 0, hourlyOffset: '-03:00', countries: [country] },
      { id: 2, name: 'America/New_York', offset: 0, standardOffset: 0, hourlyOffset: '-05:00' },
    ];
    const location = { country, timeZone: null };

    spyOn(identityService, 'getCurrentUserAs').and.returnValue(of({ location }));
    spyOn(commonService, 'getCountries').and.returnValue(of([ country ]));
    spyOn(commonService, 'getTimezones').and.returnValue(of(timeZones));

    fixture.detectChanges();
    component.cityChange(cityInfo);

    expect(component.form.controls['city'].value).toEqual(cityInfo.address_components[0].long_name);
    expect(component.form.controls['country'].value).toEqual(country);
  });

  it('should clear city and state data successfully', () => {
    const country = { id: 1, name: 'Brazil', code: 'BR', allowed: true, timezones: [] };
    const timeZones = [
      { id: 1, name: 'America/Sao_Paulo', offset: 0, standardOffset: 0, hourlyOffset: '-03:00', countries: [country] },
      { id: 2, name: 'America/New_York', offset: 0, standardOffset: 0, hourlyOffset: '-05:00' },
    ];
    const location = { country, timeZone: null };

    spyOn(identityService, 'getCurrentUserAs').and.returnValue(of({ location }));
    spyOn(commonService, 'getCountries').and.returnValue(of([ country ]));
    spyOn(commonService, 'getTimezones').and.returnValue(of(timeZones));

    fixture.detectChanges();
    component.form.controls['city'].setValue('Sample City');
    component.form.controls['state'].setValue('Sample State');
    component.cityStateClear();

    expect(component.form.controls['city'].value).toBe(null);
    expect(component.form.controls['state'].value).toBe(null);
  });

  it('should store location data successfully', () => {
    const location = { lat: () => 42, lng: () => 42 };
    const geometry = { location };
    component.selectedCity = { geometry } as typeof GooglePlaceDirective.prototype.place;
    component.form.patchValue({ country: true, timeZone: true, city: 'Sample' });

    spyOn(candidateService, 'updateCandidate').and.returnValue(of({}));
    spyOn(router, 'navigate');

    component.save();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should display an error message when an error occurs during candidate\'s data storage', () => {
    const location = { lat: () => 42, lng: () => 42 };
    const geometry = { location };
    component.selectedCity = { geometry } as typeof GooglePlaceDirective.prototype.place;
    component.form.patchValue({ country: true, timeZone: true, city: 'Sample' });

    spyOn(candidateService, 'updateCandidate').and.returnValue(ErrorObservable.create({}));
    component.save();

    expect(component.error).toBe('An error occurred while storing candidate data.');
  });

  it('should skip data storage when the form is not valid', () => {
    const location = { lat: () => 42, lng: () => 42 };
    const geometry = { location };
    component.selectedCity = { geometry } as typeof GooglePlaceDirective.prototype.place;
    component.form.patchValue({ country: true, city: 'Sample' });

    component.save();

    expect(component.form.valid).toBe(false);
  });
});
