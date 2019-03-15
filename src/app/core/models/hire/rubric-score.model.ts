import { TestEvaluation } from 'app/core/models/hire/test-evaluation.model';

export interface RubricScore {
  id: number;
  testsEvaluations: TestEvaluation[];
}
