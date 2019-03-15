import { Component, HostBinding, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DfModalService } from '@devfactory/ngx-df';
import {
  addDays,
  addMonths,
  addWeeks,
  eachDay,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isFriday,
  isMonday,
  isSameDay,
  isWeekend,
  parse,
  startOfDay,
  startOfMonth,
  startOfToday,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { merge } from 'rxjs/observable/merge';
import { filter, finalize, takeUntil, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as AvatarTypes from 'app/core/constants/avatar-types';
import * as PeriodConstants from 'app/core/constants/period';
import * as TeamSelectorConstants from 'app/core/constants/team-selector';
import { ALL_DIRECT_REPORT } from 'app/core/constants/team-selector';
import { TeamFeature } from 'app/core/models/app';
import { Assignment } from 'app/core/models/assignment';
import { CurrentUserDetail } from 'app/core/models/identity';
import {
  BlocksStreak,
  CheckIn,
  ProductivitySummary,
  TeamMember,
} from 'app/core/models/productivity';
import { Team } from 'app/core/models/team/team.model';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import { CheckInChatsMemberComponent } from 'app/modules/contractor/components/check-in-chats/member/check-in-chats-member.component';
import { sortBy } from 'app/utils/sorting';

@Component({
  selector: 'app-check-in-chats',
  templateUrl: './check-in-chats.component.html',
  styleUrls: ['./check-in-chats.component.scss'],
})
export class CheckInChatsComponent implements OnInit, OnDestroy {

  private static readonly MONTH_WEEKSCOUNT = 5;
  private static readonly DAYS_DIFF_IF_WEEKEND = 3;
  private static readonly TEAM_FEATURE_APP = 'TEAM_CHECKINS';
  private static readonly APP_NOT_AVAILABLE_MSG =
    'Check-in Chats are not available for All Direct Reports, please change team from team selector.';
  private static readonly ASSIGNMENT_ACTIVE_STATUS = 'ACTIVE';


  private today = startOfToday();
  private startOfThisWeek = startOfWeek(new Date(), {weekStartsOn: 1});
  private startOfThisMonth = startOfMonth(new Date());
  private destroy$ = new Subject();

  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public assignments: Assignment[];
  public blocksStreaks: BlocksStreak[];
  public error = '';
  public isLoading = false;
  public periodMode: string;
  public managerMode = false;
  public toggleGroupItems: string[] = [];
  public team: Team;
  public managerId: number | undefined;
  public checkins: CheckIn[];
  public dateControlDaily = new FormControl(this.today);
  public dateControlWeekly = new FormControl(this.startOfThisWeek);
  public dateControlMonthly = new FormControl(this.startOfThisMonth);
  public teamMember = new FormControl();
  public currentUserDetail: CurrentUserDetail | null;
  public startDate: Date;
  public teamMembers: TeamMember[] = [];
  public summary: ProductivitySummary;
  public enableCheckInsToggle = false;
  public teamFeature: TeamFeature;
  public periodConstants = PeriodConstants;
  public thisMonth = startOfMonth(new Date());
  public isTeamOwner: boolean = false;
  public isAppAvailable: boolean = true;

  @ViewChild('settingsModal')
  public settingsModal: TemplateRef<{}>;

  @ViewChild(CheckInChatsMemberComponent)
  public checkInChatsMember: CheckInChatsMemberComponent;

  constructor(
    private productivityService: ProductivityService,
    private identityService: IdentityService,
    private assignmentService: AssignmentService,
    private modalService: DfModalService
  ) { }

  public onPageScroll(): void {
    if (this.checkInChatsMember) {
      this.checkInChatsMember.hideSkypeTooltip();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.isLoading = true;
    this.currentUserDetail = this.identityService.getCurrentUserValue();
    if (this.identityService.hasAvatarType(this.currentUserDetail, AvatarTypes.Manager)) {
      this.setManagerMode();
    } else {
      this.setContractorMode();
    }
    this.teamMember.setValue('');
    this.onFormValuesChange();

    if (!this.managerMode && this.currentUserDetail) {
      this.team = this.currentUserDetail.assignment.team;
      this.managerId = this.currentUserDetail.assignment.manager.id;
      this.getAssignmentData();
    } else {
      this.getTeamAndManagerSelection();
    }
  }

  public onToggleChange(event: string): void {
    this.isLoading = true;
    this.periodMode = event;
    if (this.currentUserDetail && this.summary) {
      this.onParamChange();
    }
  }

  public getDailyFormat(date: Date): string {
    const day = `${PeriodConstants.DAYS[date.getDay()]}`;
    return `${day}, ${PeriodConstants.YEAR_MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  public getWeeklyFormat(date: Date): string {
    const start = addDays(startOfWeek(date), 1);
    const end = addDays(endOfWeek(date), 1);

    return `${format(start, 'MMM DD')} - ${format(end, 'MMM DD, YYYY')}`;
  }

  public getMonthlyFormat(date: Date): string {
    return `${PeriodConstants.YEAR_MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
  }

  public previousDay(): void {
    const daysDiff = isMonday(this.dateControlDaily.value) ? CheckInChatsComponent.DAYS_DIFF_IF_WEEKEND : 1;
    this.dateControlDaily.setValue(subDays(this.dateControlDaily.value, daysDiff));
  }

  public nextDay(): void {
    const daysDiff = isFriday(this.dateControlDaily.value) ? CheckInChatsComponent.DAYS_DIFF_IF_WEEKEND : 1;
    this.dateControlDaily.setValue(addDays(this.dateControlDaily.value, daysDiff));
  }

  public previousWeek(): void {
    this.dateControlWeekly.setValue(subWeeks(this.dateControlWeekly.value, 1));
  }

  public nextWeek(): void {
    this.dateControlWeekly.setValue(addWeeks(this.dateControlWeekly.value, 1));
  }

  public previousMonth(): void {
    this.dateControlMonthly.setValue(subMonths(this.dateControlMonthly.value, 1));
  }

  public nextMonth(): void {
    this.dateControlMonthly.setValue(addMonths(this.dateControlMonthly.value, 1));
  }

  public fetchYesterday(): void {
    const daysDiff = isMonday(this.today) ? CheckInChatsComponent.DAYS_DIFF_IF_WEEKEND : 1;
    this.dateControlDaily.setValue(subDays(this.today, daysDiff));
  }

  public fetchToday(): void {
    this.dateControlDaily.setValue(this.today);
  }

  public fetchLastWeek(): void {
    this.dateControlWeekly.setValue(subWeeks(this.startOfThisWeek, 1));
  }

  public fetchThisWeek(): void {
    this.dateControlWeekly.setValue(this.startOfThisWeek);
  }

  public fetchLastMonth(): void {
    this.dateControlMonthly.setValue(subMonths(this.startOfThisMonth, 1));
  }

  public fetchThisMonth(): void {
    this.dateControlMonthly.setValue(this.startOfThisMonth);
  }

  public openSettings(): void {
    this.modalService.open(this.settingsModal);
  }

  public isTodayActive(): boolean {
    return isSameDay(this.dateControlDaily.value, this.today);
  }

  public isYesterdayActive(): boolean {
    return isSameDay(this.dateControlDaily.value, subDays(this.today, 1));
  }

  public isThisWeekActive(): boolean {
    return isSameDay(this.dateControlWeekly.value, this.startOfThisWeek);
  }

  public isLastWeekActive(): boolean {
    return isSameDay(this.dateControlWeekly.value, subWeeks(this.startOfThisWeek, 1));
  }

  public isThisMonthActive(): boolean {
    return isSameDay(this.dateControlMonthly.value, this.startOfThisMonth);
  }

  public isLastMonthActive(): boolean {
    return isSameDay(this.dateControlMonthly.value, subMonths(this.startOfThisMonth, 1));
  }

  public updateCheckinTeamFeature(close: Function): void {
    close();
    const currentTeamFeature: TeamFeature = {
      enabled: this.enableCheckInsToggle,
      links: [],
      teamFeature: CheckInChatsComponent.TEAM_FEATURE_APP,
    };
    this.productivityService.toggleCheckinTeamFeature(this.team.id.toString(), currentTeamFeature)
    .subscribe(() => {},
      () => this.error = 'Error updating check-in team feature.');
  }

  public reloadComponents(): void {
    this.isLoading = true;
    this.onParamChange();
  }

  private onFormValuesChange(): void {
    merge(
      this.dateControlDaily.valueChanges,
      this.dateControlWeekly.valueChanges,
      this.dateControlMonthly.valueChanges,
      this.teamMember.valueChanges
    ).subscribe(() => this.reloadComponents());
  }

  private getTeamAndManagerSelection(): void {
    this.identityService.getTeamManagerGroupSelection()
    .pipe(filter((selectedTeamManagerGroup) => selectedTeamManagerGroup !== null))
    .pipe(tap((selectedTeamManagerGroup) => {
      this.isLoading = true;
      this.teamMember.setValue('', { emitEvent: false});
      /* istanbul ignore else */
      if (selectedTeamManagerGroup !== null) {
        this.team = selectedTeamManagerGroup.team;
        this.managerId = selectedTeamManagerGroup.managerId ? selectedTeamManagerGroup.managerId : undefined;
        this.isAppAvailable = true;
        this.error = '';
        if (this.team.name === ALL_DIRECT_REPORT) {
          this.isAppAvailable = false;
          this.error = CheckInChatsComponent.APP_NOT_AVAILABLE_MSG;
        }
      }
    }))
    .pipe(filter(() => this.isAppAvailable))
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.setUserModeAndGetData();
    }, () => this.error = 'Error loading selected team and manager.');
  }

  private setUserModeAndGetData(): void {
    // Manager has selected his team and is shown as contractor
    if (this.team && this.currentUserDetail && this.currentUserDetail.assignment.team.id === this.team.id) {
      this.setContractorMode();
      this.managerId = this.currentUserDetail.assignment.manager.id;
      this.getAssignmentData();
    } else {
      this.setManagerMode();
      this.setupManagerData();
    }
  }

  private setupManagerData(): void {
    if (this.managerId === TeamSelectorConstants.ALL_MANAGERS_ID) {
      this.managerId = undefined;
    }
    this.isTeamOwner =
      this.team.teamOwner && this.currentUserDetail ? this.currentUserDetail.managerAvatar.id === this.team.teamOwner.id : false;
    this.getAssignmentData();
  }

  private getAssignmentData(): void {
    combineLatest(
      this.getAssignments(),
      this.productivityService.getSummary(
        CheckInChatsComponent.MONTH_WEEKSCOUNT,
        this.team.id.toString(),
        this.managerId
      ),
      this.productivityService.getTeamFeature(this.team.id.toString())
    ).subscribe(([assignments, productivitySummary, teamFeature]) => {
      this.teamMembers = assignments.map(assignment => {
        const member = {} as TeamMember;
        member.id = assignment.candidate.userId || -1;
        member.fullName = assignment.candidate.printableName;
        member.assignment = assignment;
        return member;
      });
      this.teamMembers.sort(sortBy('fullName'));
      this.assignments = assignments;
      this.summary = productivitySummary;
      this.teamFeature = teamFeature;
      this.enableCheckInsToggle = this.teamFeature ? this.teamFeature.enabled : false;
      this.onParamChange();
    });
  }

  private getAssignments(): Observable<Assignment[]> {
    if (this.managerMode) {
      return this.assignmentService.getTeamAssignmentsAsManager(
        !this.managerId,
        this.managerId,
        this.team.id,
        CheckInChatsComponent.ASSIGNMENT_ACTIVE_STATUS
      );
    }
    return this.assignmentService.getTeamAssignmentsAsCandidate();
  }

  private onParamChange(): void {
    if (this.periodMode === PeriodConstants.DAILY) {
      this.startDate = this.dateControlDaily.value;
      this.getCheckinsData(this.startDate, this.startDate);
    } else if (this.periodMode === PeriodConstants.WEEKLY) {
      this.startDate = startOfWeek(this.dateControlWeekly.value, {weekStartsOn: 1});
      this.getCheckinsData(this.startDate, addDays(endOfWeek(this.startDate), 1));
    } else if (this.periodMode === PeriodConstants.MONTHLY) {
      this.startDate = startOfMonth(this.dateControlMonthly.value);
      this.getCheckinsData(this.startDate, endOfMonth(this.startDate));
    }
  }

  private getCheckinsData(start: Date, end: Date): void {
    /* istanbul ignore else */
    if (this.managerId !== TeamSelectorConstants.ALL_MANAGERS_ID) {
      const rangeStart = this.formatDate(start);
      const rangeEnd = this.formatDate(end);
      combineLatest(
        this.getCheckins(rangeStart, rangeEnd),
        this.productivityService.getBlocksStreaks(this.team.id.toString(), this.managerId)
      )
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(([checkins, blocksStreaks]) => {
        this.checkins = checkins.concat(...this.addNotDoneCheckins(checkins, start, end));
        this.blocksStreaks = blocksStreaks;
      }, () => {
        this.blocksStreaks = [];
      });
    }
  }

  private getCheckins(rangeStart: string, rangeEnd: string): Observable<CheckIn[]> {
    if (this.managerMode) {
      return this.productivityService.getManagerCheckIns(rangeStart, rangeEnd, this.managerId, this.team.id);
    }
    return this.productivityService.getCandidateCheckIns(rangeStart, rangeEnd);
  }

  private addNotDoneCheckins(checkins: CheckIn[], start: Date, end: Date): CheckIn[] {
    const allDaysInRange = eachDay(start, end).filter(day => !isWeekend(day) && !isAfter(day, this.today));
    const notDoneCheckins: CheckIn[] = [];
    this.teamMembers.forEach(teamMember => {
      allDaysInRange.forEach(weekDay => {
        const worked = checkins.find(checkin =>
          isSameDay(weekDay, parse(checkin.date)) &&
          checkin.assignmentId === teamMember.assignment.id
        );
        if (!worked && !isBefore(weekDay, startOfDay(teamMember.assignment.effectiveDateBegin))) {
          notDoneCheckins.push({
            id: null,
            date: format(weekDay, 'YYYY-MM-DD'),
            status: 'NOT_DONE',
            unblocked: true,
            assignmentId: teamMember.assignment.id,
            blockageStatus: 'Unknown',
          });
        }
      });
    });
    return notDoneCheckins;
  }

  private formatDate(start: Date): string {
    return `${format(start, 'YYYY-MM-DD')}`;
  }

  private setManagerMode(): void {
    this.managerMode = true;
    this.toggleGroupItems = [PeriodConstants.DAILY, PeriodConstants.WEEKLY, PeriodConstants.MONTHLY];
    this.periodMode = PeriodConstants.DAILY;
  }

  private setContractorMode(): void {
    this.managerMode = false;
    this.toggleGroupItems = [PeriodConstants.WEEKLY, PeriodConstants.MONTHLY];
    this.periodMode = PeriodConstants.WEEKLY;
  }
}
