import {
  JobApplication,
  TestInstance,
  WrittenAssignationTest,
} from 'app/core/models/application';

export const TEST_INSTANCES_MOCK: TestInstance[] = [{'id': 0, 'test': {'type': 'FIVEQ', 'id': 5015}}];
export const JOB_APPLICATION_MOCK: JobApplication = {
  id: 1521072417,
  applicationFlow: {id: 7, name: '5Q Only', flowDefinitionType: 'FIVEQ'},
  applicationType: 'NATIVE',
  candidate: {
    type: 'CANDIDATE',
    userAvatars: [
      {
        'id': 1436220,
        'type': 'CANDIDATE',
      },
    ],
    id: 1436220,
    averageRatings: 0,
    workedHours: 0,
    billedHours: 0,
    connections: [],
    skypeId: 'test ccc',
    agreementAccepted: false,
    intercomId: '5a7b1fb2e67857944e1812b0',
    email: 'awork-32864@ccc.com',
    printableName: 'Peter Griffin',
    userSecurity: {
      linkedInLogin: false,
      enabled: false,
      accountNonExpired: true,
      accountNonLocked: true,
      credentialsNonExpired: true,
      securityQuestion: 'Sample',
    },
    candidate: true,
    personal: false,
    location: {
      country: {
        id: 2,
        name: 'Aland Islands',
        code: 'ax',
        allowed: true,
        zipFormat: '22\\d{3}',
      },
      timeZone: {
        id: 34,
        name: 'Europe/Helsinki',
        offset: 10800000,
        standardOffset: 7200000,
        hourlyOffset: '+03:00',
      },
      phone: '1878787878787',
    },
    avatarTypes: [
      'CANDIDATE',
      'PERSONAL',
    ],
    firstName: 'Peter',
    lastName: 'Griffin',
    userId: 779584,
    manager: false,
    companyAdmin: false,
    photoUrl: 'https://xo-qa-uploads-crossover.s3.amazonaws.com/images/0f200eaead7d7ba4c1615ce0f1a11d27.jpg',
    busySlots: [],
    appFeatures: [],
  },
  job: {
    id: 3549,
    title: 'Technical Screen + Written Evaluation',
    trackerRequired: false,
    applicationFlow: {
      id: 6,
      name: 'Moodle and 5Q',
      flowDefinitionType: 'HACKERRANK_FIVEQ',
    },
    jbpEnabled: false,
    outboundEnabled: false,
    activationDate: '2018-03-26T08:16:12.000+0000',
    workingHoursPerWeek: 40,
    autoEndorse: false,
    flowType: 'HACKERRANK_FIVEQ',
    testSetupCompleted: false,
  },
  resumeFile: {
    id: 1251543,
    label: 'Resume',
    name: 'cv-template-monster-new.docx',
    internal: false,
    resume: true,
    notResume: false,
  },
  score: 0,
  status: 'IN_PROGRESS',
  task: 'candidateSubmits5QTest',
  testScores: [],
  createdOn: '2018-03-15T23:16:22.000+0000',
  updatedOn: '2018-03-15T23:16:22.000+0000',
  variants: [],
  yearsOfExperience: 0,
  testInstances: TEST_INSTANCES_MOCK,
};

export const WRITTEN_ASSIGNMENT_MOCK: WrittenAssignationTest = {
  id: 914497,
  type: 'FIVEQ_ANSWER',
  test: {
    id: 5015,
    type: 'FIVEQ',
    description: 'Q1 Description',
    questions: [
      {
        sequenceNumber: 1,
        question: 'Question 1',
      },
      {
        sequenceNumber: 2,
        question: 'Question 2',
      },
      {
        sequenceNumber: 3,
        question: 'Question 3',
      },
    ],
  },
  answers: [
    {
      sequenceNumber: 1,
      answer: 'Answer 1',
    },
    {
      sequenceNumber: 2,
      answer: 'Answer 2',
    },
    {
      sequenceNumber: 3,
    },
  ],
};
