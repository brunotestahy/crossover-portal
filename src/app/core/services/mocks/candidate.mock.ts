import { ApplicationFlowStep } from 'app/core/models/application';
import {
  Candidate,
  CandidateLanguage,
  Certification,
  Employment,
  Language,
} from 'app/core/models/candidate';

export const STEPS: ApplicationFlowStep[] = [
  {
    id: '35589368-3a1b-43bf-886c-800536a29037',
    name: 'ApplicationProcessStep_CreateBasicProfile',
    title: 'Create Basic Profile',
    order: 0,
    clazz: 'create-basic-profile',
    description: `We need some basic information about you
      to proceed with the recruitment process.
      You\'ll be asked to provide it here.`,
    allowedFlowTypes: [
      {
        MOODLE_WE: 6,
        MOODLE_PE: 8,
      },
    ],
    state: {
      names: ['authenticated.application-process.create-basic-profile'],
    },
  },
  {
    id: '0eeba79d-54f6-4795-8ca7-494c9b5662b3',
    name: 'ApplicationProcessStep_TechnicalScreen',
    title: 'Technical Screen',
    order: 1,
    clazz: 'technical-screen',
    description: `A technical test to exercise your brain. It takes about one hour to complete.`,
    allowedFlowTypes: [
      {
        MOODLE_WE: 6,
        MOODLE_PE: 8,
      },
    ],
    state: {
      names: ['authenticated.application-process.technical-screen'],
    },
  },
  {
    id: '05f05594-3e28-4356-89bb-51e9d88abeb0',
    name: 'ApplicationProcessStep_WrittenEvaluation',
    title: 'Written Evaluation',
    order: 2,
    clazz: 'written-evaluation',
    description: `Here we will ask you some scenario-based questions to see your thought process in action.
      It usually takes a couple of hours to complete.`,
    allowedFlowTypes: [
      {
        MOODLE_WE: 6,
      },
    ],
    state: {
      names: [
        'authenticated.application-process.written-evaluation',
        'authenticated.application-process.written-evaluation.assignment',
        'authenticated.application-process.written-evaluation.submitted',
        'authenticated.application-process.written-evaluation.submitted',
      ],
    },
  },
  {
    id: '4f299d74-d49c-4e4f-848c-a69bc1c6b423',
    name: 'ApplicationProcessStep_ProjectEvaluation',
    title: 'Project Evaluation',
    order: 2,
    clazz: 'project-evaluation',
    description: `Here you will be presented with a complex assignment you have to provide a solution for.
      It\'s more challenging and also more time consuming than the Technical Screen.
      It takes about one working day to complete.`,
    allowedFlowTypes: [
      {
        MOODLE_PE: 8,
      },
    ],
    state: {
      names: [
        'authenticated.application-process.project-evaluation',
        'authenticated.application-process.project-evaluation.instructions',
        'authenticated.application-process.project-evaluation.assignment',
        'authenticated.application-process.project-evaluation.submitted',
      ],
    },
  },
  {
    id: '3459358-3b2b-73ef-485c-834656a24056',
    name: 'ApplicationProcessStep_MeetAdvocate',
    title: 'Meet Your Advocate',
    order: 3,
    clazz: 'meet-advocate',
    description: `When you reach this point, you will be contacted by one of our Talent Advocates.
      They make sure you have all you need to start your remote job and will also answer
      all your questions and concerns.`,
    allowedFlowTypes: [
      {
        MOODLE_WE: 6,
        MOODLE_PE: 8,
      },
    ],
    state: {
      names: ['authenticated.application-process.meet-advocate'],
    },
  },
  {
    id: '2c4t3d8-3t24-7dc2-4r3c-33s6e6a2r05e',
    name: 'ApplicationProcessStep_Marketplace',
    title: 'Marketplace',
    order: 4,
    clazz: 'marketplace',
    description: `Be proud of yourself. Reaching the marketplace means that you are one of top 1% candidates
      that applied for the job. Once you get here, hiring managers will be able to schedule an interview
      and offer you the job.`,
    allowedFlowTypes: [
      {
        MOODLE_WE: 6,
        MOODLE_PE: 8,
      },
    ],
    state: {
      names: ['authenticated.application-process.marketplace'],
    },
  },
  {
    id: '',
    name: 'ApplicationProcessStep_ManagerInterviews',
    title: 'Manager Interviews',
    order: 5,
    clazz: 'manager-interviews',
    description: `The last step before you're hired is a video interview with
      your future manager. If there is a good fit, your remote job is
      just around the corner.`,
    allowedFlowTypes: [
      {
        MOODLE_WE: 6,
        MOODLE_PE: 8,
      },
    ],
    state: {
      names: ['authenticated.application-process.manager-interviews'],
    },
  },
];

export const CANDIDATE_MOCK: Candidate = {
  type: 'CANDIDATE',
  userAvatars: [],
  id: 580338,
  averageRatings: 0.0,
  workedHours: 0.0,
  billedHours: 0.0,
  industry: { id: 7, name: 'Internet' },
  languages: [
    CandidateLanguage.from({
      id: 1,
      language: Language.from({
        id: 1,
        name: 'Portuguese',
      }),
      proficiency: 3,
    }),
    CandidateLanguage.from({
      id: 2,
      language: Language.from({
        id: 2,
        name: 'Français',
      }),
      proficiency: 2,
    }),
    CandidateLanguage.from({
      id: 3,
      language: Language.from({
        id: 3,
        name: 'Español',
      }),
      proficiency: 2,
    }),
  ],
  certifications: [
    Certification.from({
      id: 1,
      startDateTime: '2017-01-01T00:00:00',
      endDateTime: '2017-01-01T00:00:00',
      name: 'Sample Certification 1',
    }),
    Certification.from({
      id: 2,
      startDateTime: '2017-01-01T00:00:00',
      endDateTime: '2017-01-01T00:00:00',
      name: 'Sample Certification 2',
    }),
    Certification.from({
      id: 3,
      startDateTime: '2017-01-01T00:00:00',
      endDateTime: '2017-01-01T00:00:00',
      name: 'Sample Certification 2',
    }),
  ],
  educations: [
    {
      id: 1,
      school: 'sdfsdf',
      startDate: '2018-01-01T02:00:00.000+0000',
      endDate: '2018-01-01T02:00:00.000+0000',
      startYear: '2018',
      endYear: '2018',
      degree: 'sdf',
      markedToDelete: false,
    },
    {
      id: 2,
      school: 'sdfsdf',
      startDate: '2018-01-01T02:00:00.000+0000',
      endDate: '2018-01-01T02:00:00.000+0000',
      startYear: '2019',
      endYear: '2019',
      degree: 'sdf',
      markedToDelete: false,
    },
    {
      id: 3,
      school: 'sdfsdf',
      startDate: '2018-01-01T02:00:00.000+0000',
      endDate: '2018-01-01T02:00:00.000+0000',
      startYear: '2019',
      endYear: '2019',
      degree: 'sdf',
      markedToDelete: false,
    },
  ],
  employments: [
    Employment.from({
    id: 1,
    city: 'Plano, TX',
    company: 'Crossover',
    country: { id: 10, name: 'United States', code: 'us', allowed: true, zipFormat: '\d{5}([ \-]\d{4})?' },
    current: true,
    description: 'MASKED',
    startDate: '2001-01-01',
    endDate: '',
    role: 'Lead',
    title: 'Chief Architect',
    }),
    Employment.from({
      id: 2,
      city: 'Plano, TX',
      company: 'Aurea',
    }),
    Employment.from({
      id: 3,
      city: 'Plano, TX',
      company: 'Ignite',
      startDate: '2001-01-01',
      endDate: '2099-01-01',
    }),
  ],
  connections: [],
  skills: [
    { id: 1, skill: { id: 43, name: 'Java' }, proficiency: 0, markedToDelete: false },
    { id: 2, skill: { id: 90, name: '.NET' }, proficiency: 0, markedToDelete: false },
    { id: 3, skill: { id: 180, name: 'Angular' }, proficiency: 0, markedToDelete: false },
  ],
  skypeId: 'alan.jhonnes',
  agreementAccepted: true,
  availability: 'IN_LESS_THAN_2_WEEKS',
  intercomId: '598359fdf336a3316379ecca',
  userSecurity: {
    securityQuestion: 'Your favorite sports team',
    linkedInLogin: false,
    enabled: false,
    accountNonExpired: true,
    accountNonLocked: true,
    credentialsNonExpired: true,
    rawSecurityAnswer: '',
  },
  candidate: true,
  personal: false,
  printableName: 'Alan Jhonnes',
  email: 'alanjhonnes@gmail.com',
  location: {
    country: {
      id: 30,
      name: 'Brazil',
      code: 'br',
      allowed: true,
      zipFormat: '\\d{5}[\\-]?\\d{3}',
    },
    timeZone: {
      id: 548,
      name: 'America/Sao_Paulo',
      offset: -7200000,
      standardOffset: -7200000,
      hourlyOffset: '-02:00',
    },
    city: 'São Paulo',
  },
  manager: false,
  companyAdmin: false,
  photoUrl:
    'https://crossover-uploads-production.s3.amazonaws.com/images/af88c5018542ff9762b511e774b82b46.jpeg',
  busySlots: [],
  headline: 'Chief Angular Architect at Devfactory',
  summary: '',
  userId: 580778,
  firstName: 'Alan',
  lastName: 'Jhonnes',
  avatarTypes: ['CANDIDATE', 'PERSONAL'],
  appFeatures: [],
};
