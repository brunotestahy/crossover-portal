import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfActivePortal, DfModalService } from '@devfactory/ngx-df';
import { mock } from 'ts-mockito';

import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { CookieAlertComponent } from 'app/shared/components/cookie-alert/cookie-alert.component';
import { CookiesService } from 'app/shared/services/cookies/cookies.service';

describe('CookieAlertComponent', () => {
  let component: CookieAlertComponent;
  let fixture: ComponentFixture<CookieAlertComponent>;
  let activePortal: DfActivePortal;
  let modalService: DfModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookieAlertComponent ],
      providers: [
        CookiesService,
        { provide: DfActivePortal, useFactory: () => mock(DfActivePortal) },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
        { provide: WINDOW_TOKEN, useValue: {
          location: {},
        } },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieAlertComponent);
    component = fixture.componentInstance;
    activePortal = TestBed.get(DfActivePortal);
    modalService = TestBed.get(DfModalService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[close] should set cookies and close portal', () => {
    spyOn(activePortal, 'close');
    component.close();
    expect(activePortal.close).toHaveBeenCalled();
  });

  it('[openPreferences] should open preferences modal', () => {
    spyOn(modalService, 'open');
    component.openPreferences();
    expect(modalService.open).toHaveBeenCalled();
  });
});
