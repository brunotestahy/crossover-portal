import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as testTypes from 'app/core/constants/endorsement-filter/test-type';
import * as scoreType from 'app/core/constants/hire/score-type';
import { AbstractTestVisitorFactory } from 'app/core/models/endorsement-filter/abstract-test-visitor-factory';
import { ScoreField } from 'app/core/models/hire';

export class HackerRankVisitor extends AbstractTestVisitorFactory {
  public static expectedType = testTypes.HACKER_RANK;

  public setFields(target: FormGroup, scoreFields: ScoreField[]): void {
    target.addControl(
      'hrScoreMin',
      new FormControl(null, [Validators.min(0), Validators.max(100)])
    );
    target.addControl(
      'hrScoreMax',
      new FormControl(null, [Validators.min(0), Validators.max(100)])
    );

    scoreFields.push({
      name: 'HR Score',
      type: scoreType.TEST_SCORE,
      testType: testTypes.HACKER_RANK,
      fields: {
        min: 'hrScoreMin',
        max: 'hrScoreMax',
      },
      scoreMax: target.value.hrScoreMax,
      scoreMin: target.value.hrScoreMin,
    });
  }
}
