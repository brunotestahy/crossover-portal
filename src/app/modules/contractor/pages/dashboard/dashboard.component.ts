import {
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { DfModalService, DfModalSize, isNumber } from '@devfactory/ngx-df';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { combineLatest, filter, finalize, mergeMap, takeUntil } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { sprintf } from 'sprintf-js';

import * as AvatarTypes from 'app/core/constants/avatar-types';
import { CONTRACTOR_BUTTONS } from 'app/core/constants/contractor/dashboard/contractor-buttons';
import { MANAGER_BUTTONS } from 'app/core/constants/contractor/dashboard/manager-buttons';
import { isAllManagers } from 'app/core/constants/team-selector';
import { App } from 'app/core/models/app';
import { Assignment } from 'app/core/models/assignment';
import { Candidate } from 'app/core/models/candidate';
import { Company } from 'app/core/models/company';
import {
AppButton,
TeamTrend,
} from 'app/core/models/dashboard';
import { CurrentUserDetail } from 'app/core/models/identity';
import { WorkDiary, WorkDiaryLatestFilters } from 'app/core/models/logbook';
import { Manager } from 'app/core/models/manager';
import {
Team,
TeamActivitiesAverage,
TeamAverage,
TeamManagerGroup,
} from 'app/core/models/team';
import { TeamDashboard } from 'app/core/models/time-tracking';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import { TimetrackingService } from 'app/core/services/timetracking/timetracking.service';
import { isApiError } from 'app/core/type-guards/is-api-error';
import { SkypeModalComponent } from 'app/shared/components/skype-modal/skype-modal.component';
import { UserDashboardService } from 'app/shared/services/user-dashboard/user-dashboard.service';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject();

  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  @ViewChildren(SkypeModalComponent)
  public skypeTooltips: QueryList<SkypeModalComponent>;

  public teamTrend: TeamTrend[] = [];

  public workDiaries: WorkDiary[] = [];

  public error = '';

  public isLoading = false;
  public isAllDirectReports: boolean = true;
  public noManagersSelected: boolean = false;
  public isMyTeamSelected: boolean = false;

  public contractors: Assignment[] = [];
  public currentTeamGroup: TeamManagerGroup;
  public currentTeam = new BehaviorSubject<Team | null>(null);

  public managerMode = false;

  public managerButtons: AppButton[] = MANAGER_BUTTONS;
  public contractorButtons: AppButton[] = CONTRACTOR_BUTTONS;

  public availableButtons: AppButton[] = MANAGER_BUTTONS;

  public currentUser: CurrentUserDetail | null;
  public activityAverage: TeamAverage;
  public metricTarget: string;
  public metricAverage: number;
  public metricDescription: string;

  @ViewChild('workflowsWizardModal')
  public workflowsWizardModal: TemplateRef<{}>;

  public isWorkflowWidgetConfigured: boolean = false;
  public isCurrentUserCompanyAdminOrTeamOwner: boolean = false;

  constructor(
    private assignmentService: AssignmentService,
    private identityService: IdentityService,
    private dashboardService: UserDashboardService,
    private authTokenService: AuthTokenService,
    private productivityService: ProductivityService,
    private timeTrackingService: TimetrackingService,
    private router: Router,
    private modalService: DfModalService,
  ) {
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.isLoading = true;

    this.currentTeam
      .pipe(
        takeUntil(this.destroy$),
        filter(entry => !!entry),
      )
      .subscribe(team => {
        if (team && this.currentUser) {
          this.fetchTeamDashboardDataAsManager(
            this.currentTeamGroup.managerId === -1 ?
              (this.currentTeamGroup.team.teamOwner as Manager).id :
              this.currentUser.managerAvatar.id,
            team.id || undefined,
          );
        } else {
          this.isLoading = false;
        }
      });

    this.identityService
      .getTeamManagerGroupSelection()
      .pipe(
        combineLatest(this.identityService.getCurrentUserDetail()),
        finalize(() => this.isLoading = false),
      )
      .subscribe(
        ([teamManagerGroup, userDetail]) => {
          this.error = '';
          this.isLoading = true;
          this.isMyTeamSelected = false;
          this.currentUser = userDetail;

          this.currentTeamGroup = teamManagerGroup as TeamManagerGroup;

          this.identityService.hasAvatarType(this.currentUser, AvatarTypes.Manager) ?
            this.setManagerMode() : this.setContractorMode();
          if (teamManagerGroup) {
            this.isCurrentUserCompanyAdminOrTeamOwner = this.identityService.isCompanyAdminOrTeamOwner(this.currentUser, teamManagerGroup);
            this.isWorkflowWidgetConfigured = !!teamManagerGroup.team.workflowJiraProject;
            this.currentTeam.next(teamManagerGroup.team);
          } else {
            if (!this.managerMode && this.currentUser) {
              this.fetchTeamDashboardDataAsCandidate(this.currentUser.assignment.manager, this.currentUser.assignment.team.id);
            }
          }
        }, negativeResponse => {
          if (isApiError(negativeResponse)) {
            this.error = negativeResponse.error.text;
          } else {
            this.error = 'Error trying to load the current user.';
          }
        },
      );
  }

  public openWorkflowsWizard(): void {
    this.modalService.open(this.workflowsWizardModal, {
      size: DfModalSize.Large,
    });
  }

  public xAxisTickFormatter(value: Date): string {
    return format(value, 'MMM DD');
  }

  public yAxisTickFormatter(): string {
    return '';
  }

  public onPageScroll(): void {
    this.skypeTooltips.forEach(skypeTooltip => skypeTooltip.hide());
  }

  public goToWorkflows(): void {
    this.router.navigate(['/contractor/workflows']);
  }

  public navigateTo(button: AppButton): void {
    if (button.link) {
      this.router.navigate([button.link]);
    } else if (button.externalUrl) {
      window.open(button.externalUrl, '_blank');
    } else if (this.currentUser !== null && button.worksmartUrl) {
      window.open(sprintf(button.worksmartUrl, {
        env: 'qa',
        contractorId: this.currentUser.id,
        date: new Date().getTime(),
        token: this.authTokenService.getToken(),
      }), '_blank');
    }
  }

  public navigateToTeamMetrics(): void {
    if (this.managerMode && this.isMetricAverageNumber(this.metricAverage)) {
      this.router.navigate(['/contractor/team-metrics']);
    }
  }

  public getMetricTargetPercentage(): string {
    if (this.metricTarget === '1') {
      return 'no target';
    }
    return Math.round(this.metricAverage / Number(this.metricTarget) * 100).toString();
  }

  public getMetricAverage(): string {
    return this.metricAverage.toFixed(1);
  }

  public colorFn(dataKey: string): string {
    if (dataKey === 'metric') {
      return '#828886';
    }
    return '#247ab6';
  }

  public updateTeamTrend(event: TeamTrend[]): void {
    this.teamTrend = event;
  }

  public isMetricAverageNumber(metric: number): boolean {
    return isNumber(metric);
  }

  public hasActivitiAvg(activityAvg: TeamActivitiesAverage): boolean {
    return activityAvg.alignmentScoreAvg !== 0 ||
      activityAvg.focusScoreAvg !== 0 ||
      activityAvg.intensityScoreAvg !== 0 ||
      (!!activityAvg.groupsSummaryAvg && activityAvg.groupsSummaryAvg.length > 0) ||
      (!!activityAvg.overWeekPlannedActs && activityAvg.overWeekPlannedActs.length > 0);
  }

  private fetchTeamDashboardDataAsCandidate(manager: Manager, teamId: number): void {
    const weeksCount = '4';
    forkJoin(
      this.assignmentService.getTeamAssignments(
        manager.id.toString(),
        teamId.toString(),
        format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'YYYY-MM-DD'),
        format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'YYYY-MM-DD'),
      ),
      this.productivityService.getProductivityAverage(
        'CANDIDATE',
        manager.id.toString(),
        teamId.toString(),
        format(startOfWeek(new Date()), 'YYYY-MM-DD'),
        weeksCount,
      ),
    ).pipe(finalize(() => this.isLoading = false))
      .subscribe(
        ([teamDashboard, teamAverage]) => {
          if (this.isMyTeamSelected) {
            this.noManagersSelected = !!teamAverage &&
              !this.hasActivitiAvg(teamAverage.activitiAvg as TeamActivitiesAverage);
          }
          this.isAllDirectReports = false;
          this.contractors = teamDashboard;
          this.contractors = _.sortBy(this.contractors, (assignment: Assignment) =>
            assignment.candidate.printableName);
          this.activityAverage = teamAverage;
          this.fetchContractorStatus(manager.id, teamId.toString());
        },
        negativeResponse => {
          if (isApiError(negativeResponse)) {
            this.error = negativeResponse.error.text;
          } else {
            this.error = 'Error trying to load the dashboard data.';
          }
        });
  }

  private fetchTeamDashboardDataAsManager(managerId: number, teamId?: number): void {
    this.dashboardService.getTeamDashboard(true, managerId, teamId || undefined)
      .pipe(
        finalize(() => this.isLoading = false),
        mergeMap((teamDashboard: TeamDashboard) => {
          this.isAllDirectReports = !(!!teamDashboard.productivityAverage);
          this.noManagersSelected = !!teamDashboard.productivityAverage &&
          !this.hasActivitiAvg(teamDashboard.productivityAverage[0].activitiAvg as TeamActivitiesAverage);
          if (teamDashboard.teams.length > 1 && !this.isAllDirectReports) {
            return this.dashboardService
              .getTeamDashboard(true, undefined, teamId || undefined) as Observable<TeamDashboard>;
          }
          return of(teamDashboard) as Observable<TeamDashboard>;
        }),
      )
      .subscribe(
        (teamDashboard: TeamDashboard) => {
          this.contractors = teamDashboard.assignments as Assignment[];
          this.contractors = _.sortBy(this.contractors, (assignment: Assignment) =>
            assignment.selection.marketplaceMember.application.candidate.printableName);
          this.contractors.forEach(contractor => {
            contractor.candidate = contractor.selection.marketplaceMember.application.candidate as Candidate;
          });
          if (!this.isAllDirectReports) {
            this.activityAverage = teamDashboard.productivityAverage[0];
          }
          this.fetchContractorStatus(managerId);
        },
        negativeResponse => {
          if (isApiError(negativeResponse)) {
            if (negativeResponse.error.httpStatus === 403) {
              this.isMyTeamSelected = true;
              this.setManagerMode();
              this.fetchTeamDashboardDataAsCandidate((this.currentUser as CurrentUserDetail).assignment.manager, teamId as number);
            } else {
              this.error = negativeResponse.error.text;
            }
          } else {
            this.error = 'Error trying to load the dashboard data.';
          }
        });
  }

  private fetchContractorStatus(managerId: number, contractorTeamId?: string): void {
    const team = this.currentTeam.getValue() as Team;

    const params: WorkDiaryLatestFilters = {
      fullTeam: 'false',
      managerId: managerId.toString(),
      teamId: contractorTeamId || (team.id ? team.id.toString() : ''),
    };

    if (!params.teamId) {
      delete params.teamId;
    }

    this.timeTrackingService
      .getLatestWorkDiaries(params)
      .subscribe(
        workDiaries => this.workDiaries = workDiaries,
        () => this.error = 'An unknown error happened while retrieving work diaries data.',
      );
  }

  private setManagerMode(): void {
    if (this.currentUser) {
      this.loadManagerAppButtons();
      this.managerMode = true;
      this.checkTeamSettingsButton();
      this.checkPollsButton();
      this.availableButtons = this.managerButtons;
    }
  }

  private setContractorMode(): void {
    this.managerMode = false;
    this.availableButtons = this.contractorButtons;
  }

  private loadManagerAppButtons(): void {
    if (this.currentTeamGroup) {
      let apps: App[] = [];
      const isAdmin: boolean = (this.currentUser as CurrentUserDetail).avatarTypes.some(avatar => avatar === AvatarTypes.Admin);
      apps = (this.currentUser as CurrentUserDetail).applications[isAdmin ? AvatarTypes.Admin : AvatarTypes.Manager];

      this.managerButtons = isAllManagers(this.currentTeamGroup.managerId)
          && !this.identityService.isUserOwnerOfTeam(this.currentUser, this.currentTeamGroup)
          && this.isMyTeamSelected
        ? CONTRACTOR_BUTTONS
        : MANAGER_BUTTONS.filter(
          button =>
            apps.some(app => app.identifier === button.identifier && !(app.appUserType === 'INDIVIDUAL')),
        );
    }
  }

  private checkTeamSettingsButton(): void {
    if (this.currentTeamGroup && this.currentUser) {
      const condition1: boolean = !!this.currentTeamGroup.team.teamOwner;
      const isAdmin: boolean = this.currentUser.avatarTypes.some(avatar => avatar === AvatarTypes.Admin);
      const condition2: boolean = !!this.currentTeamGroup.team.teamOwner
        && this.currentTeamGroup.team.teamOwner.userId !== this.currentUser.id
        && (this.currentTeamGroup.team.teamOwner.type !== AvatarTypes.CompanyAdmin ||
          (isAdmin ?
          (this.currentTeamGroup.team.company as Company).id !== (this.currentUser.managerAvatar.company as Company).id :
          (this.currentTeamGroup.team.company as Company).id === (this.currentUser.managerAvatar.company as Company).id));

      if (condition2 || (!condition1 && !isAdmin)) {
        this.managerButtons = this.managerButtons.filter(button => !(button.identifier === 'TEAM_SETTINGS'));
      }
    }
  }

  private checkPollsButton(): void {
    if (this.currentTeamGroup && this.currentUser) {
      const condition: boolean = this.currentUser.appFeatures.some(app => app.appFeature === 'POLLS');

      if (!condition) {
        this.managerButtons = this.managerButtons.filter(button => !(button.identifier === 'TEAM_POLLS'));
      }
    }
  }
}
