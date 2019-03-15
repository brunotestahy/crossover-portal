import { Test } from 'app/core/models/assignment/test.model';
import { ResumeRubricScore } from 'app/core/models/hire/resume-rubric-score.model';
import { TestEvaluation } from 'app/core/models/hire/test-evaluation.model';
import { TestScore } from 'app/core/models/hire/test-score.model';
import { Test as TestHire } from 'app/core/models/hire/test.model';

export class Applicant {
  id: number;
  averageRating: number;
  candidate: {
    skypeId?: string,
    email?: string,
    countryName?: string,
    printableName?: string
  };
  jobTitle?: string;
  campaign?: string;
  resumeFile: { id: number };
  tests?: {
    rubrics: {
      resumeRubricScores: ResumeRubricScore[];
    },
  };
  testsEvaluations: TestEvaluation[];
  testScores?: TestScore[];
  matScore: TestScore;
  rkScore: TestScore;
  fiveQScore?: number;
  fiveQResponse: TestEvaluation;
  overAllResumeGrad: number;
  flowType: string;
  assignmentScore: number;
  hackerRankScore: number;
  previewTestPasser: boolean;
  lastNoteContent?: string;
  previewToHiringManager: boolean;
  rubricEval: TestEvaluation;
  status: string;
  taskCreationTime: string;
  task: string;
  taskStatus: string;
  HACKER_RANK: Test;
  FIVEQ: TestHire;
  AM_ENDORSEMENT: Test;
  RESUME_RUBRIC: Test;
  MANDATORY_ATTRIBUTES: Test;
  RESUME_KEYWORD: Test;
  AVERAGE_SCORE: Test;
  TALENT_ADVOCATE: Test;
}

export interface ApplicantRow {
  id: number;
  name: string | undefined;
  pipeline: string | undefined;
  campaign: string | undefined;
  email: string | undefined;
  skype: string | undefined;
  location: string | undefined;
  resume: string;
  files: string;
  technicalScreenScore: number | null;
  evaluationScore: string | number | null;
  status: string;
  timeSpent: string;
  resumeKeywordScore: number;
  resumeFile: { id: number };
}
