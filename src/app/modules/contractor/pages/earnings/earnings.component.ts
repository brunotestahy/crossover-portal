import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  BREAKPOINT_CONFIG,
  DfModalService,
} from '@devfactory/ngx-df';
import { format, subWeeks } from 'date-fns';
import * as moment from 'moment';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { CurrentUserDetail } from 'app/core/models/identity';
import { EarningsRow, UserPayment } from 'app/core/models/payments';
import { PaymentFilters } from 'app/core/models/payments';
import { DownloadService } from 'app/core/services/download/download.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { PaymentInfoService } from 'app/core/services/payment-info/payment-info.service';
import { isApiError } from 'app/core/type-guards/is-api-error';
import { MyDashboardDatepickerComponent } from 'app/shared/components/my-dashboard-datepicker/my-dashboard-datepicker.component';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss'],
})
export class EarningsComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public isIncomeStatementLoading = false;
  public isPaymentReportLoading = false;
  public isLoading = false;

  public earnings: EarningsRow[] = [];
  public earningdate: Date;
  public userDetail: CurrentUserDetail | null = null;
  public error: string | null = null;
  public form: FormGroup;

  public isResponsive: boolean;
  public destroy$ = new Subject();

  @ViewChild(MyDashboardDatepickerComponent)
  public datePicker: MyDashboardDatepickerComponent;

  constructor(
    private identityService: IdentityService,
    private paymentInfoService: PaymentInfoService,
    private breakpointObserver: BreakpointObserver,
    private downloadService: DownloadService,
    private modal: DfModalService
  ) { }

  public ngOnInit(): void {
    this.breakpointObserver
      .observe(BREAKPOINT_CONFIG)
      .pipe(map(match => match.matches), takeUntil(this.destroy$))
      .subscribe(isResponsive => this.isResponsive = isResponsive);
    const todayDate = new Date();
    const eightWeeksBeforeToday = subWeeks(new Date(), 8);
    this.form = new FormGroup({
      from: new FormControl(eightWeeksBeforeToday, [Validators.required]),
      to: new FormControl(todayDate, [Validators.required]),
    });
    this.getCurrentUserDetail();
    this.getCurrentUserPayments();
    this.onChanges();
  }

  public onChanges(): void {
    this.form.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.getCurrentUserPayments();
      }
    });
  }

  public getCurrentUserDetail(): void {
    this.identityService.getCurrentUserDetail()
      .subscribe(userDetail => this.userDetail = userDetail
        , error => {
          if (isApiError(error)) {
            this.error = error.error.text;
          } else {
            this.error = 'Error fetching user details.';
          }
        });
  }

  public getCurrentUserPayments(): void {
    this.isLoading = true;
    const from = format(this.form.controls.from.value, 'YYYY-MM-DD');
    const to = format(this.form.controls.to.value, 'YYYY-MM-DD');
    this.paymentInfoService.getCurrentUserPayments(from, to)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((payments: UserPayment[]) => {
        this.error = null;
        this.earnings = this.getEarningsRow(payments);
      }, error => {
        if (isApiError(error)) {
          this.error = error.error.text;
        } else {
          this.error = 'Error fetching earnings.';
        }
      });
  }

  public downloadPaymentReport(): void {
    this.isPaymentReportLoading = true;
    const filters: PaymentFilters = {
      from: format(this.form.controls.from.value, 'YYYY-MM-DD'),
      to: format(this.form.controls.to.value, 'YYYY-MM-DD'),
    };
    this.paymentInfoService.getPaymentReport(filters)
      .pipe(finalize(() => this.isPaymentReportLoading = false))
      .subscribe(res => {
        const blob = new Blob([res], { type: 'text/csv' });
        const fileName = `earnings-report_${format(new Date(), 'MM-DD-YYYY')}.csv`;
        this.downloadService.download(blob, fileName);
      }, error => {
        if (isApiError(error)) {
          this.error = error.error.text;
        } else {
          this.error = 'Error downloading statement.';
        }
      });
  }

  public downloadIncomeStatement(): void {
    this.isIncomeStatementLoading = true;
    this.error = null;
    const filters: PaymentFilters = {
      from: format(this.form.controls.from.value, 'YYYY-MM-DD'),
      to: format(this.form.controls.to.value, 'YYYY-MM-DD'),
    };
    this.paymentInfoService.getIncomeStatement(filters)
      .pipe(finalize(() => this.isIncomeStatementLoading = false))
      .subscribe(res => {
        const fileName = `IncomeStatement.pdf`;
        const blob = new Blob([res], { type: 'application/pdf;charset=utf-8' });
        this.downloadService.download(blob, fileName);
      }, error => {
        if (isApiError(error)) {
          this.error = error.error.text;
        } else {
          this.error = 'Error downloading statement.';
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public openLogbook(template: ElementRef, data: { paymentWeekStartDate: string }): void {
    this.earningdate = moment(data.paymentWeekStartDate).toDate();
    this.modal.open(template, { customClass: 'x-large-modal' });
  }

  public onDateChange(date: Date): void {
    this.earningdate = date;
  }

  public setDateToToday(): void {
    this.earningdate = new Date();
    if (this.datePicker) {
      this.datePicker.setDate(this.earningdate);
    }
  }

  private getEarningsRow(payments: UserPayment[]): EarningsRow[] {
    return payments.map<EarningsRow>((e: UserPayment) => {
      return <EarningsRow>{
        team: e.team,
        paymentPlatform: e.platform.toLowerCase(),
        loggedHours: e.workedHours ? e.workedHours : '-',
        manual: e.manualHours ? e.manualHours : '-',
        disputed: e.disputedHours ? e.disputedHours : '',
        paymentHours: e.paidHours ? e.paidHours : '',
        weeklyLimit: e.weeklyHourLimit,
        netPayment: e.amount,
        paymentStatus: e.status.toLowerCase(),
        paymentWeekStartDate: e.periodStartDate,
      };
    })
      .sort((previous, current) => current.paymentWeekStartDate.localeCompare(previous.paymentWeekStartDate));
  }
}
