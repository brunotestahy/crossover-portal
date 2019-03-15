import { Assignment } from 'app/core/models/assignment/assignment.model';

export const ASSIGNMENT_SIMPLE_MOCK = <Assignment>{
  id: 1,
  currentAssignmentHistory: {
    team: {
      id: 1,
    },
  },
  manager: {
    id: 1,
  },
  selection: {
    marketplaceMember: {
      application: {
        candidate: {
          id: 1,
        },
      },
    },
  },
};

export const ASSIGNMENT_MOCK = {
  'applications': {
    'ADMIN': [
      {
        'name': 'Team Scoring',
        'identifier': 'TEAM_SCORING',
        'enabled': false,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Activities',
        'identifier': 'ACTIVITIES',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'App Store',
        'identifier': 'APP_STORE',
        'enabled': false,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Check-in Chats',
        'identifier': 'CHECKIN_CHATS',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Community',
        'identifier': 'COMMUNITY',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Gemba Walk',
        'identifier': 'GEMBA_WALK',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Goals',
        'identifier': 'GOALS',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Hire',
        'identifier': 'HIRE',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Learn',
        'identifier': 'LEARN',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Metrics',
        'identifier': 'METRICS',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'My Dashboard',
        'identifier': 'MY_DASHBOARD',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Organization',
        'identifier': 'ORGANIZATION',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Rank & Review',
        'identifier': 'RANK_AND_REVIEW',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Reports',
        'identifier': 'REPORTS',
        'enabled': false,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Team Summary',
        'identifier': 'TEAM_SUMMARY',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Team Settings',
        'identifier': 'TEAM_SETTINGS',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Team History',
        'identifier': 'TEAM_HISTORY',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Polls',
        'identifier': 'TEAM_POLLS',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Timesheet',
        'identifier': 'TIMESHEET',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Timezones',
        'identifier': 'TIMEZONES',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Workflows',
        'identifier': 'WORKFLOWS',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'World',
        'identifier': 'WORLD',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Accounts App',
        'identifier': 'ACCOUNTS',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Work Smart',
        'identifier': 'WORK_SMART',
        'enabled': true,
        'appUserType': 'INDIVIDUAL',
        'links': [

        ],
      },
      {
        'name': 'Manual Time Approval',
        'identifier': 'MANUAL_TIME_APPROVAL',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
    ],
    'CANDIDATE': [
      {
        'name': 'Check-in Chats',
        'identifier': 'CHECKIN_CHATS',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Community',
        'identifier': 'COMMUNITY',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Learn',
        'identifier': 'LEARN',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'My Dashboard',
        'identifier': 'MY_DASHBOARD',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Rank & Review',
        'identifier': 'RANK_AND_REVIEW',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Reports',
        'identifier': 'REPORTS',
        'enabled': false,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Timezones',
        'identifier': 'TIMEZONES',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'World',
        'identifier': 'WORLD',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Work Smart',
        'identifier': 'WORK_SMART',
        'enabled': true,
        'appUserType': 'INDIVIDUAL',
        'links': [

        ],
      },
    ],
    'MANAGER': [
      {
        'name': 'Team Scoring',
        'identifier': 'TEAM_SCORING',
        'enabled': false,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Activities',
        'identifier': 'ACTIVITIES',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Check-in Chats',
        'identifier': 'CHECKIN_CHATS',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Community',
        'identifier': 'COMMUNITY',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Gemba Walk',
        'identifier': 'GEMBA_WALK',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Goals',
        'identifier': 'GOALS',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Hire',
        'identifier': 'HIRE',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Learn',
        'identifier': 'LEARN',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Metrics',
        'identifier': 'METRICS',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'My Dashboard',
        'identifier': 'MY_DASHBOARD',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Organization',
        'identifier': 'ORGANIZATION',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Rank & Review',
        'identifier': 'RANK_AND_REVIEW',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Reports',
        'identifier': 'REPORTS',
        'enabled': false,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Team Summary',
        'identifier': 'TEAM_SUMMARY',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Team Settings',
        'identifier': 'TEAM_SETTINGS',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Team History',
        'identifier': 'TEAM_HISTORY',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Polls',
        'identifier': 'TEAM_POLLS',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Timesheet',
        'identifier': 'TIMESHEET',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'Timezones',
        'identifier': 'TIMEZONES',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Workflows',
        'identifier': 'WORKFLOWS',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
      {
        'name': 'World',
        'identifier': 'WORLD',
        'enabled': true,
        'appUserType': 'BOTH',
        'links': [

        ],
      },
      {
        'name': 'Manual Time Approval',
        'identifier': 'MANUAL_TIME_APPROVAL',
        'enabled': true,
        'appUserType': 'TEAM',
        'links': [

        ],
      },
    ],
  },
  'assignment': {
    'id': 14944,
    'jobTitle': 'Java Chief Software Architect',
    'salaryUnit': 'HOUR',
    'weeklyMeetingMinutesLimit': 180,
    'team': {
      'id': 2343,
      'name': 'XO.TPM',
      'company': {
        'id': 12,
        'name': 'Crossover',
      },
      'teamOwner': {
        'printableName': 'Alexandru Cojocaru',
        'userId': 150920,
        'id': 1346734,
        'type': 'MANAGER',
      },
    },
    'selection': {
      'marketplaceMember': {
        'application': {
          'candidate': {
            'id': 453690,
            'userId': 454466,
            'email': 'costel.radulescu@crossover.com',
            'firstName': 'Costel',
            'lastName': 'Radulescu',
            'printableName': 'Costel Radulescu',
            'photoUrl': 'https://crossover-uploads-production.s3.amazonaws.com/images/22fdfaaaa5a10889920488dae28b5d2e.jpg',
            'location': {
              'country': 'Netherlands',
              'city': 'Amsterdam',
              'timeZone': {
                'id': 284,
                'name': 'Europe/Amsterdam',
                'offset': 3600000,
                'hourlyOffset': '+01: 00',
              },
            },
            'avatarTypes': [
              'CANDIDATE',
              'MANAGER',
              'COMPANY_ADMIN',
              'ADMIN',
              'RECRUITER',
              'ACCOUNT_MANAGER',
              'RECRUITMENT_ANALYST',
              'ENFORCER',
              'PERSONAL',
            ],
            'userAvatars': [
              {
                'id': 958789,
                'type': 'PERSONAL',
              },
              {
                'id': 647896,
                'type': 'ENFORCER',
              },
              {
                'id': 549951,
                'type': 'ADMIN',
              },
              {
                'id': 1336616,
                'type': 'RECRUITER',
              },
              {
                'id': 1382620,
                'type': 'RECRUITMENT_ANALYST',
              },
              {
                'id': 453690,
                'type': 'CANDIDATE',
              },
              {
                'id': 1336617,
                'type': 'ACCOUNT_MANAGER',
              },
              {
                'id': 1382619,
                'type': 'COMPANY_ADMIN',
              },
              {
                'id': 1382619,
                'type': 'MANAGER',
              },
            ],
            'feedbackRequired': false,
          },
        },
      },
    },
    'manager': {
      'id': 1415104,
      'userId': 662295,
      'email': 'ashishkprasad@gmail.com',
      'firstName': 'Ash',
      'lastName': 'Prasad',
      'printableName': 'Ash Prasad',
      'photoUrl': 'https://crossover-uploads-production.s3.amazonaws.com/images/06abc28fdd88b53a64d09d7abbd48fea.jpg',
      'location': {
        'country': 'Canada',
        'city': 'Vancouver',
        'timeZone': {
          'id': 587,
          'name': 'America/Vancouver',
          'offset': -25200000,
          'hourlyOffset': '-07: 00',
        },
      },
      'avatarTypes': [
        'CANDIDATE',
        'MANAGER',
        'PERSONAL',
      ],
      'userAvatars': [
        {
          'id': 1415104,
          'type': 'MANAGER',
        },
        {
          'id': 662037,
          'type': 'CANDIDATE',
        },
        {
          'id': 714645,
          'type': 'PERSONAL',
        },
      ],
      'company': {
        'id': 12,
        'name': 'Crossover',
      },
      'feedbackRequired': false,
    },
    'status': 'ACTIVE',
    'assignmentAvatar': {
      'id': 3,
      'avatarUrl': 'avatar3',
    },
  },
  'managerAvatar': {
    'id': 1382619,
    'userId': 454466,
    'email': 'costel.radulescu@crossover.com',
    'firstName': 'Costel',
    'lastName': 'Radulescu',
    'printableName': 'Costel Radulescu',
    'photoUrl': 'https://crossover-uploads-production.s3.amazonaws.com/images/22fdfaaaa5a10889920488dae28b5d2e.jpg',
    'location': {
      'country': 'Netherlands',
      'city': 'Amsterdam',
      'timeZone': {
        'id': 284,
        'name': 'Europe/Amsterdam',
        'offset': 3600000,
        'hourlyOffset': '+01: 00',
      },
    },
    'avatarTypes': [
      'CANDIDATE',
      'MANAGER',
      'COMPANY_ADMIN',
      'ADMIN',
      'RECRUITER',
      'ACCOUNT_MANAGER',
      'RECRUITMENT_ANALYST',
      'ENFORCER',
      'PERSONAL',
    ],
    'userAvatars': [
      {
        'id': 958789,
        'type': 'PERSONAL',
      },
      {
        'id': 647896,
        'type': 'ENFORCER',
      },
      {
        'id': 549951,
        'type': 'ADMIN',
      },
      {
        'id': 1336616,
        'type': 'RECRUITER',
      },
      {
        'id': 1382620,
        'type': 'RECRUITMENT_ANALYST',
      },
      {
        'id': 453690,
        'type': 'CANDIDATE',
      },
      {
        'id': 1336617,
        'type': 'ACCOUNT_MANAGER',
      },
      {
        'id': 1382619,
        'type': 'COMPANY_ADMIN',
      },
      {
        'id': 1382619,
        'type': 'MANAGER',
      },
    ],
    'company': {
      'id': 12,
      'name': 'Crossover',
    },
    'feedbackRequired': false,
  },
  'headline': 'Java Chief Architect at Crossover',
  'summary': '',
  'id': 454466,
  'email': 'costel.radulescu@crossover.com',
  'firstName': 'Costel',
  'lastName': 'Radulescu',
  'fullName': 'Costel Radulescu',
  'photoUrl': 'https://crossover-uploads-production.s3.amazonaws.com/images/22fdfaaaa5a10889920488dae28b5d2e.jpg',
  'appFeatures': [

  ],
  'userAvatars': [
    {
      'id': 958789,
      'type': 'PERSONAL',
    },
    {
      'id': 647896,
      'type': 'ENFORCER',
    },
    {
      'id': 549951,
      'type': 'ADMIN',
    },
    {
      'id': 1336616,
      'type': 'RECRUITER',
    },
    {
      'id': 1382620,
      'type': 'RECRUITMENT_ANALYST',
    },
    {
      'id': 453690,
      'type': 'CANDIDATE',
    },
    {
      'id': 1336617,
      'type': 'ACCOUNT_MANAGER',
    },
    {
      'id': 1382619,
      'type': 'COMPANY_ADMIN',
    },
    {
      'id': 1382619,
      'type': 'MANAGER',
    },
  ],
  'avatarTypes': [
    'CANDIDATE',
    'MANAGER',
    'COMPANY_ADMIN',
    'ADMIN',
    'RECRUITER',
    'ACCOUNT_MANAGER',
    'RECRUITMENT_ANALYST',
    'ENFORCER',
    'PERSONAL',
  ],
  'location': {
    'country': 'Netherlands',
    'city': 'Amsterdam',
    'timeZone': {
      'id': 284,
      'name': 'Europe/Amsterdam',
      'offset': 3600000,
      'hourlyOffset': '+01: 00',
    },
  },
  'infoShared': true,
  'communicationStatus': 'NOT_SET',
  'userSecurity': {
    'securityQuestion': 'Your favorite sports team',
    'linkedInLogin': false,
    'enabled': true,
    'signupMethod': 'STANDARD',
    'accountNonExpired': true,
    'accountNonLocked': true,
    'credentialsNonExpired': true,
  },
};

export const ASSIGNMENT_SUMMARY = {
  'name': 'Alan Jhonnes',
  'managerName': 'Erini Lytrides Michael',
  'assignmentId': 17406,
  'stats': [
    {
      'id': 529720,
      'startDate': '2018-04-09',
      'ticketsResolved': 1.00,
      'hoursWorked': 0,
      'weekSalary': 0,
      'activeWeek': true,
    },
    {
      'id': 533705,
      'startDate': '2018-04-16',
      'ticketsResolved': 2.00,
      'hoursWorked': 0,
      'weekSalary': 0,
      'activeWeek': true,
    },
    {
      'id': 547551,
      'startDate': '2018-04-23',
      'ticketsResolved': 3.00,
      'hoursWorked': 0,
      'weekSalary': 0,
      'activeWeek': true,
    },
    {
      'id': 551083,
      'startDate': '2018-04-30',
      'ticketsResolved': 0.00,
      'hoursWorked': 0,
      'weekSalary': 0,
      'activeWeek': true,
    },
    {
      'id': 529720,
      'startDate': '2018-04-09',
      'ticketsResolved': 4.00,
      'hoursWorked': 0,
      'weekSalary': 0,
      'activeWeek': true,
    },
    {
      'id': 533705,
      'startDate': '2018-04-16',
      'ticketsResolved': 1.00,
      'hoursWorked': 0,
      'weekSalary': 0,
      'activeWeek': true,
    },
    {
      'id': 547551,
      'startDate': '2018-04-23',
      'ticketsResolved': 4.00,
      'hoursWorked': 0,
      'weekSalary': 0,
      'activeWeek': true,
    },
    {
      'id': 551083,
      'startDate': '2018-04-30',
      'ticketsResolved': 0.00,
      'hoursWorked': 0,
      'weekSalary': 0,
      'activeWeek': true,
    },
    {
      'id': 529720,
      'startDate': '2018-04-09',
      'ticketsResolved': 1.00,
      'hoursWorked': 0,
      'weekSalary': 0,
      'activeWeek': true,
    },
    {
      'id': 533705,
      'startDate': '2018-04-16',
      'ticketsResolved': 1.00,
      'hoursWorked': 0,
      'weekSalary': 0,
      'activeWeek': true,
    },
    {
      'id': 547551,
      'startDate': '2018-04-23',
      'ticketsResolved': 4.00,
      'hoursWorked': 0,
      'weekSalary': 0,
      'activeWeek': true,
    },
    {
      'id': 551083,
      'startDate': '2018-04-30',
      'ticketsResolved': 0.00,
      'hoursWorked': 0,
      'weekSalary': 0,
      'activeWeek': true,
    },
    {
      'id': 553800,
      'startDate': '2018-05-07',
      'ticketsResolved': 0.00,
      'hoursWorked': 0,
      'weekSalary': 0,
      'activeWeek': true,
    },
  ],
  'metricAvg': {
    'hasMetricsSetup': true,
    'weeksMetric': [
      {
        'weekIndex': 0,
        'average': 0.00,
        'total': 0.00,
      },
      {
        'weekIndex': 1,
        'average': 0.00,
        'total': 0.00,
      },
      {
        'weekIndex': 2,
        'average': 3.33,
        'total': 10.00,
      },
      {
        'weekIndex': 3,
        'average': 3.67,
        'total': 11.00,
      },
      {
        'weekIndex': 0,
        'average': 0.00,
        'total': 0.00,
      },
      {
        'weekIndex': 1,
        'average': 0.00,
        'total': 0.00,
      },
      {
        'weekIndex': 2,
        'average': 3.33,
        'total': 10.00,
      },
      {
        'weekIndex': 3,
        'average': 3.67,
        'total': 11.00,
      },
      {
        'weekIndex': 0,
        'average': 0.00,
        'total': 0.00,
      },
      {
        'weekIndex': 1,
        'average': 0.00,
        'total': 0.00,
      },
      {
        'weekIndex': 2,
        'average': 3.33,
        'total': 10.00,
      },
      {
        'weekIndex': 3,
        'average': 3.67,
        'total': 11.00,
      },
      {
        'weekIndex': 4,
        'average': 5.00,
        'total': 15.00,
      },
    ],
    'metricTarget': 10.00,
    'metricName': 'Number of Screens Approved by Customer',
  },
  'teamId': 1889,
};

export const ASSIGNMENT_HISTORIES = [
  {
    'id': 28432,
    'effectiveDateBegin': '2017-08-21',
    'team': {
      'id': 1889,
      'name': 'DF.Rebuild Reskin',
      'metricSetups': [
        {
          'name': 'Screens Approved by Customer',
        },
      ],
    },
    'manager': {
      'id': 535393,
      'name': 'Erini Lytrides Michael',
      'company': {
        'id': 13,
        'name': 'Devfactory',
        'website': 'http://www.devfactory.com',
        'createdOn': '2015-02-22T12:19:09Z',
        'updatedOn': '2018-05-08T01:55:30Z',
      },
    },
  },
];

export const TEAM_ASSIGNMENT_MOCK = [
  {
  'id': 21760,
  'createdOn': '2018-01-19T22:30:25.000+0000',
  'jobTitle': 'Java Chief Software Architect',
  'status': 'ACTIVE',
  'startDate': '2018-01-19T22:30:25.000+0000',
  'effectiveDateBegin': '2018-03-26T00:00:00.000+0000',
  'lengthInDays': 30,
  'disabledFeatures': [],
  'featureValues': {
    'screenshotFrequency': 1,
    'webcamshotFrequency': 1,
  },
  'team': {
    'id': 1995,
    'name': 'Eng.Easier',
    'company': {
      'id': 11,
      'name': 'Aurea',
    },
    'teamOwner': {
      'printableName': 'Gastón Real',
      'userId': 30631,
      'id': 269499,
      'company': {
        'id': 11,
        'name': 'Aurea',
      },
      'type': 'MANAGER',
    },
  },
  'candidate': {
    'id': 669180,
    'userId': 669424,
    'email': 'uionutz@yahoo.com',
    'firstName': 'Ionut',
    'lastName': 'Ungureanu',
    'printableName': 'Ionut Ungureanu',
    'photoUrl': 'https://crossover-uploads-production.s3.amazonaws.com/images/baa60dddfbd9f80c15fbfa3f08b884fa.jpeg',
    'location': {
      'country': 'Romania',
      'timeZone': {
        'id': 144,
        'name': 'Europe/Bucharest',
        'offset': 10800000,
        'hourlyOffset': '+03:00',
      },
    },
    'avatarTypes': ['CANDIDATE', 'PERSONAL'],
    'userAvatars': [{
      'id': 669180,
      'type': 'CANDIDATE',
    }, {
      'id': 1038659,
      'type': 'PERSONAL',
    }],
    'feedbackRequired': false,
    'skypeId': 'un_ionutz',
  },
  'manager': {
    'id': 269499,
    'userId': 30631,
    'email': 'gastonreal@hotmail.com',
    'firstName': 'Gastón',
    'lastName': 'Real',
    'printableName': 'Gastón Real',
    'photoUrl': 'https://crossover-uploads-production.s3.amazonaws.com/images/fe50b865-dff1-461d-9baf-0a47c82d726f.jpg',
    'location': {
      'country': 'Argentina',
      'city': 'Buenos Aires',
      'timeZone': {
        'id': 323,
        'name': 'America/Argentina/Buenos_Aires',
        'offset': -10800000,
        'hourlyOffset': '-03:00',
      },
    },
    'avatarTypes': ['CANDIDATE', 'MANAGER', 'PERSONAL'],
    'userAvatars': [{
      'id': 672702,
      'type': 'PERSONAL',
    }, {
      'id': 30631,
      'type': 'CANDIDATE',
    }, {
      'id': 269499,
      'type': 'MANAGER',
    }],
    'company': {
      'id': 11,
      'name': 'Aurea',
    },
    'feedbackRequired': false,
  },
  'salary': 50.00,
  'weeklyLimit': 40,
  'salaryUnit': 'HOUR',
  'weeklyMeetingMinutesLimit': 180,
  'assignmentHistories': [{
    'id': 39393,
    'effectiveDateBegin': '2018-02-26T00:19:39.000+0000',
    'effectiveDateEnd': '2018-03-12T00:00:00.000+0000',
    'team': {
      'id': 1994,
      'name': 'Eng.Easier.Remove',
      'company': {
        'id': 11,
        'name': 'Aurea',
      },
      'teamOwner': {
        'printableName': 'Gastón Real',
        'userId': 30631,
        'id': 269499,
        'company': {
          'id': 11,
          'name': 'Aurea',
        },
        'type': 'MANAGER',
      },
    },
    'manager': {
      'id': 505841,
      'userId': 14260,
      'email': 'ievgen.lukasevych@gmail.com',
      'firstName': 'Ievgen',
      'lastName': 'Lukasevych',
      'printableName': 'Ievgen Lukasevych',
      'photoUrl': 'https://crossover-uploads-production.s3.amazonaws.com/images/7191d4822ff97090d55e905527c76aa9.jpg',
      'location': {
        'country': 'Ukraine',
        'timeZone': {
          'id': 213,
          'name': 'Europe/Kiev',
          'offset': 10800000,
          'hourlyOffset': '+03:00',
        },
      },
      'avatarTypes': ['CANDIDATE', 'MANAGER', 'ACCOUNT_MANAGER', 'RECRUITMENT_ANALYST', 'PERSONAL'],
      'userAvatars': [{
        'id': 14260,
        'type': 'CANDIDATE',
      }, {
        'id': 1392014,
        'type': 'RECRUITMENT_ANALYST',
      }, {
        'id': 505841,
        'type': 'MANAGER',
      }, {
        'id': 1089053,
        'type': 'PERSONAL',
      }, {
        'id': 513310,
        'type': 'ACCOUNT_MANAGER',
      }],
      'company': {
        'id': 17,
        'name': 'Trilogy',
      },
      'feedbackRequired': false,
    },
    'status': 'ACTIVE',
  }, {
    'id': 43177,
    'effectiveDateBegin': '2018-03-12T00:00:00.000+0000',
    'effectiveDateEnd': '2018-03-26T00:00:00.000+0000',
    'team': {
      'id': 1995,
      'name': 'Eng.Easier',
      'company': {
        'id': 11,
        'name': 'Aurea',
      },
      'teamOwner': {
        'printableName': 'Gastón Real',
        'userId': 30631,
        'id': 269499,
        'company': {
          'id': 11,
          'name': 'Aurea',
        },
        'type': 'MANAGER',
      },
    },
    'manager': {
      'id': 505841,
      'userId': 14260,
      'email': 'ievgen.lukasevych@gmail.com',
      'firstName': 'Ievgen',
      'lastName': 'Lukasevych',
      'printableName': 'Ievgen Lukasevych',
      'photoUrl': 'https://crossover-uploads-production.s3.amazonaws.com/images/7191d4822ff97090d55e905527c76aa9.jpg',
      'location': {
        'country': 'Ukraine',
        'timeZone': {
          'id': 213,
          'name': 'Europe/Kiev',
          'offset': 10800000,
          'hourlyOffset': '+03:00',
        },
      },
      'avatarTypes': ['CANDIDATE', 'MANAGER', 'ACCOUNT_MANAGER', 'RECRUITMENT_ANALYST', 'PERSONAL'],
      'userAvatars': [{
        'id': 14260,
        'type': 'CANDIDATE',
      }, {
        'id': 1392014,
        'type': 'RECRUITMENT_ANALYST',
      }, {
        'id': 505841,
        'type': 'MANAGER',
      }, {
        'id': 1089053,
        'type': 'PERSONAL',
      }, {
        'id': 513310,
        'type': 'ACCOUNT_MANAGER',
      }],
      'company': {
        'id': 17,
        'name': 'Trilogy',
      },
      'feedbackRequired': false,
    },
    'status': 'ACTIVE',
  }, {
    'id': 45048,
    'effectiveDateBegin': '2018-03-26T00:00:00.000+0000',
    'team': {
      'id': 1995,
      'name': 'Eng.Easier',
      'company': {
        'id': 11,
        'name': 'Aurea',
      },
      'teamOwner': {
        'printableName': 'Gastón Real',
        'userId': 30631,
        'id': 269499,
        'company': {
          'id': 11,
          'name': 'Aurea',
        },
        'type': 'MANAGER',
      },
    },
    'manager': {
      'id': 269499,
      'userId': 30631,
      'email': 'gastonreal@hotmail.com',
      'firstName': 'Gastón',
      'lastName': 'Real',
      'printableName': 'Gastón Real',
      'photoUrl': 'https://crossover-uploads-production.s3.amazonaws.com/images/fe50b865-dff1-461d-9baf-0a47c82d726f.jpg',
      'location': {
        'country': 'Argentina',
        'city': 'Buenos Aires',
        'timeZone': {
          'id': 323,
          'name': 'America/Argentina/Buenos_Aires',
          'offset': -10800000,
          'hourlyOffset': '-03:00',
        },
      },
      'avatarTypes': ['CANDIDATE', 'MANAGER', 'PERSONAL'],
      'userAvatars': [{
        'id': 672702,
        'type': 'PERSONAL',
      }, {
        'id': 30631,
        'type': 'CANDIDATE',
      }, {
        'id': 269499,
        'type': 'MANAGER',
      }],
      'company': {
        'id': 11,
        'name': 'Aurea',
      },
      'feedbackRequired': false,
    },
    'status': 'ACTIVE',
  }],
  },
  {
  'id': 28727,
  'createdOn': '2018-03-27T18:41:05.000+0000',
  'jobTitle': 'Front End Angular Chief Software Architect',
  'status': 'ACTIVE',
  'startDate': '2018-03-27T18:41:05.000+0000',
  'effectiveDateBegin': '2018-04-25T20:58:42.000+0000',
  'lengthInDays': 30,
  'disabledFeatures': [],
  'featureValues': {
    'screenshotFrequency': 1,
    'webcamshotFrequency': 1,
  },
  'team': {
    'id': 1995,
    'name': 'Eng.Easier',
    'company': {
      'id': 11,
      'name': 'Aurea',
    },
    'teamOwner': {
      'printableName': 'Gastón Real',
      'userId': 30631,
      'id': 269499,
      'company': {
        'id': 11,
        'name': 'Aurea',
      },
      'type': 'MANAGER',
    },
  },
  'candidate': {
    'id': 1421727,
    'userId': 765508,
    'email': 'juhasz.thomas.jozsef@gmail.com',
    'firstName': 'Thomas',
    'lastName': 'Juhász',
    'printableName': 'Thomas Juhász',
    'photoUrl': 'https://crossover-uploads-production.s3.amazonaws.com/images/0a418b17a99a137c41f435f19cf5d287.jpg',
    'location': {
      'country': 'Hungary',
      'timeZone': {
        'id': 19,
        'name': 'Europe/Budapest',
        'offset': 7200000,
        'hourlyOffset': '+02:00',
      },
    },
    'avatarTypes': ['CANDIDATE', 'PERSONAL'],
    'userAvatars': [{
      'id': 1421727,
      'type': 'CANDIDATE',
    }],
    'feedbackRequired': false,
    'skypeId': 'juhaszthomasjozsef',
  },
  'manager': {
    'id': 269499,
    'userId': 30631,
    'email': 'gastonreal@hotmail.com',
    'firstName': 'Gastón',
    'lastName': 'Real',
    'printableName': 'Gastón Real',
    'photoUrl': 'https://crossover-uploads-production.s3.amazonaws.com/images/fe50b865-dff1-461d-9baf-0a47c82d726f.jpg',
    'location': {
      'country': 'Argentina',
      'city': 'Buenos Aires',
      'timeZone': {
        'id': 323,
        'name': 'America/Argentina/Buenos_Aires',
        'offset': -10800000,
        'hourlyOffset': '-03:00',
      },
    },
    'avatarTypes': ['CANDIDATE', 'MANAGER', 'PERSONAL'],
    'userAvatars': [{
      'id': 672702,
      'type': 'PERSONAL',
    }, {
      'id': 30631,
      'type': 'CANDIDATE',
    }, {
      'id': 269499,
      'type': 'MANAGER',
    }],
    'company': {
      'id': 11,
      'name': 'Aurea',
    },
    'feedbackRequired': false,
  },
  'salary': 50.00,
  'weeklyLimit': 40,
  'salaryUnit': 'HOUR',
  'weeklyMeetingMinutesLimit': 180,
  'assignmentHistories': [{
    'id': 45656,
    'effectiveDateBegin': '2018-04-25T20:58:42.000+0000',
    'team': {
      'id': 1995,
      'name': 'Eng.Easier',
      'company': {
        'id': 11,
        'name': 'Aurea',
      },
      'teamOwner': {
        'printableName': 'Gastón Real',
        'userId': 30631,
        'id': 269499,
        'company': {
          'id': 11,
          'name': 'Aurea',
        },
        'type': 'MANAGER',
      },
    },
    'manager': {
      'id': 269499,
      'userId': 30631,
      'email': 'gastonreal@hotmail.com',
      'firstName': 'Gastón',
      'lastName': 'Real',
      'printableName': 'Gastón Real',
      'photoUrl': 'https://crossover-uploads-production.s3.amazonaws.com/images/fe50b865-dff1-461d-9baf-0a47c82d726f.jpg',
      'location': {
        'country': 'Argentina',
        'city': 'Buenos Aires',
        'timeZone': {
          'id': 323,
          'name': 'America/Argentina/Buenos_Aires',
          'offset': -10800000,
          'hourlyOffset': '-03:00',
        },
      },
      'avatarTypes': ['CANDIDATE', 'MANAGER', 'PERSONAL'],
      'userAvatars': [{
        'id': 672702,
        'type': 'PERSONAL',
      }, {
        'id': 30631,
        'type': 'CANDIDATE',
      }, {
        'id': 269499,
        'type': 'MANAGER',
      }],
      'company': {
        'id': 11,
        'name': 'Aurea',
      },
      'feedbackRequired': false,
    },
    'status': 'ACTIVE',
  }],
},
];
