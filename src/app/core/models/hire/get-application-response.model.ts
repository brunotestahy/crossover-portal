import { ApplicationFlow, TestInstance, TestScore } from 'app/core/models/application';
import { Candidate } from 'app/core/models/candidate';
import { Job, ResumeFile } from 'app/core/models/hire';

export interface GetApplicationResponse {
  createdOn: string;
  updatedOn: string;
  resumeFile: ResumeFile;
  candidate: Partial<Candidate>;
  job: Partial<Job>;
  status: string;
  applicationType: string;
  testScores: TestScore[];
  testInstances: TestInstance[];
  score: number;
  yearsOfExperience: number;
  applicationFlow: ApplicationFlow;
  id: number;
  task: string;
  fileUrl?: string;
}
