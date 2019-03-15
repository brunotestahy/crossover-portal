import { Component, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { DfModalService } from '@devfactory/ngx-df';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { TeamMetricRecord, TeamSetup, TeamSetupServer } from 'app/core/models/metric';
import { MetricService } from 'app/core/services/metric/metric.service';
import {
  DeskDotComServerSettingsComponent,
} from 'app/modules/contractor/pages/team-metrics/settings/desk-dot-com/server/desk-dot-com-server-settings.component';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'app-desk-dot-com-settings',
  templateUrl: './desk-dot-com-settings.component.html',
  styleUrls: ['./desk-dot-com-settings.component.scss'],
})
// TODO this compoenent is not done yet this will be handled in diff ticket
export class DeskDotComSettingsComponent implements OnInit {
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

  @ViewChildren(DeskDotComServerSettingsComponent)
  public serverSettingsComponents: QueryList<DeskDotComServerSettingsComponent>;

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
          host: serverSettings.deskDotComAccount.controls.baseUrl.value,
          password: serverSettings.deskDotComAccount.controls.password.value,
          type: 'DESK',
          username: serverSettings.deskDotComAccount.controls.username.value,
        };
        requests.push(this.metricService.checkServerSetupInfo(serverSetup, this.teamId));
      }
    );
    forkJoin(requests)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(() => {}, error => this.error = error);
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
        host: serverSettings.deskDotComAccount.controls.baseUrl.value,
        metricName: serverSettings.metricInfo.controls.name.value,
        metricTarget: serverSettings.metricInfo.controls.metricTarget.value,
        password: serverSettings.deskDotComAccount.controls.password.value,
        type: 'DESK',
        username: serverSettings.deskDotComAccount.controls.username.value,
      } as TeamSetup;
      requests.push(this.metricService.setupOrUpdateMetrics(this.teamId,teamMetric));
    });

    this.serverSettingsComponents.first.deskDotComUsers.forEach(user => {
      const contractorMetric = {
        metricType: 'DESK',
        metricUserId: user.username,
      } as TeamSetup;
      requests.push(this.metricService.setupOrUpdateMetrics(this.teamId,contractorMetric));
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
