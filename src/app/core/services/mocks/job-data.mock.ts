import { Job } from '../../models/hire';

export const JOB_DATA_MOCK: Job = {
  'id': 2685,
  'title': '.NET Chief Software Architect (Telecom)',
  'salary': 50,
  'salaryType': 'WEEKLY',
  'salaryUnit': 'HOUR',
  'trackerRequired': false,
  'status': 'ACTIVE',
  'applicationType': 'NATIVE',
  'applicationFlow': {
    'id': 8,
    'name': 'Moodle and TT',
    'flowDefinitionType': 'HACKERRANK_ASSIGNMENT',
  },
  'jbpEnabled': false,
  'outboundEnabled': false,
  'activationDate': '2017-06-23T23:14:37.000+0000',
  'workingHoursPerWeek': 40,
  'label': {
    'id': 11,
    'name': 'C# (.NET)',
    'parent': {
      'id': 1,
      'name': 'Software Development',
    },
  },
  'autoEndorse': false,
  'testSetupCompleted': false,
  'yearSalary': 100,
  'flowType': 'HACKERRANK_ASSIGNMENT',
};
