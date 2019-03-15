import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DfLoadingSpinnerService } from '@devfactory/ngx-df';

import { JobApplication } from 'app/core/models/application';
import { CandidateService } from 'app/core/services/candidate/candidate.service';

@Component({
  selector: 'app-meet-your-advocate',
  templateUrl: './meet-your-advocate.component.html',
  styleUrls: ['./meet-your-advocate.component.scss'],
})
export class MeetYourAdvocateComponent implements OnInit {

  public static readonly STEP_NO = 4;
  public static readonly ERROR = 'Skype Id failed to update';
  public static readonly SUCCESS = 'Skype Id was successfully saved';

  public application: JobApplication;
  public skypeId: FormControl = new FormControl('', [Validators.required]);
  public error: string;
  public success: string;

  constructor(private candidateService: CandidateService,
              private loader: DfLoadingSpinnerService) {}

  public ngOnInit(): void {
    this.loader.showLoader({});

    const body = document.querySelector('.application-process__body') as HTMLBodyElement;
    body.scrollTop = 0;

    this.fetchApplication();
  }

  public updateSkypeId(): void {
    this.loader.showLoader({});
    this.application.candidate.skypeId = this.skypeId.value;
    this.candidateService.updateCandidate(this.application.candidate)
      .subscribe(
        () => {
          this.loader.hide();
          this.error = '';
          this.success = MeetYourAdvocateComponent.SUCCESS;
        },
        () => {
          this.loader.hide();
          this.success = '';
          this.error = MeetYourAdvocateComponent.ERROR;
        }
      );
  }

  private fetchApplication(): void {
    this.candidateService.getCurrentApplication()
      .subscribe((application: JobApplication) => {
        this.application = application;
        this.skypeId.setValue(application.candidate.skypeId);
        this.loader.hide();
      });
  }
}
