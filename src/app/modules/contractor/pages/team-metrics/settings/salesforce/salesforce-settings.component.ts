import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Observable } from 'rxjs/Observable';

import { SALESFORCE } from 'app/core/constants/team-metric-setup/metric-setup-type';
import { READONLY_METRIC_TOOLTIP } from 'app/core/constants/team-metric-setup/readonly-metric-tooltip';
import { EMAIL_NOT_REQUIRED_PATTERN } from 'app/core/constants/validation-rules';
import { MetricSetup, TeamMetricSetting, TeamSetup } from 'app/core/models/metric';
import { MetricService } from 'app/core/services/metric/metric.service';

@Component({
  selector: 'app-salesforce-settings',
  templateUrl: './salesforce-settings.component.html',
  styleUrls: ['./salesforce-settings.component.scss'],
})

export class SalesforceSettingsComponent implements OnInit {
  public tooltipText = READONLY_METRIC_TOOLTIP;
  public isLoading = false;
  public error: string | null;
  public formGroup: FormGroup;
  public usersForm: FormGroup;

  @Input()
  public metricSetup = {} as MetricSetup;

  @Input()
  public isTeamOwnerOrAdmin: boolean;

  @Input()
  public teamId: number;

  @Input()
  public users: TeamMetricSetting[] = [];

  @Output()
  public close = new EventEmitter<void>();

  @Output()
  public showSources = new EventEmitter<void>();

  @Output()
  public update = new EventEmitter<void>();

  constructor(
    private metricService: MetricService,
    private formBuilder: FormBuilder
  ) {
  }

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: [{ value: this.metricSetup.metricName || '', disabled: !this.isTeamOwnerOrAdmin }, Validators.required],
      metricTarget: [{ value: this.metricSetup.metricTarget || '', disabled: !this.isTeamOwnerOrAdmin }],
      users: this.formBuilder.array([])
    });
    this.createUserFormGroup(this.users);
  }

  public showMetricSources(): void {
    this.showSources.emit();
  }

  public saveMetricSetup(): void {
    this.isLoading = true;
    const requests: Observable<void>[] = [];
    const users = this.formGroup.get('users') as FormArray;
    users.controls
      .filter(control => !control.pristine)
      .map(control => {
        const metricUserId = control.value.salesforceId;
        const userId = control.value.userId;
        const contractorMetric = {
          metricType: SALESFORCE,
          metricUserId
        };
        requests.push(this.metricService.updateContractorMetricConfig(contractorMetric, userId));
      });

    const teamMetric = {
      active: true,
      currentTeamMetric: true,
      id: this.metricSetup.id,
      metricName: this.formGroup.controls.name.value,
      metricTarget: this.formGroup.controls.metricTarget.value,
      type: SALESFORCE,
    } as TeamSetup;
    if (this.isTeamOwnerOrAdmin) {
      this.metricService.setupOrUpdateMetrics(this.teamId, teamMetric)
        .subscribe(
          () => this.updateContractorMetricConfig(requests),
          () => this.error = 'Error updating metric config.');
    } else {
      this.updateContractorMetricConfig(requests)
    }
  }

  public onClose(): void {
    this.close.emit();
  }

  private createUserFormGroup(users: TeamMetricSetting[]): void {
    const formArray = this.formGroup.get('users') as FormArray;
    users.map(user => {
      formArray.push(this.createUserForm(user));
    });
    this.formGroup.setControl('users', formArray);
  }

  private createUserForm(user: TeamMetricSetting): FormGroup {
    return this.formBuilder.group({
      salesforceId: [user.salesforceId, Validators.pattern(EMAIL_NOT_REQUIRED_PATTERN)],
      name: [user.printableName],
      userId: [user.id]
    });
  }

  private updateContractorMetricConfig(requests: Observable<void>[]): void {
    forkJoin(requests)
      .subscribe(
        () => true,
        () => {
          this.error = 'Error updating metric config';
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
          this.onClose();
          this.update.emit()
        }
      );
  }

}
