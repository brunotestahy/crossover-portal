import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarUtils } from 'angular-calendar';
import { Subject } from 'rxjs/Subject';

import { ScheduleCalendarComponent } from 'app/shared/components/schedule-calendar/schedule-calendar.component';

describe('ScheduleCalendarComponent', () => {
  let component: ScheduleCalendarComponent;
  let fixture: ComponentFixture<ScheduleCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        ScheduleCalendarComponent,
      ],
      imports: [],
      providers: [
        CalendarUtils,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleCalendarComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit]', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
  });

  it('[ngOnInit] refresh', () => {
    component.refresh = new Subject<void>();
    expect(component).toBeTruthy();
    component.ngOnInit();
  });

  it('[ngOnChanges]', () => {
    expect(component).toBeTruthy();
    component.ngOnChanges(Object.assign({
      viewDate: true,
      dayStartHour: 1,
      dayStartMinute: 15,
      dayEndHour: 4,
      dayEndMinute: 55,
      eventWidth: 100,
      events: [
        {},
      ],
    }));
    component.ngOnChanges(Object.assign({
      viewDate: true,
    }));
    component.ngOnChanges(Object.assign({
      dayStartHour: 1,
    }));
    component.ngOnChanges(Object.assign({
      dayStartMinute: 15,
    }));
    component.ngOnChanges(Object.assign({
      dayEndHour: 4,
    }));

    component.ngOnChanges({});
  });

  it('[ngOnDestroy]', () => {
    expect(component).toBeTruthy();
    component.ngOnDestroy();
  });
});
