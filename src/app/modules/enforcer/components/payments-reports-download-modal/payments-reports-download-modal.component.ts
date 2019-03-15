import { Component, OnInit } from '@angular/core';
import { DfActiveModal } from '@devfactory/ngx-df';
import { format } from 'date-fns';

import { PaymentsPlatform, PaymentsStatus, PaymentsType, PaymentsUnit } from 'app/core/constants/enforcer/payments';
import { DownloadService } from 'app/core/services/download/download.service';
import { FinanceService } from 'app/core/services/finance/finance.service';
import { decodeErrorMessage } from 'app/utils/api-utilities';

@Component({
  selector: 'app-payments-reports-download-modal',
  templateUrl: './payments-reports-download-modal.component.html',
  styleUrls: ['./payments-reports-download-modal.component.scss'],
})
export class PaymentsReportsDownloadModalComponent implements OnInit {

  public filterResultsCount: number = -1;
  public platforms: { [key: string]: boolean } = {};
  public types: { [key: string]: boolean } = {};
  public units: { [key: string]: boolean } = {};
  public statuses: { [key: string]: boolean } = {};
  public error: string | null;

  public filterEnums: {
    Platform: typeof PaymentsPlatform;
    Type: typeof PaymentsType;
    Unit: typeof PaymentsUnit;
    Status: typeof PaymentsStatus;
  } = {
    Platform: PaymentsPlatform,
    Type: PaymentsType,
    Unit: PaymentsUnit,
    Status: PaymentsStatus,
  };

  public isDownloadDisabled: boolean;

  constructor(
    private activeModal: DfActiveModal,
    private financeService: FinanceService,
    private downloadService: DownloadService
  ) {}

  public ngOnInit(): void {
    this.platforms[PaymentsPlatform.Payoneer] = true;
    this.types[PaymentsType.Weekly] = true;
    this.units[PaymentsUnit.Hour] = true;
    this.statuses[PaymentsStatus.Ready] = true;
    this.isDownloadDisabled = false;
    this.changeFilterAndQuery();
  }

  public changeFilterAndQuery(): void {
    this.filterResultsCount = -1;

    this.isDownloadDisabled =
      this.isAnyKeyTrue(this.platforms) ||
      this.isAnyKeyTrue(this.types) ||
      this.isAnyKeyTrue(this.units) ||
      this.isAnyKeyTrue(this.statuses);

    if (!this.isDownloadDisabled) {
      this.financeService
      .getPaymentsCount(
        this.filterObjectToQueryArray(this.platforms),
        this.filterObjectToQueryArray(this.types),
        this.filterObjectToQueryArray(this.units),
        this.filterObjectToQueryArray(this.statuses),
        format(this.activeModal.data.weekStartDate, 'YYYY-MM-DD')
      )
      .subscribe(data => {
        this.filterResultsCount = data.count;
      });
    } else {
      this.filterResultsCount = 0;
    }
  }

  public downloadReports(): void {
    this.financeService
      .downloadPaymentsReport(
        this.filterObjectToQueryArray(this.platforms),
        this.filterObjectToQueryArray(this.types),
        this.filterObjectToQueryArray(this.units),
        this.filterObjectToQueryArray(this.statuses),
        format(this.activeModal.data.weekStartDate, 'YYYY-MM-DD')
      )
      .subscribe(data => {
        const fileName = `Payment Report for ${format(this.activeModal.data.weekStartDate, 'YYYY-MM-DD')}.csv`;
        const blob = new Blob([data], { type: 'text/csv' });
        this.downloadService.download(blob, fileName);
      },
      error => this.error = decodeErrorMessage(error, 'Error exporting insights report'));
    this.activeModal.close();
  }

  public close(): void {
    this.activeModal.close();
  }

  private isAnyKeyTrue(obj: { [key: string]: boolean }): boolean {
    return Array.from(Object.keys(obj)).filter(keyValue => obj[keyValue]).length === 0;
  }

  private filterObjectToQueryArray(filterObject: {
    [key: string]: boolean;
  }): string[] {
    let queryArray: string[] = Array.from({ length: Object.keys(filterObject).length });
    queryArray = queryArray
      .map((_item, index) => Object.keys(filterObject)[index])
      .filter(item => filterObject[item]);
    return queryArray;
  }
}
