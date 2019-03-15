import { Component, HostBinding, OnInit } from '@angular/core';
import { DfActiveModal } from '@devfactory/ngx-df';
import { ReportsActivityDescription } from 'app/core/models/reports/reports-activity-description.model';

@Component({
  selector: 'app-reports-activity-modal',
  templateUrl: './reports-activity-modal.component.html',
  styleUrls: ['./reports-activity-modal.component.scss'],
})
export class ReportsActivityModalComponent implements OnInit {
  @HostBinding('class') _class: string = 'd-flex flex-column h-100';

  public activityDescription: ReportsActivityDescription;

  constructor(private activeModal: DfActiveModal) {}

  ngOnInit(): void {
    this.activityDescription = this.activeModal.data;
  }

  close(): void {
    this.activeModal.close();
  }
}
