import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DfValidationMessagesMap } from '@devfactory/ngx-df';

import { finalize } from 'rxjs/operators';

import { Job } from 'app/core/models/hire';
import { HireService } from 'app/core/services/hire/hire.service';
import { isApiError } from 'app/core/type-guards/is-api-error';

@Component({
  selector: 'app-job-dashboard-index-page',
  templateUrl: './job-dashboard-index-page.component.html',
  styleUrls: ['./job-dashboard-index-page.component.scss'],
})
export class JobDashboardIndexPageComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public form: FormGroup;
  public validationMessages: DfValidationMessagesMap = {
    minlength: () => 'The single character search is not supported',
  };
  public genericJobs: Partial<Job>[] = [];
  public customJobs: Partial<Job>[] = [];

  public isLoading = false;
  public error: string | null = null;

  constructor(
    private hireService: HireService,
    private router: Router,
    private domSanitizer: DomSanitizer
  ) { }

  public ngOnInit(): void {
    this.form = new FormGroup({
      query: new FormControl(null, [Validators.required, Validators.minLength(2)]),
    });
    this.isLoading = true;
    const avatarType = 'MANAGER';
    this.hireService.getJobs({ avatarType })
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((jobs: Job[]) => {
        const JOB_TYPE_GENERIC = 'GENERIC';
        const JOB_TYPE_CUSTOM = 'CUSTOM';
        this.genericJobs = jobs.filter(job => job.type === JOB_TYPE_GENERIC);
        this.customJobs = jobs.filter(job => job.type === JOB_TYPE_CUSTOM);
      }, (error) => {
        if (isApiError(error)) {
          this.error = error.error.text;
        } else {
          this.error = 'Error loading jobs.';
        }
      });
  }

  public searchPipelines(): void {
    if (this.form.valid) {
      this.router.navigate(
        ['/job-dashboard/marketplace-members'],
        {
          queryParams: { query: this.form.controls.query.value },
        }
      );
    }
  }

  public sanitizeURL(url: string): string {
    return this.domSanitizer.bypassSecurityTrustStyle(`url(${url})`) as string;
  }
}
