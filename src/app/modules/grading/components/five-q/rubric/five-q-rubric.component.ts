import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { filter, finalize, map } from 'rxjs/operators';

import { Question } from 'app/core/models/hire';
import { HireService } from 'app/core/services/hire/hire.service';

@Component({
  selector: 'app-five-q-rubric',
  templateUrl: './five-q-rubric.component.html',
  styleUrls: ['./five-q-rubric.component.scss'],
})
export class FiveQRubricComponent implements OnInit {
  public readonly FIVE_Q = 'FIVEQ';

  public isLoading = false;

  public DEFAULT_RUBRIC_TEXT = 'Rubric is not provided for this question';

  public questions: Question[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private hireService: HireService
  ) { }

  public ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;

    this.isLoading = true;
    this.hireService
    .getJob(params.pipelineId)
    .pipe(
      finalize(() => this.isLoading = false),
      map(jobDetails => {
        jobDetails.tests = _.defaultTo(jobDetails.tests, []);
        return jobDetails.tests.filter(testDetail => testDetail.test.type === this.FIVE_Q);
      }),
      filter(testDetails => !!testDetails && testDetails.length > 0)
    )
    .subscribe(testDetails => {
      const test = testDetails[0].test;
      test.questions = _.defaultTo(test.questions, []);
      test.questions.forEach(question => question.rubric = _.defaultTo(question.rubric, this.DEFAULT_RUBRIC_TEXT));
      this.questions = test.questions;
    });
  }
}
