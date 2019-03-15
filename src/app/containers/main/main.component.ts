import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  BREAKPOINT_CONFIG,
  DfSidebar,
  DfSidebarItemNodes,
} from '@devfactory/ngx-df';
import * as _ from 'lodash';
import { combineLatest, map, take, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as AvatarTypes from 'app/core/constants/avatar-types';
import {
  APPLICATION_MENU_ITEM,
  APPLICATION_MENU_ITEM_CANCELLABLE,
  AVAILABLE_JOBS_MENU_ITEM,
  CONTRACTOR_MENU_ITEM,
  ENFORCER_MENU_ITEM,
  PRIVACY_POLICY_MENU_ITEM,
  PROFILE_MENU_ITEM,
  REPORTS_ADMIN_MENU_ITEM,
  REPORTS_MANAGER_MENU_ITEM,
  RESOURCES_MENU_ITEM,
  SETTINGS_MENU_ITEM,
  SUPPORT_MENU_ITEM,
} from 'app/core/constants/menu/items';
import { App } from 'app/core/models/app';
import { JobApplication } from 'app/core/models/application';
import { EventWithAnchorTarget } from 'app/core/models/browser';
import { CurrentUserDetail } from 'app/core/models/identity';
import { ReadableTask } from 'app/core/models/task';
import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { NotificationService } from 'app/core/services/notification/notification.service';
import { TeamSelectorComponent } from 'app/shared/components/team-selector/team-selector.component';
import { EventService } from 'app/shared/services/event.service';
import {
  TeamSelectorStrategyService,
} from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  public readonly classes = 'w-100 d-flex flex-column flex-grow';

  public isResponsive: boolean;
  public sidebarOpen = false;
  public user: CurrentUserDetail | null;
  public tasks$: Observable<ReadableTask[]>;
  public isManager = false;
  public isAdmin = false;
  public showTeamSelector = false;

  public topbarLinks: DfSidebarItemNodes[] = [
    SUPPORT_MENU_ITEM,
    RESOURCES_MENU_ITEM,
    PRIVACY_POLICY_MENU_ITEM,
  ];

  public sidebarLinks: DfSidebarItemNodes[] = [];

  @ViewChild(DfSidebar)
  public sidebar: DfSidebar;

  @ViewChild('teamSelectorEntry')
  public teamSelector: TeamSelectorComponent;

  public destroy$ = new Subject();

  constructor(
    private identityService: IdentityService,
    private notificationService: NotificationService,
    private candidateService: CandidateService,
    private breakpointObserver: BreakpointObserver,
    private eventService: EventService,
    private teamSelectorStrategyService: TeamSelectorStrategyService,
    private router: Router
  ) {
  }

  public ngOnInit(): void {
    this.eventService.refreshNotifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getUserAndNotifications());
    this.router.events.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.closeSidebar());

    this.breakpointObserver
      .observe(BREAKPOINT_CONFIG)
      .pipe(map(match => match.matches), takeUntil(this.destroy$))
      .subscribe(isResponsive => {
        this.isResponsive = isResponsive;
      });

    this.user = this.identityService.getCurrentUserValue();
    this.getUserAndNotifications();


    this.candidateService.getCurrentApplication()
      .pipe(
        combineLatest(
          this.identityService.currentUserIsManager(),
          this.identityService.currentUserIsAdmin(),
        ),
        take(1)
      )
      .subscribe(([application, isManager, isAdmin]) => {
        this.isManager = isManager;
        this.isAdmin = isAdmin;

        const sidebarLinks = ([] as DfSidebarItemNodes[]).concat(...this.sidebarLinks);
        const topbarLinks = ([] as DfSidebarItemNodes[]).concat(...this.topbarLinks);
        if (isAdmin) {
          sidebarLinks.push(REPORTS_ADMIN_MENU_ITEM);
        } else if (isManager) {
          topbarLinks.push(
            SUPPORT_MENU_ITEM,
            RESOURCES_MENU_ITEM,
            PRIVACY_POLICY_MENU_ITEM,
          );
          sidebarLinks.push(REPORTS_MANAGER_MENU_ITEM);
        } else {
          topbarLinks.push(
            SUPPORT_MENU_ITEM,
            RESOURCES_MENU_ITEM,
            PRIVACY_POLICY_MENU_ITEM,
          );
          sidebarLinks.push(PROFILE_MENU_ITEM);
          this.addApplicationSubmenu(sidebarLinks, application);
        }
        sidebarLinks.push(
          SUPPORT_MENU_ITEM,
          RESOURCES_MENU_ITEM,
          PRIVACY_POLICY_MENU_ITEM,
          ENFORCER_MENU_ITEM,
          PROFILE_MENU_ITEM,
        );
        sidebarLinks.push(SETTINGS_MENU_ITEM);
        sidebarLinks.push(this.getUserApps());
        sidebarLinks.push(AVAILABLE_JOBS_MENU_ITEM);
        sidebarLinks.sort((a, b) => {
          if (a.label < b.label) {
            return -1;
          }
          if (a.label > b.label) {
            return 1;
          }
          return 0;
        });
        this.sidebarLinks = sidebarLinks;
        this.topbarLinks = topbarLinks;
      });

    this.teamSelectorStrategyService.isTeamSelectorVisible
      .subscribe(state => this.showTeamSelector = state);
  }

  public teamSelectorVisibilityChange(value: boolean): void {
    if (value === false) {
      this.showTeamSelector = false;
    }
  }

  public getUserAndNotifications(): void {
    if (this.user) {
      this.tasks$ = this.notificationService.getReadableTaskList().pipe(
        map(list => list.slice()
        .filter(entry => entry.updated)
        .sort(
          (previous, current) => current.updated.localeCompare(previous.updated)
        ))
      );
    }
  }

  public checkNavigation(e: EventWithAnchorTarget): void {
    if (e.target.tagName.toLowerCase() === 'a') {
      e.preventDefault();
      this.router.navigate([e.target.pathname]);
    }
  }

  public onSidebarToggle(): void {
    this.sidebar.mobileSidebarRevealed = !this.sidebar.mobileSidebarRevealed;
    this.sidebarOpen = this.sidebar.mobileSidebarRevealed;
    this.teamSelectorStrategyService.menuState.next(this.sidebarOpen);

    if (this.isResponsive && this.showTeamSelector) {
      this.toggleTeamSelector();
    }
  }

  public getTeamDescription(): string {
    return _.get(this.teamSelector, 'selectedTeam.name', '') + ' - ' +
    _.get(this.teamSelector, 'selectedManager.printableName', 'All Managers');
  }

  public toggleTeamSelector(): void {
    if (this.teamSelector.isEnabled) {
      this.showTeamSelector = !this.showTeamSelector;
    }
  }

  public logout(): void {
    this.identityService.logout();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private closeSidebar(): void {
    if (this.isResponsive) {
      this.sidebar.mobileSidebarRevealed = false;
      this.sidebarOpen = false;
    }
  }

  private addApplicationSubmenu(sidebarLinks: DfSidebarItemNodes[], application: JobApplication): void {
    if (application && application.status === 'IN_PROGRESS') {
      sidebarLinks.push(APPLICATION_MENU_ITEM_CANCELLABLE);
    } else {
      sidebarLinks.push(APPLICATION_MENU_ITEM);
    }
  }

  private getUserApps(): DfSidebarItemNodes {
    const contractorMenu = Object.assign(CONTRACTOR_MENU_ITEM, {});
    const avatar = this.isManager ? AvatarTypes.Manager : AvatarTypes.Candidate;
    const apps = _.get(this.user, `applications.${avatar}`, []) as App[];
    const nodes: Array<DfSidebarItemNodes> = [];
    apps.forEach(app => {
      const availableApp =
        contractorMenu.nodes ? contractorMenu.nodes.find(node => node.auxInfo.identifier === app.identifier): undefined;
      if (availableApp) {
        nodes.push(availableApp);
      }
    });
    if (contractorMenu.nodes) {
      nodes.push(...contractorMenu.nodes.filter(node => node.auxInfo.identifier === AvatarTypes.AllAvatars));
    }
    contractorMenu.nodes = nodes;
    return contractorMenu;
  }
}
