import { Component, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { DfModalService } from '@devfactory/ngx-df';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { TeamMetricRecord, TeamSetup, TeamSetupServer } from 'app/core/models/metric';
import { MetricService } from 'app/core/services/metric/metric.service';
import {
  ZendeskServerSettingsComponent,
} from 'app/modules/contractor/pages/team-metrics/settings/zendesk/server/zendesk-server-settings.component';

@Component({
  selector: 'app-zendesk-settings',
  templateUrl: './zendesk-settings.component.html',
  styleUrls: ['./zendesk-settings.component.scss'],
})
// TODO this compoenent is not done yet this will be handled in AWORK-38327
export class ZendeskSettingsComponent implements OnInit {
  public isLoading = false;
  public error = '';

  public servers: TeamSetupServer[] = [];

  public isSaving = false;

  public selectedIndex: number | null = 0;
  public selectedTab: number;

  @Output()
  public close = new EventEmitter<{}>();

  @Output()
  public showSources = new EventEmitter<{}>();

  @Input()
  public users: TeamMetricRecord[];

  @Input()
  public teamId: number;

  @ViewChildren(ZendeskServerSettingsComponent)
  public serverSettingsComponents: QueryList<ZendeskServerSettingsComponent>;

  @ViewChild('confirmationModal')
  public confirmationModal: TemplateRef<{}>;

  constructor(
    private metricService: MetricService,
    private modalService: DfModalService
  ) {
  }

  public showMetricSources(): void {
    this.showSources.emit();
  }

  public ngOnInit(): void {
    this.servers = [
      {
        name: 'Server 1',
      },
    ];
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
          host: serverSettings.zendeskAccount.controls.baseUrl.value,
          password: serverSettings.zendeskAccount.controls.password.value,
          type: 'ZENDESK',
          username: serverSettings.zendeskAccount.controls.username.value,
        };
        requests.push(this.metricService.checkServerSetupInfo(serverSetup, this.teamId));
      }
    );
    forkJoin(requests)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(() => { }, error => this.error = error);
  }

  public saveSetup(): void {
    this.isSaving = true;
    const requests: Observable<void>[] = [];

    this.serverSettingsComponents.forEach(serverSettings => {
      const teamMetric = {
        active: false,
        currentTeamMetric: true,
        doneCriteria: serverSettings.metricInfo.controls.metricDefinition.value,
        customQuery: serverSettings.metricInfo.controls.customQuery.value,
        host: serverSettings.zendeskAccount.controls.baseUrl.value,
        metricName: serverSettings.metricInfo.controls.name.value,
        metricTarget: serverSettings.metricInfo.controls.metricTarget.value,
        password: serverSettings.zendeskAccount.controls.password.value,
        type: 'ZENDESK',
        username: serverSettings.zendeskAccount.controls.username.value,
      } as TeamSetup;
      requests.push(this.metricService.setupOrUpdateMetrics(this.teamId, teamMetric));
    });

    this.serverSettingsComponents.first.zendeskUsers.forEach(user => {
      const contractorMetric = {
        metricType: 'ZENDESK',
        metricUserId: user.username,
      } as TeamSetup;
      requests.push(this.metricService.setupOrUpdateMetrics(this.teamId, contractorMetric));
    });
    forkJoin(
      requests
    ).pipe(finalize(() => this.isSaving = false))
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
