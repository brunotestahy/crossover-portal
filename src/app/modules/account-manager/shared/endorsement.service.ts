import { Injectable } from '@angular/core';

import {
  Applicant,
  JobDetails,
  ResumeRubricWeight,
  Test,
  TestDetails,
  TestScore,
} from 'app/core/models/hire';

@Injectable()
export class EndorsementService {
  public rubrics = [] as ResumeRubricWeight[];
  public appScores = {} as {
    [key: string]: {
      rubrics: { [key: number]: number }
    } | number
  };

  public getRubrics(data: JobDetails): ResumeRubricWeight[] {
    const details = data.tests as TestDetails[];
    const rubrics = details
      .filter(detail => detail.test.type === 'RESUME_RUBRIC')
      .map(detail => detail.test.resumeRubrics)
      .pop() as ResumeRubricWeight[];
    /* istanbul ignore else */
    if (rubrics.length) {
      this.rubrics = rubrics.sort(a => a.resumeRubric.type.search('PRE_DEFINED'));
    }
    return rubrics;
  }

  public createDataModels(data: Applicant[]): void {
    this.appScores = {};

    data.forEach(app => {
      this.appScores[app.id] = { rubrics: {} };
      const testScores = app.testScores as TestScore[];
      testScores
        .forEach(testScore => this.appScores[testScore.test.type] = testScore.score);
      if (this.rubrics.length) {
        Object.assign(this.appScores[app.id], { rubrics: {} });
        this.createRubricsDataModels(app);
      }
    });
  }

  public createRubricsDataModels(app: Applicant): void {
    const testScores = app.testScores as TestScore[];
    const overall = testScores.filter(t => t.test.type === 'RESUME_RUBRIC')[0];

    this.rubrics.forEach(test => {
      const entry = test.test || {} as Test;
      if (app.tests && app.tests.rubrics) {
        app.tests.rubrics.resumeRubricScores.forEach(rScore => {
          if (entry.id === rScore.resumeRubric.id) {
            Object.assign(this.appScores[app.id], {
              rubrics: { [entry.id]: rScore.score },
            });
          }
        });
      } else {
        Object.assign(this.appScores[app.id], {
          rubrics: entry ? { [entry.id]: null } : {},
        });
      }
    });

    Object.assign(this.appScores[app.id], {
      rubrics: { overall: overall ? overall.score : null },
    });
  }
}
