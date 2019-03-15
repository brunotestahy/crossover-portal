import { AbstractControl } from '@angular/forms';

import { ScoreField, TestDetails } from 'app/core/models/hire';

export abstract class AbstractTestVisitorFactory {
  public static expectedType = 'UNKNOWN';

  public static matches(type: string): boolean {
    return type === this.expectedType;
  }

  public static getInstance(type: string, types: (typeof AbstractTestVisitorFactory)[]): AbstractTestVisitorFactory | null {
    const filter = types.find(entry => entry.expectedType === type);
    if (!filter) {
      return null;
    }
    const foundType = Object.assign(filter);
    return new foundType();
  }

  public abstract setFields(
    target: AbstractControl,
    scoreFields: ScoreField[],
    testDetail?: TestDetails
  ): void;
}
