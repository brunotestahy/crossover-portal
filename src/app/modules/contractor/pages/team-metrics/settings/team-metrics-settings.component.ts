import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs/operators';

import * as METRIC_TYPE from 'app/core/constants/team-metric-setup/metric-setup-type';
import { CurrentUserDetail } from 'app/core/models/identity';
import { MetricSetup, MetricTypes, TeamMetricSetting } from 'app/core/models/metric';
import { Team } from 'app/core/models/team';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { MetricService } from 'app/core/services/metric/metric.service';

@Component({
  selector: 'app-team-metrics-settings',
  templateUrl: './team-metrics-settings.component.html',
  styleUrls: ['./team-metrics-settings.component.scss'],
})

export class TeamMetricsSettingsComponent implements OnInit {
  public readonly metricType = METRIC_TYPE;
  public users: TeamMetricSetting[];
  public selectedTeam: Team | null;
  public teamId: number | null;
  public managerId: number | null;
  public error: string | null = null;
  public metricSetups: MetricTypes = {};
  public activeMetric: MetricSetup;
  public showSources = false;
  public isLoading = false;
  public currentUserDetail: CurrentUserDetail;
  public isAdmin = false;

  @Output()
  public close = new EventEmitter<void>();

  @Output()
  public update = new EventEmitter<void>();

  constructor(
    private identityService: IdentityService,
    private metricService: MetricService
  ) { }

  public ngOnInit(): void {
    this.isLoading = true;
    this.identityService.getCurrentUser()
      .subscribe(
        currentUser => this.currentUserDetail = currentUser as CurrentUserDetail
      );
    this.identityService.getTeamManagerGroupSelection()
      .subscribe((teamManagerGroupSelection) => {
        this.error = null;
        this.selectedTeam = teamManagerGroupSelection ? teamManagerGroupSelection.team : null;
        this.teamId = teamManagerGroupSelection ? teamManagerGroupSelection.team.id : null;
        this.managerId = teamManagerGroupSelection ? teamManagerGroupSelection.managerId : null;
        this.getMetricsSetup(this.teamId as number);
      }, () => {
        this.error = 'Error loading selected team and manager.';
        this.isLoading = false;
      });
    this.currentUserIsAdmin();
  }

  public getMetricsSetup(teamId: number): void {
    this.isLoading = true;
    this.metricService.getMetricsSetup(teamId)
      .subscribe(setups => {
        this.showSources = setups.length === 0;
        setups.map((setup => {
          const type = setup.type as string;
          this.metricSetups[type] = setup;
        }));
        this.activeMetric = this.getActiveMetric(setups);
        this.getTeamMetricSetting();
      }, () => {
        this.error = 'Error getting metrics setup';
        this.isLoading = false;
      });
  }

  public getActiveMetric(metricSetups: MetricSetup[]): MetricSetup {
    const activeMetric = metricSetups.filter(setup => setup.currentTeamMetric && setup.active);
    return activeMetric[0] || {};
  }

  public getTeamMetricSetting(): void {
    this.isLoading = true;
    this.metricService.getTeamMetricSetting(this.teamId as number, this.managerId as number)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(users => {
        users.sort((previousTeam, currentTeam) => {
          const previousName = previousTeam.printableName as string;
          const currentName = currentTeam.printableName as string;
          return previousName.localeCompare(currentName);
        });
        this.users = users;
      }, () => this.error = 'Error getting team metric settings');
  }

  public onClose(): void {
    this.close.emit();
  }

  public isTeamOwnerOrAdmin(): boolean {
    const isOwner = this.identityService.isTeamOwner(this.currentUserDetail.managerAvatar.id, this.selectedTeam as Team);
    return isOwner || this.isAdmin;
  }

  public showSettingSources(): void {
    this.showSources = true;
  }

  public isModalVisible(modalName: string): boolean {
    return !this.showSources && this.activeMetric && modalName === this.activeMetric.type;
  }

  public onChangeModal(modalName: string): void {
    this.showSources = false;
    const targetMetrics = Object.assign({}, this.metricSetups[modalName]);
    const defaultMetric = {
      type: modalName,
      active: true,
      currentTeamMetric: true
    };
    this.activeMetric = this.metricSetups[modalName] ? targetMetrics : defaultMetric;
  }

  public onSettingChange(): void {
    this.update.emit();
  }

  private currentUserIsAdmin(): void {
    this.identityService.currentUserIsAdmin()
      .subscribe(isAdmin => this.isAdmin = isAdmin);
  }
}
