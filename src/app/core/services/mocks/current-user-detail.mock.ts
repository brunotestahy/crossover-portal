import { Assignment } from 'app/core/models/assignment';
import { CurrentUserDetail } from 'app/core/models/identity';
import { Manager } from 'app/core/models/manager';

export const CURRENT_USER_DETAIL_MOCK: CurrentUserDetail = {
  headline: 'Chief Angular Architect at Devfactory',
  summary: '',
  id: 580778,
  email: 'alanjhonnes@gmail.com',
  firstName: 'Alan',
  lastName: 'Jhonnes',
  fullName: 'Alan Jhonnes',
  photoUrl:
    'https://crossover-uploads-production.s3.amazonaws.com/images/af88c5018542ff9762b511e774b82b46.jpeg',
  appFeatures: [],
  applications: Object.assign({
    'CANDIDATE': [{
      'name': 'Check-in Chats',
      'identifier': 'CHECKIN_CHATS',
      'enabled': true,
      'appUserType': 'BOTH',
      'links': [],
    }, {
      'name': 'Community',
      'identifier': 'COMMUNITY',
      'enabled': true,
      'appUserType': 'BOTH',
      'links': [],
    }, {
      'name': 'Learn',
      'identifier': 'LEARN',
      'enabled': true,
      'appUserType': 'BOTH',
      'links': [],
    }, {
      'name': 'My Dashboard',
      'identifier': 'MY_DASHBOARD',
      'enabled': true,
      'appUserType': 'BOTH',
      'links': [],
    }, {
      'name': 'Rank & Review',
      'identifier': 'RANK_AND_REVIEW',
      'enabled': true,
      'appUserType': 'BOTH',
      'links': [],
    }, {
      'name': 'Timezones',
      'identifier': 'TIMEZONES',
      'enabled': true,
      'appUserType': 'BOTH',
      'links': [],
    }, {
      'name': 'World',
      'identifier': 'WORLD',
      'enabled': true,
      'appUserType': 'BOTH',
      'links': [],
    }, { 'name': 'Work Smart', 'identifier': 'WORK_SMART', 'enabled': true, 'appUserType': 'INDIVIDUAL', 'links': [] }],
    'MANAGER': [{
      'name': 'Activities',
      'identifier': 'ACTIVITIES',
      'enabled': true,
      'appUserType': 'TEAM',
      'links': [],
    }, {
      'name': 'Check-in Chats',
      'identifier': 'CHECKIN_CHATS',
      'enabled': true,
      'appUserType': 'BOTH',
      'links': [],
    }, {
      'name': 'Community',
      'identifier': 'COMMUNITY',
      'enabled': true,
      'appUserType': 'BOTH',
      'links': [],
    }, {
      'name': 'Gemba Walk',
      'identifier': 'GEMBA_WALK',
      'enabled': true,
      'appUserType': 'TEAM',
      'links': [],
    }, {
      'name': 'Goals',
      'identifier': 'GOALS',
      'enabled': true,
      'appUserType': 'TEAM',
      'links': [],
    }, { 'name': 'Hire', 'identifier': 'HIRE', 'enabled': true, 'appUserType': 'TEAM', 'links': [] }, {
      'name': 'Learn',
      'identifier': 'LEARN',
      'enabled': true,
      'appUserType': 'BOTH',
      'links': [],
    }, {
      'name': 'Metrics',
      'identifier': 'METRICS',
      'enabled': true,
      'appUserType': 'TEAM',
      'links': [],
    }, {
      'name': 'My Dashboard',
      'identifier': 'MY_DASHBOARD',
      'enabled': true,
      'appUserType': 'BOTH',
      'links': [],
    }, {
      'name': 'Organization',
      'identifier': 'ORGANIZATION',
      'enabled': true,
      'appUserType': 'TEAM',
      'links': [],
    }, {
      'name': 'Rank & Review',
      'identifier': 'RANK_AND_REVIEW',
      'enabled': true,
      'appUserType': 'BOTH',
      'links': [],
    }, {
      'name': 'Team Summary',
      'identifier': 'TEAM_SUMMARY',
      'enabled': true,
      'appUserType': 'TEAM',
      'links': [],
    }, {
      'name': 'Team Settings',
      'identifier': 'TEAM_SETTINGS',
      'enabled': true,
      'appUserType': 'TEAM',
      'links': [],
    }, {
      'name': 'Team History',
      'identifier': 'TEAM_HISTORY',
      'enabled': true,
      'appUserType': 'TEAM',
      'links': [],
    }, {
      'name': 'Polls',
      'identifier': 'TEAM_POLLS',
      'enabled': true,
      'appUserType': 'TEAM',
      'links': [],
    }, {
      'name': 'Timesheet',
      'identifier': 'TIMESHEET',
      'enabled': true,
      'appUserType': 'TEAM',
      'links': [],
    }, {
      'name': 'Timezones',
      'identifier': 'TIMEZONES',
      'enabled': true,
      'appUserType': 'BOTH',
      'links': [],
    }, {
      'name': 'Workflows',
      'identifier': 'WORKFLOWS',
      'enabled': true,
      'appUserType': 'TEAM',
      'links': [],
    }, {
      'name': 'World',
      'identifier': 'WORLD',
      'enabled': true,
      'appUserType': 'BOTH',
      'links': [],
    }, {
      'name': 'Accounts App',
      'identifier': 'ACCOUNTS',
      'enabled': true,
      'appUserType': 'TEAM',
      'links': [],
    }, {
      'name': 'Manual Time Approval',
      'identifier': 'MANUAL_TIME_APPROVAL',
      'enabled': true,
      'appUserType': 'TEAM',
      'links': [],
    }],
  }),
  assignment: Object.assign({}) as Assignment,
  communicationStatus: '',
  avatarTypes: ['CANDIDATE', 'PERSONAL'],
  managerAvatar: Object.assign({}) as Manager,
  userAvatars: [
    { id: 580338, type: 'CANDIDATE' },
    { id: 702899, type: 'PERSONAL' },
  ],
  userSecurity: {
    securityQuestion: 'The name of your elementary school',
    linkedInLogin: false,
    enabled: false,
    credentialsNonExpired: true,
    accountNonLocked: true,
    accountNonExpired: true,
  },
  location: {
    address: '',
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
    state: '',
    city: 'São Paulo',
    phone: '946043674',
  },
  infoShared: true,
};

export const CURRENT_USER_DETAIL_SIMPLE_MOCK: CurrentUserDetail = <CurrentUserDetail>{
  assignment: {
    team: {
      id: 1,
    },
    manager: {
      id: 1,
    },
  },
  location: {
    address: '',
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
      offset: 10800000,
      standardOffset: 10800000,
      hourlyOffset: '+03:00',
    },
    state: '',
    city: 'São Paulo',
    phone: '946043674',
  },
};

export const CURRENT_USER_DETAIL_MANAGER_MOCK: CurrentUserDetail = <CurrentUserDetail>{
  assignment: {
    team: {
      id: 1,
      name: 'test',
    },
    manager: {
      id: 1,
    },
  },
  location: {
    address: '',
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
      offset: 10800000,
      standardOffset: 10800000,
      hourlyOffset: '+03:00',
    },
    state: '',
    city: 'São Paulo',
    phone: '946043674',
  },
  managerAvatar: {
    id: 1,
  },
};
