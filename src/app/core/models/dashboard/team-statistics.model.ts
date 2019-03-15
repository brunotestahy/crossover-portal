import { TeamWorkflowStatistic } from "app/core/models/dashboard/team-workflow-statistic.model";

export interface TeamStatistics {
  totalItems: { status: string; count: number }[];
  averageItems: { status: string; average: number }[];
  overdueIssuesCount: number;
  totalGroupItems: { status: string; count: number; average: number }[];
  workflowNonAssignmentStatistics: TeamWorkflowStatistic[];
  workflowAssignmentStatistics: TeamWorkflowStatistic[];
}
