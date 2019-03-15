import { Question } from 'app/core/models/hire/question.model';
import { ResumeRubricWeight } from 'app/core/models/hire/resume-rubric-weight.model';

export interface Test {
  id: number;
  name?: string;
  status?: string;
  type: string;
  testUrl?: string;
  questions?: Question[];
  resumeRubrics?: ResumeRubricWeight[];
}
