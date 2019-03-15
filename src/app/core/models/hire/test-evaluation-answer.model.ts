import { Question } from "app/core/models/hire";

export interface TestEvaluationAnswer {
  score: number;
  sequenceNumber: number;
  question?: Question;
  answer?: string;
}
