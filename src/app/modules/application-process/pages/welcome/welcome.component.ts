import { Component, OnInit } from '@angular/core';

import { ApplicationFlowStep, JobApplication } from 'app/core/models/application';
import { CandidateService } from 'app/core/services/candidate/candidate.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: [
    './welcome.component.scss',
    '../../shared/steps.scss',
  ],
})
export class WelcomeComponent implements OnInit {

  public data: JobApplication;
  public isLoading = true;
  public currentStep: number;
  public steps: ApplicationFlowStep[];

  constructor(private service: CandidateService) {
  }

  public ngOnInit(): void {
    this.service.getCurrentApplication()
      .subscribe((application: JobApplication) => {
        this.service.getSteps(application.applicationFlow.id)
          .subscribe((steps: ApplicationFlowStep[]) => {
            this.steps = steps;
            this.data = application;
            this.isLoading = false;
            this.currentStep = 1;
          });
      });
  }
}
