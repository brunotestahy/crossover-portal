import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import {
  DfLoadingSpinnerModule, DfModalModule,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';

import { CurrentUser } from 'app/core/models/current-user';
import { UserLocationData } from 'app/core/models/identity';

import { InterviewMapComponent } from './interview-map.component';

const LOCATION_MOCK_DATA: UserLocationData = {
  country: {
    id: 123,
    timezones: [],
    name: '',
    code: '',
    allowed: true,
    zipFormat: '',
  },
  timeZone: {
    id: 123,
    name: '',
    offset: 123,
    standardOffset: 123,
    hourlyOffset: '',
    countries: [],
  },
  address: '',
  city: '',
  state: '',
  phone: '',
  latitude: 1,
  longitude: 2,
  zip: '',
};

describe('InterviewMapComponent', () => {
  let component: InterviewMapComponent;
  let fixture: ComponentFixture<InterviewMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [InterviewMapComponent],
      imports: [BrowserModule, DfValidationMessagesModule.forRoot(), DfLoadingSpinnerModule, DfModalModule],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewMapComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should getText', () => {
    component.you = { email: 'email@address.com', location: LOCATION_MOCK_DATA } as CurrentUser;
    component.counterpart = { email: 'email@address.com', location: LOCATION_MOCK_DATA } as CurrentUser;
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.url).toBeDefined();
    expect(component.you).toBeDefined();
    expect(component.counterpart).toBeDefined();
    component.mapReady();
  });

  it('should getText empty location 1', () => {
    component.you = { email: 'email@address.com', location: {} } as CurrentUser;
    component.counterpart = { email: 'email@address.com', location: LOCATION_MOCK_DATA } as CurrentUser;
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.url).toBeDefined();
    expect(component.you).toBeDefined();
    expect(component.counterpart).toBeDefined();
    component.mapReady();
  });

  it('should getText empty location 2', () => {
    component.you = { email: 'email@address.com', location: LOCATION_MOCK_DATA } as CurrentUser;
    component.counterpart = { email: 'email@address.com', location: {} } as CurrentUser;
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.url).toBeDefined();
    expect(component.you).toBeDefined();
    expect(component.counterpart).toBeDefined();
    component.mapReady();
  });

  it('should getText empty location 3', () => {
    component.you = { email: 'email@address.com', location: {} } as CurrentUser;
    component.counterpart = {
      email: 'email@address.com',
      location: {
        country: {},
      },
    } as CurrentUser;
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.url).toBeDefined();
    expect(component.you).toBeDefined();
    expect(component.counterpart).toBeDefined();
    component.mapReady();
  });

  it('should getText check bounds', () => {
    component.you = { email: 'email@address.com', location: {latitude: -174.8, longitude: -165.5} } as CurrentUser;
    component.counterpart = { email: 'email@address.com', location: { country: {name: 'Sample Country \'ABC\''}} } as CurrentUser;
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.url).toBeDefined();
    expect(component.you).toBeDefined();
    expect(component.counterpart).toBeDefined();
    component.mapReady();
  });

});
