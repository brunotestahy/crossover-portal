import { Test } from 'app/core/models/assignment';

export interface TestScore {
  test: Test;
  score: number;
  maxScore: number;
  percentage: number;
  invertedPercentile: number;
}
