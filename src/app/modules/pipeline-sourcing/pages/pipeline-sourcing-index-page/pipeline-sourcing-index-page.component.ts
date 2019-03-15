import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { BREAKPOINT_CONFIG, DfToasterService } from '@devfactory/ngx-df';
import { differenceInDays } from 'date-fns';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { JobSourcingForm, JobSourcingRow } from 'app/core/models/job-sourcing';
import { CommonService } from 'app/core/services/common/common.service';
import { PipelineSourcingService } from 'app/core/services/pipeline-sourcing/pipeline-sourcing.service';
import { isApiError } from 'app/core/type-guards/is-api-error';

@Component({
  selector: 'app-pipeline-sourcing-index-page',
  templateUrl: './pipeline-sourcing-index-page.component.html',
  styleUrls: ['./pipeline-sourcing-index-page.component.scss'],
})
export class PipelineSourcingIndexPageComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public total = 0;
  public totalDay = 0;
  public totalWeek = 0;
  public isResponsive: boolean;
  public sourcingRow: JobSourcingRow[] = [];
  public error: string | null;
  public isLoading = false;

  public destroy$ = new Subject();
  public readonly today = new Date();

  constructor(
    private pipelineSourcingService: PipelineSourcingService,
    private toasterService: DfToasterService,
    private commonService: CommonService,
    private breakpointObserver: BreakpointObserver
  ) { }

  public ngOnInit(): void {
    this.breakpointObserver
      .observe(BREAKPOINT_CONFIG)
      .pipe(takeUntil(this.destroy$))
      .subscribe(match => {
        this.isResponsive = match.matches;
      });
    this.getJobsSourcing();
  }

  public getJobsSourcing(): void {
    this.isLoading = true;
    this.pipelineSourcingService.getJobsSourcing()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
        sourcing => {
          this.isLoading = false;
          this.total = sourcing.total;
          this.totalDay = sourcing.totalDay;
          this.totalWeek = sourcing.totalWeek;
          this.sourcingRow = sourcing.pipelineStatistics.map(e => {
            return {
              jobId: e.id,
              jobName: e.job.title,
              priority: e.job.priority,
              daysOpen: e.job.calibration && e.job.calibration.activatedOn ?
                differenceInDays(this.today, e.job.calibration.activatedOn) : null,
              demand: e.job.demand,
              total: e.applicationsCount,
              lastDay: e.applicationsCountDay,
              last7Days: e.applicationsCountWeek,
              quality: e.qualityCount,
              quality1d: e.qualityCountDay,
              quality7d: e.qualityCountWeek,
              sourcingInstructions: e.job.sourcingInstructions,
              jbp: e.job.jbpEnabled,
              jbpInstructions: e.job.jbpInstructions,
              outbound: e.job.outboundEnabled,
              outboundInstructions: e.job.outboundInstructions,
            };
          });
        },
        error => {
          if (isApiError(error)) {
            this.error = error.error.text;
          } else {
            this.error = 'Error loading pipeline sourcing.';
          }
        });
  }

  public exportCsv(): boolean {
    const fileName = 'pipeline-sourcing.csv';
    const header = [
      'Job ID',
      'Job Name',
      'Priority',
      'Days Open',
      'Demand',
      'Total #',
      'Last Day',
      'Last 7 Days',
      '#Quality',
      '#Quality 1d',
      '#Quality 7d',
      'Sourcing Instructions',
      'JBP',
      'JBP Instructions',
      'Outbound',
      'Outbound Instructions',
    ];
    const data = this.sourcingRow.map(e => {
      return [
        e.jobId.toString(),
        e.jobName,
        e.priority ? e.priority.toString() : '-',
        e.daysOpen ? e.daysOpen.toString() : '-',
        e.demand !== undefined && e.demand !== null ? e.demand.toString() : '-',
        e.total.toString(),
        e.lastDay.toString(),
        e.last7Days.toString(),
        e.quality.toString(),
        e.quality1d.toString(),
        e.quality7d.toString(),
        e.sourcingInstructions as string,
        e.jbp.toString(),
        e.jbpInstructions as string,
        e.outbound.toString(),
        e.outboundInstructions as string,
      ];
    });
    const blob = this.commonService.generateCsv(header, data);
    return this.commonService.download(blob, fileName);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onRowChange(job: JobSourcingRow): void {
    /* istanbul ignore else */
    if (job) {
      const data: JobSourcingForm = {
        jbpEnabled: job.jbp,
        jbpInstructions: job.jbpInstructions,
        outboundEnabled: job.outbound,
        outboundInstructions: job.outboundInstructions,
        priority: job.priority ? job.priority : '',
        sourcingInstructions: job.sourcingInstructions,
      };
      this.pipelineSourcingService.updateJobSourcing(job.jobId, data)
        .subscribe(() => {
          this.toasterService.popSuccess(
            `Job ${job.jobName} (${job.jobId}) updated successfully.`
          );
        },
          () =>
            this.toasterService.popError(
              `Job ${job.jobName} (${job.jobId}) failed to update.`
            )
        );
    }
  }
}
