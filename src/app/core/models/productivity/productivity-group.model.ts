import { AssignmentHistory } from 'app/core/models/assignment/assignment-history.model';
import { Assignment } from 'app/core/models/assignment/assignment.model';
import { DayActivityTime } from 'app/core/models/productivity/day-activity-time.model';
import { Grouping } from 'app/core/models/productivity/grouping.model';

export interface ProductivityGroup {
  assignment: Assignment;
  assignmentHistory: AssignmentHistory;
  dayActivitiesTime: DayActivityTime;
  grouping: Grouping;
}
