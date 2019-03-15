import { WorkflowState } from 'app/core/models/workflow';

export interface WorkflowStateMapping {
  jiraStatusName?: string;
  sequenceNumber?: number;
  workflowState?: WorkflowState;
}
