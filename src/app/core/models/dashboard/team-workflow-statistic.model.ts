import { Assignment } from 'app/core/models/assignment/assignment.model';

export interface TeamWorkflowStatistic {
  assignment: Assignment;
  assigneeName: string;
  workflowStatusGroupStatistics: { status: string; count: number; }[];
  workflowStatusStatistics: { status: string; count: number; }[];
}
