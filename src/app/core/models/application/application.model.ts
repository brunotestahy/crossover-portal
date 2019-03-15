import { Variant } from 'app/core/models/application/variant.model';
import { Candidate } from 'app/core/models/candidate/candidate.model';
import { Job } from 'app/core/models/hire/job.model';
import { ResumeFile } from 'app/core/models/hire/resume-file.model';
import { TestScore } from 'app/core/models/hire/test-score.model';

export interface Application {
  id: number;
  completedOn?: string;
  candidate: Partial<Candidate>;
  job?: Partial<Job>;
  status?: string;
  score?: number;
  source?: string;
  yearsOfExperience?: number;
  variants?: Variant[];
  resumeFile?: ResumeFile;
  files?: ResumeFile[];
  testScores?: TestScore[];
  highestEducationLevel?: string;
  lastNote?: string;
  createdOn?: string;
  updatedOn?: string;
}
