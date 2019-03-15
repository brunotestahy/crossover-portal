import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DfModalService, DfModalSize } from '@devfactory/ngx-df';
import { format, parse } from 'date-fns';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators/finalize';

import { JobApplication } from 'app/core/models/application';
import { FiveQGradingRecord, TestEvaluationRecord } from 'app/core/models/grading';
import { JobDetails, TestEvaluationAnswer } from 'app/core/models/hire';
import { Question } from 'app/core/models/hire/question.model';
import { AvatarType } from 'app/core/services/enums/avatar-type';
import { HireService } from 'app/core/services/hire/hire.service';

@Component({
  selector: 'app-five-q-grading',
  templateUrl: './five-q-grading.component.html',
  styleUrls: ['./five-q-grading.component.scss'],
})
export class FiveQGradingComponent implements OnInit {
  public readonly FIVEQ = 'FIVEQ';
  public readonly FIVEQ_ANSWER = 'FIVEQ_ANSWER';
  public readonly RESUME_KEYWORD = 'RESUME_KEYWORD';
  public readonly FIVE_Q_TEST = 'recruitmentAnalystGrades5QTest';

  public candidates: FiveQGradingRecord[] = [];
  public lowResumeScoreCandidates: FiveQGradingRecord[] = [];

  public error = '';

  @ViewChild('questionModal')
  public questionModal: TemplateRef<{}>;

  @ViewChild('allAnswersModal')
  public allAnswersModal: TemplateRef<{}>;

  public questions: Question[] = [];

  public showLowResumeScore = false;

  @Input()
  public changesSaved = true;

  @Input()
  public selectedJob: JobDetails;

  public selectedQuestion: Question;
  public selectedCandidate: FiveQGradingRecord;

  public isLoading = false;
  public newTab: Window | null

  constructor(
    private modalService: DfModalService,
    private hireService: HireService,
    private sanitizer: DomSanitizer,
  ) {}

  public ngOnInit(): void {
    this.fetchData();
  }

  public bypassSecurityTrustHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  public fetchData(searchWord?: string): void {
    this.error = '';
    const query = {
      avatarType: AvatarType.RECRUITMENT_ANALYST,
      jobId: this.selectedJob.id,
      orderBy: 'score.RESUME_KEYWORD',
      page: 0,
      sortDir: 'DESC' as 'DESC',
    };

    const body = {
      jobId: this.selectedJob.id,
      searchWord: searchWord ? searchWord : undefined,
      tasks: [this.FIVE_Q_TEST]
    };

    this.isLoading = true;
    this.hireService.searchApplicants(query, body)
      .subscribe(response => this.buildScreen(response.content), error => {
        this.error = error.error.text;
        this.isLoading = false;
      });
  }

  public buildScreen(applications: JobApplication[]): void {
    this.buildCandidates(applications);
    this.buildQuestions();
    this.isLoading = false;
  }

  public buildCandidates(applications: JobApplication[]): void {
    this.candidates = [];
    this.lowResumeScoreCandidates = [];
    applications.forEach(application => {
      const candidate: FiveQGradingRecord = {
        id: application.id,
        dirty: false,
        name: application.candidate.printableName || '',
        email: application.candidate.email || '',
        date: parse(application.createdOn),
        resumeFileId: application.resumeFile.id,
        testsEvaluations: application.testsEvaluations,
      };

      application.testsEvaluations = _.defaultTo(application.testsEvaluations, [])
      const fiveQEvaluation = application.testsEvaluations.find(test => test.type === this.FIVEQ_ANSWER);
      if (fiveQEvaluation) {
        fiveQEvaluation.answers = _.defaultTo(fiveQEvaluation.answers, []);
        candidate.answers = fiveQEvaluation.answers
          .map(
            answer => ({ text: answer.answer || '', score: answer.score !== undefined ? answer.score.toString() : '' })
          );
      }

      const resumeTestScore = application.testScores.find(testScore => testScore.test.type === this.RESUME_KEYWORD);
      if (resumeTestScore) {
        candidate.keywordScore = resumeTestScore.score;
      }

      if (candidate.keywordScore === undefined || candidate.keywordScore) {
        this.candidates.push(candidate);
      } else {
        this.lowResumeScoreCandidates.push(candidate);
      }
    });
  }

  public buildQuestions(): void {
    const testInstances = this.selectedJob.tests || [];
    const fiveQ = testInstances.find(testInstance => testInstance.test.type === this.FIVEQ);
    if (fiveQ) {
      this.questions = _.defaultTo(fiveQ.test.questions, []);
      this.setAverages();
    }
  }

  public isDoneDisabled(candidate: FiveQGradingRecord): boolean {
    candidate.answers = _.defaultTo(candidate.answers, [])
    let answersFilledIn = true;
    candidate.answers.forEach(answer => {
      if (answer.score.trim() === '') {
        answersFilledIn = false;
      }
    });
    return !(!candidate.dirty && answersFilledIn);
  }

  public setAverages(): void {
    this.candidates =
      this.candidates.map(candidate => {
        candidate.totalAverage = this.getCandidateTotalAverage(_.defaultTo(candidate.answers, []));
        return candidate;
      });

    this.lowResumeScoreCandidates =
      this.lowResumeScoreCandidates.map(candidate => {
        candidate.totalAverage = this.getCandidateTotalAverage(_.defaultTo(candidate.answers, []));
        return candidate;
      });
  }

  public saveGrades(): void {
    const evaluationRecords: TestEvaluationRecord[] = [];
    this.candidates.concat(this.lowResumeScoreCandidates).forEach(candidate => {
      candidate.testsEvaluations = _.defaultTo(candidate.testsEvaluations, [])
      const testEvaluations = candidate.testsEvaluations
        .filter(testEvaluation => testEvaluation.type === this.FIVEQ_ANSWER)
        .map(testEvaluation => {
          const evaluation = {
            id: testEvaluation.id,
            type: testEvaluation.type,
            answers: testEvaluation.answers,
          } as {
            id: number;
            type: string;
            answers?: TestEvaluationAnswer[];
          };
          return evaluation;
        });

      testEvaluations.forEach(testEvaluation => {
        let i = 0;
        testEvaluation.answers = _.defaultTo(testEvaluation.answers, []);
        testEvaluation.answers.forEach(answer => {
          candidate.answers = _.defaultTo(candidate.answers, []);
          answer.score = Number(candidate.answers[i].score);
          i++;
        });
      });

      const evaluationRecord = {
        id: candidate.id,
        testsEvaluations: testEvaluations,
      }
      evaluationRecords.push(evaluationRecord);
    });

    this.error = '';
    this.isLoading = true;
    this.hireService.saveEvaluations(evaluationRecords)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(() => {
        this.changesSaved = true;
        this.cleanRecords();
      }, error => this.error = error.error.text);
  }

  public cleanRecords(): void {
    this.candidates.concat(this.lowResumeScoreCandidates).forEach(candidate => candidate.dirty = false);
  }

  public formatDate(date: Date): string {
    return format(date, 'MMM DD');
  }

  public toggleLowResumeScoreCandidates(): void {
    this.showLowResumeScore = !this.showLowResumeScore;
  }

  public openResumeFile(candidate: FiveQGradingRecord): void {
    if (candidate.resumeFileId) {
      this.hireService.getApplicationFile(candidate.id.toString(), candidate.resumeFileId.toString())
      .subscribe((url: string) => {
        this.newTab = window.open('about:blank', '_blank');
        if (this.newTab !== null) {
          this.newTab.location.href = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;
        }
      });
    }
  }

  public getAnswerValue(candidate: FiveQGradingRecord, index: number): string {
    candidate.answers = _.defaultTo(candidate.answers, []);
    const answer = _.defaultTo(candidate.answers[index], { text: '', score: '' });
    return answer.score;
  }

  public showQuestionModal(questionIndex: number): void {
    this.selectedQuestion = this.questions[questionIndex];
    this.modalService.open(this.questionModal, {
      size: DfModalSize.Large
    });
  }

  public updateAnswerValue(event: { target: { value: string }}, candidate: FiveQGradingRecord, index: number): void {
    candidate.answers = _.defaultTo(candidate.answers,[]);
    candidate.answers[index].score = event.target.value;
    candidate.totalAverage = this.getCandidateTotalAverage(candidate.answers);
    this.changesSaved = false;
    candidate.dirty = true;
  }

  public showAllAnswersModal(candidate: FiveQGradingRecord): void {
    this.selectedCandidate = candidate;
    this.modalService.open(this.allAnswersModal, {
      size: DfModalSize.Large
    });
  }

  public finalizeCandidateGrading(candidate: FiveQGradingRecord): void {
    this.isLoading = true;
    this.hireService.finalizeFiveQEvaluation(candidate.id)
      .subscribe(() => this.fetchData(), error => this.error = error.error.text);
  }

  private getCandidateTotalAverage(answers: { text: string, score: string}[]): string {
    const average = answers
      .map((answer: { text: string; score: string }) => _.defaultTo(Number(answer.score), 0))
      .reduce((answerA: number, answerB: number) => answerA + answerB);
    return (average / answers.length).toFixed(2);
  }
}
