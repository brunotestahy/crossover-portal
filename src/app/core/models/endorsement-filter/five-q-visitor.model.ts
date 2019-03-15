import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as testTypes from 'app/core/constants/endorsement-filter/test-type';
import * as scoreType from 'app/core/constants/hire/score-type';
import { AbstractTestVisitorFactory } from 'app/core/models/endorsement-filter/abstract-test-visitor-factory';
import { Question, ScoreField, TestDetails } from 'app/core/models/hire';

export class FiveQVisitor extends AbstractTestVisitorFactory {
  public static expectedType = testTypes.FIVEQ;

  public setFields(target: FormGroup, scoreFields: ScoreField[], testDetail: TestDetails): void {
    (testDetail.test.questions as Question[]).forEach(question => {
      target.addControl(
        `q${question.sequenceNumber}Min`,
        new FormControl(null, [Validators.min(0), Validators.max(100)])
      );
      target.addControl(
        `q${question.sequenceNumber}Max`,
        new FormControl(null, [Validators.min(0), Validators.max(100)])
      );

      scoreFields.push({
        name: `Q${question.sequenceNumber}`,
        type: scoreType.QUESTION_SCORE,
        sequenceNumber: question.sequenceNumber,
        fields: {
          min: `q${question.sequenceNumber}Min`,
          max: `q${question.sequenceNumber}Max`,
        },
        scoreMax: target.value[`q${question.sequenceNumber}Max`],
        scoreMin: target.value[`q${question.sequenceNumber}Min`],
      });
    });

    target.addControl(
      'fiveqMin',
      new FormControl(null, [Validators.min(0), Validators.max(100)])
    );
    target.addControl(
      'fiveqMax',
      new FormControl(null, [Validators.min(0), Validators.max(100)])
    );

    scoreFields.push({
      name: '5Q Total',
      type: scoreType.TEST_SCORE,
      testType: testTypes.FIVEQ,
      fields: {
        min: 'fiveqMin',
        max: 'fiveqMax',
      },
      scoreMax: target.value.fiveqMax,
      scoreMin: target.value.fiveqMin,
    });
  }
}
