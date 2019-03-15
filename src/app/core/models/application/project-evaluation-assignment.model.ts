export interface ProjectEvaluationAssignment {
  assignmentData: string;
  assignmentEndDate: number;
  assignmentName: string;
  assignmentStartDate: number;
  autograded: boolean;
  canSubmitAssignmentRequest: boolean;
  deliverablesUploaded: boolean;
  maxAssigmnetExtensionRequestDays: number;
  maxDeliveryInMB: number;
  pipelineName: string;
  status: string;
  vmAvailable: boolean;
}
