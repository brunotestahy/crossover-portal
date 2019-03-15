import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { READONLY_METRIC_TOOLTIP } from 'app/core/constants/team-metric-setup/readonly-metric-tooltip';
import { MetricSetup, TeamMetricSetting, TeamSetupServer } from 'app/core/models/metric';
import { MetricService } from 'app/core/services/metric/metric.service';

interface JiraProject {
  name: string;
}

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}


@Component({
  selector: 'app-jira-server-settings',
  templateUrl: './jira-server-settings.component.html',
  styleUrls: ['./jira-server-settings.component.scss'],
})
export class JiraServerSettingsComponent implements OnInit {
  public tooltipText = READONLY_METRIC_TOOLTIP;
  public formGroup: FormGroup;
  public jiraAccount: FormGroup;
  public metricInfo: FormGroup;

  public projects: JiraProject[] = [{ name: '' }];
  public readonly ISSUES = 'ISSUE_COUNT';
  public readonly CUSTOM_FIELD = 'CUSTOM_FIELD';
  public validAdvancedQuery = true;
  public error: string | null = null;
  public showDetailContent = false;

  @Input()
  public isLoading = false;

  @Input()
  public teamId: number;

  @Input()
  public servers: TeamSetupServer[] = [];

  @Input()
  public jiraUsers: TeamMetricSetting[];

  @Input()
  public metricSetup: MetricSetup;

  @Input()
  public readOnly = true;

  @Output()
  public checkServers = new EventEmitter<void>();

  @Output()
  public remove = new EventEmitter<void>();

  constructor(
    private formBuilder: FormBuilder,
    private metricService: MetricService
  ) { }

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      jiraAccount: this.formBuilder.group({
        confirmServer: [{ value: true, disabled: this.readOnly }],
        username: [{ value: this.metricSetup.username, disabled: this.readOnly }],
        baseUrl: [{ value: this.metricSetup.host, disabled: this.readOnly }],
        password: [{ value: '', disabled: this.readOnly }],
      }),
      metricInfo: this.formBuilder.group({
        customFieldId: [],
        name: [{ value: this.metricSetup.metricName, disabled: this.readOnly }, Validators.required],
        metricDefinition: [{ value: this.metricSetup.metricComputation, disabled: this.readOnly }],
        metricTarget: [{ value: this.metricSetup.metricTarget, disabled: this.readOnly }, Validators.required],
        customQuery: [{ value: this.metricSetup.customQuery, disabled: this.readOnly }],
        advancedQuery: [{ value: this.metricSetup.advancedQuery, disabled: this.readOnly }],
        project: [{ value: this.metricSetup.projects, disabled: this.readOnly }],
      }),
    });

    this.metricInfo = this.formGroup.controls.metricInfo as FormGroup;
    this.jiraAccount = this.formGroup.controls.jiraAccount as FormGroup;

    this.jiraAccount.controls.confirmServer.valueChanges.subscribe(confirmServer => this.checkJiraAccountValues(confirmServer));
  }

  public onCheckServers(): void {
    this.isLoading = true;
    this.error = null;
    this.metricService.checkServerSetupInfo(this.metricSetup, this.teamId as number)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
        () => this.showDetailContent = true,
        () => this.error = 'Error checking Server Setup');
  }

  public checkJiraAccountValues(confirmServer: boolean): void {
    this.showDetailContent = !confirmServer;
    if (this.showDetailContent) {
      this.remove.emit();
    }
  }

  public updateProject(event: HTMLInputEvent, i: number): void {
    this.projects[i].name = event.target.value;
  }

  public updateServer(event: HTMLInputEvent, i: number): void {
    this.jiraUsers[i].server = event.target.value;
  }

  public updateUsername(event: HTMLInputEvent, i: number): void {
    this.jiraUsers[i].username = event.target.value;
  }

  public removeProject(i: number): void {
    this.projects.splice(i, 1);
  }

  public addProject(): void {
    this.projects.push({ name: '' });
  }

  public validateAdvancedQuery(): void {
    const text = this.metricInfo.value.advancedQuery;
    this.validAdvancedQuery =
      text.indexOf('[c]') >= 0 &&
      text.indexOf('[ws]') >= 0 &&
      text.indexOf('[c]') >= 0;
  }
}
