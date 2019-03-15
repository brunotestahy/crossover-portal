import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidelinesForSuccessPageComponent } from './guidelines-for-success-page.component';

describe('GuidelinesForSuccessPageComponent', () => {
  let component: GuidelinesForSuccessPageComponent;
  let fixture: ComponentFixture<GuidelinesForSuccessPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        schemas: [ NO_ERRORS_SCHEMA ],
        declarations: [ GuidelinesForSuccessPageComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidelinesForSuccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});
