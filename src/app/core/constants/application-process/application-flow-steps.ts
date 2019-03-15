import { ApplicationFlowStep } from 'app/core/models/application';

export const APPLICATION_FLOW_STEPS: ApplicationFlowStep[] = [
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
        MOODLE: 5,
        MOODLE_WE: 6,
        WE: 7,
        MOODLE_PE: 8,
      },
    ],
    state: {
      names: ['create-basic-profile'],
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
        MOODLE: 5,
        MOODLE_WE: 6,
        MOODLE_PE: 8,
      },
    ],
    state: {
      names: ['technical-screen'],
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
        WE: 7,
      },
    ],
    state: {
      names: [
        'written-evaluation-welcome',
        'written-evaluation-assignment',
        'written-evaluation-submitted',
        'written-evaluation-submitted',
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
        'project-evaluation-welcome',
        'project-evaluation-instructions',
        'project-evaluation-assignment',
        'project-evaluation-submitted',
      ],
    },
  },
  {
    id: '3459358-3b2b-73ef-485c-834656a24056',
    name: 'ApplicationProcessStep_MeetAdvocate',
    title: 'Meet Your Advocate',
    order: 3,
    clazz: 'meet-your-advocate',
    description: `When you reach this point, you will be contacted by one of our Talent Advocates.
      They make sure you have all you need to start your remote job and will also answer
      all your questions and concerns.`,
    allowedFlowTypes: [
      {
        MOODLE: 5,
        MOODLE_WE: 6,
        WE: 7,
        MOODLE_PE: 8,
      },
    ],
    state: {
      names: ['meet-your-advocate'],
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
        MOODLE: 5,
        MOODLE_WE: 6,
        WE: 7,
        MOODLE_PE: 8,
      },
    ],
    state: {
      names: ['marketplace'],
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
        MOODLE: 5,
        MOODLE_WE: 6,
        WE: 7,
        MOODLE_PE: 8,
      },
    ],
    state: {
      names: ['manager-interviews'],
    },
  },
];
