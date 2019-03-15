import { Component, OnInit } from '@angular/core';
import { DfActiveModal } from '@devfactory/ngx-df';

import { JobDetails } from 'app/core/models/hire';

@Component({
  selector: 'app-job-description-modal',
  templateUrl: './job-description-modal.component.html',
  styleUrls: ['./job-description-modal.component.scss']
})
export class JobDescriptionModalComponent implements OnInit {
  public job: JobDetails;

  constructor(
    private activeModal: DfActiveModal
  ) {
  }

  public ngOnInit(): void {
    this.job = this.activeModal.data;
  }

  public close(): void {
    this.activeModal.close();
  }
}
