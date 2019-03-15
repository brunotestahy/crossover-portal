import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfModalService } from '@devfactory/ngx-df';
import {
  format,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators';
import { mock } from 'ts-mockito';

import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { TEAM_ASSIGNMENT_MOCK } from 'app/core/services/mocks/assignment.mock';
import { CURRENT_USER_DETAIL_MANAGER_MOCK, CURRENT_USER_DETAIL_SIMPLE_MOCK } from 'app/core/services/mocks/current-user-detail.mock';
import { PRODUCTIVIY_SUMMARY_MOCK } from 'app/core/services/mocks/productivity-summary.mock';
import { PRODUCTIVITY_CHECKINS_MOCK } from 'app/core/services/mocks/productivity.mock';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import { CheckInChatsMemberComponent } from 'app/modules/contractor/components/check-in-chats/member/check-in-chats-member.component';
import { CheckInChatsComponent } from 'app/modules/contractor/pages/check-in-chats/check-in-chats.component';
import { UserDashboardService } from 'app/shared/services/user-dashboard/user-dashboard.service';

describe('CheckInChatsComponent', () => {
  let component: CheckInChatsComponent;
  let fixture: ComponentFixture<CheckInChatsComponent>;

  let assignmentService: AssignmentService;
  let identityService: IdentityService;
  let productivityService: ProductivityService;
  let modalService: DfModalService;
  let userDashboardService: UserDashboardService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckInChatsComponent,
      ],
      providers: [
        { provide: AssignmentService, useFactory: () => mock(AssignmentService) },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: ProductivityService, useFactory: () => mock(ProductivityService) },
        { provide: UserDashboardService, useFactory: () => mock(UserDashboardService) },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2018-05-17T03:24:00'));
    fixture = TestBed.createComponent(CheckInChatsComponent);
    component = fixture.componentInstance;

    assignmentService = TestBed.get(AssignmentService);
    identityService = TestBed.get(IdentityService);
    productivityService = TestBed.get(ProductivityService);
    modalService = TestBed.get(DfModalService);
    userDashboardService = TestBed.get(UserDashboardService);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('[ngOnInit]', () => {
    beforeEach(() => {
      const teamFeature = [{enabled: true}];
      spyOn(assignmentService, 'getTeamAssignmentsAsCandidate').and.returnValue(of(TEAM_ASSIGNMENT_MOCK).pipe(take(1)));
      spyOn(assignmentService, 'getTeamAssignmentsAsManager').and.returnValue(of(TEAM_ASSIGNMENT_MOCK).pipe(take(1)));
      spyOn(productivityService, 'getSummary').and.returnValue(of(PRODUCTIVIY_SUMMARY_MOCK).pipe(take(1)));
      spyOn(productivityService, 'getTeamFeature').and.returnValue(of(teamFeature).pipe(take(1)));
      spyOn(productivityService, 'getCandidateCheckIns').and.returnValue(of(PRODUCTIVITY_CHECKINS_MOCK).pipe(take(1)));
      spyOn(productivityService, 'getManagerCheckIns').and.returnValue(of(PRODUCTIVITY_CHECKINS_MOCK).pipe(take(1)));
      spyOn(productivityService, 'getBlocksStreaks').and.returnValue(of([]).pipe(take(1)));
      spyOn(userDashboardService, 'getTeamDashboard').and.returnValue(of({
        teams: [
          {
            id: 1,
          },
        ],
      }).pipe(take(1)));
    });
    it('should get data as manager', () => {
      spyOn(identityService, 'getCurrentUserValue').and.returnValue(CURRENT_USER_DETAIL_MANAGER_MOCK);
      spyOn(identityService, 'hasAvatarType').and.returnValue(true);
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
        team: {
          id: 1,
        },
        managerId: 1,
      }));
      fixture.detectChanges();
      expect(component.checkins.length).toBe(11);
    });
    it('should get data as contractor', () => {
      spyOn(identityService, 'getCurrentUserValue').and.returnValue(CURRENT_USER_DETAIL_SIMPLE_MOCK);
      spyOn(identityService, 'hasAvatarType').and.returnValue(false);
      fixture.detectChanges();
      expect(component.checkins.length).toBe(11);
    });
    it('should switch period mode to monthly successfully', () => {
      spyOn(identityService, 'hasAvatarType').and.returnValue(false);
      spyOn(identityService, 'getCurrentUserValue').and.returnValue(CURRENT_USER_DETAIL_SIMPLE_MOCK);
      fixture.detectChanges();
      component.dateControlMonthly.setValue(startOfMonth(new Date()));
      fixture.detectChanges();
      expect(format(component.startDate, 'YYYY-MM-DD')).toEqual('2018-05-14');
    });
    it('should switch period mode to weekly successfully', () => {
      spyOn(identityService, 'hasAvatarType').and.returnValue(false);
      spyOn(identityService, 'getCurrentUserValue').and.returnValue(CURRENT_USER_DETAIL_SIMPLE_MOCK);
      fixture.detectChanges();
      component.dateControlWeekly.setValue(startOfWeek(new Date(), {weekStartsOn: 1}));
      fixture.detectChanges();
      expect(format(component.startDate, 'YYYY-MM-DD')).toEqual('2018-05-14');
    });
    it('should switch period mode to daily successfully', () => {
      spyOn(identityService, 'hasAvatarType').and.returnValue(true);
      spyOn(identityService, 'getCurrentUserValue').and.returnValue(CURRENT_USER_DETAIL_MANAGER_MOCK);
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
        team: {
          id: 2,
        },
        managerId: 1,
      }));
      fixture.detectChanges();
      component.dateControlDaily.setValue(new Date());
      expect(format(component.startDate, 'YYYY-MM-DD')).toEqual('2018-05-17');
    });
    it('[onToggleChange] should toggle monthly mode', () => {
      spyOn(identityService, 'hasAvatarType').and.returnValue(false);
      spyOn(identityService, 'getCurrentUserValue').and.returnValue(CURRENT_USER_DETAIL_SIMPLE_MOCK);
      fixture.detectChanges();
      component.onToggleChange('Monthly');
      fixture.detectChanges();
      component.previousMonth();
      component.nextMonth();
      component.fetchLastMonth();
      component.fetchThisMonth();
      expect(format(component.startDate, 'YYYY-MM-DD')).toEqual('2018-05-01');
    });
    it('[onToggleChange] should toggle weekly mode', () => {
      spyOn(identityService, 'hasAvatarType').and.returnValue(false);
      spyOn(identityService, 'getCurrentUserValue').and.returnValue(CURRENT_USER_DETAIL_SIMPLE_MOCK);
      fixture.detectChanges();
      component.onToggleChange('Weekly');
      fixture.detectChanges();
      component.previousWeek();
      component.nextWeek();
      component.fetchLastWeek();
      component.fetchThisWeek();
      expect(format(component.startDate, 'YYYY-MM-DD')).toEqual('2018-05-14');
    });
    it('[onToggleChange] should toggle daily mode', () => {
      spyOn(identityService, 'hasAvatarType').and.returnValue(true);
      spyOn(identityService, 'getCurrentUserValue').and.returnValue(CURRENT_USER_DETAIL_MANAGER_MOCK);
      spyOn(identityService, 'getTeamManagerGroupSelection').and.returnValue(of({
        team: {
          id: 1,
        },
        managerId: 1,
      }));
      fixture.detectChanges();
      component.onToggleChange('Daily');
      fixture.detectChanges();
      component.previousDay();
      component.nextDay();
      component.fetchYesterday();
      component.fetchToday();
      expect(format(component.startDate, 'YYYY-MM-DD')).toEqual('2018-05-17');
    });
    it('[onToggleChange] should do nothing when no user detail', () => {
      component.onToggleChange('Daily');
      expect(component.isLoading).toBe(true);
    });
  });

  it('should get daily format', () => {
    expect(component.getDailyFormat(new Date())).toEqual('Thursday, May 17, 2018');
  });

  it('should get weekly format', () => {
    expect(component.getWeeklyFormat(new Date())).toEqual('May 14 - May 20, 2018');
  });

  it('should get monthly format', () => {
    expect(component.getMonthlyFormat(new Date())).toEqual('May, 2018');
  });

  it('should open settings modal', () => {
    spyOn(modalService, 'open').and.callThrough();
    component.openSettings();
    expect(modalService.open).toHaveBeenCalledWith(component.settingsModal);
  });

  it('[onPageScroll]', () => {
    component.checkInChatsMember = <CheckInChatsMemberComponent>{
      hideSkypeTooltip: () => {},
    };
    component.onPageScroll();
    expect(component.checkInChatsMember).toBeDefined();
  });

  it('[onPageScroll]', () => {
    component.onPageScroll();
    expect(component.checkInChatsMember).toBeUndefined();
  });
});
