import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingTimesheet } from 'app/core/models/time-tracking/tracking-timesheet.model';
import { TimeLoggedWeekComponent } from 'app/shared/components/time-logged-week/time-logged-week.component';
import { DurationFormatPipe } from 'app/shared/pipes/duration-format.pipe';

describe('TimeLoggedWeekComponent', () => {
  let component: TimeLoggedWeekComponent;
  let fixture: ComponentFixture<TimeLoggedWeekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TimeLoggedWeekComponent, DurationFormatPipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-04-11T03:24:00'));
    fixture = TestBed.createComponent(TimeLoggedWeekComponent);
    component = fixture.componentInstance;
    component.weeklyTimesheets = [
      {
        weekStartDate: new Date('2018-04-09'),
        weekEndDate: new Date('2018-04-16'),
        hourWorked: '40',
        stats: [{
          'date': new Date('2018-04-09'),
          'hours': 8.3333,
        }],
        printableTime: '40h',
      } as TrackingTimesheet,
    ] as TrackingTimesheet[];
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should show chart / current week', () => {
    component.ngOnChanges();
    expect(component.timeLoggedMessage).toEqual('logged so far this week');
  });

  it('should show chart / previous week', () => {
    component.weeklyTimesheets[0].weekStartDate = new Date('2018-04-02');
    component.ngOnChanges();
    expect(component.timeLoggedMessage).toEqual('logged in the week');
  });
});
