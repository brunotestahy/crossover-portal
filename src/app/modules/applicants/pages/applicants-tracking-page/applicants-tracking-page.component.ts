
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostBinding, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DfGrid, DfModalService, DfModalSize, DfToasterService } from '@devfactory/ngx-df';
import * as moment from 'moment';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { debounceTime, finalize, map, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { RESPONSIVE_BREAKPOINT } from 'app/core/constants/breakpoint';
import {
  Applicant,
  ApplicantBody,
  ApplicantQuery,
  ApplicantRow,
  Job,
} from 'app/core/models/hire';
import { CurrentUserDetail } from 'app/core/models/identity';
import { HireService } from 'app/core/services/hire/hire.service';
import { IdentityService } from 'app/core/services/identity/identity.service';

declare function encodeURIComponent(uriComponent: string): string;

@Component({
  selector: 'app-applicants-tracking-page',
  templateUrl: './applicants-tracking-page.component.html',
  styleUrls: ['./applicants-tracking-page.component.scss'],
})
export class ApplicantsTrackingPageComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public isSearching: boolean;
  public isResponsive$: Observable<boolean>;
  public form: FormGroup;
  public campaigns: string[] = [];
  public applicants: ApplicantRow[] = [];
  public jobs: Job[] = [];

  public error: string = '';

  public destroy$ = new Subject();

  public collectionSize = 0;
  public currentPage = 1;
  public pageSize = 25;
  public currentUserEmail: string;

  public isRejecting = false;
  public selectedApplicants = [] as ApplicantRow[];

  @ViewChild('rejectForm')
  public rejectForm: TemplateRef<{}>;

  @ViewChild('applicantsGrid')
  public applicantsGrid: DfGrid;

  public statuses: Array<{ label: string; value: string }> = [
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Verify Email', value: 'candidateVerifiesEmailAddress' },
    { label: 'Awaiting test setup', value: 'candidateWaitsTestSetup' },
    { label: 'Reviewing 5Qs Test', value: 'recruitmentAnalystGrades5QTest' },
    { label: 'Taking 5Qs Test', value: 'candidateSubmits5QTest' },
    { label: 'Invited to Technical Screen', value: 'techTrialUpdatesStatus1' },
    {
      label: 'Entering Contact Info',
      value: 'candidateProvidesContactInformation1',
    },
    { label: 'Complete Profile', value: 'candidateCompletesProfile' },
    { label: 'Invited to TechTrial', value: 'candidateStartsAssignment' },
    { label: 'Taking TechTrial', value: 'candidateEndsAssignment' },
    { label: 'Reviewing TechTrial', value: 'techTrialUpdatesStatus2' },
    {
      label: 'Pre-Marketplace Approval',
      value: 'recruiterConductsPreMarketplaceInterview',
    },
    {
      label: 'Meeting Talent Advocate',
      value: 'candidateTakesTalentAdvocateTest',
    },
    {
      label: 'AM Endorses Application',
      value: 'accountManagerEndorsesApplication',
    },
    { label: 'Marketplace', value: 'Marketplace' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  public lastStatusUpdate: {
    last7Days: string,
    between7And15Days: string,
    between15And30Days: string,
    moreThan30Days: string
  } = {
    last7Days: '1',
    between7And15Days: '2',
    between15And30Days: '3',
    moreThan30Days: '4',
  };

  public rejectFormGroup: FormGroup;

  // Debounce time for text fields in this component
  public textFieldDebounceTime: number = 1000;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private hireService: HireService,
    private modalService: DfModalService,
    private toasterService: DfToasterService,
    private identityService: IdentityService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.identityService.getCurrentUser()
      .pipe(
        map(user => user as CurrentUserDetail)
      )
      .subscribe(
        ({ email }) => this.currentUserEmail = email
      );

    this.isResponsive$ = this.breakpointObserver
      .observe(RESPONSIVE_BREAKPOINT)
      .pipe(map(matches => matches.matches), takeUntil(this.destroy$));
    const queryParams = this.activatedRoute.snapshot.queryParams;

    this.form = this.formBuilder.group({
      jobId: [queryParams.jobId ? Number(queryParams.jobId) : ''],
      campaign: [queryParams.campaign || ''],
      status: [queryParams.status || this.statuses[0].value],
      email: [''],
      resumeKeyword: [''],
      statusUpdated: [null],
    });
    this.form.valueChanges.pipe(debounceTime(this.textFieldDebounceTime))
      .subscribe(() => this.search());

    this.rejectFormGroup = this.formBuilder.group({
      method: [null, Validators.required],
      reason: [null],
    });

    combineLatest(
        this.hireService.getJobs({}),
        this.hireService.getCampaigns()
    )
    .subscribe(([ jobs, campaigns ]) => {
        this.jobs = jobs;
        this.campaigns = campaigns;
        this.search();
      },
      error => this.error = error.error && error.error.text ? error.error.text : 'Error loading information. Please try again later'
    );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public rejectApplicants(close: () => void): void {
    if (this.rejectFormGroup.valid) {
      const rejectRequests: Array<Observable<void>> = [];
      const reason = (this.rejectFormGroup.value.reason || '').trim();

      const REJECT = 1;
      const rejectionType = this.rejectFormGroup.value.method === REJECT ? 'REJECT' : 'DELETE';
      if (reason.length > 0) {
        this.selectedApplicants.forEach(
          applicant =>
          rejectRequests.push(this.hireService.rejectCandidateWithReason(
            applicant.id.toString(), rejectionType, this.encodeReason(reason)
          ))
        );
      } else {
        this.selectedApplicants.forEach(
          (applicant: ApplicantRow) =>
          rejectRequests.push(this.hireService.rejectCandidateWithoutReason(applicant.id.toString(), rejectionType))
        );
      }

      this.isRejecting = true;
      forkJoin(rejectRequests)
        .pipe(finalize(() => {
          this.isRejecting = false;
        }))
        .subscribe(() => {
          this.currentPage = 1;
          this.toasterService.popSuccess('Applicant(s) rejected');
          this.rejectFormGroup.patchValue({ method: null, reason: null });
          this.search(this.currentPage);
          close();
        }, () => {
          this.error = 'Error rejecting applicant(s)';
          close();
        });
    }
  }

  public encodeReason(reason: string): string {
    return reason.replace(new RegExp(' ', 'g'), '+');
  }

  public buildSearchBody(): ApplicantBody {
    const body: ApplicantBody = {
      applicationType: 'NATIVE',
      jobId: this.form.value.jobId,
      showDisabled: true,
    };

    if (
      this.form.value.status === 'IN_PROGRESS' ||
      this.form.value.status === 'REJECTED'
    ) {
      body.applicationStatus = this.form.value.status;
    } else {
      body.tasks = [ this.form.value.status ];
    }

    if (this.form.value.campaign !== '') {
      body.campaign = this.form.value.campaign;
    }

    if (this.form.value.email.trim() !== '') {
      body.searchWord = this.form.value.email.trim();
    }

    if (this.form.value.resumeKeyword.trim() !== '') {
      body.resumeSearchQuery = this.form.value.resumeKeyword.trim();
    }

    if (this.form.value.statusUpdated) {
      this.getStatusUpdateRange(body);
    }

    return body;
  }

  public exportToCSV(): void {
    this.toasterService
    .popSuccess(
      `This report will take a couple of minutes for us to generate.
        We will send it to ${this.currentUserEmail} as an attachment.`
    );
  }

  public getStatusUpdateRange(body: ApplicantBody): void {
    const comboValue = this.form.value.statusUpdated;

    const ranges = [
      {
        condition: () => comboValue === this.lastStatusUpdate.last7Days,
        action: () => {
          const date = new Date();
          date.setDate(date.getDate() - 7);
          body.lastStatusUpdateFrom = moment(date).format('YYYY-MM-DD');
        },
      },
      {
        condition: () => comboValue === this.lastStatusUpdate.between7And15Days,
        action: () => {
          const dateFrom = new Date();
          dateFrom.setDate(dateFrom.getDate() - 15);

          const dateTo = new Date();
          dateTo.setDate(dateTo.getDate() - 7);

          body.lastStatusUpdateFrom = moment(dateFrom).format('YYYY-MM-DD');
          body.lastStatusUpdateTo = moment(dateTo).format('YYYY-MM-DD');
        },
      },
      {
        condition: () => comboValue === this.lastStatusUpdate.between15And30Days,
        action: () => {
          const dateFrom = new Date();
          dateFrom.setDate(dateFrom.getDate() - 30);

          const dateTo = new Date();
          dateTo.setDate(dateTo.getDate() - 15);

          body.lastStatusUpdateFrom = moment(dateFrom).format('YYYY-MM-DD');
          body.lastStatusUpdateTo = moment(dateTo).format('YYYY-MM-DD');
        },
      },
      {
        condition: () => true,
        action: () => {
          const date = new Date();
          date.setDate(date.getDate() - 30);
          body.lastStatusUpdateTo = moment(date).format('YYYY-MM-DD');
        },
      },
    ];
    const strategy = ranges.filter(entry => entry.condition())[0];
    strategy.action();
  }

  public onColumnSort(sort: { field: string, order: number }): void {
    let field = '';
    if (sort.field !== 'resumeKeywordScore' && sort.field !== 'timeSpent') {
      field = this.capitalizeFirstLetter(sort.field);
    }

    if (sort.field === 'resumeKeywordScore') {
      field = 'score.RESUME_KEYWORD';
    }

    if (sort.field === 'timeSpent') {
      field = 'Time_Spent';
    }

    this.search(this.currentPage, field, sort.order);
  }

  public search(page: number = 1, orderBy?: string, sortDir?: number): void {
    this.selectedApplicants = [];
    this.isSearching = true;
    this.error = '';
    const query = {} as ApplicantQuery;
    query.avatarType = 'ADMIN';
    query.page = page - 1;
    query.pageSize = this.pageSize;
    query.jobId = this.form.value.jobId;
    if (orderBy && sortDir) {
      query.orderBy = orderBy;
      query.sortDir = sortDir === 1 ? 'ASC' : 'DESC';
    }
    this.hireService.searchApplicantsV2(query, this.buildSearchBody() as ApplicantBody)
    .subscribe(
      applicants => {
        this.isSearching = false;
        this.applicants = applicants.content.map((record: Applicant) => {
          const applicant: ApplicantRow = {} as ApplicantRow;
          applicant.id = record.id;
          applicant.skype = record.candidate.skypeId;
          applicant.email = record.candidate.email;
          applicant.location = record.candidate.countryName;
          applicant.pipeline = record.jobTitle;
          applicant.name = record.candidate.printableName;
          applicant.campaign = record.campaign;
          const recordStatus = this.statuses.find(status => status.value === record.task);
          applicant.status = recordStatus ? this.capitalizeFirstLetter(recordStatus.label) : '';
          applicant.resumeFile = record.resumeFile;
          if (
              record.testScores &&
              record.testScores
              .some((test: { test: { type: string }}) => test.test.type === 'RESUME_KEYWORD')
            ) {
            const resumeTest = record.testScores.find((test: { test: { type: string }}) => test.test.type === 'RESUME_KEYWORD');
            if (resumeTest !== undefined) {
              applicant.resumeKeywordScore = resumeTest.score;
            }
          }

          if (record.fiveQScore !== undefined) {
            applicant.evaluationScore = Math.floor(record.fiveQScore) + ' (WE)';
          }

          if (record.assignmentScore !== undefined) {
            applicant.evaluationScore = record.assignmentScore + ' (PE)';
          }

          if (record.hackerRankScore !== undefined) {
            applicant.technicalScreenScore = Math.round(record.hackerRankScore);
          }
          applicant.resume = 'Resume';
          applicant.files = 'Files';
          applicant.timeSpent = this.getTimeSpent(new Date(record.taskCreationTime));
          return applicant;
        });
        this.collectionSize = applicants.totalElements;
        this.selectedApplicants = [];
        this.applicantsGrid.selection = [];
      },
      error => {
        this.error = error.error.text;
        this.isSearching = false;
      }
    );
  }

  public isRejectDisabled(): boolean {
    const MARKETPLACE = 'Marketplace';
    return !this.selectedApplicants.length || this.form.value.status === MARKETPLACE;
  }

  public capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  }

  public scoreResumes(): void {
    const applications: { applicationId: Array<number> } = { applicationId: []};

    this.selectedApplicants.forEach(applicant => applications.applicationId.push(applicant.id));
    this.hireService.scoreResume(applications)
      .subscribe(() => {
        this.toasterService.popSuccess('Resume(s) cored');
        this.search(this.currentPage);
      }, error => this.error = error.error.text);
  }

  public isInProgressSelected(status: { value: string }): boolean {
    return status.value === this.statuses[0].value;
  }

  public openResume(applicant: ApplicantRow): void {

    this.hireService.getApplicationFile(applicant.id.toString(), applicant.resumeFile.id.toString())
    .subscribe((url: string) => {
      const newTab = window.open('about:blank', '_blank');
      if (newTab !== null) {
          newTab.location.href = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;
        }
      }, error => this.error = error.error.text);
  }

  public getTimeSpent(taskCreation: Date): string {
    let timeSpent = '';

    const taskDate = moment(taskCreation).valueOf();
    const currentDate = moment(new Date()).valueOf();
    let diff = currentDate - taskDate;
    const hoursInMilli = 1000 * 60 * 60, daysInMilli = hoursInMilli * 24;

    const days = Math.floor(diff / daysInMilli);
    diff = diff % daysInMilli;
    const hours = Math.floor(diff / hoursInMilli);

    timeSpent = days + ' day ' + hours + ' hr';

    return `${timeSpent} (${moment(taskCreation).format('YYYY-MM-DD')})`;
  }

  public openRejectForm(): void {
    this.modalService.open(this.rejectForm, {size: DfModalSize.Large});
  }

  public checkSelection(selection: ApplicantRow[]): void {
    this.selectedApplicants = selection;
  }

  public onRefresh(): void {
    this.search(this.currentPage);
  }

  public onPageChange(page: number): void {
    this.search(page);
  }

}
