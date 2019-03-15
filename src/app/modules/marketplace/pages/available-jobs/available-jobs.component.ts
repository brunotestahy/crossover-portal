import { Component, HostBinding, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import * as AvatarTypes from 'app/core/constants/avatar-types';
import { GetJobsOptions, Job, JobLabelItem, VisibleCorePipeline } from 'app/core/models/hire';
import { HireService } from 'app/core/services/hire/hire.service';
import { isApiError } from 'app/core/type-guards/is-api-error';

@Component({
  selector: 'app-available-jobs',
  templateUrl: './available-jobs.component.html',
  styleUrls: ['./available-jobs.component.scss'],
})
export class AvailableJobsComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'flex-grow';

  public form: FormGroup;
  public jobLabels$: Observable<JobLabelItem[]>;
  public jobs: VisibleCorePipeline[] = [];
  public isLoading = true;
  public message: string | null = null;
  public messageType: 'info' | 'danger';
  public error: string | null = null;
  public shouldLoadNextPage = false;
  public currentOptions: GetJobsOptions = {};

  constructor(
    private formBuilder: FormBuilder,
    private hireService: HireService
  ) {
    this.form = this.formBuilder.group({
      text: [
        null,
        Validators.compose([Validators.required, Validators.minLength(2)]),
      ],
      label: [null],
    });
  }

  public ngOnInit(): void {
    this.getJobLabels();
    this.loadFirst25JobListing();
  }

  public reset(): void {
    this.message = null;
    this.form.controls['text'].reset();
    this.form.controls['label'].reset(null, { emitEvent: false });
    this.loadFirst25JobListing();
  }

  public checkIfJobIsNew(timestamp: string): boolean {
    if (timestamp) {
      const timeDiff = Math.abs(
        new Date().getTime() - new Date(timestamp).getTime()
      );
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return diffDays <= 7;
    } else {
      return false;
    }
  }

  public onScroll(): void {
    if (this.shouldLoadNextPage) {
      const currentPage = this.currentOptions.page || 0;
      this.currentOptions.page = currentPage + 1;
      this
        .getJobPipelinesObservable()
        .subscribe(([jobs, pipelines]) => this.setupJobsAndPipelines(jobs, pipelines));
    }
  }

  public submit(): void {
    this.error = null;
    this.jobs = [];
    const search = this.form.value;
    this.isLoading = true;
    const options: GetJobsOptions = {
      page: 0,
      avatarType: AvatarTypes.Candidate,
    };
    if (search.text) {
      options.title = search.text;
    }
    if (search.label) {
      options.categoryId = search.label.id;
    }
    this.currentOptions = options;

    this.getJobPipelinesObservable().subscribe(
      ([jobs, pipelines]) => {
        this.setupJobsAndPipelines(jobs, pipelines);
        this.decideMessage(this.jobs, options.title, search.label);
      },
      error => {
        if (isApiError(error)) {
          this.error = error.error.text;
        } else {
          this.error = 'Error searching for jobs.';
        }
        return of([]);
      });
  }

  public onLabelChange(label: JobLabelItem | undefined): void {
    if (label) {
      this.error = null;
      this.jobs = [];
      this.isLoading = true;
      const options: GetJobsOptions = {
        page: 0,
        avatarType: AvatarTypes.Candidate,
      };
      options.title = this.form.controls['text'].value;
      options.categoryId = label.id;
      this.currentOptions = options;

      this.getJobPipelinesObservable()
      .subscribe(
        ([jobs, pipelines]) => {
          this.setupJobsAndPipelines(jobs, pipelines);
          this.decideMessage(this.jobs, options.title, label);
        },
        error => {
          this.isLoading = false;
          if (isApiError(error)) {
            this.error = error.error.text;
          } else {
            this.error = 'Error searching for jobs.';
          }
        });
    } else {
      this.reset();
    }
  }

  private setupJobsAndPipelines(jobs: VisibleCorePipeline[], pipelines: VisibleCorePipeline[]): void {
    this.addTypeToJobsAndPipelines(jobs, pipelines);
    this.jobs.push(...pipelines);
    this.jobs.push(...jobs);
    this.isLoading = false;
    if (jobs.length >= 25) {
      this.shouldLoadNextPage = true;
    } else {
      this.shouldLoadNextPage = false;
    }
  }

  private getJobLabels(): void {
    this.jobLabels$ = this.hireService.getJobLabels().pipe(
      map(labels => {
        const sortedLabels = [...labels];
        sortedLabels.sort((a, b) => {
          if (a.id < b.id) {
            return -1;
          }
          /* istanbul ignore else */
          if (a.id > b.id) {
            return 1;
          }
          return 0;
        });

        const items = sortedLabels.map(label => {
          return {
            ...label,
            level: label.parent ? 1 : 0,
            parentId: label.parent ? label.parent.id : null,
          };
        });

        const rootItems: JobLabelItem[] = [];
        const childrenItems: JobLabelItem[] = [];
        items.forEach(item => {
          if (item.parentId === null) {
            rootItems.push(<JobLabelItem>item);
          } else {
            childrenItems.push(<JobLabelItem>item);
          }
        });

        let result: JobLabelItem[] = [];
        rootItems.forEach(item => {
          result.push(item);
          result = result.concat(
            childrenItems.filter(c => c.parentId === item.id)
          );
        });

        return result;
      })
    );
  }

  private loadFirst25JobListing(): void {
    this.isLoading = true;
    const options: GetJobsOptions = {
      page: 0,
      avatarType: AvatarTypes.Candidate,
    };
    this.currentOptions = options;

    this.getJobPipelinesObservable()
    .subscribe(([jobs, pipelines]) => this.setupJobsAndPipelines(jobs, pipelines));
  }

  private getJobPipelinesObservable(): Observable<[Job[], VisibleCorePipeline[]]> {
    return forkJoin(
      this.hireService.getJobs(this.currentOptions),
      this.hireService.getVisibleCorePipelines(this.currentOptions)
    );
  }

  private decideMessage(
    jobsFound: VisibleCorePipeline[],
    title?: string | null,
    label?: JobLabelItem | null
  ): void {
    if (title && label) {
      if (jobsFound.length > 0) {
        this.message = `Showing jobs containing keywords "${title}" under "${
          label.name
          }" category. `;
      } else {
        this.message = `No jobs found containing keywords "${title}" under "${
          label.name
          }" category. Showing jobs under all categories.`;
        this.loadFirst25JobListing();
      }
    } else if (title) {
      if (jobsFound.length > 0) {
        this.message = `Showing jobs containing keywords "${title}".`;
      } else {
        this.message = `Sorry, no jobs found containing keywords "${title}". Showing jobs under all categories.`;
        this.loadFirst25JobListing();
      }
    } else if (label) {
      if (jobsFound.length > 0) {
        this.message = `Showing jobs under "${label.name}" category.`;
      } else {
        this.message = `Sorry, no jobs found under "${
          label.name
          }" category. Showing jobs under all categories.`;
        this.loadFirst25JobListing();
      }
    } else {
      this.message = null;
    }
    this.messageType = 'info';
  }

  private addTypeToJobsAndPipelines(jobs: VisibleCorePipeline[], pipelines: VisibleCorePipeline[]): void {
    jobs.forEach(item => {
      item.type = 'job';
    });
    pipelines.forEach(item => {
      item.type = 'pipeline';
    });
  }
}
