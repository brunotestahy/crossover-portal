import { ResumeRubricScore } from 'app/core/models/hire/resume-rubric-score.model';
import { TestEvaluationAnswer } from 'app/core/models/hire/test-evaluation-answer.model';
import { Test as TestHire } from 'app/core/models/hire/test.model';

export interface TestEvaluation {
  id?: number;
  answers?: TestEvaluationAnswer[];
  resumeRubricScores: ResumeRubricScore[];
  test: TestHire;
  type: string;
}
