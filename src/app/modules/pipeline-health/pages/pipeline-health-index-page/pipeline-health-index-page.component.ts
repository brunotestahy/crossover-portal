import { BreakpointObserver } from '@angular/cdk/layout';
import {
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  BREAKPOINT_CONFIG,
  DfDonutRange,
  DfGroupToggleItem,
  DfModalOptions,
  DfModalService,
  DfModalSize,
} from '@devfactory/ngx-df';
import { addDays, differenceInDays, endOfWeek, format, startOfWeek, subWeeks } from 'date-fns';
import { first, map, switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { COLORS } from 'app/core/constants/colors';
import { JobHealth, JobHealthJob } from 'app/core/models/job-health';
import { PipelineHealthFiltersOptions } from 'app/core/models/job-health/pipeline-health-filters-options.model';
import { Indicator } from 'app/core/models/job-health/pipeline-health-indicator.model';
import { PipelineHealthRow } from 'app/core/models/job-health/pipeline-health-row.model';
import { PipelineHealthService } from 'app/core/services/pipeline-health/pipeline-health.service';

@Component({
  selector: 'app-pipeline-health-index-page',
  templateUrl: './pipeline-health-index-page.component.html',
  styleUrls: ['./pipeline-health-index-page.component.scss'],
})
export class PipelineHealthIndexPageComponent implements OnInit, OnDestroy {
  private readonly FLOWTYPE_FIVEQ = 'FIVEQ';
  private readonly FLOWTYPE_HACKERRANK = 'HACKERRANK';

  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public selectedJob: JobHealthJob;
  public data: PipelineHealthRow[] = [];
  public error: string | null = null;
  public isLoading = false;
  public isResponsive: boolean;

  public readonly today = new Date();

  public jobTypeItems = [
    <DfGroupToggleItem> {
      text: 'High Flow',
      id: 'GENERIC',
    },
    <DfGroupToggleItem> {
      text: 'Custom',
      id: 'CUSTOM',
    },
  ] as DfGroupToggleItem[];

  public periodItems = [
    <DfGroupToggleItem> {
      text: 'Total',
      id: 'TOTAL',
    },
    <DfGroupToggleItem> {
      text: 'Weekly',
      id: 'WEEKLY',
    },
  ] as DfGroupToggleItem[];

  public form: FormGroup;
  public weekStartDate: Date = subWeeks(addDays(startOfWeek(this.today), 1), 1);
  public currentWeekDays: Date[] = this.getCurrentWeekDays();

  public yellowRange: DfDonutRange = {
    color: COLORS.yellow,
    range: [0, 1],
  };
  public redRange: DfDonutRange = {
    color: COLORS.red,
    range: [0, 1],
  };
  public greenRange: DfDonutRange = {
    color: COLORS.green,
    range: [0, 1],
  };

  public greyRange: DfDonutRange = {
    color: COLORS.grey2,
    range: [0, 1],
  };

  public barYellow = {
    progressBarFillColor: COLORS.yellow,
    textColor: COLORS.greyMain,
    progressBarColor: COLORS.grey2,
  };

  public barRed = {
    progressBarFillColor: COLORS.red,
    textColor: COLORS.greyMain,
    progressBarColor: COLORS.grey2,
  };

  public barGreen = {
    progressBarFillColor: COLORS.green,
    textColor: COLORS.greyMain,
    progressBarColor: COLORS.grey2,
  };

  public barGrey = {
    progressBarFillColor: COLORS.grey2,
    textColor: COLORS.greyMain,
    progressBarColor: COLORS.grey2,
  };

  public ranges: Record<Indicator, DfDonutRange> = {
    red: this.redRange,
    yellow: this.yellowRange,
    green: this.greenRange,
    grey: this.greyRange,
  };

  public bars: Record<Indicator, DfDonutRange> = {
    red: Object.assign(this.barRed) as DfDonutRange,
    yellow: Object.assign(this.barYellow) as DfDonutRange,
    green: Object.assign(this.barGreen) as DfDonutRange,
    grey: Object.assign(this.barGrey) as DfDonutRange,
  };

  public destroy$ = new Subject();

  @ViewChild('hiringManagersModalTemplate')
  public hiringManagersModalTemplate: TemplateRef<{}>;

  constructor(
    private pipelineHealthService: PipelineHealthService,
    private breakpointObserver: BreakpointObserver,
    private modalService: DfModalService
  ) {}

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public weekFormatFn = (date: Date): string => {
    const start = addDays(startOfWeek(date), 1);
    const end = addDays(endOfWeek(date), 1);
    return `${format(start, 'MMM DD')} - ${format(end, 'MMM DD, YYYY')}`;
  }

  public ngOnInit(): void {
    this.breakpointObserver
      .observe(BREAKPOINT_CONFIG)
      .pipe(map(match => match.matches), takeUntil(this.destroy$))
      .subscribe(isResponsive => {
        this.isResponsive = isResponsive;
      });
    this.form = new FormGroup({
      jobType: new FormControl(this.jobTypeItems[0]),
      period: new FormControl(this.periodItems[1]),
      week: new FormControl(this.weekStartDate),
      search: new FormControl(),
    });

    this.form.controls['jobType'].valueChanges
      .pipe(switchMap(() => this.form.valueChanges.pipe(first())))
      .subscribe(value => this.search(value));
    this.form.controls['period'].valueChanges
      .pipe(switchMap(() => this.form.valueChanges.pipe(first())))
      .subscribe(value => this.search(value));
    this.form.controls['week'].valueChanges
      .pipe(switchMap(() => this.form.valueChanges.pipe(first())))
      .subscribe(value => {
        this.weekStartDate = addDays(startOfWeek(value.week), 1);
        this.search(value);
      });

    this.search(this.form.value);
  }

  public search(formValue: {
    jobType: { id: PipelineHealthFiltersOptions['jobType'] },
    period: DfGroupToggleItem,
    search: string,
  }): void {
    this.isLoading = true;
    if (formValue.period === this.periodItems[0]) {
      this.pipelineHealthService
        .getJobsHealth({
          options: {
            jobType: formValue.jobType.id,
            searchQuery: formValue.search,
          },
        })
        .pipe(map(data => data.map(d => this.normalizeDataToRow(d))))
        .subscribe(data => {
          this.data = data;
          this.isLoading = false;
        });
    } else {
      this.pipelineHealthService
        .getJobsHealthWeek({
          startOfWeek: this.weekStartDate,
          options: {
            jobType: formValue.jobType.id,
            searchQuery: formValue.search,
          },
        })
        .pipe(map(data => data.map(d => this.normalizeDataToRow(d))))
        .subscribe(data => {
          this.data = data;
          this.isLoading = false;
        });
    }
  }

  public normalizeDataToRow(data: JobHealth): PipelineHealthRow {
    const isWritten = this.isWrittenJob(data);
    const demand = data.job.demand ? data.job.demand : 5;
    const totalHiresAndDemands = demand + data.hiresCount;
    let hiresPercentage: number;
    if (totalHiresAndDemands > 0) {
      hiresPercentage = data.hiresCount / totalHiresAndDemands;
    } else {
      hiresPercentage = 0;
    }

    let hiresIndicator: Indicator;
    if (this.form.value.period === this.periodItems[0]) {
      if (hiresPercentage >= 0.75) {
        hiresIndicator = 'green';
      } else if (hiresPercentage >= 0.5) {
        hiresIndicator = 'yellow';
      } else {
        hiresIndicator = 'red';
      }
    } else {
      hiresIndicator = data.hiresIndicator.toLowerCase() as Indicator;
    }

    return {
      jobId: data.job.id,
      job: data.job,
      applications: data.applicationsCount,
      applicationsIndicator: data.applicationsIndicator.toLowerCase() as Indicator,
      demand: demand,
      demandIsAuto: !data.job.demand,
      hires: data.hiresCount,
      hiresIndicator: hiresIndicator,
      hiresPercent: hiresPercentage,
      interviews: data.interviewsCount,
      interviewsIndicator: data.interviewsIndicator.toLowerCase() as Indicator,
      jobTitle: `${data.job.title} (${data.job.id})`,
      daysSinceOpen: data.job.activationDate
        ? differenceInDays(this.today, data.job.activationDate)
        : 'N/A',
      daysSinceOpenSort: data.job.activationDate
        ? differenceInDays(this.today, data.job.activationDate)
        : -1,
      interviewsTimeAgo:
        (data.lastInterviewDate
          ? differenceInDays(this.today, data.lastInterviewDate)
          : '0') + ' days ago',
      managers: data.job.visibleManagers,
      marketplace: data.marketplaceCount,
      marketplaceIndicator: data.marketplaceIndicator.toLowerCase() as Indicator,
      marketplaceTimeAgo:
        (data.lastArriveInMP
          ? differenceInDays(this.today, data.lastArriveInMP)
          : '0') + ' days ago',
      payband: data.job.yearSalary ? data.job.yearSalary + ',000/year' : '',
      projectWrittenEvaluation: isWritten ? data.test1Count : data.test2Count,
      projectWrittenEvaluationIndicator: this.getEvaluationIndicatorClass(data),
      technicalScreen: isWritten ? 'N/A' : data.test1Count,
      technicalScreenSort: isWritten ? -1 : data.test1Count,
      technicalScreenIndicator:
        data.test1Indicator ? this.getIndicatorClass(<Indicator>data.test1Indicator.toLowerCase(), data) :
          this.getIndicatorClass(null, data),
    };
  }

  public progressBarTextGenerator(
    data: PipelineHealthRow,
    key: keyof PipelineHealthRow
  ): Function {
    return () => data[key];
  }

  public get isCustom(): boolean {
    return this.form.value.jobType === this.jobTypeItems[1];
  }

  public openHiringManagersModal(job: JobHealthJob): void {
    this.selectedJob = job;
    this.modalService.open(this.hiringManagersModalTemplate, <DfModalOptions>{ size: DfModalSize.Large });
  }

  public sortByPayband(data: PipelineHealthRow[], _fieldName: string, sortOrder: number): void {
    data.sort((a: PipelineHealthRow, b: PipelineHealthRow) => {
      return sortOrder === 1 ?
        b.job.yearSalary - a.job.yearSalary :
        a.job.yearSalary - b.job.yearSalary;
    });
  }

  public sortbyDaysOpen(data: PipelineHealthRow[], _fieldName: string, sortOrder: number): void {
    data.sort((a: PipelineHealthRow, b: PipelineHealthRow) => {
      return sortOrder === 1 ?
        b.daysSinceOpenSort - a.daysSinceOpenSort :
        a.daysSinceOpenSort - b.daysSinceOpenSort;
    });
  }

  public sortbyTechnicalScreen(data: PipelineHealthRow[], _fieldName: string, sortOrder: number): void {
    data.sort((a: PipelineHealthRow, b: PipelineHealthRow) => {
      return sortOrder === 1 ?
        b.technicalScreenSort - a.technicalScreenSort :
        a.technicalScreenSort - b.technicalScreenSort;
    });
  }

  private isWrittenJob(data: JobHealth): boolean {
    return data.job && (data.job.flowType === this.FLOWTYPE_FIVEQ || data.job.flowType ===
      this.FLOWTYPE_HACKERRANK || !data.job.flowType);
  }

  private getEvaluationIndicatorClass(data: JobHealth): Indicator {
    if (this.isWrittenJob(data)) {
      return data.test1Indicator ? this.getIndicatorClass(<Indicator>data.test1Indicator.toLowerCase(), data) : 'red';
    } else {
      return data.test2Indicator ? this.getIndicatorClass(<Indicator>data.test2Indicator.toLowerCase(), <JobHealth> {}) : 'red';
    }
  }

  private getIndicatorClass(value: Indicator| null, data: JobHealth): Indicator {
    if (this.isWrittenJob(data)) {
      return 'grey';
    }
    if (value) {
      return value;
    }
    return 'red';
  }

  private getCurrentWeekDays(): Date[] {
    const dates: Date[] = [];
    let start = startOfWeek(this.today);
    while (start < this.today) {
      dates.push(start);
      start = addDays(start, 1);
    }
    return dates;
  }
}
