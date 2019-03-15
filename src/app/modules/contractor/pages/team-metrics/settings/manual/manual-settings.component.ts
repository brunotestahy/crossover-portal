import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addWeeks, endOfWeek, format, startOfWeek, subWeeks } from 'date-fns';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import { MANUAL } from 'app/core/constants/team-metric-setup/metric-setup-type';
import { READONLY_METRIC_TOOLTIP } from 'app/core/constants/team-metric-setup/readonly-metric-tooltip';
import { EventWithInputTarget } from 'app/core/models/browser';
import {
  ManualMetricRecord, MetricSetup, MetricValues, TeamSetup, WeekMetrics,
} from 'app/core/models/metric';
import { MetricService } from 'app/core/services/metric/metric.service';

@Component({
  selector: 'app-manual-settings',
  templateUrl: './manual-settings.component.html',
  styleUrls: ['./manual-settings.component.scss'],
})
export class ManualSettingsComponent implements OnInit {
  public tooltipText = READONLY_METRIC_TOOLTIP;

  public error: string | null = null;

  public isLoading = false;

  public selectedTab: number;

  public formGroup: FormGroup;

  public teamMetrics: ManualMetricRecord[] = [];

  public weekHeaders: string[] = [];

  public selectedWeek: Date;

  public selectedWeekIndex = 2;

  public metricValues: MetricValues[];
  public todaysDate = new Date();
  public startWeekIndex = 8;
  public endWeekIndex = 13;
  public readonly maxWeekCount = 12;

  @Input()
  public metricSetup: MetricSetup;

  @Input()
  public isTeamOwnerOrAdmin = false;

  @Input()
  public teamId: number;

  @Input()
  public managerId: number;

  @Output()
  public close = new EventEmitter<void>();

  @Output()
  public update = new EventEmitter<void>();

  @Output()
  public showSources = new EventEmitter<void>();

  constructor(
    private metricService: MetricService,
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
    this.isLoading = true;
    const startOfIsoWeek = { weekStartsOn: 1 };
    this.formGroup = this.formBuilder.group({
      name: [{ value: this.metricSetup.metricName || '', disabled: !this.isTeamOwnerOrAdmin }, Validators.required],
      metricTarget: [{ value: this.metricSetup.metricTarget || '', disabled: !this.isTeamOwnerOrAdmin }],
    });
    const from = subWeeks(startOfWeek(this.todaysDate, startOfIsoWeek), this.maxWeekCount);
    const to = endOfWeek(this.todaysDate, startOfIsoWeek);
    this.getMetricValues(from, to);
    this.buildWeekHeaders(from, this.maxWeekCount);
  }

  public showMetricSources(): void {
    this.showSources.emit();
  }

  public getMetricValues(from: Date, to: Date): void {
    const params = {
      teamId: this.teamId,
      from: format(from, 'YYYY-MM-DD'),
      to: format(to, 'YYYY-MM-DD'),
      costInclusive: false,
      managerId: this.managerId,
    };
    const startOfIsoWeek = { weekStartsOn: 1 };
    const startDate = format(startOfWeek(this.todaysDate, startOfIsoWeek), 'YYYY-MM-DD');
    this.metricService.getTeamMetricsValuesV2(params)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(metricValues => {
        metricValues = metricValues
          .filter(metricValue => metricValue.stats.some(stat => stat.activeWeek === true && stat.startDate === startDate));
        this.teamMetrics = metricValues
          .map(value => ({
            name: value.name,
            weeks: this.getWeekState(value.stats),
            contractorId: value.assignmentId
          }));
      }, () => this.error = 'Error fetching metric values.');
  }

  public nextFourWeeks(): void {
    const maxWeekIndex = 2;
    if (this.selectedWeekIndex < maxWeekIndex) {
      this.selectedWeekIndex++;
      this.startEndWeeKIndex();
    }
  }

  public previousFourWeeks(): void {
    const minWeekIndex = 0;
    if (this.selectedWeekIndex > minWeekIndex) {
      this.selectedWeekIndex--;
      this.startEndWeeKIndex();
    }
  }

  public isPreviousDisabled(): boolean {
    const minWeekIndex = 0;
    return this.selectedWeekIndex === minWeekIndex;
  }

  public isNextDisabled(): boolean {
    const maxWeekIndex = 2;
    return this.selectedWeekIndex === maxWeekIndex;
  }

  public startEndWeeKIndex(): void {
    const weekIndexZero = 0;
    const weekIndexOne = 1;
    const weekIndexTwo = 2;
    switch (this.selectedWeekIndex) {
      case weekIndexZero:
        this.startWeekIndex = 0;
        this.endWeekIndex = 4;
        break;
      case weekIndexOne:
        this.startWeekIndex = 4;
        this.endWeekIndex = 8;
        break;
      case weekIndexTwo:
        this.startWeekIndex = 8;
        this.endWeekIndex = 13;
        break;
      default:
        break;
    }
  }

  public getFieldName(index: number): string {
    const columnCount = 4;
    const newIndex = columnCount * this.selectedWeekIndex + index;
    const columnName = `week${newIndex}` as string;
    return `weeks.${columnName}.ticketsResolved`;
  }

  public getFieldValue(item: ManualMetricRecord, index: number): number {
    const columnCount = 4;
    const newIndex = columnCount * this.selectedWeekIndex + index;
    const columnName = `week${newIndex}` as string;
    return item.weeks[columnName].ticketsResolved as number;
  }

  public isCellEditable(item: ManualMetricRecord, index: number): boolean {
    const columnCount = 4;
    const newIndex = columnCount * this.selectedWeekIndex + index;
    const columnName = `week${newIndex}` as string;
    return item.weeks[columnName].activeWeek as boolean;
  }

  public updateRow(event: EventWithInputTarget, item: ManualMetricRecord, index: number): void {
    const columnCount = 4;
    const newIndex = columnCount * this.selectedWeekIndex + index;
    const columnName = `week${newIndex}` as string;
    this.teamMetrics
      .filter(metric => metric.contractorId === item.contractorId)
      .map(metric => metric.weeks[columnName].ticketsResolved = +event.target.value);
  }

  public saveSetup(): void {
    this.isLoading = true;
    const teamMetric = {
      active: true,
      currentTeamMetric: true,
      metricName: this.formGroup.controls.name.value,
      metricTarget: this.formGroup.controls.metricTarget.value,
      type: MANUAL,
      ...this.metricSetup.id && { id: this.metricSetup.id },
    } as TeamSetup;
    const requests: Observable<void>[] = [];
    this.teamMetrics.forEach(contractor => {
      const contractorMetric = this.buildContractorMetric(contractor);
      const contractorId = contractor.contractorId;
      requests.push(this.metricService.saveContractorManualMetric(contractorMetric, contractorId));
    });
    this.metricService.setupOrUpdateMetrics(this.teamId, teamMetric)
      .subscribe(() => {
        this.updateContractorManualMetric(requests);
      }, () => this.error = 'Error updating metric setup.');
  }



  public onClose(): void {
    this.close.emit();
  }

  private getWeekState(states: WeekMetrics[]): { [key: string]: WeekMetrics } {
    const weeks: { [key: string]: WeekMetrics } = {};
    states.map((state, index) => {
      const key = `week${index}`;
      return weeks[key] = {
        assignmentHistoryId: state.assignmentHistoryId,
        activeWeek: state.activeWeek,
        hoursWorked: state.hoursWorked,
        id: state.assignmentId,
        startDate: state.startDate,
        ticketsResolved: state.activeWeek ? state.ticketsResolved : '-',
        type: state.type,
        weekSalary: state.weekSalary
      } as WeekMetrics;
    });
    return weeks;
  }

  private updateContractorManualMetric(requests: Observable<void>[]): void {
    forkJoin(requests)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(() => {
        this.onClose();
        this.update.emit()
      }, () => this.error = 'Error updating manual setting');
  }

  private buildContractorMetric(contractor: ManualMetricRecord): WeekMetrics[] {
    const metricValues = Array.from({ length: this.maxWeekCount + 1 })
      .map((_item, index) => {
        const columnName = `week${index}`;
        return {
          activeWeek: true,
          assignmentHistoryId: contractor.weeks[columnName].assignmentHistoryId,
          hoursWorked: contractor.weeks[columnName].hoursWorked,
          id: contractor.weeks[columnName].id ? contractor.weeks[columnName].id : null,
          startDate: contractor.weeks[columnName].startDate,
          ticketsResolved: contractor.weeks[columnName].ticketsResolved === '-' ? 0 : contractor.weeks[columnName].ticketsResolved,
          type: MANUAL,
          weekSalary: contractor.weeks[columnName].weekSalary,
          cost: contractor.weeks[columnName].weekSalary,
        }
      });
    return metricValues;
  }

  private buildWeekHeaders(currentWeek: Date, weekCount: number): void {
    const startOfIsoWeek = { weekStartsOn: 1 };
    this.weekHeaders = Array.from({ length: weekCount + 1 })
      .map((_entry, index) => {
        const week = addWeeks(currentWeek, index);
        const weekStart = startOfWeek(week, startOfIsoWeek);
        const weekEnd = endOfWeek(week, startOfIsoWeek);
        return `${format(weekStart, 'MMM DD')} - ${format(weekEnd, 'MMM DD')}`;
      });
  }
}
