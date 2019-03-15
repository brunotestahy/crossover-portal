import { Component, HostBinding, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {
  DfListPanelItem,
  DfModalService,
  DfModalSize,
} from '@devfactory/ngx-df';
import { finalize, switchMap, tap } from 'rxjs/operators';

import { APPLICATION_TASKS } from 'app/core/constants/application-tasks';
import { basicMetrics, extendedMetrics } from 'app/core/constants/pipeline-tracker/metrics';
import {
  AllPipelinesTrackerData,
  Job,
  JobDetails,
  Metric,
  PipelineTrackerData,
  Question,
  StatisticsHeaders,
  Test,
  TestDetails,
  TestScore,
} from 'app/core/models/hire';
import { JobStatistic } from 'app/core/models/job-statistic';
import { CommonService } from 'app/core/services/common/common.service';
import { HireService } from 'app/core/services/hire/hire.service';
import { TestService } from 'app/core/services/test/test.service';

@Component({
  selector: 'app-pipeline-tracker-index-page',
  templateUrl: './pipeline-tracker-index-page.component.html',
  styleUrls: ['./pipeline-tracker-index-page.component.scss'],
})
export class PipelineTrackerIndexPageComponent implements OnInit {
  @HostBinding('class')
  public readonly classes = 'd-flex flex-column flex-grow';

  public isResponsive: boolean;
  public jobs: Job[] = [];
  public error = '';
  public isLoading = {
    screen: false,
    modal: false,
  };
  public isSearching = false;

  public pipelineControl = new FormControl(null);
  public details = {} as {
    job: Job,
    test: Test
  };

  public tasks = APPLICATION_TASKS;

  public headers: StatisticsHeaders[] = [];
  public jobData: PipelineTrackerData[] = [];
  public allData: AllPipelinesTrackerData[] = [];

  public hiringManagers: DfListPanelItem[] = [];

  public modal = {
    title: '',
    content: '' as string | undefined,
  };

  public readonly metrics = basicMetrics;
  public readonly metricsSecondGroup = extendedMetrics;

  @ViewChild('modalTemplate')
  public modalTemplate: TemplateRef<{}>;

  constructor(
    private hireService: HireService,
    private modalService: DfModalService,
    private sanitizer: DomSanitizer,
    private commonService: CommonService,
    private testService: TestService
  ) {
  }

  public ngOnInit(): void {
    this.pipelineControl.valueChanges.subscribe(
      (selectedPipeline: Job | 'All') => {
        delete this.details.job;
        if (selectedPipeline !== 'All') {
          this.headers = APPLICATION_TASKS[selectedPipeline.flowType as keyof typeof APPLICATION_TASKS];
          this.getStatisticsForJob(selectedPipeline as Job);
          this.loadJobDetails(selectedPipeline.id);
        } else {
          this.headers = APPLICATION_TASKS.ALL;
          this.getStatistics();
        }
      }
    );
    this.isLoading.screen = true;
    const applicationType = 'NATIVE';
    this.hireService
      .getJobs({ applicationType })
      .pipe(finalize(() => this.isLoading.screen = false))
      .subscribe(
        jobs => this.jobs = jobs,
        () => this.error = 'Error loading pipelines'
      );
  }

  public getCsvHeaders(): string[] {
    const tasks = APPLICATION_TASKS.ALL.map(task => task.printableName);
    return ['Job Title'].concat(tasks);
  }

  public getCsvContent(): string[][] {
    const stats = this.sortStatsAlphabeticallyByJob(this.allData);
    const csvContent: string[][] = [];

    stats.forEach(stat => {
      const row: string[] = [];
      row.push(stat.jobTitle);

      APPLICATION_TASKS.ALL
        .forEach(task => row.push(stat.count[task.task] as string));
      csvContent.push(row);
    });

    return csvContent;
  }

  public isFirstRow(rowIndex: number): boolean {
    return rowIndex === 0;
  }

  public checkTasksNumber(tasksNumber: number | undefined): number {
    return tasksNumber || 0;
  }

  public downloadCSV(): boolean {
    const fileName = 'pipeline-statistics.csv';
    const blob = this.commonService.generateCsv(this.getCsvHeaders(), this.getCsvContent());
    return this.commonService.download(blob, fileName);
  }

  public getPipelineTrackerData(statistics: JobStatistic[], metric: Metric): PipelineTrackerData {
    const statistic = statistics.find(entry => entry.type === metric.enum) as JobStatistic;
    const tasks = statistic.values.reduce(
      (carry, item) => ({...carry, [item.task]: item.count}),
      {} as Record<string, number>
    );
    return { metric, tasks };
  }

  public getStatisticsForJob(pipeline: Job): void {
    this.isSearching = true;
    this.error = '';
    const types = this.metrics.map(m => m.enum).join(',');
    this.hireService
      .getJobStatisticsById(pipeline.id, { types })
      .pipe(
        tap(statistics => this.jobData = this.metrics.map(
          metric => this.getPipelineTrackerData(statistics, metric)
        )),
        switchMap(
          () => this.hireService.getJobStatisticsById(
            pipeline.id,
            { types: this.metricsSecondGroup.map(m => m.enum).join(',') }
          )
        ),
        finalize(() => this.isSearching = false)
      )
      .subscribe(
        statistics => {
          const jobDataLastGroup = this.metricsSecondGroup.map(metric => this.getPipelineTrackerData(statistics, metric));
          this.jobData = this.jobData.concat(jobDataLastGroup);
        },
        ()  => this.jobData = this.jobData.concat(
          this.metricsSecondGroup.map(metric => ({
            metric,
            tasks: {},
          } as PipelineTrackerData))
        )
      );
  }

  public sortStatsAlphabeticallyByJob(stats: AllPipelinesTrackerData[]): AllPipelinesTrackerData[] {
    return stats
      .sort(
        (trackerRowA, trackerRowB) =>
          trackerRowA.jobTitle.localeCompare(trackerRowB.jobTitle)
      );
  }

  public getStatistics(): void {
    this.headers = APPLICATION_TASKS.ALL;
    this.isSearching = true;
    this.error = '';
    this.hireService.getJobStatistics()
    .pipe(finalize(() => this.isSearching = false))
    .subscribe(
      statistics => {
        const stats = statistics.map(stat => {
          const tasks = stat.values.reduce(
            (carry, value) => ({...carry, [value.task]: value.count}),
            {} as Record<string, number>
          );
          const trackerRow = {
            jobTitle: stat.job.title,
            jobId: stat.job.id,
            flowType: stat.job.flowType,
            tasks,
          } as AllPipelinesTrackerData;
          trackerRow.count = this.headers.reduce(
            (carry, header) => ({
              ...carry,
              [header.task]: this.getTaskCellContent(trackerRow, header),
            }),
            {}
          );
          return trackerRow;
        });
        this.allData = this.sortStatsAlphabeticallyByJob(stats);
      },
      () => this.error = 'Error loading statistics'
    );
  }

  public loadJobDetails(id: number): void {
    const TECHNICAL_SCREEN = 'HACKER_RANK';
    delete this.details.job;

    this.hireService.getJob(id)
    .pipe(
      tap(job => this.details.job = Object.assign(job)),
      switchMap(job => {
        const test = (job.tests as TestDetails[])
          .find(entry => entry.test.type === TECHNICAL_SCREEN) as TestDetails;
        return this.testService.get(test.test.id);
      })
    )
    .subscribe(
      testEntry => {
        this.details.test = testEntry;
        if (this.details.job.visibleManagers) {
          this.hiringManagers = this.details.job.visibleManagers.map(
            (manager, index) => (<DfListPanelItem> {
              label: manager.printableName,
              data: manager,
              value: `${manager.id}-${index}`,
            })
          );
        } else {
          this.hiringManagers = [];
        }
      },
      () => this.error = 'Error loading pipeline'
    );
  }

  public openJobDescription(): void {
    const job = this.details.job as JobDetails;
    this.modal.title = `Job Description: ${job.title}`;
    this.isLoading.modal = false;
    Object.assign(this.modal, { content:  this.sanitizer.bypassSecurityTrustHtml(job.candidateDescription as string)});
    this.modalService.open(this.modalTemplate, { size: DfModalSize.Large });
  }

  public loadTestContents(testType: string): void {
    if (this.details.job && this.details.job.tests) {
      const testScores = Object.assign(this.details.job.tests) as TestScore[];
      const projectEvaluation = testScores.find(testCategory => testCategory.test.type === testType) as TestScore;

      this.isLoading.modal = true;
      this.modal.content = '';
      this.modalService.open(this.modalTemplate, { size: DfModalSize.Large });
      this.hireService.getApplicationTest(projectEvaluation.test.id)
        .pipe(finalize(() => this.isLoading.modal = false))
        .subscribe(test => this.modal.content = test.testDetails.content);
    }
  }

  public getTaskCellContent(item: AllPipelinesTrackerData, header: StatisticsHeaders): number | string {
    const tasksList = {
      'FIVEQ': APPLICATION_TASKS.FIVEQ,
      'HACKERRANK_ASSIGNMENT': APPLICATION_TASKS.HACKERRANK_ASSIGNMENT,
      'HACKERRANK_FIVEQ': APPLICATION_TASKS.HACKERRANK_FIVEQ,
      'HACKERRANK': APPLICATION_TASKS.HACKERRANK,
      'ALL': APPLICATION_TASKS.ALL,
    };
    const flowType = item.flowType as keyof typeof tasksList;
    const tasks = tasksList[flowType] || tasksList['ALL'];
    const taskFound = tasks
      .find((taskDefinition: {task: string }) => taskDefinition.task.indexOf(header.task) >= 0);
    if (taskFound) {
      return item.tasks[taskFound.task] || 0;
    }
    return 'N/A';
  }

  public openProjectEvaluation(): void {
    const job = this.details.job as JobDetails;
    const PROJECT_EVALUATION = 'ASSIGNMENT';
    this.modal.title = `Project Evaluation: ${job.title}`;
    this.isLoading.modal = true;
    this.loadTestContents(PROJECT_EVALUATION);
  }

  public openWrittenEvaluation(): void {
    const job = this.details.job as JobDetails;
    const FIVEQ = 'FIVEQ';
    this.modal.title = `Written Evaluation: ${job.title}`;
    this.isLoading.modal = false;
    this.modal.content = '';
    const tests = job.tests as TestDetails[];
    if (tests) {
      const test = tests.find(testCategory => testCategory.test.type === FIVEQ) as TestDetails;
      const questions = test.test.questions as Question[];
      this.modal.content = questions.map(
        question => `
          <div class="my-2">
            <b>${question.sequenceNumber}. </b><span>${question.question}</span>
          </div>`
      )
      .join('');
    }
    this.modalService.open(this.modalTemplate, { size: DfModalSize.Large });
  }

}
