import { SlackTestResponse, SlackUserDataResponse } from 'app/core/models/slack';

export const SLACK_USER_DATA_MOCK: SlackUserDataResponse = {
  slackUserId: 'U6YF3J6CE',
  slackTeamId: 'T20GN7DQT',
  slackUserName: 'Alan  Jhonnes',
  slackTeamName: 'DevFactory',
  slackUserEmail: 'alan.jhonnes@devfactory.com',
  isDeleted: false,
};

export const SLACK_TEST_MOCK: SlackTestResponse = {
  url: 'https://devfactorydev.slack.com/',
  team: 'DevFactory',
  user: 'alan..jhonnes',
  teamId: 'T20GN7DQT',
  userId: 'U6YF3J6CE',
};
