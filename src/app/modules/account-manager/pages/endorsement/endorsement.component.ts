import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostBinding, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DfGrid, DfModal, DfModalService } from '@devfactory/ngx-df';
import * as _ from 'lodash';
import { finalize, map, mergeMap } from 'rxjs/operators';

import * as applicationStatus from 'app/core/constants/hire/application-status';
import * as pipelineStatus from 'app/core/constants/hire/pipeline-status';
import * as taskStatus from 'app/core/constants/hire/task-status';
import { Application } from 'app/core/models/application';
import {
  Applicant,
  ApplicantBody,
  Job,
  JobDetails,
  Question,
  ResumeRubric,
  ResumeRubricScore,
  RubricScore,
  TestDetails,
  TestEvaluation,
  TestEvaluationAnswer,
  TestScore,
} from 'app/core/models/hire';
import { Manager } from 'app/core/models/manager';
import { HireService } from 'app/core/services/hire/hire.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { EndorsementCommentsComponent } from 'app/modules/account-manager/pages/endorsement-comments/endorsement-comments.component';
import { EndorsementFilterComponent } from 'app/modules/account-manager/pages/endorsement-filter/endorsement-filter.component';
import { EndorsementNotesComponent } from 'app/modules/account-manager/pages/endorsement-notes/endorsement-notes.component';
import { EndorsementService } from 'app/modules/account-manager/shared/endorsement.service';

@Component({
  selector: 'app-endorsement',
  templateUrl: './endorsement.component.html',
  styleUrls: ['./endorsement.component.scss'],
})
export class EndorsementComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public readonly accountManager = 'ACCOUNT_MANAGER';
  public readonly recruitmentAnalyst = 'RECRUITMENT_ANALYST';
  public readonly applicationStatus = applicationStatus;
  public readonly pipelineStatus = pipelineStatus;
  public readonly taskStatus = taskStatus;
  public readonly rowsPerPage = 50;

  public jobs: Job[];
  public selectedJob: JobDetails;
  public jobForm: FormGroup = new FormGroup({
    jobId: new FormControl(),
    searchWord: new FormControl(''),
    resumeSearchQuery: new FormControl(''),
  });
  public temporaryFilterValues = {
    searchWord: '',
    resumeSearchQuery: '',
  };
  public isFirstInfiniteScroll: boolean = true;
  public selectedRows = [] as Applicant[];
  public otherTests = [] as TestDetails[];
  public rubricScoresArray = [] as RubricScore[];
  public assignmentScore: boolean = false;
  public fiveQTest: boolean = false;
  public technicalScreenScore: boolean = false;
  public fiveQResponseColumns: Question[];
  public data: Applicant[];
  public avatarType: string;
  public jobVisibleManagers: Manager[];
  public filterOptions = {};
  public hasFilter = false;
  public isMobile = false;
  public isLoading = false;
  public isTableLoading = false;
  public isTableContentLoading = false;
  public showMoreRecords: boolean;
  public emptyMessage = 'There are no results that match the criteria.';
  public error: string;

  public searchField: string;
  public searchOrder: 'ASC' | 'DESC';

  constructor(
    private hireService: HireService,
    private identityService: IdentityService,
    public endorsementService: EndorsementService,
    private modal: DfModalService,
    private breakpointService: BreakpointObserver
  ) {}

  public ngOnInit(): void {
    this.breakpointService
      .observe('(max-width: 576px)')
      .pipe(mergeMap(breakpointResult => {
        this.isMobile = breakpointResult.matches;
        return this.identityService.currentUserIsAccountManager();
      }))
      .subscribe(result => this.avatarType = result ? this.accountManager : this.recruitmentAnalyst);

    this.getActiveOnHoldJobs();
  }

  public jobChange(option: Job): void {
    this.isLoading = true;
    this.hireService.getJob(option.id)
      .subscribe(
      res => {
        this.endorsementService.getRubrics(res);
        this.selectedJob = res;
        Object.assign(
          this.selectedJob,
          this.jobs.filter((j: Job) => j.id === option.id)[0]
        );

        this.jobVisibleManagers = res.visibleManagers as Manager[];
      },
      (negativeResponse) => {
        this.error = negativeResponse.error.text;
        this.isLoading = false;
      }
    );

    this.searchApplicants(option);
  }

  public searchApplicants(job?: Job | undefined, isFirstPage: boolean = true, filterOptions?: ApplicantBody): void {
    const body = Object.assign({
      applicationStatus: this.applicationStatus.inProgress,
      jobId: job ? job.id : this.selectedJob.id,
      resumeSearchQuery: this.jobForm.value.resumeSearchQuery,
      searchWord: this.jobForm.value.searchWord,
      showDisabled: true,
    }, filterOptions) as ApplicantBody;

    if (isFirstPage) {
      this.isFirstInfiniteScroll = isFirstPage;
    }

    this.hireService
      .searchApplicantsV2(
        {
          avatarType: this.avatarType,
          jobId: job ? job.id : this.selectedJob.id,
          orderBy: this.searchField || 'score',
          page: isFirstPage ? 0 : Math.round(this.data.length / this.rowsPerPage),
          pageSize: this.rowsPerPage,
          sortDir: this.searchOrder || 'ASC',
        },
        body
      )
      .pipe(finalize(() => {
        this.isLoading = false;
        this.isTableLoading = false;
        this.isTableContentLoading = false;
      }))
      .subscribe(
        res => {
          this.data = isFirstPage ? this.buildCompletedData(res.content) : this.data.concat(this.buildCompletedData(res.content));
          this.showMoreRecords = this.data.length < res.totalElements;
          this.assignmentScore = this.data.some(applicant => !!applicant.assignmentScore);
          this.fiveQTest = this.data.some(applicant => !!applicant.fiveQResponse);
          this.technicalScreenScore = this.data.some(applicant => !!applicant.hackerRankScore);
          this.endorsementService.createDataModels(this.data);
        },
        (negativeResponse) => this.error = negativeResponse.error.text
      );
  }

  public onScrollEnd(): void {
    // TODO: isFirstInfiniteScroll is a temporary variable to fix infinite scroll issue on df-grid
    const condition: boolean = this.isFirstInfiniteScroll ? this.data.length > this.rowsPerPage : true;
    if (condition && this.showMoreRecords) {
      this.isTableContentLoading = true;
      this.searchApplicants(undefined, false);
    }

    this.isFirstInfiniteScroll = false;
  }

  public onTableSort(tableGrid: DfGrid): void {
    this.isTableContentLoading = true;
    this.searchField = tableGrid.sortField;
    // Special fields
    if (this.searchField === 'taskStatus') {
      this.searchField = 'Status';
    }

    this.searchOrder = tableGrid.sortOrder === 1 ? 'ASC' : 'DESC';
    this.searchApplicants();
  }

  public onBlurNameFilterInput(): void {
    if (this.jobForm.value.searchWord !== this.temporaryFilterValues.searchWord) {
      this.afterJobInputsChange();
    }
  }

  public onEnterPressNameFilterInput(): void {
    this.temporaryFilterValues.searchWord = this.jobForm.value.searchWord;
    this.afterJobInputsChange();
  }

  public onBlurKeywordFilterInput(): void {
    if (this.jobForm.value.resumeSearchQuery !== this.temporaryFilterValues.resumeSearchQuery) {
      this.afterJobInputsChange();
    }
  }

  public onEnterPressKeywordFilterInput(): void {
    this.temporaryFilterValues.resumeSearchQuery = this.jobForm.value.resumeSearchQuery;
    this.afterJobInputsChange();
  }

  public showFilter(): void {
    const modalRef = this.modal.open(EndorsementFilterComponent, {
      customClass: 'endorsement-filter-modal',
      data: [this.selectedJob, this.filterOptions],
    });

    modalRef.onClose.subscribe(filterOptions => {
      if (filterOptions) {
        if ((filterOptions.applicationStatus === 'ACCEPTED' || filterOptions.applicationStatus === 'REJECTED') && filterOptions.tasks) {
          delete filterOptions.tasks;
        }
        this.hasFilter = !!Object.keys(filterOptions).length;
        this.filterOptions = filterOptions;
        this.isTableLoading = true;
        this.selectedRows = [];
        this.searchApplicants(undefined, true, filterOptions);
      }
    });
  }

  public showNotes(application: Application): void {
    const modalRef = this.modal.open(EndorsementNotesComponent, {
      customClass: 'endorsement-notes-modal',
      data: {
        id: application.id,
        avatarType: this.avatarType,
        noteType: 'AM_RA',
      },
    });

    modalRef.onClose.subscribe(note => {
      if (note) {
        application.lastNote = note;
      }
    });
  }

  public showComments(application: Application): void {
    this.modal.open(EndorsementCommentsComponent, {
      customClass: 'endorsement-comments-modal',
      data: {
        id: application.id,
        avatarType: this.avatarType,
        type: 'AM_HM',
        candidateName: application.candidate.printableName,
        jobTitle: this.selectedJob.title,
        managers: this.jobVisibleManagers,
      },
    });
  }

  public get isAccountManager(): boolean {
    return this.avatarType === this.accountManager;
  }

  public get allowEndorse(): boolean {
    return this.data.length > 0 || this.selectedRows.some(
      applicant => applicant.status !== this.applicationStatus.accepted &&
        applicant.status !== this.applicationStatus.rejected
    );
  }

  public get hasSelectedInEndorsementPhase(): boolean {
    return this.selectedRows.length < 1 || this.selectedRows.some(
      applicant => applicant.task !== this.taskStatus.accountManagerEndorsesApplication.value &&
        applicant.status !== this.applicationStatus.accepted
    );
  }

  public get hasSelectedNotInPreview(): boolean {
    return this.selectedRows.length < 1 || !this.selectedRows.some(applicant => !applicant.previewToHiringManager);
  }

  public hasKeywordSuccessLabel(rkTestScore: TestScore,
                                rkScore: number,
                                normalizedHighThreshold: number,
                                matTestScore: TestScore,
                                matScore: number): boolean {
    return rkTestScore && rkScore >= normalizedHighThreshold && (!matTestScore || matScore === 1);
  }

  public hasKeywordWarningLabel(rkTestScore: TestScore,
                                rkScore: number,
                                normalizedHighThreshold: number,
                                matTestScore: TestScore,
                                matScore: number): boolean {
    return rkTestScore && rkScore < normalizedHighThreshold && (!matTestScore || matScore === 1);
  }

  public getOverAllResumeGrad(applicant: Applicant): number | string {
    return applicant.overAllResumeGrad || '-';
  }

  public getFiveQAnswer(answers: TestEvaluationAnswer[], sequenceQuestionNumber: number): number | string {
    const score = answers ? answers.find(answer => answer.sequenceNumber === sequenceQuestionNumber) : null;
    return score ? score.score : '-';
  }

  public get hasSelectedForPassersPreview(): boolean {
    const invalidFlowTypes: string[] = ['HACKERRANK_FIVEQ', 'FIVEQ'];
    const invalidTasks: string[] = [
      this.taskStatus.accountManagerEndorsesApplication.value,
      this.taskStatus.recruiterConductsPreMarketplaceInterview.value,
    ];
    return this.selectedRows.length < 1 || this.selectedRows.some(
      applicant => _.includes(invalidFlowTypes, applicant.flowType) ||
        _.includes(invalidTasks, applicant.task) ||
        applicant.previewTestPasser
    );
  }

  public buildFiveQColumns(tests: TestDetails[]): void {
    const fiveQTests: TestDetails | undefined = tests.find(test => test.test.type === 'FIVEQ');
    this.fiveQResponseColumns = fiveQTests && fiveQTests.test.questions
      ? fiveQTests.test.questions.sort((a, b) => a.sequenceNumber - b.sequenceNumber)
      : [];
  }

  public shouldShowEndorsementButton(applicant: Applicant): boolean {
    return applicant.task === this.taskStatus.accountManagerEndorsesApplication.value;
  }

  public shouldShowRejectButton(applicant: Applicant): boolean {
    return applicant.task === this.taskStatus.accountManagerEndorsesApplication.value ||
      applicant.task === this.taskStatus.recruiterConductsPreMarketplaceInterview.value;
  }

  public close(): void {
    // TODO: implement endorsement close modal
  }

  public reject(): void {
    // TODO: implement endorsement reject modal
  }

  public endorsement(): void {
    // TODO: implement endorsement modal
  }

  public viewFiveLink(): void {
    // TODO: implement five link modal
  }

  public previewResumes(): void {
    this.isTableLoading = true;
    const applicationsIds: number[] = this.selectedRows.map(applicants => applicants.id);
    this.hireService.addNewPreview(applicationsIds, 'applications')
      .pipe(finalize(() => {
        this.isTableLoading = false;
        this.isFirstInfiniteScroll = true;
      }))
      .subscribe(
        () => {
          this.data = this.data.slice(0, this.rowsPerPage);
          this.selectedRows.forEach(applicants => applicants.previewToHiringManager = true);
        },
        negativeResponse => this.error = negativeResponse.error.text
      );
  }

  public previewPassers(): void {
    this.isTableLoading = true;
    const applicationsIds: number[] = this.selectedRows.map(applicants => applicants.id);
    this.hireService.addNewPreview(applicationsIds, 'testPassers')
      .pipe(finalize(() => {
        this.isTableLoading = false;
        this.isFirstInfiniteScroll = true;
      }))
      .subscribe(
        () => {
          this.data = this.data.slice(0, this.rowsPerPage);
          this.selectedRows.forEach(applicants => applicants.previewTestPasser = true);
        },
        negativeResponse => this.error = negativeResponse.error.text
      );
  }

  public removePreview(applicant: Applicant): void {
    this.isTableLoading = true;
    const applicationsIds: string[] = [applicant.id.toString()];
    this.hireService.removePreview(applicationsIds)
      .pipe(finalize(() => {
        this.isTableLoading = false;
        this.isFirstInfiniteScroll = true;
      }))
      .subscribe(
        () => {
          this.data = this.data.slice(0, this.rowsPerPage);
          applicant.previewTestPasser = false;
          applicant.previewToHiringManager = false;
        },
        negativeResponse => this.error = negativeResponse.error.text);
  }

  public addRubricScores(applicant: Applicant, value: string): void {
    const inputValue: number = parseInt(value, 10) || 0;
    if (
      inputValue === applicant.overAllResumeGrad
      && !this.rubricScoresArray.length || inputValue < 0
      && !this.rubricScoresArray.length || inputValue > 100
      && !this.rubricScoresArray.length
    ) {
      return;
    }

    const rubricScoreArray: RubricScore | undefined = this.rubricScoresArray.find(rubricScore => rubricScore.id === applicant.id);
    if (rubricScoreArray) {
      if (!inputValue || inputValue < 0 || inputValue > 100 || inputValue === applicant.overAllResumeGrad) {
        const invalidElementIndex: number = this.rubricScoresArray.findIndex(elem => elem.id === rubricScoreArray.id);
        this.rubricScoresArray.splice(invalidElementIndex, 1);
      } else {
        rubricScoreArray.testsEvaluations[0].resumeRubricScores[0].score = inputValue;
      }
    } else {
      if (inputValue >= 0 && inputValue <= 100) {
        const newRubricScore: RubricScore = {
          id: applicant.id,
          testsEvaluations: [applicant.rubricEval],
        };
        newRubricScore.testsEvaluations[0].resumeRubricScores[0].score = inputValue;
        this.rubricScoresArray.push(newRubricScore);
      }
    }
  }

  public saveScores(): void {
    this.hireService.updateResumeRubricScore(this.rubricScoresArray)
      .pipe(finalize(() => this.isTableLoading = true))
      .subscribe(
        () => {
          this.rubricScoresArray = [];
          this.searchApplicants();
        },
        negativeResponse => this.error = negativeResponse.error.text
      );
  }

  public openRubricDescriptionModal(template: TemplateRef<DfModal>, rubric: ResumeRubric): void {
    this.modal.open(template, { data: rubric });
  }

  protected afterJobInputsChange(): void {
    this.isTableLoading = true;
    this.searchApplicants();
  }

  private getActiveOnHoldJobs(): void {
    this.hireService.getJobs({})
      .pipe(
        map(
          job => job.filter(filteredJob => filteredJob.status === this.pipelineStatus.active ||
            filteredJob.status === this.pipelineStatus.onHold)
        )
      )
      .subscribe(
        (jobs) => this.jobs = jobs,
        (negativeResponse) => this.error = negativeResponse.error.text
      );
  }

  private buildCompletedData(data: Applicant[]): Applicant[] {
    return data.map(applicant => {
      if (this.selectedJob.tests) {
        this.selectedJob.rubricTest = this.selectedJob.tests.find(test => test.test.type === 'RESUME_RUBRIC');

        this.selectedJob.tests.forEach(testDetail => {
          if (testDetail.test.type === 'OTHER') {
            this.otherTests.push(testDetail);
          }
          applicant = <Applicant>{
            ...applicant,
            [testDetail.test.type]: testDetail.test,
          };
        });
        this.buildFiveQColumns(this.selectedJob.tests);
      }
      const key = applicant.task as keyof typeof EndorsementComponent.prototype.taskStatus;

      return <Applicant>{
        ...applicant,
        matScore: applicant.testScores ?
          applicant.testScores.find(test => test.test.type === 'MANDATORY_ATTRIBUTES') : undefined,
        rkScore: applicant.testScores ?
          applicant.testScores.find(test => test.test.type === 'RESUME_KEYWORD') : undefined,
        assignmentScore: this.jobApplicationTest(applicant, 'ASSIGNMENT'),
        fiveQScore: this.jobApplicationTest(applicant, 'FIVEQ'),
        hackerRankScore: this.jobApplicationTest(applicant, 'HACKER_RANK'),
        overAllResumeGrad: this.jobApplicationTest(applicant, 'RESUME_RUBRIC'),
        previewTestPasser: applicant.previewTestPasser ? applicant.previewTestPasser : false,
        fiveQResponse: applicant.testsEvaluations.find(test => test.type === 'FIVEQ_ANSWER'),
        previewToHiringManager: applicant.previewToHiringManager ? applicant.previewToHiringManager : false,
        rubricEval: this.buildRubricScoreTests(),
        taskStatus: this.taskStatus[key].display,
      };
    });
  }

  private jobApplicationTest(application: Applicant, testType: string, suffix?: number): number | '' {
    let result = 0;
    if (application && application.testScores) {
      for (const testScore of application.testScores) {
        if (testScore.test.type === testType) {
           result = suffix ? (testScore.score + suffix) : testScore.score;
        }
      }
    }
    return result || '';
  }

  private buildRubricScoreTests(): TestEvaluation {
    let rubricEval: TestEvaluation = {} as TestEvaluation;
    if (this.selectedJob.rubricTest) {
      rubricEval = {
        resumeRubricScores: [] as ResumeRubricScore[],
        test: this.selectedJob.rubricTest.test,
        type: 'RESUME_RUBRIC_EVALUATION',
      };

      const resumeRubrics = this.selectedJob.rubricTest.test.resumeRubrics;
      if (resumeRubrics) {
        resumeRubrics.forEach(resumeRubric => {
          rubricEval.resumeRubricScores.push({
            resumeRubric: resumeRubric.resumeRubric,
            score: Object.assign({ value: '' }).value,
          });
        });
      }
    }
    return rubricEval;
  }
}
