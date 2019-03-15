import { ResumeRubric } from 'app/core/models/hire/resume-rubric.model';
import { Test } from 'app/core/models/hire/test.model';

export interface ResumeRubricWeight {
  id: number;
  resumeRubric: ResumeRubric;
  weight: number;
  test?: Test;
}
