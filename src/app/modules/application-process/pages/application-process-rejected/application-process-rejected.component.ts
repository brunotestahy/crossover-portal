import { Component, OnDestroy, OnInit } from '@angular/core';
import { JobApplication } from 'app/core/models/application';
import { CurrentUserDetail } from 'app/core/models/identity';
import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { IdentityService } from '../../../../core/services/identity/identity.service';
import { ApplicationProcessService } from '../../shared/application-process.service';

@Component({
  selector: 'app-application-process-rejected',
  templateUrl: './application-process-rejected.component.html',
  styleUrls: ['./application-process-rejected.component.scss'],
})
export class ApplicationProcessRejectedComponent implements OnInit, OnDestroy {

  public static readonly STEP_NO = 0;

  private destroy$ = new Subject();
  public application: JobApplication;
  public user: CurrentUserDetail | null;
  public isLoading = true;


  constructor(
    private identityService: IdentityService,
    private candidateService: CandidateService,
    private applicationProcessService: ApplicationProcessService
  ) {}

  public ngOnInit(): void {
    this.applicationProcessService.currentStep(ApplicationProcessRejectedComponent.STEP_NO);
    combineLatest(
      this.identityService.getCurrentUser(),
      this.candidateService.getCurrentApplication()
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(([user, application]) => {
        this.user = user;
        this.application = application;
        this.isLoading = false;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
