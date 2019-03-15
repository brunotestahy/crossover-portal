import {
  TeamActivitiesAverage,
  TeamMetricsAverage,
} from 'app/core/models/team';

export interface TeamAverage {
  activitiAvg?: TeamActivitiesAverage;
  metricAvg?: TeamMetricsAverage;
  teamId: number;
}
