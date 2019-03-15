import { BreakpointObserver } from '@angular/cdk/layout';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators';
import { mock } from 'ts-mockito';

import { TrackingTimesheet } from 'app/core/models/time-tracking/tracking-timesheet.model';
import { TimeLoggedComponent } from 'app/shared/components/time-logged/time-logged.component';
import { DurationFormatPipe } from 'app/shared/pipes/duration-format.pipe';

describe('TimeLoggedComponent', () => {
  let component: TimeLoggedComponent;
  let fixture: ComponentFixture<TimeLoggedComponent>;
  let breakpointObserver: BreakpointObserver;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TimeLoggedComponent, DurationFormatPipe],
      providers: [
        { provide: BreakpointObserver, useFactory: () => mock(BreakpointObserver) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLoggedComponent);
    component = fixture.componentInstance;
    component.timesheets = [
      {
        weekStartDate: new Date('2018-04-09'),
        weekEndDate: new Date('2018-04-16'),
        hourWorked: '40',
      },
      {
        weekStartDate: new Date('2018-04-09'),
        weekEndDate: new Date('2018-04-16'),
        hourWorked: '40',
      },
      {
        weekStartDate: new Date('2018-04-09'),
        weekEndDate: new Date('2018-04-16'),
        hourWorked: '40',
      },
      {
        weekStartDate: new Date('2018-04-09'),
        weekEndDate: new Date('2018-04-16'),
        hourWorked: '40',
      },
    ] as TrackingTimesheet[];
    breakpointObserver = TestBed.get(BreakpointObserver);
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-04-11T03:24:00'));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should show chart responsive', () => {
    spyOn(breakpointObserver, 'observe').and.returnValue(of({
      matches: true,
    }).pipe(take(1)));
    component.ngOnChanges();
    expect(component.data.length).toEqual(4);
  });

  it('should show chart non responsive', () => {
    spyOn(breakpointObserver, 'observe').and.returnValue(of({
      matches: false,
    }).pipe(take(1)));
    component.ngOnChanges();
    expect(component.data.length).toEqual(4);
  });

  it('[getFourWeeksTitle] should get four weeks title', () => {
    spyOn(breakpointObserver, 'observe').and.returnValue(of({
      matches: false,
    }).pipe(take(1)));
    component.ngOnChanges();
    const startDate = component.timesheets[0].weekStartDate.getDate();
    const endDate = component.timesheets[0].weekEndDate.getDate();
    expect(component.getFourWeeksTitle()).toEqual(`April ${startDate}th - April ${endDate}th`);
  });
});
