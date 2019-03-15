import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfToasterService } from '@devfactory/ngx-df';
import { DfActiveModal } from '@devfactory/ngx-df/modal';
import { mock } from 'ts-mockito';

import { CookiePreferencesModalComponent } from 'app/shared/components/cookie-preferences-modal/cookie-preferences-modal.component';
import { CookiesService } from 'app/shared/services/cookies/cookies.service';

describe('CookiePreferencesModalComponent', () => {
  let component: CookiePreferencesModalComponent;
  let fixture: ComponentFixture<CookiePreferencesModalComponent>;
  let cookiesService: CookiesService;
  let activeModal: DfActiveModal;
  let toasterService: DfToasterService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookiePreferencesModalComponent ],
      providers: [
        { provide: CookiesService, useFactory: () => mock(CookiesService) },
        { provide: DfActiveModal, useFactory: () => mock(DfActiveModal) },
        { provide: DfToasterService, useFactory: () => mock(DfToasterService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookiePreferencesModalComponent);
    component = fixture.componentInstance;
    cookiesService = TestBed.get(CookiesService);
    activeModal = TestBed.get(DfActiveModal);
    toasterService = TestBed.get(DfToasterService);
  });

  it('[ngOnInit] should set cookies value to required level', () => {
    spyOn(cookiesService, 'getCookie').and.returnValue('3');
    fixture.detectChanges();
    expect(component.value).toBe(0);
  });

  it('[ngOnInit] should set cookies value to analytics level', () => {
    spyOn(cookiesService, 'getCookie').and.returnValue('2');
    fixture.detectChanges();
    expect(component.value).toBe(1);
  });

  it('[ngOnInit] should set cookies value to ads level', () => {
    spyOn(cookiesService, 'getCookie').and.returnValue('1');
    fixture.detectChanges();
    expect(component.value).toBe(2);
  });

  it('[onValueChange] should set value to 0', () => {
    component.onValueChange(0);
    expect(component.value).toBe(0);
  });

  it('[submit] should set cookie to required level', () => {
    spyOn(cookiesService, 'setCookie');
    spyOn(toasterService, 'popSuccess');
    component.value = 0;
    component.submit();
    expect(cookiesService.setCookie).toHaveBeenCalledWith('cookieLevel', '3');
    expect(toasterService.popSuccess).toHaveBeenCalledWith('Cookie settings updated.');
  });

  it('[close] should close active modal', () => {
    spyOn(activeModal, 'close');
    component.close();
    expect(activeModal.close).toHaveBeenCalled();
  });
});
