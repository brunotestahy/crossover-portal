import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PRODUCTIVITY_CHECKINS_MOCK_ALL } from 'app/core/services/mocks/productivity.mock';
import { CheckInChatsSummaryComponent } from 'app/modules/contractor/components/check-in-chats/summary/check-in-chats-summary.component';

describe('CheckInChatsSummaryComponent', () => {
  let component: CheckInChatsSummaryComponent;
  let fixture: ComponentFixture<CheckInChatsSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckInChatsSummaryComponent,
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-05-18T03:24:00'));
    fixture = TestBed.createComponent(CheckInChatsSummaryComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('[ngOnChanges] contractor mode', () => {
    beforeEach(() => {
      component.managerMode = false;
    });
    it('should set up daily summary', () => {
      component.checkins = PRODUCTIVITY_CHECKINS_MOCK_ALL;
      component.startDate = new Date('2018-05-18T03:24:00');
      component.periodMode = 'Daily';
      component.ngOnChanges();
      expect(component.dailySummary.length).toBe(4);
    });
    it('should set up weekly summary', () => {
      component.checkins = PRODUCTIVITY_CHECKINS_MOCK_ALL;
      component.startDate = new Date('2018-05-14T03:24:00');
      component.periodMode = 'Weekly';
      component.ngOnChanges();
      expect(component.weeklySummary.length).toBe(4);
    });
    it('should set up monthly summary', () => {
      component.checkins = PRODUCTIVITY_CHECKINS_MOCK_ALL;
      component.startDate = new Date('2018-05-01T03:24:00');
      component.periodMode = 'Monthly';
      component.ngOnChanges();
      expect(component.monthlySummary.length).toBe(4);
    });
    it('should set up monthly summary for previous month', () => {
      component.checkins = PRODUCTIVITY_CHECKINS_MOCK_ALL;
      component.startDate = new Date('2018-04-01T03:24:00');
      component.periodMode = 'Monthly';
      component.ngOnChanges();
      expect(component.monthlySummary.length).toBe(4);
    });
    it('should do nothing when no periodMode provided', () => {
      component.ngOnChanges();
      expect(component.dailySummary.length).toBe(0);
      expect(component.weeklySummary.length).toBe(0);
      expect(component.monthlySummary.length).toBe(0);
    });
  });

  it('[getStatusDescription] should get status description with existing status', () => {
    expect(component.getStatusDescription('Not Done')).not.toBe('');
  });

  it('[getStatusDescription] should get status description with non existing status', () => {
    expect(component.getStatusDescription('unknown')).toBe('');
  });
});
