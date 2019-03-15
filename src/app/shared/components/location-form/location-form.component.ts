import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Candidate, Industry } from 'app/core/models/candidate';
import { Country } from 'app/core/models/country';
import { Timezone } from 'app/core/models/timezone';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss'],
})
export class LocationFormComponent implements OnInit {

  public form: FormGroup;

  @Output()
  public save = new EventEmitter<Partial<Candidate>>();

  @Output()
  public cancel = new EventEmitter<void>();

  @Output()
  public remove = new EventEmitter<void>();

  @Input()
  public initialValue = {} as Partial<Candidate>;

  @Input()
  public countries: Country[] = [];

  @Input()
  public industries: Industry[] = [];

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  public ngOnInit(): void {
    const industryId = this.initialValue.industry ?
      this.initialValue.industry.id :
      0;
    const location = this.initialValue.location || {};
    const countryId =  location.country ?
      location.country.id as number :
      0;
    const timezoneId = location.timeZone ?
      location.timeZone.id :
      0;

    const industry = Industry.findById(this.industries, industryId);
    const country = Country.findById(this.countries, countryId);
    const timezone = Timezone.findById(
      country && country.timezones || [],
      timezoneId
    );

    this.form = this.formBuilder.group({
      location: this.formBuilder.group({
        country: [country, Validators.required],
        city: [location.city, Validators.required],
        timeZone: [timezone, Validators.required],
      }),
      industry: [industry],
    });
  }

  public onCountryChange(): void {
    const city = this.form.get('location.city') as AbstractControl;
    const timeZone = this.form.get('location.timeZone') as AbstractControl;
    city.setValue(null);
    timeZone.setValue(null);
  }

  public onSubmit(): void {
    /* istanbul ignore else */
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}
