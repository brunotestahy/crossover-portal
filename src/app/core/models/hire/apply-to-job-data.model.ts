import { AnonymousCandidateData } from 'app/core/models/hire';

export interface ApplyToJobData {
  application: {
    candidate: AnonymousCandidateData;
    job: { id: number },
    campaign?: string;
  };
  resume: string;
}
