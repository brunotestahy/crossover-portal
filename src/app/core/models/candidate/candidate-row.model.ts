import { CandidateTestEvaluation } from 'app/core/models/candidate/candidate-test-evaluation.model';

export interface CandidateRow {
  name: string;
  pipeline: string;
  email: string;
  skypeId: string;
  location: string;
  projectEvaluationFinished: string;
  hasCV: boolean;
  recruiter: string;
  applicationId: number;
  candidateId: number;
  score: number;
  testsEvaluations: CandidateTestEvaluation[];
}
