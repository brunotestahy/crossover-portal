import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { JobHealthCurrentState, JobHealthDetails } from 'app/core/models/job-health';
import { PipelineHealthService } from 'app/core/services/pipeline-health/pipeline-health.service';

interface DisplayState {
  isGray: boolean;
  value: string | number;
  stalled: boolean;
}

@Component({
  selector: 'app-pipeline-health-details-page',
  templateUrl: './pipeline-health-details-page.component.html',
  styleUrls: ['./pipeline-health-details-page.component.scss'],
})
export class PipelineHealthDetailsPageComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public total: number;
  public yearSalary: string;
  public verifyEmail: { inProgress: DisplayState; stalled: DisplayState };
  public marketplace: {
    preMP: DisplayState;
    marketplace: DisplayState;
    stalled: DisplayState;
  };
  public writtenEvaluation: {
    invited: DisplayState;
    raGrades: DisplayState;
    amEndorses: DisplayState;
    stalled: DisplayState;
  };
  public projectEvaluation: {
    invited: DisplayState;
    inProgress: DisplayState;
    underEvaluation: DisplayState;
    stalled: DisplayState;
  };
  public technicalScreen: { invited: DisplayState; stalled: DisplayState };
  public error: string | null = null;
  public isLoading = false;
  public isResponsive: boolean;

  public health: JobHealthDetails;
  public jobId: string;

  constructor(
    private pipelineHealthService: PipelineHealthService,
    private activatedRoute: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.isLoading = true;
    this.activatedRoute.params
      .pipe(switchMap((params) => {
        return this.pipelineHealthService.getJobHealthDetail(this.jobId = params.id);
      }))
      .subscribe(health => {
        this.health = health;
        const pipelineStatesByTaskKey = health.currentStates.reduce(
          (acc: Record<string, JobHealthCurrentState>, state) => {
            acc[state.state] = state;
            return acc;
          },
          {}
        );
        this.yearSalary = '$' + this.health.yearSalary + 'K / YEAR';
        this.total = health.totalApplicants;
        this.computeVerifyEmail(pipelineStatesByTaskKey);
        this.computeTechnicalScreen(pipelineStatesByTaskKey);
        this.computeProjectEvaluation(pipelineStatesByTaskKey);
        this.computeWrittenEvaluation(pipelineStatesByTaskKey);
        this.computeMarketplace(pipelineStatesByTaskKey);
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        this.error = 'Error loading pipeline details.';
      });
  }

  private createDisplayState(
    count: number,
    isStalled?: boolean
  ): DisplayState {
    return {
      isGray: !(count > 0),
      value: count || '',
      stalled: !!isStalled,
    };
  }

  private computeVerifyEmail(
    statesByTaskName: Record<string, JobHealthCurrentState>
  ): void {
    const VerifyEmailState =
      statesByTaskName['candidateVerifiesEmailAddress'] || {};

    this.verifyEmail = {
      inProgress: this.createDisplayState(
        VerifyEmailState.count),
      stalled: this.createDisplayState(
        VerifyEmailState.stalledCount,
        true
      ),
    };
  }

  private computeTechnicalScreen(
    statesByTaskName: Record<string, JobHealthCurrentState>
  ): void {
    const techTrialUpdate = statesByTaskName['techTrialUpdatesStatus1'] || {};

    this.technicalScreen = {
      invited: this.createDisplayState(
        techTrialUpdate.count
      ),
      stalled: this.createDisplayState(
        techTrialUpdate.stalledCount,
        true
      ),
    };
  }

  private computeProjectEvaluation(
    statesByTaskName: Record<string, JobHealthCurrentState>
  ): void {
    const invited = statesByTaskName['candidateStartsAssignment'] || {};
    const inProgress = statesByTaskName['candidateEndsAssignment'] || {};
    const underEvaluation = statesByTaskName['techTrialUpdatesStatus2'] || {};
    const stalledCount =
      invited.stalledCount +
      inProgress.stalledCount +
      underEvaluation.stalledCount;

    this.projectEvaluation = {
      invited: this.createDisplayState(
        invited.count
      ),
      inProgress: this.createDisplayState(
        inProgress.count
      ),
      underEvaluation: this.createDisplayState(
        underEvaluation.count
      ),
      stalled: this.createDisplayState(
        stalledCount,
        true
      ),
    };
  }

  private computeWrittenEvaluation(statesByTaskName: Record<string, JobHealthCurrentState>): void {
    const invited = statesByTaskName['candidateSubmits5QTest'] || {};
    const raGrades = statesByTaskName['recruitmentAnalystGrades5QTest'] || {};
    const amEndorses =
      statesByTaskName['accountManagerEndorsesApplication'] || {};
    const stalledCount =
      invited.stalledCount + raGrades.stalledCount + amEndorses.stalledCount;

    this.writtenEvaluation = {
      invited: this.createDisplayState(invited.count),
      raGrades: this.createDisplayState(
        raGrades.count
      ),
      amEndorses: this.createDisplayState(
        amEndorses.count
      ),
      stalled: this.createDisplayState(
        stalledCount,
        true
      ),
    };
  }

  private computeMarketplace(
    statesByTaskName: Record<string, JobHealthCurrentState>
  ): void {
    const preMP = statesByTaskName['candidateTakesTalentAdvocateTest'] || {};
    const marketplace = statesByTaskName['marketplace'] || {};
    const stalledCount = preMP.stalledCount + marketplace.stalledCount;

    this.marketplace = {
      preMP: this.createDisplayState(
        preMP.count
      ),
      marketplace: this.createDisplayState(marketplace.count),
      stalled: this.createDisplayState(
        stalledCount,
        true
      ),
    };
  }
}
