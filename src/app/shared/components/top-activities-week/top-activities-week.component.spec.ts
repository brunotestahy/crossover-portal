import { BreakpointObserver } from '@angular/cdk/layout';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { mock } from 'ts-mockito';

import { ProductivityGroup } from 'app/core/models/productivity/productivity-group.model';
import { PRODUCTIVITY_MOCK } from 'app/core/services/mocks/productivity.mock';
import { TopActivitiesWeekComponent } from 'app/shared/components/top-activities-week/top-activities-week.component';
import { DurationFormatPipe } from 'app/shared/pipes/duration-format.pipe';

describe('TopActivitiesWeekComponent', () => {
  let component: TopActivitiesWeekComponent;
  let fixture: ComponentFixture<TopActivitiesWeekComponent>;
  let breakpointObserver: BreakpointObserver;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TopActivitiesWeekComponent, DurationFormatPipe],
      providers: [
        { provide: BreakpointObserver, useFactory: () => mock(BreakpointObserver) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopActivitiesWeekComponent);
    component = fixture.componentInstance;
    breakpointObserver = TestBed.get(BreakpointObserver);
    component.productivityGroups = [
      {
        grouping: PRODUCTIVITY_MOCK[0].grouping,
        assignment: {
          id: 1,
        },
        assignmentHistory: {
          id: 1,
        },
      },
    ] as ProductivityGroup[];
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
    }));
    component.ngOnChanges();
    expect(component.data.length).toEqual(6);
  });

  it('should show chart non responsive', () => {
    spyOn(breakpointObserver, 'observe').and.returnValue(of({
      matches: false,
    }));
    component.ngOnChanges();
    expect(component.data.length).toEqual(6);
  });
});
