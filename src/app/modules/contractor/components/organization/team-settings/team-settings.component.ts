import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DfAlertService, DfAlertType, DfModalService } from '@devfactory/ngx-df';
import { format } from 'date-fns';
import * as _ from 'lodash';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import * as AvatarTypes from 'app/core/constants/avatar-types';
import { Assignment } from 'app/core/models/assignment';
import { Company } from 'app/core/models/company';
import { CurrentUserDetail } from 'app/core/models/identity';
import { Manager } from 'app/core/models/manager';
import { Team, TeamManagerGroup } from 'app/core/models/team';
import { AssignmentService } from 'app/core/services/assignments/assignment.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { TeamSelectorStrategyService } from 'app/shared/services/team-selector-strategy/team-selector-strategy.service';
import { decodeErrorMessage } from 'app/utils/api-utilities';

@Component({
  selector: 'app-team-settings',
  templateUrl: './team-settings.component.html',
  styleUrls: ['./team-settings.component.scss'],
})
export class TeamSettingsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();

  protected selectedTeam: Team;
  @HostBinding('class') classes: string = 'page-content padding-aligned page-scroll';

  @Input()
  public currentManagerId: number;
  @Input()
  public isOtherTeam: boolean;
  @Input()
  public isSinglePageMode: boolean = true;

  @Output()
  public errorEmitter: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  public teamDeleteAction: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  public get team(): Team {
    return this.selectedTeam;
  }

  public set team(value: Team) {
    this.selectedTeam = value;
    this.isTeamLoading = false;
    if (!this.team) {
      this.fetchCurrentTeam();
      return;
    }
    this.getWatchers(this.team);
    this.getTeamMetricSettings(this.team);
    this.getTeamAssignments(value);
  }

  public isMetricsLoading: boolean = false;
  public isSecurityLoading: boolean;
  public isWatchersLoading: boolean;
  public teamAssignments: Assignment[] = [];
  public metricUnit: string = '';
  public metricSource: string = '';
  public watchers: Manager[] = [];
  public isAddingWatcher: boolean = false;
  public newWatcher: Manager;
  public managers: { [key: number]: Manager } = {};
  public managersIds: number[] = [];
  public managersLastCompany: Company;

  public allCounter: { [key: string]: number } = {
    webCamCount: 0,
    screenshotsCount: 0,
    applicationsCount: 0,
    reviewsCount: 0,
  };

  public isTeamLoading: boolean = true;
  public error = '';
  public teamSelectorManuallyUpdated: boolean = false;

  constructor(
    protected assignmentService: AssignmentService,
    protected modalService: DfModalService,
    protected alertService: DfAlertService,
    protected identityService: IdentityService,
    protected router: Router,
    protected teamSelectorStrategyService: TeamSelectorStrategyService,
  ) {
  }


  public ngOnInit(): void {
    if (this.isSinglePageMode) {
      this.fetchCurrentTeam();
    }
    this.getManagers();
  }

  public ngOnDestroy(): void {
    this.teamSelectorStrategyService.currentUserAsTeamOwner.next(false);
    this.destroy$.next();
    this.destroy$.complete();
  }

  public fetchCurrentTeam(): void {
    this.isTeamLoading = true;
    this.error = '';
    this.identityService.getTeamManagerGroupSelection()
      .pipe(takeUntil(this.destroy$))
      .subscribe(teamManagerSelectionData => {
        if (teamManagerSelectionData) {
          if (this.teamSelectorManuallyUpdated) {
            this.teamSelectorManuallyUpdated = false;
            return;
          }

          const currentUserManagerId = this.identityService.getCurrentUserAvatarId(AvatarTypes.Manager);

          if (this.isSinglePageMode) {
            const currentUser: CurrentUserDetail = this.identityService.getCurrentUserValue() as CurrentUserDetail;
            this.teamSelectorStrategyService.currentUserAsTeamOwner.next(true);
            this.currentManagerId = currentUserManagerId as number;

            if (currentUser.assignment.team.id === teamManagerSelectionData.team.id) {
              this.noTeamSettingsAvailable(currentUser);
            } else {
              this.loadTeamSettingsAsSinglePage(teamManagerSelectionData);
            }
            return;
          }

          this.assignmentService.getDashboard(currentUserManagerId as number, '', false)
            .pipe(take(1))
            .subscribe(dashboardData => {
                const myTeams: Team[] = [];
                dashboardData.teams.forEach(team => {
                  if (
                    team.reportingManagers &&
                    team.reportingManagers.filter(manager => manager.id === (currentUserManagerId as number)).length > 0
                  ) {
                    myTeams.push(team);
                  }
                });

                if (myTeams[0]) {
                  this.team = myTeams[0];
                  this.getWatchers(this.team);
                  this.getTeamMetricSettings(this.team);
                  this.fetchTeamAssignments(this.team);
                }
              },
              error => this.error = decodeErrorMessage(error, 'Error trying to load the team settings.'));
        }
      });
  }

  public loadTeamSettingsAsSinglePage(teamManagerGroupSelection: TeamManagerGroup): void {
    const selectedTeam: Team = teamManagerGroupSelection.team;
    const selectedTeams: Team[] = teamManagerGroupSelection.teams as Team[];
    if (selectedTeam.teamOwner && selectedTeam.teamOwner.id === this.currentManagerId) {
      this.team = selectedTeam;
    } else {
      this.team = selectedTeams.filter(team => !!team.teamOwner && team.teamOwner.id === this.currentManagerId)[0];
    }

    this.teamSelectorManuallyUpdated = true;
    this.identityService.updateTeamById(this.team.id);
  }

  public fetchTeamAssignments(team: Team): void {
    this.error = '';
    if (team.teamOwner) {
      this.assignmentService
        .getTeamAssignments(
          team.teamOwner.id.toString(),
          team.id.toString(),
          format(new Date(), 'YYYY-MM-DD'),
          format(new Date(), 'YYYY-MM-DD'),
          true,
        )
        .subscribe(
          assignmentsData => {
            team.activeAssignments = assignmentsData;
            this.isTeamLoading = false;
          },
          error => this.error = decodeErrorMessage(error, 'Error trying to load the team assignments.'));
    }
  }

  public addNewWatchers(watcher: Manager): void {
    this.error = '';
    if (watcher) {
      this.errorEmitter.emit('');
      const newWatchers: Manager[] = this.watchers.filter(oldWatcher => !oldWatcher.logicalWatcher);
      newWatchers.push(watcher);
      this.team.watchers = _.orderBy(newWatchers, ['printableName'], ['asc']);
      this.team.watchers.forEach(finalWatcher => delete finalWatcher.logicalWatcher);
      this.assignmentService.updateTeam(this.team)
        .subscribe(
          updatedTeam => this.getWatchers(updatedTeam),
          error => {
            this.errorEmitter.emit(decodeErrorMessage(error, 'Error trying to add a new watcher.'));
            this.error = decodeErrorMessage(error, 'Error trying to add a new watcher.');
          }
        );
    }
  }

  public removeWatcher(id: number): void {
    this.error = '';
    this.errorEmitter.emit('');
    const newWatchers: Manager[] = this.watchers.filter(watcher => !watcher.logicalWatcher && watcher.id !== id);
    this.team.watchers = _.orderBy(newWatchers, ['printableName'], ['asc']);
    this.team.watchers.forEach(finalWatcher => delete finalWatcher.logicalWatcher);
    this.assignmentService.updateTeam(this.team)
      .subscribe(
        updatedTeam => this.getWatchers(updatedTeam),
        error => {
          this.errorEmitter.emit(decodeErrorMessage(error,'Error trying to delete the watcher.'));
          this.error = decodeErrorMessage(error, 'Error trying to delete the watcher.');
        }
      );
  }

  public getTeamMetricSettings(team: Team): void {
    this.metricUnit = '';
    this.metricSource = '';
    this.error = '';
    this.isMetricsLoading = true;
    this.assignmentService.getTeamMetricSettings(team)
      .subscribe(
        data => {
          if (data && data.length) {
            this.metricUnit = data.filter(metricSetup => metricSetup.currentTeamMetric)[0].metricName as string;
            this.metricSource = data.filter(metricSetup => metricSetup.currentTeamMetric)[0].type as string;
          }
          this.isMetricsLoading = false;
        },
        error => {
          this.errorEmitter.emit(decodeErrorMessage(error, 'Error trying to load the metrics.'));
          this.error = decodeErrorMessage(error, 'Error trying to load the metrics.');
        }
      );
  }

  public getTeamAssignments(team: Team): void {
    this.isSecurityLoading = true;
    this.error = '';
    if (team.teamOwner) {
      this.errorEmitter.emit('');
      this.allCounter = {
        webCamCount: 0,
        screenshotsCount: 0,
        applicationsCount: 0,
        reviewsCount: 0,
      };
      this.assignmentService
        .getTeamAssignments(
          undefined,
          team.id.toString(),
          format(new Date(), 'YYYY-MM-DD'),
          format(new Date(), 'YYYY-MM-DD'),
          false,
        )
        .subscribe(
          assignmentsData => {
            if (!this.isOtherTeam && !this.isSinglePageMode) {
              assignmentsData = assignmentsData.filter(assignment => assignment.manager.id === this.currentManagerId);
            }

            assignmentsData.map(assignment => {
              if (assignment.featureValues.webcamshotFrequency > 0) {
                this.allCounter.webCamCount += 1;
              }
              if (assignment.disabledFeatures.indexOf('SCREENSHOTS') < 0) {
                this.allCounter.screenshotsCount += 1;
              }
              if (assignment.disabledFeatures.indexOf('APPLICATION_TRACKING') < 0) {
                this.allCounter.applicationsCount += 1;
              }
              if (assignment.disabledFeatures.indexOf('ENFORCER_REVIEW') < 0) {
                this.allCounter.reviewsCount += 1;
              }
            });
            this.teamAssignments = assignmentsData;
            this.isSecurityLoading = false;
          },
          error => {
            this.errorEmitter.emit(decodeErrorMessage(error,'Error trying to load the team assignments.'));
            this.error = decodeErrorMessage(error, 'Error trying to load the team assignments.');
          }
        );
    }
  }

  public filterManagerNotWatcher(managersIds: number[]): number[] {
    return managersIds.filter(
      managerId => !this.watchers.some(watcher => managerId === watcher.id),
    );
  }

  public getManagers(): void {
    this.errorEmitter.emit('');
    this.error = '';
    this.assignmentService.getManagers()
      .subscribe(
        data => {
          data.map(value => (this.managers[value.id] = value));
          this.managersIds = Object.keys(this.managers).map(value => Number(value));
          this.managersIds.sort((a, b) => {
            const aCompanyName: string = _.get(this.managers[a], 'company.name', '');
            const bCompanyName: string = _.get(this.managers[b], 'company.name', '');
            const aName: string = this.managers[a].printableName || '';
            const bName: string = this.managers[b].printableName || '';

            /**
             * aCompanyName.localeCompare(bCompanyName) = 0 ? then use manager name
             * So it would group managers of the same company together
             */
            return aCompanyName.localeCompare(bCompanyName) === 0 ? aName.localeCompare(bName) : aCompanyName.localeCompare(bCompanyName);
          });
        },
        error => {
          this.errorEmitter.emit(decodeErrorMessage(error,'Error trying to load the managers.'));
          this.error = decodeErrorMessage(error, 'Error trying to load the managers.');
        }
      );
  }

  public isNewManagersCompany(company: Company): boolean {
    if (this.managersLastCompany && this.managersLastCompany.id === company.id) {
      return false;
    } else {
      this.managersLastCompany = company;
      return true;
    }
  }

  public getWatchers(team: Team): void {
    this.error = '';
    this.watchers = [];
    this.isWatchersLoading = true;
    this.errorEmitter.emit('');

    const watchers: Manager[] = _.orderBy((team.watchers || ([] as Manager[])), ['printableName'], ['asc']);
    watchers.forEach(watcher => watcher.logicalWatcher = false);

    this.assignmentService.getWatchers(team.id.toString())
      .subscribe(
        data => {
          this.watchers = data;
          this.watchers.forEach(logicalWatcher => logicalWatcher.logicalWatcher = true);
          this.watchers = this.watchers.concat(watchers);
          this.isWatchersLoading = false;
        },
        error => {
          this.errorEmitter.emit(decodeErrorMessage(error, 'Error trying to fetch the watchers.'));
          this.error = decodeErrorMessage(error, 'Error trying to fetch the watchers.');
        }
      );
  }

  public deleteTeam(): void {
    this.error = '';
    if (this.team && this.teamAssignments.length > 0) {
      this.alertService.createDialog({
        title: '',
        message:
        `The team need to be empty before it can be deleted. ` +
        `Please move all contractors into a different team and retry the operation.`,
      });
    } else if (this.team) {
      this.alertService
        .createDialog({
          title: 'Confirmation',
          message: `Are you sure you want to delete this team (${this.team.name}) ? This action cannot be undone.`,
          type: DfAlertType.Confirm,
        })
        .pipe(filter(data => data[0] === 'ok'))
        .subscribe(() => {
          this.errorEmitter.emit('');
          this.assignmentService.deleteTeam(this.team.id.toString())
            .subscribe(
              () => {
                this.teamDeleteAction.emit();
                if (this.isSinglePageMode) {
                  this.destroy$.next();
                  this.destroy$.complete();
                  this.ngOnInit();
                }
              },
              error => {
                this.errorEmitter.emit(decodeErrorMessage(error,'Error trying to delete the team.'));
                this.error = decodeErrorMessage(error, 'Error trying to delete the team.');
              }
            );
        });
    }
  }

  public toggleDisabledWebCam(memberIndex: number, featureName: string): void {
    const featureIndex: number = this.teamAssignments[memberIndex].disabledFeatures.indexOf(featureName);
    if (featureIndex < 0) {
      this.teamAssignments[memberIndex].disabledFeatures.push(featureName);
      this.teamAssignments[memberIndex].featureValues.webcamshotFrequency = 0;
    } else {
      this.teamAssignments[memberIndex].disabledFeatures.splice(featureIndex, 1);
      this.teamAssignments[memberIndex].featureValues.webcamshotFrequency = 1;
    }

    this.updateTeamAssignment(this.teamAssignments[memberIndex]);
  }

  public toggleDisabledScreenShot(memberIndex: number, featureName: string, value: number): void {
    const featureIndex: number = this.teamAssignments[memberIndex].disabledFeatures.indexOf(featureName);
    if (featureIndex < 0 && value === 0) {
      this.teamAssignments[memberIndex].disabledFeatures.push(featureName);
    } else if (featureIndex >= 0 && value > 0) {
      this.teamAssignments[memberIndex].disabledFeatures.splice(featureIndex, 1);
    }
    this.teamAssignments[memberIndex].featureValues.screenshotFrequency = value;

    this.updateTeamAssignment(this.teamAssignments[memberIndex]);
  }

  public toggleDisabledFeatures(memberIndex: number, featureName: string): void {
    const featureIndex: number = this.teamAssignments[memberIndex].disabledFeatures.indexOf(featureName);
    if (featureIndex < 0) {
      this.teamAssignments[memberIndex].disabledFeatures.push(featureName);
    } else {
      this.teamAssignments[memberIndex].disabledFeatures.splice(featureIndex, 1);
    }

    this.updateTeamAssignment(this.teamAssignments[memberIndex]);
  }

  public toggleAllWebCam(): void {
    const newValue: boolean = this.allCounter.webCamCount <= this.teamAssignments.length && this.allCounter.webCamCount > 0;
    this.teamAssignments.map(assignment => {
      assignment.featureValues.webcamshotFrequency = !newValue;
    });
    this.allCounter.webCamCount = newValue ? 0 : this.teamAssignments.length;

    this.updateAllAssignments();
  }

  public toggleAllScreenshot(): void {
    const newValue: boolean = this.allCounter.screenshotsCount <= this.teamAssignments.length && this.allCounter.screenshotsCount > 0;
    this.teamAssignments.map(assignment => {
      assignment.featureValues.screenshotFrequency = Number(!newValue);
    });
    this.allCounter.screenshotsCount = newValue ? 0 : this.teamAssignments.length;

    this.updateAllAssignments();
  }

  public toggleAllApplications(): void {
    const newValue: boolean = this.allCounter.applicationsCount <= this.teamAssignments.length && this.allCounter.applicationsCount > 0;
    let featureIndex = -1;
    this.teamAssignments.map(assignment => {
      featureIndex = assignment.disabledFeatures.indexOf('APPLICATION_TRACKING');
      if (newValue && featureIndex < 0) {
        assignment.disabledFeatures.push('APPLICATION_TRACKING');
      } else if (!newValue) {
        assignment.disabledFeatures.splice(featureIndex, 1);
      }
    });
    this.allCounter.applicationsCount = newValue ? 0 : this.teamAssignments.length;

    this.updateAllAssignments();
  }

  public toggleAllReview(): void {
    const newValue: boolean = this.allCounter.reviewsCount <= this.teamAssignments.length && this.allCounter.reviewsCount > 0;
    let featureIndex = -1;
    this.teamAssignments.map(assignment => {
      featureIndex = assignment.disabledFeatures.indexOf('ENFORCER_REVIEW');
      if (newValue && featureIndex < 0) {
        assignment.disabledFeatures.push('ENFORCER_REVIEW');
      } else if (!newValue) {
        assignment.disabledFeatures.splice(featureIndex, 1);
      }
    });
    this.allCounter.reviewsCount = newValue ? 0 : this.teamAssignments.length;

    this.updateAllAssignments();
  }

  public changeAllCounter(event: number | string, key: string): void {
    this.allCounter[key] += Number(event) ? 1 : -1;
    if (this.allCounter[key] > this.teamAssignments.length) {
      this.allCounter[key] = this.teamAssignments.length;
    }
  }

  public updateTeamAssignment(assignment: Assignment): void {
    this.errorEmitter.emit('');
    this.error = '';
    this.assignmentService.updateAssignment(assignment)
      .subscribe(
        () => {
        },
        error => {
          this.errorEmitter.emit(decodeErrorMessage(error,'Error trying to update the assignment.'));
          this.error = decodeErrorMessage(error, 'Error trying to update the assignment.');
        }
      );
  }

  public updateAllAssignments(): void {
    this.teamAssignments.forEach(assignment => this.updateTeamAssignment(assignment));
  }

  private noTeamSettingsAvailable(currentUser: CurrentUserDetail): void {
    const teamDashboardLabel = 'Go to team\'s dashboard';
    this.teamSelectorStrategyService.isTeamSelectorVisible.next(false);
    this.alertService.createDialog({
      buttons: [
        { className: 'primary', text: teamDashboardLabel },
        { className: 'white', text: 'Go back' },
      ],
      message: `<strong>Team Settings</strong> is not available for the team <strong>${currentUser.assignment.team.name}</strong>. What do you want to do instead?`,
      type: DfAlertType.Confirm,
    }).subscribe((data: string[]) => {
      if (data[0] === teamDashboardLabel) {
        this.router.navigate(['/contractor/dashboard']);
      } else {
        this.teamSelectorManuallyUpdated = true;
        this.identityService.updateTeamById(this.team.id);
      }
    });
  }
}
