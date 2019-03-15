import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookiePreferencesFormComponent } from 'app/shared/components/cookie-preferences-form/cookie-preferences-form.component';

describe('CookiePreferencesFormComponent', () => {
  let component: CookiePreferencesFormComponent;
  let fixture: ComponentFixture<CookiePreferencesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookiePreferencesFormComponent ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookiePreferencesFormComponent);
    component = fixture.componentInstance;
  });

  it('[setValue] should emit value', () => {
    spyOn(component.valueChange, 'emit');
    component.setValue(0);
    expect(component.valueChange.emit).toHaveBeenCalledWith(0);
  });
});
