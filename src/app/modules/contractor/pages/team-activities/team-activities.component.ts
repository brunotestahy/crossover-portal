import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DfExportXLSXService, DfGrid, DfGroupToggle, DfGroupToggleItem, DfModalService } from '@devfactory/ngx-df';
import {
  addDays,
  addMinutes,
  addWeeks,
  endOfWeek,
  format,
  startOfDay,
  startOfToday,
  startOfWeek,
  subDays,
  subWeeks,
} from 'date-fns';
import * as _ from 'lodash';
import * as moment from 'moment';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { combineLatest, finalize, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as PeriodConstants from 'app/core/constants/period';
import * as TeamConstants from 'app/core/constants/team-selector';
import { Assignment } from 'app/core/models/assignment';
import { Candidate } from 'app/core/models/candidate';
import { CurrentUserDetail } from 'app/core/models/identity';
import { Manager } from 'app/core/models/manager';
import {
  Activity,
  ActivityRecord,
  AdvancedGroup,
  DaySlot,
  PercentageChartRow,
  PlannedProductivityGroup,
  ProductivityGroup,
  Section,
  TimeBarStructure,
  TimeChartRow,
  TimeSlot,
} from 'app/core/models/productivity';
import { Team } from 'app/core/models/team';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { ProductivityService } from 'app/core/services/productivity/productivity.service';
import { isApiError } from 'app/core/type-guards/is-api-error';

@Component({
  selector: 'app-team-activities',
  templateUrl: './team-activities.component.html',
  styleUrls: ['./team-activities.component.scss'],
})
export class TeamActivitiesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  private today = startOfToday();
  private startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });

  @ViewChild('teamPercentageTableGrid')
  public teamPercentageTableGrid: DfGrid;
  @ViewChild('teamTimeTableGrid')
  public teamTimeTableGrid: DfGrid;
  @ViewChild('percentageTimeToggle')
  public percentageTimeToggle: DfGroupToggle;
  @ViewChild('periodToggle')
  public periodToggle: DfGroupToggle;
  @ViewChild('profileModal')
  public profileModal: TemplateRef<{}>;

  public readonly PERCENTAGE = 'Percentage';
  public readonly TIME = 'Time';
  public readonly DAILY = 'Daily';
  public readonly DAY = 'Day';
  public readonly WEEK = 'Week';
  public readonly WEEKLY = 'Weekly';
  public readonly TABLE = 'Table';
  public readonly CHART = 'Chart';
  public readonly CONTRACTOR = 'CONTRACTOR';
  public readonly MANAGER = 'MANAGER';

  public readonly percentageTimeItems = [this.PERCENTAGE, this.TIME];
  public readonly viewModeItems: DfGroupToggleItem[] = [
    {
      text: '',
      id: this.CHART,
      icon: 'fa fa-bar-chart fa-lg',
    },
    {
      text: '',
      id: this.TABLE,
      icon: 'fa fa-table fa-lg',
    },
  ];
  public readonly periodItems = [this.DAILY, this.WEEKLY];
  public readonly SUMMARY = 'Summary';

  public error: string;
  public isAllDirectReports: boolean = false;
  public dailyActivities: ProductivityGroup[];
  public groups: ProductivityGroup[];
  public plannedTimeSlots = [] as TimeSlot[];
  public timeSlotsGrid: TimeBarStructure[] = [];
  public timeSlotsHeaders: string[] = [];
  public timeSlotsPerContractor = [] as Array<{ timeSlots: TimeSlot[]; }>;
  public periodMode: typeof PeriodConstants.DAILY | typeof PeriodConstants.WEEKLY = PeriodConstants.WEEKLY;
  public percentageTimeMode: typeof PeriodConstants.PERCENTAGE | typeof PeriodConstants.TIME = this.PERCENTAGE;
  public viewMode = this.viewModeItems[0];
  public dateControlDaily = new FormControl(this.today);
  public dateControlWeekly = new FormControl(this.startOfThisWeek);
  public teamTimeActivity: ActivityRecord[] = [];
  public teamPercentageActivity: ActivityRecord[] = [];
  public teamChartPercentageActivity: ActivityRecord[] = [];
  public teamChartPercentageXSLX: PercentageChartRow[] = [];
  public teamChartTimeActivity: ActivityRecord[] = [];
  public teamChartTimeXLSX: TimeChartRow[] = [];
  public isLoading = false;
  public teamActivities: Activity[] = [];
  public contractors: Partial<Assignment>[] = [];
  public currentUser: CurrentUserDetail;
  public plannedSections: Partial<Section>[];
  public dailyTimeControl = new FormControl(this.MANAGER);
  public managerOffset = 6;
  public currentUserAssignmentId: number;
  public currentUserManager: Manager;
  public currentUserTeamId: number;
  public currentContractor: CurrentUserDetail;
  public currentManagerId: number;
  public currentTeam: Team;
  public updateActivitiesBtn = {
    frequency: 10,
    lastRefreshDate: moment(),
    isDisabled: false,
    observableTimer: new Observable<void>(),
  };

  constructor(
    private exportService: DfExportXLSXService,
    private identityService: IdentityService,
    private productivityService: ProductivityService,
    private assignmentService: AssignmentService,
    private modalService: DfModalService,
  ) {
  }

  public getTooltipPlacement(sections: Section[], index: number): string {
    const hourMinutes = 60;
    const workdayInHours = 8;
    const weekDays = 5;
    const dailyTotalMinutes = hourMinutes * workdayInHours;
    const weeklyTotalMinutes = dailyTotalMinutes * weekDays;
    let totalSpentTime = 0;
    for (let j = 0; j < index; j++) {
      const section = sections[j];
      if (section.spentTime) {
        totalSpentTime += section.spentTime;
      }
    }
    const percentage = Math.round(totalSpentTime / (this.isDailyPeriod ? dailyTotalMinutes : weeklyTotalMinutes) * 100);
    return percentage >= 50 ? 'top' : 'bottom';
  }

  public ngOnInit(): void {
    this.buildTimeSlotStructure();

    this.identityService
      .getTeamManagerGroupSelection()
      .pipe(
        combineLatest(this.identityService.getCurrentUserDetail()),
      )
      .subscribe(
        ([teamManagerGroup, userDetail]) => {
          /* istanbul ignore else */
          if (teamManagerGroup) {
            this.currentUser = userDetail;
            this.setManagerTimezoneOffset();
            this.currentManagerId = teamManagerGroup.managerId;
            this.currentTeam = teamManagerGroup.team;
            this.dateControlDaily.valueChanges.subscribe(date => this.getTeamActivity(date));
            this.dateControlWeekly.valueChanges.subscribe(date => this.getTeamActivity(date));
            this.dailyTimeControl.valueChanges.subscribe(mode => this.onManagerToggleChange(mode));
            if (this.currentTeam) {
              this.getTeamActivity(this.isDailyPeriod ? this.dateControlDaily.value : this.dateControlWeekly.value);
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

  public update(): void {
    const secondsPerMinute = 60 * 1000;
    const waitingTime = this.updateActivitiesBtn.frequency * secondsPerMinute;
    this.updateActivitiesBtn.isDisabled = true;
    this.updateActivitiesBtn.lastRefreshDate = moment();
    this.updateActivitiesBtn.observableTimer = Observable.create((observer: Subject<void>) => observer.next())
      .pipe(takeUntil(this.destroy$))
      .delay(waitingTime);
    this.updateActivitiesBtn.observableTimer.subscribe(() => this.updateActivitiesBtn.isDisabled = false);
    this.refresh();
  }

  public get formatLastUpdateDate(): string {
    let tooltipMessage = `Last update: ${this.updateActivitiesBtn.lastRefreshDate.format('DD MMM, YYYY HH:mm')}. `;

    if (this.updateActivitiesBtn.isDisabled) {
      tooltipMessage += 'You can refresh again in ' +
        (this.updateActivitiesBtn.frequency - moment().diff(this.updateActivitiesBtn.lastRefreshDate, 'minutes')) +
        ' minutes';
    } else {
      tooltipMessage += `You can refresh once every ${this.updateActivitiesBtn.frequency} minutes.`;
    }
    return tooltipMessage;
  }

  public get isDailyPeriod(): boolean {
    return this.periodMode === PeriodConstants.DAILY;
  }

  public get isPercentageMode(): boolean {
    return this.percentageTimeMode === this.PERCENTAGE;
  }

  public downloadCSV(): void {
    const period = this.isDailyPeriod ? 'Day' : 'Week';
    const formatDate = this.isDailyPeriod
      ? this.getDailyFormat(this.dateControlDaily.value)
      : this.getWeeklyFormat(this.dateControlWeekly.value);
    const fileName = `Productivity Report ${this.currentTeam.name} - `;

    if (this.viewMode.id === this.TABLE) {
      if (this.isPercentageMode) {
        this.teamPercentageTableGrid.exportFilename = `${fileName}${period}-${this.TABLE} - ${formatDate}`;
        this.teamPercentageTableGrid.exportCSV();
      } else {
        this.teamTimeTableGrid.exportFilename = `${fileName}${period}-${this.TABLE} - ${formatDate}`;
        this.teamTimeTableGrid.exportCSV();
      }
    } else {
      if (this.isPercentageMode) {
        this.exportService.exportToExcel(
          this.teamChartPercentageXSLX,
          {
            fileName: `${fileName}${period}-${this.CHART} - ${formatDate}.xlsx`,
            sheetName: `${fileName}${period}-${this.CHART} - ${formatDate}.xlsx`,
          });
      } else {
        this.exportService.exportToExcel(
          this.teamChartTimeXLSX,
          {
            fileName: `${fileName}${period}-${this.CHART} - ${formatDate}.xlsx`,
            sheetName: `${fileName}${period}-${this.CHART} - ${formatDate}.xlsx`,
          });
      }
    }
  }

  public getTimezoneOffsetText(candidate: Candidate): string {
    if (!candidate || !candidate.location.timeZone) {
      return '';
    }

    const conOffset: number = candidate.location.timeZone.offset;
    const oneHourInMilliseconds = 1000 * 60 * 60;

    const str = this.managerOffset <= conOffset ? 'ahead' : 'behind';
    let finalOffset: number | string = Math.abs((conOffset - this.managerOffset) / (oneHourInMilliseconds));
    finalOffset = (finalOffset * 10) % 10 === 0 ? Math.round(finalOffset) : finalOffset.toFixed(1);

    return `${finalOffset}h ${str} you`;
  }

  public getSlotHeightPercentage(totalTrackedTime: number): string {
    if (!totalTrackedTime) {
      return '';
    }
    const maxHeight = 100;
    const hourMinutes = 60;
    const workdayInHours = 8;
    const weekDays = 5;
    const dailyTotalMinutes = hourMinutes * workdayInHours;
    const weeklyTotalMinutes = dailyTotalMinutes * weekDays;
    const heightPercentage =
      Math.round((totalTrackedTime / (this.isDailyPeriod ? dailyTotalMinutes : weeklyTotalMinutes)) * maxHeight);

    return `${heightPercentage > maxHeight ? maxHeight : heightPercentage}%`;
  }

  public getCellBorderColor(activity: string): string | void {
    const teamActivity = this.teamActivities.find(act => act.name === activity);
    if (teamActivity) {
      return teamActivity.color;
    }
    return;
  }

  public switchToTimeMode(): void {
    this.percentageTimeMode = this.TIME;
  }

  public showSpentTimeInHoursFormat(spentTime: number): string {
    const minutesPerHour = 60;
    const hours = Math.floor(spentTime / minutesPerHour);
    const minutes = spentTime % minutesPerHour;
    return `${hours}h ${minutes < 10 ? '0' + minutes : minutes}m`;
  }

  public onManagerToggleChange(mode: string): void {
    if (mode === this.CONTRACTOR) {
      this.buildContractorTimeActivityBar();
    } else {
      this.buildManagerTimeActivityBar();
    }
  }

  public getSlotColor(slot: TimeSlot): string {
    return slot.color || 'white';
  }

  public getScoreClass(score: number): string {
    const minimumToSuccess = 70;
    const minimumToWarning = 30;
    if (score >= minimumToSuccess) {
      return 'score-success';
    } else if (score >= minimumToWarning) {
      return 'score-warning';
    } else {
      return 'score-danger';
    }
  }

  public getTheme(score: number): string {
    const themeConditions = [
      {
        condition: () => score < 30,
        className: 'danger',
      },
      {
        condition: () => score < 70,
        className: 'warning',
      },
      {
        condition: () => true,
        className: 'success',
      },
    ];
    return themeConditions.filter(entry => entry.condition())[0].className;
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

  public previousDay(): void {
    this.dateControlDaily.setValue(subDays(this.dateControlDaily.value, 1));
  }

  public nextDay(): void {
    this.dateControlDaily.setValue(addDays(this.dateControlDaily.value, 1));
  }

  public previousWeek(): void {
    this.dateControlWeekly.setValue(subWeeks(this.dateControlWeekly.value, 1));
  }

  public nextWeek(): void {
    this.dateControlWeekly.setValue(addWeeks(this.dateControlWeekly.value, 1));
  }

  public refresh(toggle?: DfGroupToggle): void {
    if (!this.isPercentageMode && !this.isDailyPeriod && toggle) {
      if (toggle.selectedItem === this.WEEKLY) {
        this.percentageTimeToggle.selectItem(this.PERCENTAGE);
      } else {
        this.periodToggle.selectItem(this.DAILY);
      }
      return;
    }
    const date = this.isDailyPeriod ? this.dateControlDaily.value : this.dateControlWeekly.value;

    if (this.currentUser) {
      this.getTeamActivity(date);
    }
  }

  public showContractorModal(contractorId: number): void {
    this.error = '';
    this.currentUserAssignmentId = contractorId;
    this.assignmentService.getContractorAssignment(contractorId).subscribe(assignment => {
      this.currentUserManager = Object.assign(assignment.manager);
      this.currentUserTeamId = assignment.team.id;
      this.currentContractor = assignment.candidate as CurrentUserDetail;
      this.modalService.open(this.profileModal, { customClass: 'profile-modal' });
    }, negativeResponse => {
      if (isApiError(negativeResponse)) {
        this.error = negativeResponse.error.text;
      } else {
        this.error = 'Error fetching contractor assignment.';
      }
    });
  }

  public showPercentageOrTime(item: ActivityRecord, contractor: ProductivityGroup): string {
    return item.name === 'Alignment Score'
      ? item.teamMembers[contractor.assignment.candidate.printableName as string] + '%'
      : item.teamMembers[contractor.assignment.candidate.printableName as string] as string;
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getTeamActivity(date: Date): void {
    this.isLoading = true;
    this.error = '';
    const currentTeamId = this.currentTeam.id || TeamConstants.ALL_MANAGERS_ID;
    const activityRequest = this.isDailyPeriod
      ? this.productivityService.getDailyActivity(
        format(date, 'YYYY-MM-DD'),
        'groups',
        this.currentManagerId.toString(),
        undefined,
        currentTeamId.toString(),
      )
      : this.productivityService.getWeeklyActivity(
        format(date, 'YYYY-MM-DD'),
        'groups',
        this.currentManagerId.toString(),
        undefined,
        currentTeamId.toString(),
      );

    forkJoin(
      activityRequest,
      !TeamConstants.isDirectReportsTeam(currentTeamId) ?
        this.productivityService.getDailyPlanned(
          undefined,
          'groups',
          currentTeamId.toString(),
          this.currentManagerId.toString(),
        ) : of(Object.assign({ value: null }).value),
      this.productivityService.getActivities(
        this.currentManagerId.toString(),
        currentTeamId.toString(),
      ),
    ).pipe(finalize(() => this.isLoading = false))
      .subscribe(([groups, plannedActivity, activities]) => {
          this.dailyActivities = _.sortBy(groups, (group: ProductivityGroup) => group.assignment.candidate.printableName);
          this.teamActivities = _.sortBy(activities, (activity) => activity.name);
          this.isAllDirectReports = !!plannedActivity;

          if (this.isAllDirectReports) {
            // Load planned time slots
            this.plannedSections = this.buildPlannedSections(plannedActivity, !this.isDailyPeriod);
            const plannedTimeSlots: Partial<TimeSlot>[] = Array.from({ length: 0 }, () => <Partial<TimeSlot>>{});
            let plannedTimeLength = plannedTimeSlots.length;

            plannedActivity.daySlots.map((plannedSlot: DaySlot) => {
              if (plannedSlot.activity) {
                plannedTimeSlots.push({
                  timeSlot: this.getTimeSlot(plannedTimeLength),
                  plannedSectionName: plannedSlot.activity.name,
                  color: plannedSlot.activity.color,
                });
              } else {
                plannedTimeSlots.push({});
              }
              plannedTimeLength++;
            });

            this.plannedTimeSlots = Object.assign(plannedTimeSlots) as TimeSlot[];
          }

          this.groups = _.sortBy(groups, (group) => group.assignment.candidate.printableName);
          this.buildScreen(groups as ProductivityGroup[]);
        },
        negativeResponse => {
          if (isApiError(negativeResponse)) {
            this.error = negativeResponse.error.text;
          } else {
            this.error = 'Error trying to load the team activities.';
          }
        });
  }

  private buildScreen(groups: ProductivityGroup[]): void {
    if (this.viewMode === this.viewModeItems[1]) {
      if (this.percentageTimeMode === this.PERCENTAGE) {
        this.buildPercentageTable(groups);
      } else {
        this.buildTimeTable(groups);
      }
    } else {
      if (this.percentageTimeMode === this.PERCENTAGE) {
        this.buildPercentageChart(groups);
      } else {
        this.buildTimeChart();
      }
    }
  }

  private buildSections(group: ProductivityGroup): Section[] {
    let sections: Section[];
    sections = group.grouping.advancedGroups as Section[];

    // User's activities
    if (sections.length) {
      const hourMinutes = 60;
      const workdayInHours = 8;
      const weekDays = 5;
      const dailyTotalMinutes = hourMinutes * workdayInHours;
      const weeklyTotalMinutes = dailyTotalMinutes * weekDays;
      let total = group.grouping.totalTrackedTime;
      total = Math.max(total, dailyTotalMinutes) < dailyTotalMinutes ? dailyTotalMinutes : total;

      sections = sections
        .sort((sectionA, sectionB) => sectionB.spentTime - sectionA.spentTime)
        .map(section => {
          section.percentage = section.spentTime / total * 100;
          section.percentageRounded = Math.round(section.percentage);

          // Calculate for each group
          section.groupItems = section.groupItems
            .map((item) => {
              item.percentage = Math.round(
                item.spentTime / (this.isDailyPeriod ? dailyTotalMinutes : weeklyTotalMinutes) * 100,
              );
              return item;
            })
            .sort((itemA, itemB) => itemB.spentTime - itemA.spentTime);

          return section;
        });
    }
    return sections;
  }

  private buildPlannedSections(plannedGroup: PlannedProductivityGroup, weekly: boolean = false): Partial<Section>[] {
    let sections: Partial<Section>[] = [];

    // User's activities
    if (plannedGroup.groupedList.length) {
      const hourMinutes = 60;
      const workdayInHours = 8;
      const weekDays = 5;
      const dailyTotalMinutes = hourMinutes * workdayInHours;
      const weeklyTotalMinutes = dailyTotalMinutes * weekDays;
      let total = plannedGroup.totalTime;
      total = Math.max(total, dailyTotalMinutes) < dailyTotalMinutes ? dailyTotalMinutes : total;

      if (weekly) {
        total = total * weekDays;
        total = Math.max(total, weeklyTotalMinutes) < weeklyTotalMinutes ? weeklyTotalMinutes : total;
      }

      sections = plannedGroup.groupedList
        .map<Partial<Section>>(plannedActivity => {
          const plannedTime = weekly ? (plannedActivity.plannedTime * weekDays) : plannedActivity.plannedTime;
          return <Partial<Section>>{
            color: plannedActivity.activity.color,
            sectionName: plannedActivity.activity.name,
            spentTime: plannedTime,
            percentage: plannedTime / total * 100,
            percentageRounded: Math.round(plannedTime / total * 100),
          };
        });
    }
    return _.orderBy(sections, ['percentageRounded', 'sectionName'], ['desc', 'asc']);
  }

  private buildContractorTimeActivityBar(): void {
    this.timeSlotsPerContractor = [];
    const slot: Partial<TimeSlot> = {};
    if (this.dailyActivities) {
      this.dailyActivities.forEach(dailyActivity => {
        const timeSlots: Partial<TimeSlot>[] = [];
        dailyActivity.dayActivitiesTime.contractorTimeSlots.forEach((timeSlot: TimeSlot | null) => {
          if (timeSlot !== null) {
            timeSlot.timeSlot = this.getTimeSlot(timeSlot.index);
            timeSlots.push(timeSlot);
          } else {
            timeSlots.push(slot);
          }
        });
        this.timeSlotsPerContractor.push({ timeSlots: timeSlots as TimeSlot[] });
      });
    }
  }

  private buildManagerTimeActivityBar(): void {
    this.timeSlotsPerContractor = [];
    const slot: Partial<TimeSlot> = {};
    if (this.dailyActivities) {
      this.dailyActivities.forEach(dailyActivity => {
        const timeSlots: Partial<TimeSlot>[] = [];
        dailyActivity.dayActivitiesTime.managerTimeSlots.forEach((timeSlot: TimeSlot | null) => {
          if (timeSlot !== null) {
            timeSlot.timeSlot = this.getTimeSlot(timeSlot.index);
            timeSlots.push(timeSlot);
          } else {
            timeSlots.push(slot);
          }
        });
        this.timeSlotsPerContractor.push({ timeSlots: timeSlots as TimeSlot[] });
      });
    }
  }

  private buildPercentageChart(groups: ProductivityGroup[]): void {
    this.teamChartPercentageActivity = [];
    this.teamChartPercentageXSLX = [];
    const teamChart: ActivityRecord = { teamMembers: {} };
    groups.forEach((group: ProductivityGroup) =>
      teamChart.teamMembers[group.assignment.candidate.printableName || ''] = this.buildSections(group),
    );
    this.teamChartPercentageActivity.push(teamChart);
    const teamMembers: { [key: string]: Section[] } = this.teamChartPercentageActivity[0].teamMembers as { [key: string]: Section[] };
    for (const key in teamMembers) {
      if (teamMembers.hasOwnProperty(key)) {
        this.teamChartPercentageXSLX.push({
          teamMember: key,
          sections: teamMembers[key].map(member => ({
            sectionName: member.sectionName,
            percentageRounded: member.percentageRounded,
          })),
        });
      }
    }
  }

  private buildTimeChart(): void {
    this.buildManagerTimeActivityBar();
    this.teamChartTimeActivity = [];
    this.teamChartTimeXLSX = [];
    const teamChart: ActivityRecord = { teamMembers: {} };
    this.teamChartTimeActivity.push(teamChart);

    for (const group of this.groups) {
      for (const activity of group.grouping.advancedGroups) {
        for (const task of activity.groupItems) {
          if (!this.teamChartTimeXLSX.some(activityTask => activityTask.task === task.applicationName)) {
            this.teamChartTimeXLSX.push({
              task: task.applicationName,
              activity: activity.sectionName,
            });
          }
        }
      }
    }

    this.teamChartTimeXLSX.forEach(row => {
      for (const group of this.groups) {
        for (const activity of group.grouping.advancedGroups) {
          for (const task of activity.groupItems) {
            if (row.task === task.applicationName) {
              row[group.assignment.candidate.printableName as string] = task.spentTime;
            }
          }
        }
      }
    });
  }

  private buildPercentageTable(groups: ProductivityGroup[]): void {
    this.teamPercentageActivity = [];

    const alignmentRecord: ActivityRecord = {
      name: 'Alignment Score',
      plan: '',
      teamAverage: '',
      teamMembers: {},
    };
    groups.forEach((group: ProductivityGroup) => {
      alignmentRecord.teamMembers[group.assignment.candidate.printableName || ''] = group.grouping.alignmentScore.toString();
      this.contractors.push(group.assignment);
    });
    this.teamPercentageActivity.push(alignmentRecord);

    this.teamActivities.forEach(activity => {

      const record: ActivityRecord = {
        name: activity.name,
        plan: '',
        teamAverage: 0,
        teamMembers: {},
      };
      groups.forEach((group: ProductivityGroup) => {

        if (group.grouping.advancedGroups.some(advancedGroup => advancedGroup.sectionName === activity.name)) {
          const customPercentage = group.grouping.advancedGroups
            .find(advancedGroup => advancedGroup.sectionName === activity.name) as AdvancedGroup;
          record.teamMembers[group.assignment.candidate.printableName || ''] =
            Math.round(customPercentage.spentTime / group.grouping.totalTrackedTime * 100).toString();
        }
      });
      if (Object.keys(record.teamMembers).length || activity.name === 'Other') {
        this.teamPercentageActivity.push(record);
      }
    });

    this.teamPercentageActivity.forEach(teamPercentage => {
      let sumTeamAlignmentScores = 0;

      for (const key in teamPercentage.teamMembers) {
        if (teamPercentage.teamMembers.hasOwnProperty(key)) {
          sumTeamAlignmentScores = sumTeamAlignmentScores + parseInt(teamPercentage.teamMembers[key] as string, 10);
        }
      }
      teamPercentage.teamAverage = Math.round(sumTeamAlignmentScores / groups.length);
    });

    if (this.plannedSections && this.isAllDirectReports) {

      const alignmentActivity = this.teamPercentageActivity[0];
      this.teamPercentageActivity.shift();

      _.orderBy(this.plannedSections, ['percentageRounded', 'sectionName'], ['desc', 'asc']).forEach(section => {

        const similarActivity: ActivityRecord | undefined =
          this.teamPercentageActivity.find(activity => activity.name === section.sectionName);
        if (similarActivity) {
          similarActivity.plan = section.percentageRounded ? section.percentageRounded.toString() : '';
        } else {
          const record: ActivityRecord = {
            name: section.sectionName as string,
            plan: section.percentageRounded ? section.percentageRounded.toString() : '',
            teamAverage: 0,
            teamMembers: {},
          };

          this.teamPercentageActivity.unshift(record);
        }
      });

      const plannedActivities: ActivityRecord[] = this.teamPercentageActivity.filter(activity => activity.plan);
      const notPlannedActivities: ActivityRecord[] = this.teamPercentageActivity.filter(activity => !activity.plan);
      this.teamPercentageActivity =
        _.cloneDeep(
          _.sortBy(plannedActivities, activity => activity.plan ? parseInt(activity.plan, 10) : 0).reverse(),
        ).concat(
          _.cloneDeep(_.sortBy(notPlannedActivities, activity => activity.name)),
        );
      this.teamPercentageActivity.unshift(alignmentActivity);
    }
  }

  private buildTimeTable(groups: ProductivityGroup[]): void {
    const alignmentScoreLabel = 'Alignment Score';
    this.teamTimeActivity = [];
    this.contractors = [];
    const alignmentRecord: ActivityRecord = {
      name: alignmentScoreLabel,
      plan: '',
      teamAverage: '',
      teamMembers: {},
    };
    const alignmentTeamMembersTime: ActivityRecord = {
      teamMembers: {},
    };

    const recordsMembersTimes: ActivityRecord[] = [];

    groups.forEach((group: ProductivityGroup) => {
      alignmentRecord.teamMembers[group.assignment.candidate.printableName || ''] =
        group.grouping.alignmentScore.toString();
      alignmentTeamMembersTime.teamMembers[group.assignment.candidate.printableName || ''] =
        group.grouping.alignmentScore.toString();
      this.contractors.push(group.assignment);
    });

    recordsMembersTimes.push(alignmentTeamMembersTime);
    this.teamTimeActivity.push(alignmentRecord);


    this.teamActivities.forEach(activity => {
      const record: ActivityRecord = {
        name: activity.name,
        plan: '',
        teamAverage: 0,
        teamMembers: {},
      };

      const teamMembersTime: ActivityRecord = {
        teamMembers: {},
      };

      groups.forEach((group: ProductivityGroup) => {
        if (group.grouping.advancedGroups.some(advancedGroup => advancedGroup.sectionName === activity.name)) {
          const sect = group.grouping.advancedGroups.find(section => section.sectionName === activity.name);
          record.teamMembers[group.assignment.candidate.printableName || ''] =
            sect ? this.showSpentTimeInHoursFormat(sect.spentTime) : '';
          teamMembersTime.teamMembers[group.assignment.candidate.printableName || ''] =
            sect ? sect.spentTime.toString() : '0';
        }
      });

      if (Object.keys(record.teamMembers).length || activity.name === 'Other') {
        recordsMembersTimes.push(teamMembersTime);
        this.teamTimeActivity.push(record);
      }
    });

    this.teamTimeActivity.forEach((teamTime, index) => {
      let sumTeamAlignmentScores = 0;
      for (const key in recordsMembersTimes[index].teamMembers) {
        if (recordsMembersTimes[index].teamMembers.hasOwnProperty(key)) {
          sumTeamAlignmentScores = sumTeamAlignmentScores + parseInt(recordsMembersTimes[index].teamMembers[key] as string, 10);
        }
      }
      const average: number = Math.round(sumTeamAlignmentScores / groups.length);
      teamTime.teamAverage = teamTime.name === alignmentScoreLabel ? average : this.showSpentTimeInHoursFormat(average);
    });

    if (this.plannedSections && this.isAllDirectReports) {

      const alignmentActivity = this.teamTimeActivity[0];
      this.teamTimeActivity.shift();

      _.orderBy(this.plannedSections, ['percentageRounded', 'sectionName'], ['desc', 'asc']).forEach(section => {

        const similarActivity: ActivityRecord | undefined =
          this.teamTimeActivity.find(activity => activity.name === section.sectionName);
        if (similarActivity) {
          similarActivity.plan = section.spentTime ? section.spentTime.toString() : '';
        } else {
          const record: ActivityRecord = {
            name: section.sectionName as string,
            plan: section.spentTime ? section.spentTime.toString() : '',
            teamAverage: this.showSpentTimeInHoursFormat(0),
            teamMembers: {},
          };

          this.teamTimeActivity.unshift(record);
        }
      });

      const plannedActivities: ActivityRecord[] = this.teamTimeActivity.filter(activity => activity.plan);
      const notPlannedActivities: ActivityRecord[] = this.teamTimeActivity.filter(activity => !activity.plan);
      this.teamTimeActivity =
        _.cloneDeep(
          _.sortBy(plannedActivities, activity => activity.plan ? parseInt(activity.plan, 10) : 0).reverse(),
        ).concat(
          _.cloneDeep(_.sortBy(notPlannedActivities, activity => activity.name)),
        );
      this.teamTimeActivity.forEach(activity => {
        if (activity.plan) {
          activity.plan = this.showSpentTimeInHoursFormat(parseInt(activity.plan, 10));
        }
      });
      this.teamTimeActivity.unshift(alignmentActivity);
    }
  }

  private buildTimeSlotStructure(): void {
    const DAILY_SLOTS = 144;
    const HOURLY_INTERVALS = 6;
    const TIME_BAR_HOURS = 24;
    const NOON = 12;

    for (let i = 0; i < DAILY_SLOTS; i++) {
      this.timeSlotsGrid.push({
        hourStart: i % HOURLY_INTERVALS === 0,
        hourEnd: i % HOURLY_INTERVALS === 5,
      });
    }

    for (let i = 0; i < TIME_BAR_HOURS; i++) {
      const header = `${i % NOON === 0 ? NOON : i % NOON}:00 ${i < NOON ? 'AM' : 'PM'}`;
      this.timeSlotsHeaders.push(header);
    }
  }

  private getTimeSlot(slot: number): string {
    const timeCardMinutes = 10;
    const today = startOfDay(new Date());
    const start = addMinutes(today, slot * timeCardMinutes);
    const end = addMinutes(today, slot * timeCardMinutes + timeCardMinutes);
    return `${format(start, 'hh:mm aa')} - ${format(end, 'hh:mm aa')}`;
  }

  private setManagerTimezoneOffset(): void {
    const managerTimezone = this.currentUser.location.timeZone;
    if (managerTimezone) {
      this.managerOffset = managerTimezone.offset;
    }
  }
}
