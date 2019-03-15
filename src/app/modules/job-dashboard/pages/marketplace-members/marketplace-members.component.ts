import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DfModalService, DfModalSize } from '@devfactory/ngx-df';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { finalize } from 'rxjs/operators';

import * as AvatarTypes from 'app/core/constants/avatar-types';
import { Units } from 'app/core/constants/hire/salary-unit';
import { Job, JobDetails } from 'app/core/models/hire';
import { HireService } from 'app/core/services/hire/hire.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import {
  JobDescriptionModalComponent,
} from 'app/modules/job-dashboard/components/job-description-modal/job-description-modal.component';


@Component({
  selector: 'app-marketplace-members',
  templateUrl: './marketplace-members.component.html',
  styleUrls: ['./marketplace-members.component.scss'],
})
export class MarketplaceMembersComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public error: string;
  public job: JobDetails;
  /**
   * ToDo: Replace string with proper type when it's added
   */
  public candidates: string[] = [];
  public isSubscribed: boolean = false;

  public isLoading: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modal: DfModalService,
    private hireService: HireService,
    private identityService: IdentityService
  ) {
  }

  public ngOnInit(): void {
    const jobId = this.activatedRoute.snapshot.params['id'] as string;
    this.fetchData(Number(_.defaultTo(jobId, -1)));
  }

  public getSalaryUnitAbbreviation(salaryUnit: keyof typeof Units): string {
    return (Units[salaryUnit] || {}).abbreviation;
  }

  public openJobDescriptionModal(job: JobDetails): void {
    this.modal.open(JobDescriptionModalComponent, {
      data: job,
      size: DfModalSize.Large,
    });
  }

  public subscribeToJobPipeline(): void {
    this.hireService.subscribeToJobPipeline(this.job.id).subscribe(() => this.isSubscribed = true);
  }

  private fetchData(jobId: number): void {
    this.isLoading = true;
    forkJoin(
      this.hireService.getJob(jobId, AvatarTypes.Manager),
      this.identityService.getCurrentUserAs(AvatarTypes.Manager)
    )
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(([job, currentUser]) => {
          this.job = {
            ...job,
            managerDescription: this.stripStyleTags(job.managerDescription),
            candidateDescription: this.stripStyleTags(job.candidateDescription),
          };
          if (currentUser != null) {
            const subscriptionJobs = _.get(currentUser, 'subscriptionJobs') as Job[];
            const indexOfJobSubscription = _.findIndex(subscriptionJobs, (subscriptionJob) => subscriptionJob.id === jobId);
            this.isSubscribed = indexOfJobSubscription !== -1;
          }
        },
        () => {
          this.error = `Unknown identifier ${jobId} specified. Retry the operation with a valid identifier.`;
        }
      );
  }

  private stripStyleTags(input: string | undefined): string {
    return (input || '').replace(/ style="[^\"]*"/gim, '');
  }
}
