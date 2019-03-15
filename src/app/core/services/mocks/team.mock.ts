import { Team } from 'app/core/models/team/team.model';
import { DeepPartial } from 'app/core/type-guards/deep-partial';
export const TEAMS: Array<DeepPartial<Team>> = [
  {
    'id': 688,
    'name': '1test',
    'company': {
      'id': 21,
      'name': 'Trilogy Automotive',
    },
    'teamOwner': {
      'printableName': 'Aaron Parsons',
      'userId': 161707,
      'id': 1869,
      'type': 'MANAGER',
    },
  },
  {
    'id': 689,
    'name': '2test',
    'company': {
      'id': 21,
      'name': 'Trilogy Automotive',
    },
    'teamOwner': {
      'printableName': 'Aaron Parsons',
      'userId': 161707,
      'id': 1869,
      'type': 'MANAGER',
    },
  },
  {
    'id': 670,
    'name': '2test',
    'company': {
      'id': 21,
      'name': 'Trilogy Automotive',
    },
    'teamOwner': {
      'printableName': 'Aaron Parsons',
      'userId': 161707,
      'id': 1869,
      'type': 'MANAGER',
    },
  },
];
