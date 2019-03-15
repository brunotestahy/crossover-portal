export interface SlackUserDataResponse {
  slackUserId: string;
  slackTeamId: string;
  slackUserName: string;
  slackTeamName: string;
  slackUserEmail: string;
  testResult?: 'ok' | string;
  isDeleted: boolean;
}
