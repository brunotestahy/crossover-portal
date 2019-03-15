import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostBinding, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  DFAlertButtonType,
  DfAlertService,
  DfAlertType,
  DfModalService,
  DfModalSize, DfToasterService,
} from '@devfactory/ngx-df';
import { map, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as AvatarTypes from 'app/core/constants/avatar-types';
import { RESPONSIVE_BREAKPOINT } from 'app/core/constants/breakpoint';
import { CandidateRow } from 'app/core/models/candidate';
import { Country } from 'app/core/models/country';
import { TalentAdvocateAnswer, TalentAvocateTest } from 'app/core/models/hire';
import { Timezone } from 'app/core/models/timezone';
import { HireService } from 'app/core/services/hire/hire.service';

@Component({
  selector: 'app-talent-advocacy-index-page',
  templateUrl: './talent-advocacy-index-page.component.html',
  styleUrls: ['./talent-advocacy-index-page.component.scss'],
})
export class TalentAdvocacyIndexPageComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public isSavingForm: boolean;
  public selectedCandidate: CandidateRow;
  public callFormGroup: FormGroup = new FormGroup({});
  public isLoadingForm: boolean;
  public destroy$ = new Subject();
  public isResponsive$: Observable<boolean>;
  public error: string | null = null;
  public errorForm: string | null = null;

  public candidates: CandidateRow[] = [];

  public isLoading = false;

  @ViewChild('callForm') public callFormTemplate: TemplateRef<{}>;

  public formData: TalentAvocateTest;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private alertService: DfAlertService,
    private hireService: HireService,
    private modalService: DfModalService,
    private toasterService: DfToasterService
  ) {
  }

  public ngOnInit(): void {
    this.isResponsive$ = this.breakpointObserver
      .observe(RESPONSIVE_BREAKPOINT)
      .pipe(map(matches => matches.matches), takeUntil(this.destroy$));

    this.refreshList();
  }

  public canAccept(application: CandidateRow): boolean {
    return !!application.testsEvaluations.find(test => test.type === 'TALENT_ADVOCATE_EVALUATION');
  }

  public accept(candidate: CandidateRow): void {
    this.isLoading = true;
    this.error = null;
    this.hireService.acceptRejectTalentAdvocateAnswers(candidate.applicationId, true)
      .subscribe(() => {
        this.isLoading = false;
        this.ngOnInit();
      }, negativeResponse => {
        this.error = negativeResponse.error.text || 'Error accepting candidate.';
        this.isLoading = false;
      });
  }

  public reject(candidate: CandidateRow): void {
    this.alertService
      .createDialog({
        title: 'Reject Candidate',
        message: 'Are you sure you want to reject this candidate?',
        icon: 'fa fa-warning',
        iconColor: 'orange',
        type: DfAlertType.Confirm,
      })
      .subscribe(result => {
        if (result[0] === DFAlertButtonType.OK) {
          this.isLoading = true;
          this.error = null;
          this.hireService.acceptRejectTalentAdvocateAnswers(candidate.applicationId, false)
            .subscribe(() => {
              this.isLoading = false;
              this.ngOnInit();
            }, negativeResponse => {
              this.error = negativeResponse.error.text || 'Error accepting candidate.';
              this.isLoading = false;
            });
        }
      });
  }

  public openForm(item: CandidateRow): void {
    this.selectedCandidate = item;
    this.isLoadingForm = true;
    this.callFormGroup = new FormGroup({});
    this.modalService.open(this.callFormTemplate, { size: DfModalSize.Large });
    this.hireService.getPreHireApplicationTest(this.selectedCandidate.applicationId)
      .subscribe(test => {
        this.isLoadingForm = false;
        this.formData = test;
        // Loop through the answers to build the form on the fly
        this.formData.answers.forEach((question: TalentAdvocateAnswer) => {
          this.callFormGroup
            .addControl(
              question.question.id.toString(),
              new FormControl(
                question.answer || null,
                question.question.mandatory ? Validators.required : null));
          // Convert to number value only for radio input
          if (question.question.type === 'SELECT_LIST' && question.answer) {
            const key = question.question.id;
            this.callFormGroup.patchValue({ [key]: parseInt(question.answer, 10) });
          }
        });
      }, negativeResponse => {
        this.isLoadingForm = false;
        this.errorForm = negativeResponse.error.text;
      });
  }

  public onFormSubmit(closeModalFn: Function): void {
    if (this.callFormGroup.valid) {
      this.isSavingForm = true;
      for (let i = 0; i < this.formData.answers.length; i++) {
        this.formData.answers[i].answer = this.callFormGroup.value[this.formData.answers[i].question.id];
      }
      this.hireService.updateHireApplicationTest(this.selectedCandidate.applicationId, this.formData)
        .subscribe(() => {
          this.isSavingForm = false;
          this.ngOnInit();
          closeModalFn();
        }, negativeResponse => {
          this.isSavingForm = false;
          this.error = negativeResponse.error.text;
          closeModalFn();
        });
    }
  }

  public uploadTournamentCandidatesFile(file: File): void {
    this.error = null;
    if (!file) {
      return;
    }

    this.hireService.uploadCandidatesFile(file)
      .subscribe(() => {
          this.toasterService.popSuccess('File is uploaded, you will get an email soon with the import results.');
        },
        negativeResponse => this.error = negativeResponse.error.text);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private refreshList(): void {
    const pageSize = 1000;
    const withPercentiles = false;
    this.isLoading = true;
    this.hireService
      .searchApplicants(
        {
          avatarType: AvatarTypes.Recruiter,
          pageSize,
          withPercentiles,
        },
        { tasks: ['candidateTakesTalentAdvocateTest'] }
      )
      .subscribe(applications => {
        this.isLoading = false;
        this.candidates = applications.content.map(application => {
          const country = application.candidate.location.country as Country;
          const timeZone = application.candidate.location.timeZone as Timezone;
          return <CandidateRow> {
            name: application.candidate.printableName,
            location: `${country.name} (UTC ${timeZone.hourlyOffset})`,
            pipeline: application.job.title,
            email: application.candidate.email,
            skypeId: application.candidate.skypeId,
            projectEvaluationFinished: application.updatedOn,
            hasCV: !!application.resumeFile,
            recruiter: application.job.recruiter ? application.job.recruiter.printableName : '' as string,
            applicationId: application.id,
            candidateId: application.candidate.id,
            score: application.score,
            testsEvaluations: application.testsEvaluations,
          };
        });
      });
  }
}
