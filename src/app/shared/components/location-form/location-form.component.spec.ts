import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DfButtonModule,
  DfCoreModule,
  DfDatepickerModule,
  DfInputModule,
  DfMouseUpService,
  DfSelectModule,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';
import { take } from 'rxjs/operators';

import { Industry } from 'app/core/models/candidate';
import { COUNTRIES_MOCK_DATA } from 'app/core/services/mocks/countries.mock';
import { INDUSTRIES_MOCK_DATA } from 'app/core/services/public/public.mock';
import { LocationFormComponent } from 'app/shared/components/location-form/location-form.component';

describe('LocationFormComponent', () => {
  let component: LocationFormComponent;
  let fixture: ComponentFixture<typeof component>;

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        LocationFormComponent,
      ],
      imports: [
        DfCoreModule.forRoot(),
        DfButtonModule,
        DfDatepickerModule,
        DfInputModule,
        DfSelectModule,
        DfValidationMessagesModule.forRoot(),
        LayoutModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        DfMouseUpService,
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(LocationFormComponent);
      component = fixture.componentInstance;
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should pickup initial properties successfully', () => {
    const city = 'São Paulo';
    component.industries = INDUSTRIES_MOCK_DATA;
    component.countries = COUNTRIES_MOCK_DATA;
    const initialValue = {
      industry: component.industries[0],
      location: {
        country: component.countries[0],
        timeZone: component.countries[0].timezones[0],
        city,
      },
    };
    component.initialValue = initialValue;

    component.ngOnInit();

    const data = component.form.value;
    expect(data).toEqual(jasmine.objectContaining(initialValue));
  });

  it('should reset city and timezone when the country is changed', () => {
    const city = '東京';
    const timeZone = {};

    fixture.detectChanges();

    component.form.patchValue({ location: { city, timeZone } });
    component.onCountryChange();

    const data = component.form.value;

    expect(data.location.city).toBe(null);
    expect(data.location.timeZone).toBe(null);
  });

  it('should submit data successfully', async(() => {
    const city = 'São Paulo';
    component.industries = INDUSTRIES_MOCK_DATA;
    component.countries = COUNTRIES_MOCK_DATA;
    const initialValue = Object.assign({
      industry: component.industries[0],
      location: {
        country: component.countries[0],
        timeZone: component.countries[0].timezones[0],
        city,
      },
    });
    component.initialValue = initialValue;

    component.ngOnInit();

    component.save
      .pipe(take(1))
      .subscribe(data =>
          expect(data).toEqual(jasmine.objectContaining(initialValue))
      );
    component.onSubmit();
  }));

  it('should manage industry data corner cases successfully', () => {
    const industry = Industry.from(undefined);
    expect(industry).toBeUndefined();

    const found = Industry.findById(undefined, 1);
    expect(found).toBeUndefined();
  });
});
