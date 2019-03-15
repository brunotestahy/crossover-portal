import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { BREAKPOINT_CONFIG } from '@devfactory/ngx-df';
import { format } from 'date-fns';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { GetInterviewReportParam, InterviewReport } from 'app/core/models/interview-report';
import { PaginatedApi } from 'app/core/models/paginated-api';
import { DownloadService } from 'app/core/services/download/download.service';
import { ReportService } from 'app/core/services/report/report.service';
import { isApiError } from 'app/core/type-guards/is-api-error';

@Component({
  selector: 'app-pending-interview-offers',
  templateUrl: './pending-interview-offers.component.html',
  styleUrls: ['./pending-interview-offers.component.scss'],
})
export class PendingInterviewOffersComponent implements OnInit {
  public readonly MODE = 'pending';
  public avatar = 'ADMIN';

  public noDataMessage = 'No pending interview offers found.';
  public error: string | null = null;

  public data: InterviewReport[] = [];
  public collectionSize = 0;
  public currentPage = 1;
  public pageSize = 100;
  public totalCount: number;

  public isResponsive = false;
  public isLoading = false;

  public destroy$ = new Subject();

  constructor(
    private reportService: ReportService,
    private breakpointObserver: BreakpointObserver,
    private downloadService: DownloadService
  ) { }

  public ngOnInit(): void {
    this.breakpointObserver
      .observe(BREAKPOINT_CONFIG)
      .pipe(takeUntil(this.destroy$))
      .subscribe(match => {
        this.isResponsive = match.matches;
      });
    this.loadData();
  }

  public onPageChange(page: number): void {
    this.currentPage = page;
    this.loadData();
  }

  public downloadCsv(): void {
    this.isLoading = true;
    this.reportService.getInterviewReportFile(this.MODE, this.avatar).subscribe(data => {
      this.isLoading = false;
      const fileName = `Pending-interviews-offers_${format(new Date(), 'MM-DD-YYYY')}.csv`;
      const blob = new Blob([data], { type: 'text/csv' });
      this.downloadService.download(blob, fileName);
    });
  }

  public loadData(): void {
    this.isLoading = true;
    const param: GetInterviewReportParam = {
      reportType: this.MODE,
      avatarType: this.avatar,
      page: this.currentPage - 1,
      pageSize: this.pageSize,
    };
    this.reportService.getInterviewReport(param).subscribe((res: PaginatedApi<InterviewReport>) => {
      this.collectionSize = res.totalElements;
      this.data = res.content;
      this.totalCount = res.totalElements;
      this.isLoading = false;
    },
      error => {
        this.isLoading = false;
        if (isApiError(error)) {
          this.error = error.error.text;
        } else {
          this.error = 'Error fetching pending interview offers.';
        }
      });
  }
}
