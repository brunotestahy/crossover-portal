import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DfLoadingSpinnerOptions, DfLoadingSpinnerService } from '@devfactory/ngx-df';
import 'rxjs/add/operator/takeUntil';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, map } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { APPLICATION_PROCESS_STEPS_DEF } from 'app/core/constants/application-process/step-definition';
import { APPLICATION_MENU_ITEM } from 'app/core/constants/menu/items';
import { ApplicationFlowStep, JobApplication, StepDefinition } from 'app/core/models/application';
import { JobDetails } from 'app/core/models/hire';
import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { HireService } from 'app/core/services/hire/hire.service';
import { ApplicationProcessService } from 'app/modules/application-process/shared/application-process.service';

@Component({
  selector: 'app-application-process',
  templateUrl: './application-process.component.html',
  styleUrls: [
    './application-process.component.scss',
    '../../shared/steps.scss',
  ],
})
export class ApplicationProcessComponent implements OnInit, OnDestroy {
  private readonly CANDIDATE_WAITS_TESTS_SETUP = 'candidateWaitsTestSetup';
  private destroy$ = new Subject();

  @HostBinding('class')
  public readonly classes = 'd-flex flex-grow flex-column';

  public data: JobApplication;
  public job: JobDetails;
  public currentStep = 1;
  public steps: ApplicationFlowStep[];
  public highwayVisible = true;
  public isOpenApplication = true;

  @ViewChild('highway', {read: ElementRef})
  public highway: ElementRef;

  constructor(private candidateService: CandidateService,
              private hireService: HireService,
              private applicationProcessService: ApplicationProcessService,
              private router: Router,
              private route: ActivatedRoute,
              private breakpointObserver: BreakpointObserver,
              private loader: DfLoadingSpinnerService) {
  }

  public ngOnInit(): void {
    this.loader.showLoader(<DfLoadingSpinnerOptions>{});
    this.getApplicationData();

    this.breakpointObserver
      .observe(['(min-width: 992px)'])
      .takeUntil(this.destroy$)
      .subscribe(result => {
        this.highwayVisible = result.matches;
      });

    this.applicationProcessService.moveToStepSubmission$
      .takeUntil(this.destroy$)
      .subscribe(step => {
        this.currentStep = step;
        const nextStep = this.steps[step - 1];
        this.router.navigate([this.data.id, 'job', this.data.job.id, nextStep.clazz],
          {relativeTo: this.route});

        this.highway.nativeElement.scrollIntoView({
          inline: 'start',
          block: 'start',
          behavior: 'smooth',
        });
      });

    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map(e => e as NavigationEnd)
      )
      .takeUntil(this.destroy$)
      .subscribe(e => {
        this.loader.hide();
        if (e.url === APPLICATION_MENU_ITEM.link) {
          this.getApplicationData();
        }
      });
  }

  public highwayVisibility(): void {
    this.highwayVisible = !this.highwayVisible;
    if (!this.highwayVisible) {
      this.highway.nativeElement.scrollIntoView({
        inline: 'start',
        block: 'start',
        behavior: 'smooth',
      });
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  private getApplicationData(): void {
    this.candidateService.getCurrentApplication()
      .subscribe((application: JobApplication) => {
        if (!application) {
          this.isOpenApplication = false;
          return;
        }
        combineLatest(
          this.candidateService.getSteps(application.applicationFlow.id),
          this.hireService.getJob(application.job.id)
        )
        .subscribe(data => {
          this.steps = data[0];
          this.job = data[1];
          this.data = application;
          this.goToApplicationProcess(application);
        });
      });
  }

  private goToApplicationProcess(application: JobApplication): void {
    // if job has pending tests, navigate to pending test screen
    if (application.task === this.CANDIDATE_WAITS_TESTS_SETUP) {
      this.router.navigate(
        [application.id, 'job', application.job.id, 'testing-invite-pending'],
        {relativeTo: this.route}
      );
      return;
    }

    if (application.status === 'REJECTED') {
      this.router.navigate([application.id, 'job', application.job.id, 'rejected'],
        {relativeTo: this.route});
      return;
    }

    if (application.status === 'ACCEPTED') {
      this.currentStep = this.steps.length - 1;
      this.router.navigate([application.id, 'job', application.job.id, 'marketplace'],
        {relativeTo: this.route});
      return;
    }

    const currentStepDefinition: StepDefinition | undefined = APPLICATION_PROCESS_STEPS_DEF.find(step => {
      return step.tasks.indexOf(application.task) > -1;
    });

    /* istanbul ignore else */
    if (currentStepDefinition) {
      const substepIndex = currentStepDefinition.tasks.indexOf(application.task);
      this.decideApplicationProcessStep(application, currentStepDefinition, substepIndex);
    }
  }

  private decideApplicationProcessStep(application: JobApplication, currentStepDefinition: StepDefinition,
                                       substepIndex: number): void {
    // if backend task is mapped to first step , go to welcome screen
    if (application.task === APPLICATION_PROCESS_STEPS_DEF[0].tasks[0]) {
      this.router.navigate([application.id], {relativeTo: this.route});
      return;
    }
    const currentStep = this.steps.find(step => {
      return step.name === currentStepDefinition.name;
    });

    /* istanbul ignore else */
    if (currentStep) {
      const currentStepIndex = this.steps.indexOf(currentStep);
      this.currentStep = currentStepIndex + 1;
      const currentState = currentStep.state.names[substepIndex] || '';
      this.router.navigate([application.id, 'job', application.job.id, currentState],
        {relativeTo: this.route});

    }
  }
}
