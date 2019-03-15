import { ApplicationFlow } from 'app/core/models/application/application-flow.model';
import { Candidate } from 'app/core/models/candidate/candidate.model';
import { Job } from 'app/core/models/hire/job.model';
import { ResumeFile } from 'app/core/models/hire/resume-file.model';
import { TestInstance } from 'app/core/models/hire/test-instance.model';
import { TestScore } from 'app/core/models/hire/test-score.model';

export interface JobApplicationResponse {
  createdOn: string;
  updatedOn: string;
  resumeFile: ResumeFile;
  candidate: Partial<Candidate>;
  job: Partial<Job>;
  status: 'IN_PROGRESS' | string;
  applicationType: string;
  testScores: TestScore[];
  testInstances: TestInstance[];
  score: number;
  yearsOfExperience: number;
  applicationFlow: Partial<ApplicationFlow>;
  id: number;
}
