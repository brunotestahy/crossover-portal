import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';

import { GOOGLESHEETS } from 'app/core/constants/team-metric-setup/metric-setup-type';
import { READONLY_METRIC_TOOLTIP } from 'app/core/constants/team-metric-setup/readonly-metric-tooltip';
import { MetricSetup, TeamSetup } from 'app/core/models/metric';
import { MetricService } from 'app/core/services/metric/metric.service';

@Component({
  selector: 'app-google-sheets-settings',
  templateUrl: './google-sheets-settings.component.html',
  styleUrls: ['./google-sheets-settings.component.scss'],
})
export class GoogleSheetsComponent implements OnInit {
  public readonly SHARED = 'SHARED';
  public readonly OAUTH = 'OAUTH';
  public readonly tooltipText = READONLY_METRIC_TOOLTIP;
  public qAuthUrl: string;
  public error: string | null = null;
  public isLoading = false;
  public formGroup: FormGroup;

  @Input()
  public metricSetup = {} as MetricSetup;

  @Input()
  public isTeamOwnerOrAdmin: boolean;

  @Input()
  public teamId: number;

  @Output()
  public close = new EventEmitter<void>();

  @Output()
  public showSources = new EventEmitter<void>();

  @Output()
  public update = new EventEmitter<void>();

  constructor(
    private metricService: MetricService,
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: [
        { value: _.defaultTo(this.metricSetup.metricName, ''), disabled: !this.isTeamOwnerOrAdmin },
        Validators.required
      ],
      metricTarget: [
        { value: _.defaultTo(this.metricSetup.metricTarget, ''), disabled: !this.isTeamOwnerOrAdmin }
      ],
      sheetUrl: [
        { value: _.defaultTo(this.metricSetup.host, ''), disabled: !this.isTeamOwnerOrAdmin },
        Validators.required
      ],
      template: [
        { value: _.defaultTo(this.metricSetup.worksheetName, ''), disabled: !this.isTeamOwnerOrAdmin },
        Validators.required],
      accessMethod: [
        { value: _.defaultTo(this.metricSetup.spreadsheetAccess, this.SHARED), disabled: !this.isTeamOwnerOrAdmin },
        Validators.required
      ],
      password: [
        { value: null, disabled: !this.isTeamOwnerOrAdmin }
      ]
    });
    if (this.metricSetup.spreadsheetAccess === this.SHARED) {
      const passwordControl = this.formGroup.controls.password;
      this.formGroup.controls.accessMethod.valueChanges.subscribe(
        (accessMethod: string) => {
          if (accessMethod === this.OAUTH) {
            passwordControl.setValidators([Validators.required]);
          }
          else {
            passwordControl.clearValidators();
          }
          passwordControl.updateValueAndValidity();
        });
    }
    this.getQAuthUrl();
  }

  public saveSetup(): void {
    this.isLoading = true;
    const teamMetric = {
      id: this.metricSetup.id,
      active: true,
      currentTeamMetric: true,
      host: this.formGroup.controls.sheetUrl.value,
      metricName: this.formGroup.controls.name.value,
      metricTarget: this.formGroup.controls.metricTarget.value,
      spreadsheetAccess: this.formGroup.controls.accessMethod.value,
      type: GOOGLESHEETS,
      worksheetName: this.formGroup.controls.template.value,
      ...this.formGroup.controls.password.value && { password: this.formGroup.controls.password.value },
    } as TeamSetup;
    this.metricService.setupOrUpdateMetrics(this.teamId, teamMetric)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
        () => {
          this.update.emit();
          this.onClose();
        },
        error => {
          const errorContainer = _.get(error, 'error');
          this.error = _.get(errorContainer, 'text', 'Error updating metric setup.');
        }
      );
  }

  public showMetricSources(): void {
    this.showSources.emit();
  }

  public onClose(): void {
    this.close.emit();
  }

  private getQAuthUrl(): void {
    this.metricService.getQAuthUrl()
      .subscribe(
        url => this.qAuthUrl = url,
        () => this.error = 'Error fetching QAuth Url.');
  }
}
