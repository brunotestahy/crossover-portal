import { MappedActivityInfo } from 'app/core/models/productivity/mapped-activity-info.model';
import { ProductivitySummary } from 'app/core/models/productivity/productivity-summary.model';

export interface ProductivitySummaryWithMappedActivities {
  productivitySummary: ProductivitySummary;
  mappedActivities: (MappedActivityInfo | null)[];
}
