import {
  AssignmentHistory,
  CurrentAssignmentHistory,
} from 'app/core/models/assignment';

export interface AssignmentResponse {
  assignmentHistories: AssignmentHistory[];
  currentAssignmentHistory: CurrentAssignmentHistory;
}
