import { ApplicationFlow } from 'app/core/models/application/application-flow.model';
import { Job } from 'app/core/models/application/job.model';
import { ResumeFile } from 'app/core/models/application/resume-file.model';
import { TestInstance } from 'app/core/models/application/test-instance.model';
import { TestScore } from 'app/core/models/application/test-score.model';
import { Variant } from 'app/core/models/application/variant.model';
import { Candidate } from 'app/core/models/candidate/candidate.model';
import { TestEvaluationAnswer } from 'app/core/models/hire';

export interface JobApplication {
  applicationFlow: ApplicationFlow;
  applicationType: string;
  candidate: Candidate;
  createdOn: string;
  completedOn?: string;
  id: number;
  job: Job;
  resumeFile: ResumeFile;
  score: number;
  status: string;
  task: string;
  testInstances: TestInstance[];
  testScores: TestScore[];
  updatedOn: string;
  variants: Variant[];
  yearsOfExperience: number;
  highestEducationLevel?: string;
  testsEvaluations?: {
    id: number;
    type: string;
    answers?: TestEvaluationAnswer[]
  } [];
}
