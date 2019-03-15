import { FormControl, FormGroup, Validators } from '@angular/forms';

import * as testTypes from 'app/core/constants/endorsement-filter/test-type';
import * as scoreType from 'app/core/constants/hire/score-type';
import { AbstractTestVisitorFactory } from 'app/core/models/endorsement-filter/abstract-test-visitor-factory';
import { ScoreField } from 'app/core/models/hire';

export class AssignmentVisitor extends AbstractTestVisitorFactory {
  public static expectedType = testTypes.ASSIGNMENT;

  public setFields(target: FormGroup, scoreFields: ScoreField[]): void {
    target.addControl(
      'assignmentScoreMin',
      new FormControl(null, [Validators.min(0), Validators.max(100)])
    );
    target.addControl(
      'assignmentScoreMax',
      new FormControl(null, [Validators.min(0), Validators.max(100)])
    );

    scoreFields.push({
      name: 'Assignment Score',
      type: scoreType.TEST_SCORE,
      testType: testTypes.ASSIGNMENT,
      fields: {
        min: 'assignmentScoreMin',
        max: 'assignmentScoreMax',
      },
      scoreMax: target.value.assignmentScoreMax,
      scoreMin: target.value.assignmentScoreMin,
    });
  }
}
