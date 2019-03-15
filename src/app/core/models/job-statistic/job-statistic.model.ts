import { JobStatisticValue } from 'app/core/models/job-statistic';

export interface JobStatistic {
  id: number;
  type: string;
  values: JobStatisticValue[];
}
