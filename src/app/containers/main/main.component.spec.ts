import { BreakpointObserver } from '@angular/cdk/layout';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRouteSnapshot, ActivationStart, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DfSidebarModule, DfTopbarModule } from '@devfactory/ngx-df';
import { cold } from 'jasmine-marbles';
import { DateFnsModule } from 'ngx-date-fns';
import 'rxjs/add/observable/of';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators';
import { mock } from 'ts-mockito';

import { MainComponent } from 'app/containers/main/main.component';
import {
  APPLICATION_MENU_ITEM,
  APPLICATION_MENU_ITEM_CANCELLABLE,
  AVAILABLE_JOBS_MENU_ITEM,
  PRIVACY_POLICY_MENU_ITEM,
  PROFILE_MENU_ITEM,
  RESOURCES_MENU_ITEM,
  SETTINGS_MENU_ITEM,
  SUPPORT_MENU_ITEM,
} from 'app/core/constants/menu/items';
import { App } from 'app/core/models/app';
import { CurrentUserDetail } from 'app/core/models/identity';
import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { NotificationService } from 'app/core/services/notification/notification.service';
import { EventService } from 'app/shared/services/event.service';
import {
  TeamSelectorStrategyService,
} from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let identityService: IdentityService;
  let notificationService: NotificationService;
  let candidateService: CandidateService;
  let breakpointObserver: BreakpointObserver;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        DateFnsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        DfTopbarModule.forRoot(),
        DfSidebarModule.forRoot(),
      ],
      providers: [
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
        { provide: NotificationService, useFactory: () => mock(NotificationService) },
        { provide: EventService, useFactory: () => mock(EventService) },
        { provide: CandidateService, useFactory: () => mock(CandidateService) },
        {
          provide: BreakpointObserver,
          useFactory: () => mock(BreakpointObserver),
        },
        EventService,
        TeamSelectorStrategyService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    identityService = TestBed.get(IdentityService);
    candidateService = TestBed.get(CandidateService);
    notificationService = TestBed.get(NotificationService);
    breakpointObserver = TestBed.get(BreakpointObserver);
    router = TestBed.get(Router);
    (router.events as Object) = cold('');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('[ngOnInit]', () => {
    it('should load the data on ngOnInit / manager', () => {
      const SAMPLE_TASKS = [
        { updated: 'sample', message: 'sample' },
        { updated: 'sample1', message: 'sample1' },
      ];
      const SAMPLE_USER: CurrentUserDetail = <CurrentUserDetail>{
        headline: 'sample',
        applications: {
          'MANAGER': [{
            identifier: 'HIRE'
          }]
        } as { [key: string]: App[] }
      };
      const SAMPLE_IS_MANAGER = true;
      const SAMPLE_IS_ADMIN = false;

      spyOn(breakpointObserver, 'observe').and.returnValue(of(
        {}).pipe(take(1))
      );
      spyOn(notificationService, 'getReadableTaskList').and.returnValue(
        of(SAMPLE_TASKS).pipe(take(1))
      );
      spyOn(identityService, 'getCurrentUserValue').and.returnValue(SAMPLE_USER);
      spyOn(identityService, 'currentUserIsManager').and.returnValue(
        of(SAMPLE_IS_MANAGER).pipe(take(1))
      );
      spyOn(identityService, 'currentUserIsAdmin').and.returnValue(
        of(SAMPLE_IS_ADMIN).pipe(take(1))
      );
      spyOn(candidateService, 'getCurrentApplication').and.returnValue(
        of({
          id: 1,
          applicationType: 'NATIVE',
          status: 'IN_PROGRESS',
          job: {
            id: 2,
          },
        }).pipe(take(1))
      );

      component.ngOnInit();

      expect(component.user).toBe(SAMPLE_USER);
      expect(component.isManager).toBe(SAMPLE_IS_MANAGER);
      expect(component.isAdmin).toBe(SAMPLE_IS_ADMIN);
      expect(component.topbarLinks[0]).toBe(SUPPORT_MENU_ITEM);
      expect(component.topbarLinks[1]).toBe(RESOURCES_MENU_ITEM);
      expect(component.topbarLinks[2]).toBe(PRIVACY_POLICY_MENU_ITEM);
      expect(
        component.sidebarLinks.indexOf(AVAILABLE_JOBS_MENU_ITEM)
      ).toBeGreaterThanOrEqual(0);
      expect(
        component.sidebarLinks.indexOf(SETTINGS_MENU_ITEM)
      ).toBeGreaterThanOrEqual(0);
      expect(
        component.sidebarLinks.indexOf(PROFILE_MENU_ITEM)
      ).toBeGreaterThanOrEqual(0);
    });

    it('should load the data on ngOnInit / not manager / in progress application', () => {
      const SAMPLE_TASKS = [
        { updated: 'sample', message: 'sample' },
        { updated: 'sample1', message: 'sample1' },
      ];
      const SAMPLE_USER: CurrentUserDetail = <CurrentUserDetail>{
        headline: 'sample',
        applications: {
          'CANDIDATE': [{
            identifier: 'HIRE'
          }]
        } as { [key: string]: App[] }
      };
      const SAMPLE_IS_MANAGER = false;
      const SAMPLE_IS_ADMIN = false;
      spyOn(breakpointObserver, 'observe').and.returnValue(
        of({}).pipe(take(1))
      );
      spyOn(notificationService, 'getReadableTaskList').and.returnValue(
        of(SAMPLE_TASKS).pipe(take(1))
      );
      spyOn(identityService, 'currentUserIsAdmin').and.returnValue(
        of(SAMPLE_IS_ADMIN).pipe(take(1))
      );
      spyOn(identityService, 'getCurrentUserValue').and.returnValue(SAMPLE_USER);
      spyOn(identityService, 'currentUserIsManager').and.returnValue(
        of(SAMPLE_IS_MANAGER).pipe(take(1))
      );
      spyOn(candidateService, 'getCurrentApplication').and.returnValue(of({
        id: 1,
        applicationType: 'NATIVE',
        status: 'IN_PROGRESS',
        job: {
          id: 2,
        },
      }).pipe(take(1))
      );

      component.ngOnInit();

      expect(component.user).toEqual(SAMPLE_USER);
      expect(component.isManager).toBe(SAMPLE_IS_MANAGER);
      expect(component.topbarLinks[0]).toBe(SUPPORT_MENU_ITEM);
      expect(component.topbarLinks[1]).toBe(RESOURCES_MENU_ITEM);
      expect(component.topbarLinks[2]).toBe(PRIVACY_POLICY_MENU_ITEM);
      expect(
        component.sidebarLinks.indexOf(APPLICATION_MENU_ITEM_CANCELLABLE)
      ).toBeGreaterThanOrEqual(0);
      expect(
        component.sidebarLinks.indexOf(SETTINGS_MENU_ITEM)
      ).toBeGreaterThanOrEqual(0);
      expect(
        component.sidebarLinks.indexOf(PROFILE_MENU_ITEM)
      ).toBeGreaterThanOrEqual(0);
    });

    it('should load the data on ngOnInit / not manager / accepted application', () => {
      const SAMPLE_TASKS = [
        { updated: 'sample', message: 'sample' },
        { updated: 'sample1', message: 'sample1' },
      ];
      const SAMPLE_USER: CurrentUserDetail = <CurrentUserDetail>{
        headline: 'sample',
        applications: {
          'CANDIDATE': [{
            identifier: 'HIRE'
          }]
        } as { [key: string]: App[] }
      };
      const SAMPLE_IS_MANAGER = false;
      const SAMPLE_IS_ADMIN = false;

      spyOn(breakpointObserver, 'observe').and.returnValue(
        of({}).pipe(take(1))
      );
      spyOn(notificationService, 'getReadableTaskList').and.returnValue(
        of(SAMPLE_TASKS).pipe(take(1))
      );
      spyOn(identityService, 'getCurrentUserValue').and.returnValue(SAMPLE_USER);
      spyOn(identityService, 'currentUserIsManager').and.returnValue(
        of(SAMPLE_IS_MANAGER).pipe(take(1))
      );
      spyOn(identityService, 'currentUserIsAdmin').and.returnValue(
        of(SAMPLE_IS_ADMIN).pipe(take(1))
      );
      spyOn(candidateService, 'getCurrentApplication').and.returnValue(of({
        id: 1,
        applicationType: 'NATIVE',
        status: 'ACCEPTED',
        job: {
          id: 2,
        },
      }));

      component.ngOnInit();
      expect(
        component.sidebarLinks.indexOf(APPLICATION_MENU_ITEM)
      ).toBeGreaterThanOrEqual(0);
    });
  });

  it('should change the sidebarOpen on onSidebarToggle', () => {
    component.sidebarOpen = false;

    component.onSidebarToggle();

    expect(component.sidebarOpen).toBeTruthy();

    component.onSidebarToggle();

    expect(component.sidebarOpen).toBeFalsy();
  });

  it('should retrieve team description successfully', () => {
    const selectedTeam = { name: 'Sample Team' };
    const selectedManager = { printableName: 'Selected Manager' };
    component.teamSelector = Object.assign({
      selectedTeam,
      selectedManager
    });
    const result = component.getTeamDescription();

    expect(result).toBe(`${selectedTeam.name} - ${selectedManager.printableName}`);
  });

  it('should perform the expected logout options', () => {
    const logoutSpy: jasmine.Spy = spyOn(identityService, 'logout');

    component.logout();

    expect(logoutSpy).toHaveBeenCalled();
  });

  it('should perform the expected destroy actions', () => {
    const nextSpy: jasmine.Spy = spyOn(component.destroy$, 'next');
    const completeSpy: jasmine.Spy = spyOn(component.destroy$, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should close the sidebar when a route is activated', () => {
    const SAMPLE_TASKS = [
      { updated: 'sample', message: 'sample' },
      { updated: 'sample1', message: 'sample1' },
    ];
    const SAMPLE_USER: CurrentUserDetail = <CurrentUserDetail>{
      headline: 'sample',
      applications: {
        'MANAGER': [{
          identifier: 'HIRE'
        }]
      } as { [key: string]: App[] }
    };
    const SAMPLE_IS_MANAGER = true;
    const SAMPLE_IS_ADMIN = false;
    spyOn(breakpointObserver, 'observe').and.returnValue(
      of({
        matches: true,
      }).pipe(take(1))
    );
    spyOn(notificationService, 'getReadableTaskList').and.returnValue(
      of(SAMPLE_TASKS).pipe(take(1))
    );
    spyOn(identityService, 'getCurrentUserValue').and.returnValue(SAMPLE_USER);
    spyOn(identityService, 'currentUserIsManager').and.returnValue(
      of(SAMPLE_IS_MANAGER).pipe(take(1))
    );
    spyOn(identityService, 'currentUserIsAdmin').and.returnValue(
      of(SAMPLE_IS_ADMIN).pipe(take(1))
    );
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(
      of({
        id: 1,
        applicationType: 'NATIVE',
        status: 'ACCEPTED',
        job: {
          id: 2,
        },
      }).pipe(take(1))
    );
    (router.events as Object) = cold('a', {
      a: new ActivationStart({} as ActivatedRouteSnapshot),
    });
    component.ngOnInit();
    expect(component.sidebar.mobileSidebarRevealed).toBe(false);
  });

  it('should close the sidebar when a route is activated', () => {
    const SAMPLE_TASKS = [
      { updated: 'sample', message: 'sample' },
      { updated: 'sample1', message: 'sample1' },
    ];
    const SAMPLE_USER: CurrentUserDetail = <CurrentUserDetail>{
      headline: 'sample',
      applications: {
        'MANAGER': [{
          identifier: 'HIRE'
        }]
      } as { [key: string]: App[] }
    };
    const SAMPLE_IS_MANAGER = true;
    const SAMPLE_IS_ADMIN = false;
    spyOn(breakpointObserver, 'observe').and.returnValue(
      of({
        matches: false,
      }).pipe(take(1))
    );
    spyOn(notificationService, 'getReadableTaskList').and.returnValue(
      of(SAMPLE_TASKS).pipe(take(1))
    );
    spyOn(identityService, 'getCurrentUserValue').and.returnValue(SAMPLE_USER);
    spyOn(identityService, 'currentUserIsManager').and.returnValue(
      of(SAMPLE_IS_MANAGER).pipe(take(1))
    );
    spyOn(identityService, 'currentUserIsAdmin').and.returnValue(
      of(SAMPLE_IS_ADMIN).pipe(take(1))
    );
    spyOn(candidateService, 'getCurrentApplication').and.returnValue(
      of({
        id: 1,
        applicationType: 'NATIVE',
        status: 'ACCEPTED',
        job: {
          id: 2,
        },
      }).pipe(take(1))
    );
    (router.events as Object) = cold('a', {
      a: new ActivationStart({} as ActivatedRouteSnapshot),
    });
    component.ngOnInit();
    expect(component.sidebar.mobileSidebarRevealed).toBe(false);
  });

  it('should disable team selector display when the visibility for it is disabled', () => {
    component.showTeamSelector = true;
    component.teamSelectorVisibilityChange(false);

    expect(component.showTeamSelector).toBe(false);
  });

  it('should keep team selector display when the visibility for it is enabled', () => {
    component.showTeamSelector = true;
    component.teamSelectorVisibilityChange(true);

    expect(component.showTeamSelector).toBe(true);
  });

  it('should toggle team selector when it is enabled', () => {
    component.teamSelector = Object.assign({ isEnabled: true });
    component.showTeamSelector = false;
    component.toggleTeamSelector();

    expect(component.showTeamSelector).toBe(true);
  });

  it('should not toggle team selector when it is not enabled', () => {
    component.teamSelector = Object.assign({ teamSelector: { isEnabled: false } });
    component.showTeamSelector = false;
    component.toggleTeamSelector();

    expect(component.showTeamSelector).toBe(false);
  });

  it('[getUserAndNotifications] should do nothing when no user available', () => {
    component.user = null;
    spyOn(notificationService, 'getReadableTaskList').and.returnValue(
      of({}).pipe(take(1))
    );
    component.getUserAndNotifications();
    expect(notificationService.getReadableTaskList).not.toHaveBeenCalled();
  });

});
