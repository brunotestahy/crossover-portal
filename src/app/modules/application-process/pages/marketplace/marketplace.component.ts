import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DfLoadingSpinnerOptions, DfLoadingSpinnerService, DfToasterService } from '@devfactory/ngx-df';

import { JobApplication } from 'app/core/models/application';
import { CandidateService } from 'app/core/services/candidate/candidate.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
})
export class MarketplaceComponent implements OnInit {

  public static readonly ERROR = 'Error happened while sending your questions. Please try again later';

  public application: JobApplication;
  public questions: FormControl = new FormControl('', [Validators.required]);
  public error: string;

  constructor(
    private candidateService: CandidateService,
    private toasterService: DfToasterService,
    private loader: DfLoadingSpinnerService
  ) { }

  public ngOnInit(): void {
    this.loader.showLoader(<DfLoadingSpinnerOptions>{});
    const body = document.querySelector('.application-process__body') as HTMLBodyElement;
    body.scrollTop = 0;
    this.candidateService.getCurrentApplication()
      .subscribe((application: JobApplication) => {
        this.application = application;
        this.loader.hide();
      });
  }

  public send(): void {
    this.loader.showLoader(<DfLoadingSpinnerOptions>{});
    this.candidateService.sendQuestions(this.application.id, this.application.job.id, this.questions.value)
      .subscribe(
        () => {
          this.error = '';
          this.loader.hide();
          this.toasterService.popSuccess('Message sent to Talent Advocate');
        },
        () => {
          this.error = MarketplaceComponent.ERROR;
          this.loader.hide();
        }
      );
  }
}
