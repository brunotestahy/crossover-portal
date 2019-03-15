import { Component, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { DfModalService } from '@devfactory/ngx-df';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { READONLY_METRIC_TOOLTIP } from 'app/core/constants/team-metric-setup/readonly-metric-tooltip';
import { TeamMetricSetting } from 'app/core/models/metric';
import { MetricSetup, TeamSetup, TeamSetupServer } from 'app/core/models/metric';
import { MetricService } from 'app/core/services/metric/metric.service';
import { JiraServerSettingsComponent } from 'app/modules/contractor/pages/team-metrics/settings/jira/server/jira-server-settings.component';

@Component({
  selector: 'app-jira-settings',
  templateUrl: './jira-settings.component.html',
  styleUrls: ['./jira-settings.component.scss'],
})

// TODO this compoenent is not done yet this will be handled in AWORK-34729

export class JiraSettingsComponent implements OnInit {
  public tooltipText = READONLY_METRIC_TOOLTIP;
  public teamMetricSettings: TeamMetricSetting[];
  public isLoading = false;

  public isServerChecked = false;

  public error: string | null = null;
  public showDetailContent = false;

  public servers: TeamSetupServer[] = [];

  public selectedIndex: number | null = 0;
  public selectedTab: number;

  @Input()
  public jiraUsers: TeamMetricSetting[];

  @Output()
  public close = new EventEmitter<void>();

  @Output()
  public showSources = new EventEmitter<void>();

  @Input()
  public teamId: number;

  @Input()
  public managerId: number;

  @Input()
  public metricSetup: MetricSetup;

  @Input()
  public isTeamOwnerOrAdmin = true;

  @ViewChild('confirmationModal')
  public confirmationModal: TemplateRef<void>;

  @ViewChildren(JiraServerSettingsComponent)
  public serverSettingsComponents: QueryList<JiraServerSettingsComponent>;

  constructor(
    private metricService: MetricService,
    private modalService: DfModalService
  ) { }

  public ngOnInit(): void {
    this.servers = [
      {
        name: 'Server 1',
      },
    ];
  }

  public showMetricSources(): void {
    this.showSources.emit();
  }

  public removeServer(close: Function): void {
    if (this.servers.length > 1) {
      this.selectedIndex = this.selectedTab;
      this.servers.splice(this.selectedTab, 1);
      setTimeout(() => {
        this.selectedIndex = null;
        close();
      });
    }
  }

  public checkServers(): void {
    this.isLoading = true;
    const requests: Observable<{}>[] = [];
    this.serverSettingsComponents.forEach(
      serverSettings => {
        const serverSetup = {
          host: serverSettings.jiraAccount.controls.baseUrl.value,
          password: serverSettings.jiraAccount.controls.password.value,
          type: 'JIRA',
          username: serverSettings.jiraAccount.controls.username.value,
        };
        requests.push(this.metricService.checkServerSetupInfo(serverSetup, this.teamId as number));
      }
    );
    forkJoin(requests)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(() => {
        this.showDetailContent = true;
        this.isServerChecked = true;
      }, () => this.error = 'Error checking Server Setup');
  }

  public saveSetup(): void {
    this.isLoading = true;
    const requests: Observable<void>[] = [];

    this.serverSettingsComponents.forEach(serverSettings => {
      const teamMetric = {
        active: false,
        currentTeamMetric: true,
        customFieldId: serverSettings.metricInfo.controls.customFieldId.value,
        advancedQuery: serverSettings.metricInfo.controls.advancedQuery.value,
        customQuery: serverSettings.metricInfo.controls.customQuery.value,
        host: serverSettings.jiraAccount.controls.baseUrl.value,
        metricComputation: serverSettings.metricInfo.controls.metricDefinition.value,
        metricName: serverSettings.metricInfo.controls.name.value,
        metricTarget: serverSettings.metricInfo.controls.metricTarget.value,
        projects: serverSettings.projects.map(project => project.name).join(' '),
        type: 'JIRA',
        username: serverSettings.jiraAccount.controls.username.value,
      } as TeamSetup;
      requests.push(this.metricService.setupOrUpdateMetrics(this.teamId, teamMetric));
    });

    this.serverSettingsComponents.first.jiraUsers.forEach(user => {
      const contractorMetric = {
        metricType: 'JIRA',
        metricUserId: user.id.toString(),
      } as TeamSetup;
      requests.push(this.metricService.setupOrUpdateMetrics(this.teamId, contractorMetric));
    });
    forkJoin(
      requests
    ).pipe(finalize(() => this.isLoading = false))
      .subscribe(() => this.onClose());
  }

  public onClose(): void {
    this.close.emit();
  }

  public addServer(): void {
    const index = this.servers.length + 1;
    if (index <= 5) {
      this.servers.push({
        name: `Server ${index}`,
      });
    }
  }

  public openConfirmationModal(index: number): void {
    this.selectedTab = index;
    if (this.servers.length > 1) {
      this.modalService.open(this.confirmationModal);
    }
  }
}
