import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import {
  DfAlertService,
  DfModalService,
  DfToasterService,
} from '@devfactory/ngx-df';
import { GooglePlaceDirective, GooglePlaceModule } from 'ngx-google-places-autocomplete';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

import { SignInResponse } from 'app/core/models/google';
import { CommonService } from 'app/core/services/common/common.service';
import { GoogleService } from 'app/core/services/google/google.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { SlackService } from 'app/core/services/slack/slack.service';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { AccountInfoPageComponent } from 'app/modules/settings/pages/account-info-page/account-info-page.component';

describe('AccountInfoPageComponent', () => {
  let component: AccountInfoPageComponent;
  let identityService: IdentityService;
  let modalService: DfModalService;
  let googleService: GoogleService;
  let slackService: SlackService;

  class MockedIdentityService {

    public deleteImage(): {} {
      return {};
    }

    public getCurrentUser(): Observable<{ firstName: string, lastName: string }> {
      return Observable.of({
        firstName: 'John',
        lastName: 'Smith',
      });
    }

    public getCurrentUserResidenceInfo(): Observable<{}> {
      return Observable.of({
        workingThroughEntity: false,
        personalInfo: {
          title: 'Mr.',
          address1: '10th street',
          address2: '11th street',
          city: 'Medellin',
          state: 'Antioquia',
          zip: '0000',
          country: {
            id: 48,
            name: 'Colombia',
          },
          primaryCitizenship: {
            id: 48,
            name: 'Colombia',
          },
          secondaryCitizenship: {
            id: 49,
            name: 'Brazil',
          },
          tertiaryCitizenship: {
            id: 50,
            name: 'Argentina',
          },
        },
      });
    }

    public saveAccountInfo(): Observable<string> {
      return Observable.of('');
    }

    public saveResidenceInfo(): Observable<string> {
      return Observable.of('');
    }

    public patchCurrentUser(): void {
    }
  }

  class MockedCommonService {
    public getCountries(): Observable<{id: number, name: string}[]> {
      return Observable.of([
        {
          id: 48,
          name: 'Colombia',
        },
        {
          id: 49,
          name: 'Brazil',
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
  }

  class MockedModalService {
    public open(): void {
    }
  }

  class MockedGoogleService {
    public getUserData(): Observable<{}> {
      return Observable.of({});
    }

    public disconnect(): Observable<{}> {
      return Observable.of({});
    }

    public testConnection(): Observable<{}> {
      return Observable.of({});
    }

    public signIn(): Observable<{ googleAccessToken: string}> {
      return Observable.of({ googleAccessToken: 'mocked-token' });
    }

  }

  class MockedSlackService {

    public getUserData(): Observable<{}> {
      return Observable.of({});
    }

    public disconnect(): Observable<{}> {
      return Observable.of({});
    }

    public testConnection(): Observable<{}> {
      return Observable.of({});
    }

    public signIn(): Observable<{}> {
      return Observable.of({});
    }
  }

  class MockedAlertService {
    public createDialog(): {} {
      return {};
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        GooglePlaceModule,
      ],
      declarations: [
        AccountInfoPageComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: IdentityService, useClass: MockedIdentityService },
        { provide: CommonService, useClass: MockedCommonService },
        { provide: GoogleService, useClass: MockedGoogleService },
        { provide: SlackService, useClass: MockedSlackService },
        { provide: DfToasterService, useClass: MockedToasterService},
        { provide: DfModalService, useClass: MockedModalService},
        { provide: DfAlertService, useClass: MockedAlertService},
        { provide: WINDOW_TOKEN, useValue:
          {
            location: {
              origin: '',
            },
            auth2: {
              grantOfflineAccess: () => {
                return {
                  then: (arg: Function) => arg({ code: 'mocked-code'}),
                };
              },
            },
          },
        },
        BreakpointObserver,
        MediaMatcher,
        Platform,
        FormBuilder,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    component = TestBed.createComponent(AccountInfoPageComponent).componentInstance;
    identityService = TestBed.get(IdentityService);
    modalService = TestBed.get(DfModalService);
    googleService = TestBed.get(GoogleService);
    slackService = TestBed.get(SlackService);
  });

  it('should load initial data', () => {
    expect(component.countries.length).toBe(3);

    spyOn(identityService, 'getCurrentUserResidenceInfo').and.returnValue(
      Observable.of({
        workingThroughEntity: false,
        personalInfo: {
          title: 'Mr.',
          address1: '10th street',
          address2: '11th street',
          city: 'Medellin',
          state: 'Antioquia',
          zip: '0000',
          country: {
            id: 2,
            name: '?',
          },
          primaryCitizenship: {
            id: 48,
            name: 'Colombia',
          },
        },
      })
    );

    component = TestBed.createComponent(AccountInfoPageComponent).componentInstance;
    expect(component.countries.length).toBe(3);
  });

  it('should load initial data alt', () => {
    spyOn(identityService, 'getCurrentUserResidenceInfo').and.returnValue(
      Observable.of({
        workingThroughEntity: false,
        personalInfo: {
          title: 'Mr.',
          address1: '10th street',
          address2: '11th street',
          city: 'Medellin',
          state: 'Antioquia',
          zip: '0000',
          primaryCitizenship: {
            id: 8,
            name: '?',
          },
          secondaryCitizenship: {
            id: 9,
            name: '?',
          },
          tertiaryCitizenship: {
            id: 10,
            name: '?',
          },
        },
      })
    );

    component = TestBed.createComponent(AccountInfoPageComponent).componentInstance;
    expect(component.countries.length).toBe(3);
  });

  it('should connect slack', () => {
    component.connectSlack();
    expect(window.location.origin === '').toBe(false);
  });

  it('should unlink slack', () => {
    component.slack = Object.assign({});
    component.unlinkSlack();

    expect(component.slack).toBe(null);

    spyOn(slackService, 'disconnect').and.returnValue(Observable.throw(new Error()));

    component.slack = Object.assign({});
    component.unlinkSlack();
    expect(component.error.length).toBeTruthy();
  });

  it('should shou unlink slack error message', () => {
    spyOn(slackService, 'disconnect').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));

    component.slack = Object.assign({});
    component.unlinkSlack();
    expect(component.error.length).toBeTruthy();
  });

  it('should unlink google', () => {
    component.google = Object.assign({});
    component.unlinkGoogle();

    expect(component.google).toBe(null);

    spyOn(googleService, 'disconnect').and.returnValue(Observable.throw(new Error()));

    component.google = Object.assign({});
    component.unlinkGoogle();
    expect(component.error.length).toBeTruthy();
  });

  it('should show error on google unlink error', () => {
    spyOn(googleService, 'disconnect').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));

    component.google = Object.assign({});
    component.unlinkGoogle();
    expect(component.error.length).toBeTruthy();
  });

  it('should connect google', () => {
    component.google = Object.assign({});
    component.connectGoogle();
    const signInResponse = component.google as SignInResponse;

    expect(signInResponse.googleAccessToken).toBe('mocked-token');
  });

  it('should show error on google connect error', () => {
    spyOn(googleService, 'signIn').and.returnValue(Observable.throw(new Error()));

    component.google = Object.assign({});
    component.connectGoogle();

    expect(component.connectError.length).toBeTruthy();
  });

  it('should test google connection', () => {
    component.testGoogleConnection();

    expect(component.testingGoogle).toBe(false);

    spyOn(googleService, 'testConnection').and.returnValue(Observable.throw(new Error()));
    component.testGoogleConnection();
    expect(component.connectError.length).toBeTruthy();
  });

  it('should show error on test google connection error', () => {
    spyOn(googleService, 'testConnection').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    component.testGoogleConnection();
    expect(component.connectError.length).toBeTruthy();
  });

  it('should test slack connection', () => {
    component.testSlackConnection();

    expect(component.testingSlack).toBe(false);

    spyOn(slackService, 'testConnection').and.returnValue(Observable.throw(new Error()));
    component.testSlackConnection();
    expect(component.connectError.length).toBeTruthy();
  });

  it('should show error on test slack connection error', () => {
    spyOn(slackService, 'testConnection').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));
    component.testSlackConnection();
    expect(component.connectError.length).toBeTruthy();
  });

  it('should submit personal info', () => {
    component.saving = false;
    spyOn(identityService, 'saveAccountInfo').and.callThrough();
    spyOn(identityService, 'saveResidenceInfo').and.callThrough();

    component.onSubmit();
    expect(identityService.saveAccountInfo).toHaveBeenCalled();
    expect(identityService.saveResidenceInfo).toHaveBeenCalled();

    spyOn(identityService, 'getCurrentUserResidenceInfo').and.returnValue(
      Observable.of({
        workingThroughEntity: false,
        personalInfo: {
          title: 'Mr.',
          address1: '10th street',
          address2: '11th street',
          city: 'Medellin',
          state: 'Antioquia',
          zip: '0000',
          country: {
            id: 48,
            name: 'Colombia',
          },
          primaryCitizenship: {
            id: 48,
            name: 'Colombia',
          },
        },
      })
    );

    component = TestBed.createComponent(AccountInfoPageComponent).componentInstance;

    component.saving = false;

    component.onSubmit();
    expect(identityService.saveAccountInfo).toHaveBeenCalled();
    expect(identityService.saveResidenceInfo).toHaveBeenCalled();
  });

  it('should submit entity info', () => {
    component.saving = false;
    spyOn(identityService, 'saveResidenceInfo').and.callThrough();

    spyOn(identityService, 'getCurrentUserResidenceInfo').and.returnValue(
      Observable.of({
        workingThroughEntity: true,
        entityInfo: {
          name: 'Acme Enterprises',
          country: {
            id: 48,
            name: 'Colombia',
          },
          address1: '1',
          address2: '11th street',
          city: 'Asadabad',
          state: 'aaa',
          zip: '00001',
        }})
    );

    component = TestBed.createComponent(AccountInfoPageComponent).componentInstance;

    component.saving = false;

    component.onSubmit();
    expect(identityService.saveResidenceInfo).toHaveBeenCalled();

    spyOn(identityService, 'saveAccountInfo').and.returnValue(Observable.throw({
      error: {
        errorCode: 400,
        type: 'type',
        httpStatus: 400,
        text: 'error',
      },
    }));

    component.saving = false;
    component.onSubmit();

    expect(component.error.length).toBeTruthy();
  });

  it('should show error on submit error', () => {
    component.saving = false;
    spyOn(identityService, 'saveAccountInfo').and.returnValue(Observable.throw(new Error()));

    component.saving = false;
    component.onSubmit();

    expect(component.error.length).toBeTruthy();
  });

  it('should add citizenship', () => {
    component.secondaryCitizenshipControl = false;
    component.tertiaryCitizenshipControl = false;

    component.addCitizenship();
    expect(component.secondaryCitizenshipControl).toBe(true);
    expect(component.tertiaryCitizenshipControl).toBe(false);

    component.secondaryCitizenshipControl = true;
    component.addCitizenship();

    expect(component.secondaryCitizenshipControl).toBe(true);
    expect(component.tertiaryCitizenshipControl).toBe(true);
  });

  it('should remove citizenship', () => {
    component.secondaryCitizenshipControl = true;
    component.tertiaryCitizenshipControl = true;

    component.removeCitizenship();
    expect(component.secondaryCitizenshipControl).toBe(true);
    expect(component.tertiaryCitizenshipControl).toBe(false);

    component.secondaryCitizenshipControl = false;
    component.removeCitizenship();

    expect(component.secondaryCitizenshipControl).toBe(false);
    expect(component.tertiaryCitizenshipControl).toBe(false);
  });

  it('should change email', () => {
    spyOn(modalService, 'open').and.callThrough();
    component.changeEmail();

    expect(modalService.open).toHaveBeenCalled();
  });

  it('should set places configuration by default', () => {
    component.placesRef = {
      options: {},
      reset: () => {},
    } as GooglePlaceDirective;
    spyOn(component.placesRef, 'reset').and.callThrough();

    component.ngAfterViewInit();
    expect(component.placesRef.reset).toHaveBeenCalled();
  });

  it('should set places component restrictions', () => {
    component.placesRef = {
      options: {},
      reset: () => {},
    } as GooglePlaceDirective;
    spyOn(component.placesRef, 'reset').and.callThrough();

    component.setComponentRestrictions(48);
    expect(component.placesRef.reset).toHaveBeenCalled();
  });

  it('should set city and state for entity info', () => {
    const event = Object.assign({
      formatted_address: 'Medellin, Antioquia, Colombia',
    });

    spyOn(component.form, 'patchValue').and.callThrough();
    component.handleAddressChange(event);

    expect(component.form.patchValue).toHaveBeenCalled();
  });

  it('should set city and state for personal info', () => {
    const event = Object.assign({
      formatted_address: 'Medellin, Antioquia, Colombia',
    });

    spyOn(component.form, 'patchValue').and.callThrough();
    component.handleEntityAddressChange(event);

    expect(component.form.patchValue).toHaveBeenCalled();
  });

  it('should delete a profile photo successfully', async(() => {
    spyOn(identityService, 'deleteImage').and.returnValue(
      Observable.of(true)
    );
    const photoUrl = 'http://any/photo/url';
    component.photoUrl = photoUrl;

    component.deleteProfilePhoto();

    expect(component.photoUrl).toBeNull();
  }));
});
