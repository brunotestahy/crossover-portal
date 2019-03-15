import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { endOfWeek, startOfWeek, subDays } from 'date-fns';

import { MyDashboardDatepickerComponent } from 'app/shared/components/my-dashboard-datepicker/my-dashboard-datepicker.component';

describe('MyDashboardDatepickerComponent', () => {
  let component: MyDashboardDatepickerComponent;
  let fixture: ComponentFixture<MyDashboardDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyDashboardDatepickerComponent,
      ],
      providers: [],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDashboardDatepickerComponent);
    component = fixture.componentInstance;
  });

  it('check if the component has been created', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit]', () => {
    const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    const endOfThisWeek = endOfWeek(new Date(), { weekStartsOn: 1 });
    fixture.detectChanges();
    expect(component.startOfThisWeek).toEqual(startOfThisWeek);
    expect(component.endOfThisWeek).toEqual(endOfThisWeek);
  });

  describe('[next]', () => {
    it('should goto next date when view is daily', () => {
      const curDate = new Date(2017, 12, 1);
      const nextDate = new Date(2017, 12, 2);
      component.view = 'daily';
      fixture.detectChanges();
      component.dateControl.setValue(curDate);
      component.next();
      expect(component.dateControl.value).toEqual(nextDate);
    });
    it('should goto next week when view is daily', () => {
      const curDate = new Date(2017, 12, 1);
      const nextWeek = new Date(2017, 12, 8);
      component.view = 'week';
      fixture.detectChanges();
      component.dateControl.setValue(curDate);
      component.next();
      expect(component.dateControl.value).toEqual(nextWeek);
    });
  });

  describe('[previous]', () => {
    it('should goto previous date when view is daily', () => {
      const curDate = new Date(2017, 12, 2);
      const preDate = new Date(2017, 12, 1);
      component.view = 'daily';
      component.dateControl.setValue(curDate);
      component.previous();
      expect(component.dateControl.value).toEqual(preDate);
    });
    it('should goto previous week when view is daily', () => {
      const curDate = new Date(2017, 12, 8);
      const preWeek = new Date(2017, 12, 1);
      component.view = 'week';
      component.dateControl.setValue(curDate);
      component.previous();
      expect(component.dateControl.value).toEqual(preWeek);
    });
  });

  describe('[showNext]', () => {
    it('should show next icon when date is less than todays date and view is daily', () => {
      component.dateControl.setValue(subDays(new Date(), 1));
      component.view = 'daily';
      const isShowNext = component.showNext();
      expect(isShowNext).toBe(true);
    });
  });
});
