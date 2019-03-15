import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DfActiveModal, DfToasterService } from '@devfactory/ngx-df';
import { _throw } from 'rxjs/observable/throw';
import { Observable } from 'rxjs/Observable';

import { CurrentUserDetail } from 'app/core/models/identity';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { ChangeEmailModalComponent } from 'app/modules/settings/components/change-email-modal/change-email-modal.component';

describe('ChangeEmailModalComponent', () => {
  let component: ChangeEmailModalComponent;
  let fixture: ComponentFixture<ChangeEmailModalComponent>;
  let toaster: DfToasterService;
  let activeModal: DfActiveModal;
  let identityService: IdentityService;

  class MockedToasterService {
    public popSuccess(): void {}
  }

  class MockedActiveModal {
    public close(): void {}
  }

  class MockedIdentityService {

    public getCurrentUser(): Observable<CurrentUserDetail> {
      return Observable.of({ email: 'email@address.com' } as CurrentUserDetail);
    }

    public changeCurrentUserEmail(): Observable<{}> {
      return Observable.of({});
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChangeEmailModalComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DfToasterService, useClass: MockedToasterService },
        { provide: DfActiveModal, useClass: MockedActiveModal },
        { provide: IdentityService, useClass: MockedIdentityService },
        BreakpointObserver,
        MediaMatcher,
        Platform,
        FormBuilder,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    fixture = TestBed.createComponent(ChangeEmailModalComponent);
    component = fixture.componentInstance;
    toaster = TestBed.get(DfToasterService);
    identityService = TestBed.get(IdentityService);
    activeModal = TestBed.get(DfActiveModal);
  });

  it('should load current use', () => {
    expect(component.currentUser$ !== undefined).toBe(true);
  });

  it('should submit new email', () => {
    spyOn(toaster, 'popSuccess').and.callThrough();
    component.emailControl.patchValue('daniel@address.com');
    component.submit();

    expect(toaster.popSuccess).toHaveBeenCalled();
  });

  it('should not submit new email', () => {
    spyOn(toaster, 'popSuccess').and.callThrough();
    component.emailControl.patchValue('danieladdress.com');
    component.submit();
  });

  it('should close change email pop up', () => {
    spyOn(activeModal, 'close').and.callThrough();
    component.close();

    expect(activeModal.close).toHaveBeenCalled();
  });

  describe('Submit should - get server error', () => {
    it('Show default text', () => {
      spyOn(toaster, 'popSuccess').and.callThrough();
      component.emailControl.patchValue('daniel@address.com');
      spyOn(identityService, 'changeCurrentUserEmail').and.returnValues(_throw({}));
      component.submit();

      expect(component.isLoading).toBe(false);
      expect(component.error).toBe('Error changing email.');
    });

    it('Show server error text', () => {
      spyOn(toaster, 'popSuccess').and.callThrough();
      component.emailControl.patchValue('daniel@address.com');
      spyOn(identityService, 'changeCurrentUserEmail').and.returnValues(_throw({
        error: {
          errorCode: '500',
          type: '500',
          httpStatus: '500',
          text: 'server error',
        },
      }));
      component.submit();

      expect(component.isLoading).toBe(false);
      expect(component.error).toBe('server error');
    });

    it('Shouldn\'t send a request if form is not valid', () => {
      component.emailControl.patchValue('someInvalidEmail');
      const requestSpy = spyOn(identityService, 'changeCurrentUserEmail');
      component.submit();
      expect(component.isLoading).toBe(false);
      expect(component.error).toBe(null);
      expect(requestSpy).not.toHaveBeenCalled();
    });
  });

});
