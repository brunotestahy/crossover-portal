import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DfInfiniteTable, DfModalService } from '@devfactory/ngx-df';
import { PaymentsReportsDownloadModalComponent } from 'app/modules/enforcer/components/payments-reports-download-modal/payments-reports-download-modal.component';
import { startOfWeek, subWeeks } from 'date-fns';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  @ViewChild('paymentsTable') public paymentsTable: DfInfiniteTable;

  public form: FormGroup = new FormBuilder().group({ date: [new Date()] });
  public isLoading: boolean = false;
  public date: Date = new Date();

  public error: string;

  constructor(private modalService: DfModalService) {}

  public ngOnInit(): void {
  }

  public openDownloadModal(): void {
    this.modalService.open(PaymentsReportsDownloadModalComponent, {
      data: { weekStartDate: subWeeks(startOfWeek(new Date(), { weekStartsOn: 1}), 1) },
    });
  }
}
