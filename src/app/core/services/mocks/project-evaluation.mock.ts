import { ProjectEvaluationInvitation } from 'app/core/models/application';

export const PROJECT_EVALUATION_INVITATION_MOCK: ProjectEvaluationInvitation = {
  status: 'Invited',
  inviteStartDate: 1522140384,
  inviteEndDate: 1523349984,
  canSubmitInviteRequest: true,
  maxInviteRequestDays: 7,
  pipelineName: 'Software Engineer - Java',
  assignmentDaysCount: 3,
  prerequisites: '',
};
