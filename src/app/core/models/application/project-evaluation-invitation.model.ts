export interface ProjectEvaluationInvitation {
  status: string;
  inviteStartDate: number;
  inviteEndDate: number;
  canSubmitInviteRequest: boolean;
  maxInviteRequestDays: number;
  pipelineName: string;
  assignmentDaysCount: number;
  prerequisites: string;
}
