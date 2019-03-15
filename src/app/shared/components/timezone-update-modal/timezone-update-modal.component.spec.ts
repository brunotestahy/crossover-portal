import { Platform } from '@angular/cdk/platform';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import {
  DfActiveModal, DfLoadingSpinnerModule, DfLoadingSpinnerService, DfModalModule,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { mock } from 'ts-mockito';

import { EnvironmentTimezone } from 'app/core/models/identity';
import { IdentityService } from 'app/core/services/identity/identity.service';
import {
  TimezoneUpdateModalComponent,
} from 'app/shared/components/timezone-update-modal/timezone-update-modal.component';
import {
  USER_AHEAD_UTC_TIMEZONE,
  USER_BEHIND_UTC_TIMEZONE,
} from 'app/shared/components/timezone-update-modal/timezone-update-modal.component.mock.spec';

describe('TimezoneUpdateModalComponent', () => {
  let component: TimezoneUpdateModalComponent;
  let fixture: ComponentFixture<typeof component>;
  let identityService: IdentityService;
  let activeModalService: DfActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
      declarations: [
        TimezoneUpdateModalComponent,
      ],
      imports: [
        BrowserModule,
        DfValidationMessagesModule.forRoot(),
        DfLoadingSpinnerModule,
        DfModalModule,
      ],
      providers: [
        {provide: DfActiveModal, useFactory: () => mock(DfActiveModal)},
        {provide: IdentityService, useFactory: () => mock(IdentityService)},
        DfLoadingSpinnerService,
        Platform,
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(TimezoneUpdateModalComponent);
      component = fixture.componentInstance;
      activeModalService = TestBed.get(DfActiveModal);
      identityService = TestBed.get(IdentityService);
    });
  }));

  it('should be created', () =>
    expect(component).toBeTruthy()
  );

  it('should set environment time zone successfully when user is behind UTC', async(() => {
    const currentUser = {id: 1, location: {
      timeZone: {},
    }};
    spyOn(identityService, 'getCurrentUser')
      .and.returnValue(of(currentUser));
    spyOn(identityService, 'getEnvironmentTimezone')
      .and.returnValue(of(USER_BEHIND_UTC_TIMEZONE));

    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        const environmentTimezone = component.environmentTimezone as EnvironmentTimezone;
        expect(environmentTimezone).toBe(USER_BEHIND_UTC_TIMEZONE);
        expect(environmentTimezone.humanReadable).toBe('-03:00');
      });
  }));

  it('should set environment time zone successfully when user is ahead UTC', async(() => {
    const currentUser = {id: 1, location: {
      timeZone: {},
    }};
    spyOn(identityService, 'getCurrentUser')
      .and.returnValue(of(currentUser));
    spyOn(identityService, 'getEnvironmentTimezone')
      .and.returnValue(of(USER_AHEAD_UTC_TIMEZONE));

    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        const environmentTimezone = component.environmentTimezone as EnvironmentTimezone;
        expect(environmentTimezone).toBe(USER_AHEAD_UTC_TIMEZONE);
        expect(environmentTimezone.humanReadable).toBe('+02:00');
      });
  }));

  it('should dissociate environment time zone when an error occurs', async(() => {
    spyOn(identityService, 'getCurrentUser')
      .and.returnValue(ErrorObservable.create('HTTP error'));
    spyOn(identityService, 'getEnvironmentTimezone')
      .and.returnValue(of(USER_BEHIND_UTC_TIMEZONE));
    component.environmentTimezone = USER_AHEAD_UTC_TIMEZONE;

    fixture.detectChanges();
    fixture.whenStable()
      .then(() =>
        expect(component.environmentTimezone).toBeNull()
      );
  }));

  it('should change the timezone successfully', async(() => {
    spyOn(activeModalService, 'close');

    component.change();
    expect(activeModalService.close).toHaveBeenCalledWith(true);
  }));

  it('should close the timezone difference modal successfully', async(() => {
    spyOn(activeModalService, 'close');

    component.close();
    expect(activeModalService.close).toHaveBeenCalledWith(false);
  }));
});
