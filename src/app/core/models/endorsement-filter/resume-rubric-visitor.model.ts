import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as testTypes from 'app/core/constants/endorsement-filter/test-type';
import * as scoreType from 'app/core/constants/hire/score-type';
import { AbstractTestVisitorFactory } from 'app/core/models/endorsement-filter/abstract-test-visitor-factory';
import { ResumeRubric, ResumeRubricWeight, ScoreField, TestDetails } from 'app/core/models/hire';

export class ResumeRubricVisitor extends AbstractTestVisitorFactory {
  public static expectedType = testTypes.RESUME_RUBRIC;

  public setFields(target: FormGroup, scoreFields: ScoreField[], testDetail: TestDetails): void {
    (testDetail.test.resumeRubrics as ResumeRubricWeight[]).forEach(resumeWeight => {
      target.addControl(
        `${resumeWeight.resumeRubric.id}Min`,
        new FormControl(null, [Validators.min(0), Validators.max(100)])
      );
      target.addControl(
        `${resumeWeight.resumeRubric.id}Max`,
        new FormControl(null, [Validators.min(0), Validators.max(100)])
      );

      scoreFields.push({
        name: resumeWeight.resumeRubric.name,
        type: scoreType.RUBRIC_SCORE,
        rubricId: (resumeWeight.resumeRubric as ResumeRubric).id,
        fields: {
          min: `${resumeWeight.resumeRubric.id}Min`,
          max: `${resumeWeight.resumeRubric.id}Max`,
        },
        scoreMax: target.value[`${resumeWeight.resumeRubric.id}`],
        scoreMin: target.value[`${resumeWeight.resumeRubric.id}`],
      });
    });

    target.addControl(
      'overallResumeGradeMin',
      new FormControl(null, [Validators.min(0), Validators.max(100)])
    );
    target.addControl(
      'overallResumeGradeMax',
      new FormControl(null, [Validators.min(0), Validators.max(100)])
    );

    scoreFields.push({
      name: 'Overall Resume Grade',
      type: scoreType.TEST_SCORE,
      testType: testTypes.RESUME_RUBRIC,
      fields: {
        min: 'overallResumeGradeMin',
        max: 'overallResumeGradeMax',
      },
      scoreMax: target.value.overallResumeGradeMax,
      scoreMin: target.value.overallResumeGradeMin,
    });
  }
}
