import { InterviewDetailsResponse } from 'app/core/models/interview';
export const SAMPLE_INTERVIEW: InterviewDetailsResponse = {
  'id': 17695,
  'status': 'INITIAL',
  'createdOn': '2018-03-19T06:04:50.000+0000',
  'updatedOn': '2018-03-19T06:04:50.000+0000',
  'durationInMinutes': 30,
  'interviewSlots': [
    {
      'id': 114627,
      'startDateTime': '2018-03-21T16:00:00.000+0000',
      'endDateTime': '2018-03-21T17:30:00.000+0000',
    },
  ], 'managerBusySlots': [
    { 'startDateTime': '2018-03-21T16:30:00.000+0000', 'endDateTime': '2018-03-21T17:00:00.000+0000' },
    { 'startDateTime': '2018-03-22T16:30:00.000+0000', 'endDateTime': '2018-03-22T17:00:00.000+0000' },
  ], 'interviewee': {
    'type': 'CANDIDATE', 'userAvatars': [
      { 'id': 1385142, 'type': 'CANDIDATE' },
    ],
    'id': 1385142,
    'averageRatings': 0.0,
    'workedHours': 0.0,
    'billedHours': 0.0, 'connections': [],
    'skypeId': 'edenrique3@outlook.com',
    'agreementAccepted': false,
    'intercomId': '5a614e104222bd72128ed4fc',
    'personal': false,
    'userSecurity': {
      'linkedInLogin': false,
      'enabled': false,
      'accountNonExpired': true,
      'accountNonLocked': true,
      'credentialsNonExpired': true,
      'securityQuestion': 'Sample question',
    },
    'email': 'edenrique3@gmail.com',
    'printableName': 'Ed Enrique',
    'candidate': true,
    'location': {
      'country': {
        'id': 230, 'name': 'United States', 'code': 'us', 'allowed': true,
        'zipFormat': '\\d{5}([ \\-]\\d{4})?',
      }, 'timeZone': {
        'id': 506, 'name': 'America/New_York', 'offset': -14400000, 'standardOffset': -18000000,
        'hourlyOffset': '-04:00',
      }, 'city': 'Atlanta', 'latitude': 19.434204, 'longitude': -99.138600,
    }, 'headline': 'Android Subject Matter Expert', 'firstName': 'Ed',
    'lastName': 'Enrique', 'userId': 729207, 'manager': false,
    'companyAdmin': false, 'avatarTypes': ['CANDIDATE', 'PERSONAL'],
    'photoUrl': 'https://crossover-uploads-production.s3.amazonaws.com/images/a513de2f8fd41ba2e120da1574de74d3.jpg',
    'busySlots': [], 'appFeatures': [],
  }, 'selection': {
    'id': 26422, 'status': 'IN_PROGRESS',
    'manager': {
      'type': 'MANAGER', 'userAvatars': [
        { 'id': 1152, 'type': 'COMPANY_ADMIN' },
      ],
      'id': 1152,
      'company': {
        'id': 12, 'name': 'Crossover', 'internal': false, 'xoPercentage': 0.0, 'currentBalance': 0.0,
      }, 'availableSlots': [], 'manualTimeNotificationsEnabled': true, 'email': 'andy.tryba@crossover.com',
      'personal': false, 'headline': 'CEO & Founder at Crossover', 'firstName': 'Andy',
      'lastName': 'Tryba', 'userId': 207785, 'manager': true, 'companyAdmin': false,
      'avatarTypes': ['CANDIDATE', 'MANAGER', 'COMPANY_ADMIN', 'ADMIN', 'ACCOUNT_MANAGER',
        'PERSONAL'], 'printableName': 'Andy Tryba', 'candidate': false,
      'photoUrl': 'https://crossover-uploads-production.s3.amazonaws.com/images/4c62c599bd5ebec7be902199e5f080c5',
      'userSecurity': {
        'linkedInLogin': false,
        'enabled': false,
        'accountNonExpired': true,
        'accountNonLocked': true,
        'credentialsNonExpired': true,
        'securityQuestion': 'Sample question',
      },
      'busySlots': [], 'appFeatures': [{ 'appFeature': 'TEAM_DASHBOARD' },
      { 'appFeature': 'POLLS' }],
      'location': {
        'country': {
          'id': 230, 'name': 'United States', 'code': 'us', 'allowed': true,
          'zipFormat': '\\d{5}([ \\-]\\d{4})?',
        }, 'timeZone': {
          'id': 230, 'name': 'America/Chicago', 'offset': -18000000,
          'standardOffset': -21600000, 'hourlyOffset': '-05:00',
        }, 'city': 'Austin', 'latitude': 30.267153, 'longitude': -97.743061,
      },
    },
    'createdOn': '2018-03-19T06:04:50.000+0000',
    'updatedOn': '2018-03-19T06:04:50.000+0000', 'marketplaceMember': {
      'id': 884443, 'application': {
        'id': 884443, 'completedOn': '2018-03-21T13:25:41.970+0000', 'candidate': {
          'type': 'CANDIDATE', 'userAvatars': [
            { 'id': 1385142, 'type': 'CANDIDATE' },
          ], 'id': 1385142, 'averageRatings': 0.0,
          'workedHours': 0.0, 'billedHours': 0.0,
          'connections': [],
          'skypeId': 'edenrique3@outlook.com',
          'agreementAccepted': false,
          'intercomId': '5a614e104222bd72128ed4fc',
          'personal': false,
          'email': 'edenrique3@gmail.com',
          'printableName': 'Ed Enrique',
          'candidate': true,
          'location': {
            'country': {
              'id': 230, 'name': 'United States', 'code': 'us', 'allowed': true,
              'zipFormat': '\\d{5}([ \\-]\\d{4})?',
            }, 'timeZone': {
              'id': 506, 'name': 'America/New_York', 'offset': -14400000,
              'standardOffset': -18000000, 'hourlyOffset': '-04:00',
            }, 'city': 'Atlanta',
            'latitude': 19.434204, 'longitude': -99.138600,
          }, 'headline': 'Android Subject Matter Expert', 'firstName': 'Ed',
          'lastName': 'Enrique', 'userId': 729207, 'manager': false,
          'companyAdmin': false, 'avatarTypes': ['CANDIDATE', 'PERSONAL'],
          'photoUrl': 'https://crossover-uploads-production.s3.amazonaws.com/images/a513de2f8fd41ba2e120da1574de74d3.jpg',
          'busySlots': [], 'appFeatures': [],
        }, 'job': {
          'id': 2645, 'imageUrl': 'crossover-uploads-production/images/job_2645_image_9ac5eec70b6a35d543f106d3b81cc96e.png',
          'title': 'Android Chief Software Architect', 'trackerRequired': false,
          'jbpEnabled': false, 'outboundEnabled': false, 'autoEndorse': false, 'testSetupCompleted': false,
        }, 'status': 'ACCEPTED', 'score': 0.0, 'yearsOfExperience': 0, 'variants': [],
      },
    },
  }, 'type': 'CANDIDATE',
};
