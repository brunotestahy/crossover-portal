import {
  AssignmentAvatar,
  AssignmentHistory,
  FeatureValues,
  Selection,
} from 'app/core/models/assignment';
import { Candidate } from 'app/core/models/candidate';
import { Manager } from 'app/core/models/manager';
import { Team } from 'app/core/models/team';
import { WorkflowJiraUser } from 'app/core/models/workflow';

export interface Assignment {
  acceptanceDate: string;
  activeMetricName: string;
  activeMetricType: string;
  assignmentAvatar: AssignmentAvatar;
  assignmentHistories: Array<AssignmentHistory>;
  backgroundCheckDate: string;
  candidate: Candidate;
  completedOn: string;
  createdOn: string;
  currentAssignmentHistory: AssignmentHistory;
  deskId: string;
  disabledFeatures: string[];
  effectiveDateBegin: Date;
  endDate: string;
  featureValues: FeatureValues;
  id: number;
  jiraId: string;
  jobTitle: string;
  lengthInDays: number;
  paymentPlatform: string;
  personalCompany: string;
  manager: Manager;
  salary: number;
  salaryType: string;
  salaryUnit: string;
  salesforceId: string;
  scheduledTerminationDate: string;
  startDate: string;
  status: string;
  trackerRequired: boolean;
  updatedOn: string;
  verifiedCredentialsCode: string;
  weeklyLimit: number;
  weeklyMeetingMinutesLimit: number;
  workflowJiraUser: WorkflowJiraUser;
  zendeskId: string;
  selection: Selection;
  currentStep?: number;
  team: Team;
  teams?: Team[];
  type?: string;
}
