import { StepDefinition } from 'app/core/models/application';

export const APPLICATION_PROCESS_STEPS_DEF: StepDefinition[] = [
  {
    name: 'ApplicationProcessStep_CreateBasicProfile',
    tasks: ['candidateProvidesContactInformation1'],
  },
  {
    name: 'ApplicationProcessStep_TechnicalScreen',
    tasks: [
      'techTrialUpdatesStatus1',
    ],
  },
  {
    name: 'ApplicationProcessStep_WrittenEvaluation',
    tasks: [
      'candidateSubmits5QTest',
      '',
      'recruitmentAnalystGrades5QTest',
      'accountManagerEndorsesApplication',
    ],
  },
  {
    name: 'ApplicationProcessStep_ProjectEvaluation',
    tasks: [
      'candidateStartsAssignment',
      '',
      'candidateEndsAssignment',
      'techTrialUpdatesStatus2',
    ],
  },
  {
    name: 'ApplicationProcessStep_MeetAdvocate',
    tasks: ['candidateTakesTalentAdvocateTest'],
  },
  {
    name: 'ApplicationProcessStep_Marketplace',
    tasks: ['marketplace'],
  },
];
