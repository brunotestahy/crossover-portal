import { AssignmentSummary } from 'app/core/models/productivity/assignment-summary.model';
import { CalculatedAverages } from 'app/core/models/productivity/calculated-averages.model';

export interface MappedActivityInfo extends AssignmentSummary {
  calculatedAverages: CalculatedAverages;
  metricsChange: number | undefined;
}
