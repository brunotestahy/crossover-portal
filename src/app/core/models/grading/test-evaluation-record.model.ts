import { TestEvaluationAnswer } from "app/core/models/hire";

export interface TestEvaluationRecord {
  id: number;
  testsEvaluations: {
    id: number;
    type: string;
    answers?: TestEvaluationAnswer[];
  }[];
}
