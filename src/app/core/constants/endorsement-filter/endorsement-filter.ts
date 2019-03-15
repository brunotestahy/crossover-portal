import { DfListPanelItem } from '@devfactory/ngx-df';
import * as taskStatus from 'app/core/constants/hire/task-status';

export const applicationStatusModels: DfListPanelItem[] = [
  {
    value: Object.assign({ value: null }).value,
    label: 'In Progress',
  },
  {
    value: 'REJECTED',
    label: 'Rejected',
  },
  {
    value: 'ACCEPTED',
    label: 'Accepted',
  },
];

export const tasks = [
  {
    value: taskStatus.candidateVerifiesEmailAddress.value,
    text: taskStatus.candidateVerifiesEmailAddress.display,
  },
  {
    value: taskStatus.techTrialUpdatesStatus1.value,
    text: taskStatus.techTrialUpdatesStatus1.display,
  },
  {
    value: [
      taskStatus.candidateProvidesContactInformation1.value,
      taskStatus.candidateProvidesContactInformation2.value,
    ],
    text: taskStatus.candidateProvidesContactInformation2.display,
  },
  {
    value: taskStatus.candidateSubmits5QTest.value,
    text: taskStatus.candidateSubmits5QTest.display,
  },
  {
    value: taskStatus.recruitmentAnalystGrades5QTest.value,
    text: taskStatus.recruitmentAnalystGrades5QTest.display,
  },
  {
    value: taskStatus.accountManagerEndorsesApplication.value,
    text: taskStatus.accountManagerEndorsesApplication.display,
  },
  {
    value: [
      taskStatus.recruiterConductsPreMarketplaceInterview.value,
      taskStatus.candidateTakesTalentAdvocateTest.value,
    ],
    text: taskStatus.recruiterConductsPreMarketplaceInterview.display,
  },
];
