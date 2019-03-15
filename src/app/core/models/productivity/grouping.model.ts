import { Assignment } from 'app/core/models/assignment';
import { AdvancedGroup } from 'app/core/models/productivity/advanced-group.model';

export interface Grouping {
  assignment: Assignment;
  advancedGroups: AdvancedGroup[];
  alignmentScore: number;
  focusScore: number;
  intensityScore: number;
  periodLong: number;
  totalTrackedTime: number;
}
