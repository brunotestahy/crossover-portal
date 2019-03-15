import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { DfLoadingSpinnerModule, DfModalModule, DfValidationMessagesModule } from '@devfactory/ngx-df';

import { CountdownComponent } from './countdown.component';

describe('CountdownComponent', () => {
  let component: CountdownComponent;
  let fixture: ComponentFixture<CountdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CountdownComponent],
      imports: [BrowserModule, DfValidationMessagesModule.forRoot(), DfLoadingSpinnerModule, DfModalModule],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountdownComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should [ngOnInit]', () => {
    expect(component).toBeTruthy();
    component.start = new Date();
    component.end = new Date();
    component.ngOnInit();
  });

  it('should [ngOnInit]', () => {
    expect(component).toBeTruthy();
    component.end = new Date();
    component.ngOnInit();
  });

  it('should [ngOnInit] fail', () => {
    expect(component).toBeTruthy();
    component.start = new Date();
    const spy  = spyOn(component, 'ngOnInit');
    spy.and.callThrough();
    expect(spy).toThrowError('[end] input required!');
  });
});
