import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfToasterService } from '@devfactory/ngx-df';
import { mock } from 'ts-mockito';

import { PrivacySettingsPageComponent } from 'app/modules/settings/pages/privacy-settings-page/privacy-settings-page.component';
import { CookiesService } from 'app/shared/services/cookies/cookies.service';

describe('PrivacySettingsPageComponent', () => {
  let component: PrivacySettingsPageComponent;
  let fixture: ComponentFixture<PrivacySettingsPageComponent>;
  let cookiesService: CookiesService;
  let toasterService: DfToasterService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacySettingsPageComponent ],
      providers: [
        { provide: CookiesService, useFactory: () => mock(CookiesService) },
        { provide: DfToasterService, useFactory: () => mock(DfToasterService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacySettingsPageComponent);
    component = fixture.componentInstance;
    cookiesService = TestBed.get(CookiesService);
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
    expect(toasterService.popSuccess).toHaveBeenCalledWith('Change successfully saved. It will be applied next time you login.');
  });
});
