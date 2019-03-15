import {
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DfActiveModal } from '@devfactory/ngx-df';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import * as AvatarTypes from 'app/core/constants/avatar-types';
import { Units as SalaryUnits } from 'app/core/constants/hire/salary-unit';
import { Job } from 'app/core/models/hire';
import { Team, TeamDemand } from 'app/core/models/team';
import { HireService } from 'app/core/services/hire/hire.service';
import { TeamService } from 'app/core/services/team/team.service';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { decodeErrorMessage } from 'app/utils/api-utilities';

@Component({
  selector: 'app-hire-add-role-modal',
  templateUrl: './hire-add-role-modal.component.html',
  styleUrls: ['./hire-add-role-modal.component.scss'],
})
export class HireAddRoleModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();

  @HostBinding('class')
  public readonly class: string = 'd-flex flex-column h-100';
  @ViewChild('scroll')
  public readonly scroll: HTMLElement;
  public readonly currentTeam: Team;
  public readonly salaryUnits = SalaryUnits;

  public currentPanel: HTMLElement | null;
  public jobs: Job[] = [];
  public jobsDetails: { [k: number]: SafeHtml } = {};
  public selectedJob: Job | null;
  public pipelineSearch = '';

  public isLoading = false;
  public error = '';

  @Output()
  public roleStore = new EventEmitter<TeamDemand>();

  constructor(
    private activeModal: DfActiveModal,
    private hireService: HireService,
    private teamService: TeamService,
    private sanitizer: DomSanitizer,
    @Inject(WINDOW_TOKEN) private window: Window
  ) {
  }

  public ngOnInit(): void {
    this.isLoading = true;
    this.error = '';
    const avatarType = AvatarTypes.Manager;
    this.hireService
      .getJobs({ avatarType })
      .pipe(take(1))
      .subscribe(jobs => {
        this.jobs = jobs;
        this.isLoading = false;
      },
      error => {
        this.error = decodeErrorMessage(error, 'An unknown error happened while retrieving jobs data.');
        this.isLoading = false;
      }
    );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public openJobDescription(job: Job): void {
    const avatarType = AvatarTypes.Manager;
    this.error = '';
    this.jobsDetails[job.id] = false;
    this.hireService
      .getJob(job.id, avatarType)
      .pipe(take(1))
      .subscribe(
        jobDetails => this.jobsDetails[job.id] = this.sanitizer
          .bypassSecurityTrustHtml(this.stripStyleTags(jobDetails.managerDescription)),
        error => {
          this.error = decodeErrorMessage(error, 'An unknown error happened while retrieving job details data.');
          delete this.jobsDetails[job.id];
        }
      );
  }

  public getRoleWeeklyCost(job: Job): number {
    const monthsPerYear = 12;
    const averageWeeksPerYear = 50;
    const strategies = [
      {
        condition: () => job.salaryType === SalaryUnits.WEEK.salaryType,
        value: (job.salary as number) * job.workingHoursPerWeek,
      },
      {
        condition: () => true,
        value: (job.salary as number) * monthsPerYear / averageWeeksPerYear
      }
    ];
    return strategies.filter(entry => entry.condition())[0].value;
  }

  public close(): void {
    this.activeModal.close();
  }

  public saveAndAdd(): void {
    const currentTeam = this.activeModal.data.currentTeam as Team;
    this.isLoading = true;
    this.error = '';
    this.teamService.demand(currentTeam.id, this.selectedJob as Job)
      .pipe(take(1))
      .subscribe(
        demand => {
          this.roleStore.emit(demand);
          this.selectedJob = null;
          this.currentPanel = null;
          this.window.setTimeout(() => this.isLoading = false);
        },
        error => {
          this.error = decodeErrorMessage(error, 'An unknown error happened while storing demand data.');
          this.isLoading = false;
        }
      )
  }

  private stripStyleTags(input: string | undefined): string {
     return _.defaultTo(input, '').replace(/ style="[^\"]*"/gim, '');
   }
}
