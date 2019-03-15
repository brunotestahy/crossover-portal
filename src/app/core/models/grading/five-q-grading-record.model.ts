import { TestEvaluationAnswer } from 'app/core/models/hire';

export interface FiveQGradingRecord {
  id: number;
  name: string;
  email: string;
  date: Date;
  dirty: boolean;
  keywordScore?: number;
  answers?: { text: string; score: string }[];
  totalAverage?: string;
  resumeFileId?: number;
  testsEvaluations?: {
    id: number;
    type: string;
    answers?: TestEvaluationAnswer[]
  }[];
}
