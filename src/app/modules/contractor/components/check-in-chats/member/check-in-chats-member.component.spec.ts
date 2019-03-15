import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfModalService } from '@devfactory/ngx-df';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators';
import { mock } from 'ts-mockito';

import { TeamFeature } from 'app/core/models/app';
import { CheckInStatus, WeeklyMemberCheckInSummary } from 'app/core/models/productivity';
import { TEAM_ASSIGNMENT_MOCK } from 'app/core/services/mocks/assignment.mock';
import { CURRENT_USER_DETAIL_SIMPLE_MOCK } from 'app/core/services/mocks/current-user-detail.mock';
import { PRODUCTIVIY_SUMMARY_MOCK } from 'app/core/services/mocks/productivity-summary.mock';
import {
  PRODUCTIVITY_CHECKINS_MOCK_ALL,
  PRODUCTIVITY_CHECKINS_TEAM_MEMBERS,
} from 'app/core/services/mocks/productivity.mock';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import { CheckInChatsMemberComponent } from 'app/modules/contractor/components/check-in-chats/member/check-in-chats-member.component';
import { EnumToStringPipe } from 'app/shared/pipes/enum-to-string.pipe';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

describe('CheckInChatsMemberComponent', () => {
  let component: CheckInChatsMemberComponent;
  let fixture: ComponentFixture<CheckInChatsMemberComponent>;

  let productivityService: ProductivityService;
  let modalService: DfModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckInChatsMemberComponent,
        EnumToStringPipe,
      ],
      providers: [
        { provide: ProductivityService, useFactory: () => mock(ProductivityService) },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-05-18T03:24:00'));
    fixture = TestBed.createComponent(CheckInChatsMemberComponent);
    component = fixture.componentInstance;

    productivityService = TestBed.get(ProductivityService);
    modalService = TestBed.get(DfModalService);
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
      component.currentUserDetail = CURRENT_USER_DETAIL_SIMPLE_MOCK;
      component.checkins = PRODUCTIVITY_CHECKINS_MOCK_ALL;
      component.startDate = new Date('2018-05-18T03:24:00');
      component.teamMembers = [PRODUCTIVITY_CHECKINS_TEAM_MEMBERS[0]];
      component.teamMembers[0].assignment = Object.assign(TEAM_ASSIGNMENT_MOCK[0]);
      component.summary = PRODUCTIVIY_SUMMARY_MOCK;
      component.teamFeature = {enabled: true} as TeamFeature;
      component.blocksStreaks = [{
        assignmentId: 21760,
        streakCount: 1,
      }];
    });

    it('should set up weekly members data', () => {
      component.periodMode = 'Weekly';
      component.ngOnChanges();
      expect(component.teamCheckinsWeekly.length).toBe(1);
    });

    it('should set up monthly members data', () => {
      component.periodMode = 'Monthly';
      component.ngOnChanges();
      expect(component.teamCheckinsMonthly.length).toBe(1);
    });

    it('should set unblocked to true when changing status to NOT_DONE', () => {
      component.periodMode = 'Monthly';
      component.ngOnChanges();
      component.checkInForm.controls.status.setValue('ON_TRACK');
      expect(component.checkInForm.value.unblocked).toBe('Yes');
    });

    it('should not change unblocked when changing status to WRONG_THING', () => {
      component.periodMode = 'Monthly';
      component.ngOnChanges();
      component.checkInForm.controls.status.setValue('WRONG_THING');
      expect(component.checkInForm.value.unblocked).toBe('Yes');
    });

    it('[openCheckInModal] should open check in modal - weekly mode', () => {
      spyOn(modalService, 'open');
      component.periodMode = 'Daily';
      component.ngOnChanges();
      component.openCheckInModal(component.teamCheckinsDaily[0], component.teamCheckinsDaily[0].today, 0);
      expect(modalService.open).toHaveBeenCalledWith(component.checkInModal);
    });

    it('[openCheckInModal] should open check in modal - weekly mode', () => {
      spyOn(modalService, 'open');
      component.periodMode = 'Weekly';
      component.ngOnChanges();
      component.openCheckInModal(component.teamCheckinsWeekly[0], component.teamCheckinsWeekly[0].friday, 4);
      expect(modalService.open).toHaveBeenCalledWith(component.checkInModal);
    });

    it('[openCheckInModal] should open check in modal - monthly mode', () => {
      spyOn(modalService, 'open');
      component.periodMode = 'Monthly';
      component.ngOnChanges();
      component.openCheckInModal(component.teamCheckinsMonthly[0], {isEditable: true} as CheckInStatus, 0);
      expect(modalService.open).toHaveBeenCalledWith(component.checkInModal);
    });

    it('[openCheckInModal] should do nothing when no status provided', () => {
      spyOn(modalService, 'open');
      component.periodMode = 'Weekly';
      component.ngOnChanges();
      component.openCheckInModal(component.teamCheckinsWeekly[0], undefined, 4);
      expect(modalService.open).not.toHaveBeenCalled();
    });

    it('[openScreensReleased] should open screen released modal', () => {
      spyOn(modalService, 'open');
      component.periodMode = 'Weekly';
      component.ngOnChanges();
      component.openScreensReleased(component.teamCheckinsWeekly[0]);
      expect(modalService.open).toHaveBeenCalledWith(component.screensReleasedModal);
    });

    it('[openScreensReleased] should not open modal when no contractor found', () => {
      spyOn(modalService, 'open');
      component.periodMode = 'Weekly';
      component.ngOnChanges();
      component.openScreensReleased({} as WeeklyMemberCheckInSummary);
      expect(modalService.open).not.toHaveBeenCalled();
    });

    it('[openHoursLogged] should open hours logged modal', () => {
      spyOn(modalService, 'open');
      component.periodMode = 'Weekly';
      component.ngOnChanges();
      component.openHoursLogged(component.teamCheckinsWeekly[0]);
      expect(modalService.open).toHaveBeenCalledWith(component.hoursLoggedModal);
    });

    it('[openHoursLogged] should not open modal when no contractor found', () => {
      spyOn(modalService, 'open');
      component.periodMode = 'Weekly';
      component.ngOnChanges();
      component.openHoursLogged({} as WeeklyMemberCheckInSummary);
      expect(modalService.open).not.toHaveBeenCalled();
    });

    it('[modifyCheckins] should do nothing when no selected checkin', () => {
      spyOn(component.refresh, 'emit').and.returnValue({});
      component.modifyCheckins(() => {});
      expect(component.refresh.emit).not.toHaveBeenCalled();
    });

    it('[modifyCheckins] should insert new checkin', () => {
      spyOn(productivityService, 'insertCheckIn').and.returnValue(of({}).pipe(take(1)));
      spyOn(component.refresh, 'emit').and.returnValue({});
      component.periodMode = 'Weekly';
      component.selectedTeamMemberCheckin = {
        checkin: {
          id: null,
          date: '2018-05-14',
          status: 'WRONG_THING',
          unblocked: true,
          assignmentId: 8066,
          blockageStatus: 'UNBLOCKED',
        },
        date: '2018-05-18',
        photoUrl: 'some url',
        fullName: 'some name',
      };
      component.modifyCheckins(() => {});
      expect(component.refresh.emit).toHaveBeenCalled();
    });

    it('[modifyCheckins] should show custom error message when insert api fails', () => {
      spyOn(productivityService, 'insertCheckIn').and.returnValue(ErrorObservable.create({}));
      component.periodMode = 'Weekly';
      component.selectedTeamMemberCheckin = {
        checkin: {
          id: null,
          date: '2018-05-14',
          status: 'WRONG_THING',
          unblocked: true,
          assignmentId: 8066,
          blockageStatus: 'UNBLOCKED',
        },
        date: '2018-05-18',
        photoUrl: 'some url',
        fullName: 'some name',
      };
      component.modifyCheckins(() => {});
      expect(component.error).toBe('Error inserting checkin.');
    });

    it('[modifyCheckins] should show api error message when insert api fails', () => {
      spyOn(productivityService, 'insertCheckIn').and.returnValue(ErrorObservable.create({
        error: {
          errorCode: 400,
          type: 'type',
          httpStatus: 400,
          text: 'error',
        },
      }));
      component.periodMode = 'Weekly';
      component.selectedTeamMemberCheckin = {
        checkin: {
          id: null,
          date: '2018-05-14',
          status: 'WRONG_THING',
          unblocked: true,
          assignmentId: 8066,
          blockageStatus: 'UNBLOCKED',
        },
        date: '2018-05-18',
        photoUrl: 'some url',
        fullName: 'some name',
      };
      component.modifyCheckins(() => {});
      expect(component.error).toBe('error');
    });

    it('[modifyCheckins] should update checkin', () => {
      spyOn(productivityService, 'updateCheckIn').and.returnValue(of({}).pipe(take(1)));
      spyOn(component.refresh, 'emit').and.returnValue({});
      component.periodMode = 'Weekly';
      component.ngOnChanges();
      component.selectedTeamMemberCheckin = {
        checkin: {
          id: 1,
          date: '2018-05-14',
          status: 'WRONG_THING',
          unblocked: true,
          assignmentId: 8066,
          blockageStatus: 'UNBLOCKED',
        },
        date: '2018-05-18',
        photoUrl: 'some url',
        fullName: 'some name',
      };
      component.modifyCheckins(() => {});
      expect(component.refresh.emit).toHaveBeenCalled();
    });

    it('[modifyCheckins] should show custom error message when update api fails', () => {
      spyOn(productivityService, 'updateCheckIn').and.returnValue(ErrorObservable.create({}));
      component.periodMode = 'Weekly';
      component.selectedTeamMemberCheckin = {
        checkin: {
          id: 1,
          date: '2018-05-14',
          status: 'WRONG_THING',
          unblocked: true,
          assignmentId: 8066,
          blockageStatus: 'UNBLOCKED',
        },
        date: '2018-05-18',
        photoUrl: 'some url',
        fullName: 'some name',
      };
      component.modifyCheckins(() => {});
      expect(component.error).toBe('Error updating checkin.');
    });

    it('[modifyCheckins] should show api error message when update api fails', () => {
      spyOn(productivityService, 'updateCheckIn').and.returnValue(ErrorObservable.create({
        error: {
          errorCode: 400,
          type: 'type',
          httpStatus: 400,
          text: 'error',
        },
      }));
      component.periodMode = 'Weekly';
      component.selectedTeamMemberCheckin = {
        checkin: {
          id: 1,
          date: '2018-05-14',
          status: 'WRONG_THING',
          unblocked: true,
          assignmentId: 8066,
          blockageStatus: 'UNBLOCKED',
        },
        date: '2018-05-18',
        photoUrl: 'some url',
        fullName: 'some name',
      };
      component.modifyCheckins(() => {});
      expect(component.error).toBe('error');
    });
  });

  it('[xAxisTickFormatter] should set chart x axis to formatted date MMM DD', () =>
    expect(component.xAxisTickFormatter(new Date())).toBe('May 18')
  );

  it('[isUnblockedToggleEnabled] should return true when status is not ON_TRACK or NOT_DONE', () =>
    expect(component.isUnblockedToggleEnabled()).toBe(true)
  );

  it('[onTeamPeriodChange] should set period to Last 4 Weeks', () => {
    component.onTeamPeriodChange('Last 4 Weeks');
    expect(component.teamPeriod).toBe('Last 4 Weeks');
  });

  it('[getHoursLogged] should get last week hours', () => {
    component.teamPeriod = 'Last Week';
    expect(component.getHoursLogged({
      hoursLastWeek: 'somehours',
    } as WeeklyMemberCheckInSummary)).toBe('somehours');
  });

  it('[getHoursLogged] should get last 4 weeks hours', () => {
    component.teamPeriod = 'Last 4 Weeks';
    expect(component.getHoursLogged({
      hours: 'somehours',
    } as WeeklyMemberCheckInSummary)).toBe('somehours');
  });

  it('[getHoursLogged] should get current week hours', () => {
    component.teamPeriod = 'Current Week';
    expect(component.getHoursLogged({
      hoursCurrentWeek: 'somehours',
    } as WeeklyMemberCheckInSummary)).toBe('somehours');
  });

  it('[getMetrics] should get last week metrics', () => {
    component.teamPeriod = 'Last Week';
    expect(component.getMetrics({
      metricLastWeek: 'somemetrics',
    } as WeeklyMemberCheckInSummary)).toBe('somemetrics');
  });

  it('[getMetrics] should get last 4 weeks metrics', () => {
    component.teamPeriod = 'Last 4 Weeks';
    expect(component.getMetrics({
      metric: 'somemetrics',
    } as WeeklyMemberCheckInSummary)).toBe('somemetrics');
  });

  it('[getMetrics] should get current week metrics', () => {
    component.teamPeriod = 'Current Week';
    expect(component.getMetrics({
      metricCurrentWeek: 'somemetrics',
    } as WeeklyMemberCheckInSummary)).toBe('somemetrics');
  });
});
