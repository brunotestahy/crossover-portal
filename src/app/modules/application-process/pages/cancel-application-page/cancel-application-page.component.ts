import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DFAlertButtonType, DfAlertOptions, DfAlertService, DfAlertType, DfToasterService } from '@devfactory/ngx-df';
import { COLORS } from 'app/core/constants/colors';
import { Subject } from 'rxjs/Subject';

import { JobApplication } from 'app/core/models/application';
import { CandidateService } from 'app/core/services/candidate/candidate.service';

@Component({
  selector: 'app-cancel-application-page',
  templateUrl: './cancel-application-page.component.html',
  styleUrls: ['./cancel-application-page.component.scss'],
})
export class CancelApplicationPageComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject();
  private readonly AVAILABLE_JOBS_URL = 'marketplace/available-jobs';
  public error: string | null = null;
  public isLoading = false;
  public noOpenApplications = false;

  constructor(
    private candidateService: CandidateService,
    private alertService: DfAlertService,
    private toasterService: DfToasterService,
    private router: Router,
    private location: Location) { }

  public ngOnInit(): void {
    this.candidateService.getCurrentApplication().subscribe((application) => {
      if (!application || application.status !== 'IN_PROGRESS') {
        this.isLoading = false;
        this.noOpenApplications = true;
        return;
      }
      this.openAlertDialog(application);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private openAlertDialog(application: JobApplication): void {
    this.alertService.createDialog(<DfAlertOptions>{
      title: 'Cancel Application',
      icon: 'fa fa-warning',
      iconColor: COLORS.yellow,
      message: `Are you sure you would like to cancel your application?`,
      type: DfAlertType.Confirm,
    })
    .subscribe(result => {
      if (result[0] === DFAlertButtonType.OK) {
        this.isLoading = true;
        this.confirmCancelApplication(application);
      } else {
        this.location.back();
      }
    });
  }

  private confirmCancelApplication(application: JobApplication): void {
    this.candidateService.cancelApplication(application.id)
    .subscribe(() => {
        this.toasterService.popSuccess('Application cancelled successfully.');
        this.isLoading = false;
        this.router.navigateByUrl(this.AVAILABLE_JOBS_URL);
      },
      () => {
        this.error = 'Error cancelling application.';
        this.isLoading = false;
      });
  }
}
