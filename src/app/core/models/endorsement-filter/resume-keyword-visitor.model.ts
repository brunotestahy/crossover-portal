import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as testTypes from 'app/core/constants/endorsement-filter/test-type';
import * as scoreType from 'app/core/constants/hire/score-type';
import { AbstractTestVisitorFactory } from 'app/core/models/endorsement-filter/abstract-test-visitor-factory';
import { ScoreField } from 'app/core/models/hire';

export class ResumeKeywordVisitor extends AbstractTestVisitorFactory {
  public static expectedType = testTypes.RESUME_KEYWORD;

  public setFields(target: FormGroup, scoreFields: ScoreField[]): void {
    target.addControl(
      'keywordScoreMin',
      new FormControl(null, [Validators.min(0), Validators.max(100)])
    );
    target.addControl(
      'keywordScoreMax',
      new FormControl(null, [Validators.min(0), Validators.max(100)])
    );

    scoreFields.push({
      name: 'Keyword Score',
      type: scoreType.TEST_SCORE,
      testType: testTypes.RESUME_KEYWORD,
      fields: {
        min: 'keywordScoreMin',
        max: 'keywordScoreMax',
      },
      scoreMax: target.value.keywordScoreMax,
      scoreMin: target.value.keywordScoreMin,
    });
  }
}
