import { Test } from 'app/core/models/hire/test.model';

export interface TestScore {
  id: number;
  label: string;
  name: string;
  score: number;
  maxScore?: number;
  percentage?: number;
  invertedPercentile?: number;
  test: Test;
}
