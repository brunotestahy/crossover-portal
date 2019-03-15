import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DfToasterService } from '@devfactory/ngx-df';
import { GooglePlaceDirective, GooglePlaceModule } from 'ngx-google-places-autocomplete';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { CommonService } from 'app/core/services/common/common.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { LocationInfoPageComponent } from 'app/modules/settings/pages/location-info-page//location-info-page.component';

describe('LocationInfoPageComponent', () => {
  let component: LocationInfoPageComponent;
  let fixture: ComponentFixture<LocationInfoPageComponent>;
  let identityService: IdentityService;
  let toasterService: DfToasterService;

  class MockedIdentityService {

    public getCurrentUser(): Observable<{}> {
      return of({
        location: {
          country: {
            id: 49,
            name: 'Brazil',
          },
          timeZone: {
            id: 82,
          },
          state: 'State of Rio de Janeiro',
          city: 'Rio de Janeiro',
          zip: '11111',
          phone: '123456789',
        },
      });
    }

    public changeCurrentUserLocationInfo(): Observable<string> {
      return of('');
    }
  }

  class MockedCommonService {

  public getCountries(): Observable<{}> {
      return of([
        {
          id: 48,
          name: 'Colombia',
        },
        {
          id: 49,
          name: 'Brazil',
          timezones: [
            {
              id: 82,
              name: 'America/Araguaina',
            },
            {
              id: 88,
              name: 'America/Fortaleza',
            },
          ],
        },
        {
          id: 50,
          name: 'Argentina',
        },
      ]);
    }
  }

  class MockedToasterService {
    public popSuccess(): void {
    }

    public popError(): void {
    }
  }


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        GooglePlaceModule,
      ],
      declarations: [
        LocationInfoPageComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: IdentityService, useClass: MockedIdentityService },
        { provide: CommonService, useClass: MockedCommonService },
        { provide: DfToasterService, useClass: MockedToasterService},
        FormBuilder,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationInfoPageComponent);
    component = fixture.componentInstance;
    identityService = TestBed.get(IdentityService);
    toasterService = TestBed.get(DfToasterService);
  });

  it('should load initial data', () => {
    expect(component.countries.length).toBe(3);
    expect(component.currentUser).toBeDefined();
  });

  it('should set places configuration by default', () => {
    component.placesRef = {
      options: {},
      reset: () => {},
    } as GooglePlaceDirective;
    spyOn(component.placesRef, 'reset').and.callThrough();
    spyOn(component.changeDetectorRef, 'detectChanges');
    component.ngAfterViewInit();
    expect(component.placesRef.reset).toHaveBeenCalled();
  });

  it('should set address with state available', () => {
    const event = Object.assign({
      formatted_address: 'Rio de Janeiro, State of Rio de Janeiro, Brazil',
      geometry: {
        location: {
          lat: () => {
            return 1;
          },
          lng: () => {
            return 1;
          },
        },
      },
    });
    spyOn(component.form, 'patchValue').and.callThrough();
    component.onAddressChange(event);

    expect(component.form.patchValue).toHaveBeenCalled();
  });

  it('should set address with state not available', () => {
    const event = Object.assign({
      formatted_address: 'Rio de Janeiro,,Brazil',
      geometry: {
        location: {
          lat: () => {
            return 1;
          },
          lng: () => {
            return 1;
          },
        },
      },
    });
    spyOn(component.form, 'patchValue').and.callThrough();
    component.onAddressChange(event);

    expect(component.form.patchValue).toHaveBeenCalled();
  });

  it('should set address with state and country not available', () => {
    const event = Object.assign({
      formatted_address: 'Rio de Janeiro,,',
      geometry: {
        location: {
          lat: () => {
            return 1;
          },
          lng: () => {
            return 1;
          },
        },
      },
    });
    spyOn(component.form, 'patchValue').and.callThrough();
    component.onAddressChange(event);

    expect(component.form.patchValue).toHaveBeenCalled();
  });

  it('should set address with one argument', () => {
    const event = Object.assign({
      formatted_address: 'Rio de Janeiro',
      geometry: {
        location: {
          lat: () => {
            return 1;
          },
          lng: () => {
            return 1;
          },
        },
      },
    });
    spyOn(component.form, 'patchValue').and.callThrough();
    component.onAddressChange(event);

    expect(component.form.patchValue).toHaveBeenCalled();
  });

  it('should submit form successfully', () => {
    component.saving = false;
    spyOn(identityService, 'changeCurrentUserLocationInfo').and.callThrough();
    component.saving = false;
    component.onSubmit();
    expect(identityService.changeCurrentUserLocationInfo).toHaveBeenCalled();
  });

  it('should submit form and throw api error', () => {
    component.saving = false;
    spyOn(identityService, 'changeCurrentUserLocationInfo').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    component.saving = false;
    component.onSubmit();
    expect(component.error).toEqual('error');
  });

  it('should submit form and throw other error', () => {
    component.saving = false;
    spyOn(identityService, 'changeCurrentUserLocationInfo').and.returnValue(Observable.throw({}));
    component.saving = false;
    component.onSubmit();
    expect(component.error).toEqual('Error changing location info.');
  });

  it('should submit form and throw location error', () => {
    component.validGoogleCity = false;
    component.saving = false;
    spyOn(toasterService, 'popError').and.callThrough();
    component.onSubmit();
    expect(toasterService.popError).toHaveBeenCalledWith('Invalid City! Please select city from dropdown.');
  });

  it('should reset on change country', () => {
    component.placesRef = {
      options: {},
      reset: () => {},
    } as GooglePlaceDirective;
    spyOn(component.placesRef, 'reset').and.callThrough();
    spyOn(component.changeDetectorRef, 'detectChanges');
    const country = {
      id: 49,
      name: 'Brazil',
      code: 'BR',
      timezones: [
        {
          id: 82,
          name: 'America/Araguaina',
        },
        {
          id: 88,
          name: 'America/Fortaleza',
        },
      ],
    };
    component.ngAfterViewInit();
    component.form.controls['country'].setValue(country);
    expect(component.placesRef.reset).toHaveBeenCalled();
  });

  it('should set validcity to true on change city', () => {
    component.placesRef = {
      options: {},
      reset: () => {},
    } as GooglePlaceDirective;
    spyOn(component.placesRef, 'reset').and.callThrough();
    spyOn(component.changeDetectorRef, 'detectChanges');
    component.selectedCity = 'Rio';
    component.ngAfterViewInit();
    component.form.controls['city'].setValue('Rio');
    expect(component.validGoogleCity).toBeTruthy();
  });
});
