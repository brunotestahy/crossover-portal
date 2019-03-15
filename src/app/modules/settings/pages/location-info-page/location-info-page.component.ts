import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DfToasterService, DfValidationMessagesMap } from '@devfactory/ngx-df';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ComponentRestrictions } from 'ngx-google-places-autocomplete/objects/options/componentRestrictions';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { Country } from 'app/core/models/country';
import { CurrentUserDetail } from 'app/core/models/identity';
import { UserLocationData } from 'app/core/models/identity';
import { CommonService } from 'app/core/services/common/common.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { isApiError } from 'app/core/type-guards/is-api-error';

@Component({
  selector: 'app-location-info-page',
  templateUrl: './location-info-page.component.html',
  styleUrls: ['./location-info-page.component.scss'],
})
export class LocationInfoPageComponent implements AfterViewInit {
  @ViewChild('placesRef')
  public placesRef: GooglePlaceDirective;

  public saving = false;
  public error: null  | string = null;
  public countries: Country[] = [];
  public currentUser: CurrentUserDetail | null;
  public form: FormGroup;
  public validGoogleCity = true;
  public selectedCity: string | undefined = '';

  public nameMessages: DfValidationMessagesMap = {
    required: () => 'Please enter your nearest city',
  };

  constructor(
    private formBuilder: FormBuilder,
    private identityService: IdentityService,
    private toasterService: DfToasterService,
    private commonService: CommonService,
    public changeDetectorRef: ChangeDetectorRef
  ) {
    this.buildForm();

    combineLatest(
      this.commonService.getCountries(),
      this.identityService.getCurrentUser()
    ).subscribe(([countries, currentUser]) => {
      this.countries = countries;
      this.currentUser = currentUser;
      this.patchForm();
    });
  }

  public ngAfterViewInit(): void {
    this.placesRef.options.types = ['(cities)'];
    this.placesRef.reset();

    this.onCountryChange();
    this.onCityChange();
    this.changeDetectorRef.detectChanges();
  }

  public onAddressChange(event: Address): void {
    this.validGoogleCity = true;
    const parsedAddress = this.getCity(event.formatted_address);
    this.selectedCity = parsedAddress.city;
    this.form.patchValue({
      city: parsedAddress.city,
      state: parsedAddress.state || '',
      latitude: event.geometry.location.lat(),
      longitude: event.geometry.location.lng(),
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      if (!this.validGoogleCity) {
        this.toasterService.popError(
          'Invalid City! Please select city from dropdown.'
        );
        return;
      }
      this.saving = true;
      this.error = null;
      this.identityService
        .changeCurrentUserLocationInfo(this.form.value)
        .subscribe(
          () => {
            this.saving = false;
            this.toasterService.popSuccess(
              'Location info changed successfully!'
            );
          },
          error => {
            this.saving = false;
            if (isApiError(error)) {
              this.error = error.error.text;
            } else {
              this.error = 'Error changing location info.';
            }
          }
        );
    }
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      country: ['', Validators.required],
      timeZone: ['', Validators.required],
      address: [null],
      city: [null, Validators.required],
      state: [null],
      zip: [null],
      phone: [
        null,
        Validators.compose([
          Validators.minLength(9),
          Validators.maxLength(18),
          Validators.pattern(/^(\d+-?)+\d+$/),
        ]),
      ],
      latitude: [null],
      longitude: [null],
    });
  }

  private onCountryChange(): void {
    this.form.controls['country'].valueChanges.subscribe((value: Country) => {
      value.timezones.sort((previous, current) => {
        return (
          previous.offset - current.offset ||
          (previous.name || '').localeCompare(current.name)
        );
      });

      this.form.patchValue({
        timeZone: value.timezones[0],
        city: null,
        state: null,
      });
      if (value.code) {
        this.placesRef.options.types = ['(cities)'];
        this.placesRef.options.componentRestrictions = new ComponentRestrictions(
          {
            country: value.code,
          }
        );
        this.placesRef.reset();
      }
    });
  }

  private onCityChange(): void {
    this.form.controls['city'].valueChanges.subscribe((value: string) => {
      if (value === this.selectedCity) {
        this.validGoogleCity = true;
      } else {
        this.validGoogleCity = false;
      }
    });
  }

  private getCity(address: string): {
    city: string,
    state: string | null,
    country: string | null
  } {
    const parts = address.toString().split(',');
    const city = parts[0];
    const result = {
      city,
      state: null as string | null,
      country: null as string | null,
    };
    if (parts.length === 3) {
      result.state = parts[1].trim() || '';
      result.country = parts[2].trim() || '';
    } else {
      result.country = parts[1];
    }

    return result;
  }

  private patchForm(): void {
    if (this.currentUser) {
      const initialData: UserLocationData = {};
      const location: Partial<UserLocationData> = this.currentUser.location;
      if (location.country) {
        const countryId = location.country.id;
        initialData.country = this.countries.find(
          country => country.id === countryId
        );
      }
      if (
        location.timeZone &&
        initialData.country &&
        initialData.country.timezones
      ) {
        const timeZoneId = location.timeZone.id;
        initialData.timeZone = initialData.country.timezones.find(
          timeZone => timeZone.id === timeZoneId
        );
      }
      this.selectedCity = location.city;
      this.form.patchValue({
        country: initialData.country,
        timeZone: initialData.timeZone,
        address: location.address,
        city: location.city,
        state: location.state,
        zip: location.zip,
        phone: location.phone,
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }
  }
}
