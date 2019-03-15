import { Test } from 'app/core/models/hire/test.model';

export interface TestDetails {
  numberOfAcceptedCandidates?: number;
  numberOfCandidates?: number;
  numberOfRejectedCandidates?: number;
  weight?: number;
  test: Test;
}
