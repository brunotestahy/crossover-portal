import { AfterViewInit, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { AddressComponent } from 'ngx-google-places-autocomplete/objects/addressComponent';
import { ComponentRestrictions } from 'ngx-google-places-autocomplete/objects/options/componentRestrictions';
import { combineLatest, finalize, map, take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as AvatarTypes from 'app/core/constants/avatar-types';
import { Candidate } from 'app/core/models/candidate';
import { Country } from 'app/core/models/country';
import { Timezone } from 'app/core/models/timezone';
import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { CommonService } from 'app/core/services/common/common.service';
import { IdentityService } from 'app/core/services/identity/identity.service';

@Component({
  selector: 'app-location-data-page',
  templateUrl: './location-data-page.component.html',
  styleUrls: ['./location-data-page.component.scss'],
})
export class LocationDataPageComponent implements AfterViewInit, OnInit {
  public form: FormGroup;

  @ViewChild('cityAutocomplete')
  public cityAutocomplete: GooglePlaceDirective;
  public selectedCity: Address;

  public candidate: Candidate;
  public countries$ = new BehaviorSubject<Country[]>([]);
  public timezones$ = new BehaviorSubject<Timezone[]>([]);

  public saving: boolean = false;
  public error: string | null = null;

  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  constructor(
    private candidateService: CandidateService,
    private commonService: CommonService,
    private router: Router,
    private formBuilder: FormBuilder,
    private identityService: IdentityService
  ) {
    this.form = this.formBuilder.group({
      country: [null, Validators.required],
      timeZone: [null, Validators.required],
      city: ['', Validators.required],
      address: [''],
      state: [''],
      zip: [''],
    });
  }

  public ngOnInit(): void {
    this.saving = true;

    this.identityService
      .getCurrentUserAs(AvatarTypes.Candidate)
      .pipe(
        map(currentUser => currentUser as Candidate),
        finalize(() => this.saving = false),
        combineLatest(
          this.commonService.getCountries(),
          this.commonService.getTimezones()
        )
      )
      .subscribe(
        ([candidate, countries, timezones]) => {
          this.countries$.next(countries);
          this.timezones$.next(timezones);
          if (!candidate) {
            return;
          }
          this.candidate = candidate;
          if (candidate.location) {
            const country = this.countries$.getValue()
              .find(entry => entry.id === (candidate.location.country || {} as Country).id);
            this.form.patchValue({
              ...candidate.location,
              country,
            });
            if (country) {
              this.setCityAutocompleteCountry(country.code);
              this.timezones$.next(country.timezones);
              this.setTimezoneByCountry(country);
              const timeZone = this.timezones$.getValue()
                .find(entry => entry.id === (candidate.location.timeZone as Timezone).id);
              this.form.patchValue({ timeZone });
            }
          }
        },
        () => this.error = 'An error occurred while retrieving current user data.'
      );
  }

  public ngAfterViewInit(): void {
      this.cityAutocomplete.options.types = ['(cities)'];
      this.cityAutocomplete.reset();
  }

  public countryChange(country: Country): void {
    this.setCityAutocompleteCountry(country.code);
    this.timezones$.next(country.timezones);
    this.setTimezoneByCountry(country);
    const timezone = this.form.controls.timeZone.value || {} as Timezone;
    const timezoneFromList = country.timezones.find(entry => entry.id === timezone.id);
    this.form.controls['timeZone'].setValue(timezoneFromList);
  }

  public timezoneChange(timeZone: Timezone): void {
    const countries = timeZone.countries as Country[];
    if (countries && countries.length === 1) {
      const country = this.countries$.getValue()
        .find(entry => entry.id === countries[0].id) as Country;
      this.setCityAutocompleteCountry(country.code);
      this.form.patchValue({ country });
    }
    this.form.patchValue({ timeZone });
  }

  public cityChange(address: Address): void {
    this.selectedCity = address;
    const components = address.address_components;
    const country = this.countries$.getValue()
      .find(entry => entry.code.toUpperCase() === this.filterAddressFields(components, ['country']).short_name);
    const state = this.filterAddressFields(components, [
      'administrative_area_level_1',
      'administrative_area_level_2',
    ]).long_name;
    const city = this.filterAddressFields(components, [
      'locality',
      'administrative_area_level_3',
    ]).long_name;
    this.form.patchValue({ city, state });
    if (country) {
      this.form.patchValue({ country });
      this.setTimezoneByCountry(country);
    }
  }

  public cityStateClear(): void {
    this.form.patchValue({ city: null, state: null });
  }

  public save(): void {
    if (this.form.valid) {
      this.saving = true;
      const location = {
        ...this.form.value,
        ...this.selectedCity && {
          latitude: this.selectedCity.geometry.location.lat(),
          longitude: this.selectedCity.geometry.location.lng(),
        },
      };
      const candidate = { ...this.candidate, location };
      this.candidateService
        .updateCandidate(candidate)
        .pipe(
          take(1),
          finalize(() => this.saving = false)
        )
        .subscribe(
          () => this.router.navigate(['/']),
          () => this.error = 'An error occurred while storing candidate data.'
        );
    }
  }

  private setCityAutocompleteCountry(country: string): void {
    this.cityAutocomplete.options.types = ['(cities)'];
    this.cityAutocomplete.options.componentRestrictions = new ComponentRestrictions({ country });
    this.cityAutocomplete.reset();
  }

  private setTimezoneByCountry(country: Country): void {
    if (country.timezones.length === 1) {
      const timeZone = country.timezones[0];
      this.form.patchValue({ timeZone });
    }
  }

  private filterAddressFields(addresses: AddressComponent[], fields: string[]): AddressComponent {
    let data: AddressComponent | null = null;
    for (let counter = 0, size = fields.length; counter < size; counter++) {
      const field = fields[counter];
      const address = addresses.find(entry => entry.types.indexOf(field) !== -1) as AddressComponent;
      if (address) {
        data = address;
        break;
      }
    }
    return data as AddressComponent;
  }
}
