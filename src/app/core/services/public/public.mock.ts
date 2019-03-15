import { Industry, Language } from '../../models/candidate';

export const INDUSTRIES_MOCK_DATA: Industry[] = [
  {id: 2, name: 'Accounting'},
  {id: 24, name: 'Airlines/Aviation'},
  {id: 119, name: 'Alternative Dispute Resolution'},
  {id: 130, name: 'Alternative Medicine'},
  {id: 7, name: 'Internet' },
];

export const LANGUAGE_MOCK_DATA = [
  new Language(1, 'Portuguese'),
  new Language(2, 'English'),
  new Language(3, 'French'),
  new Language(4, 'German'),
  new Language(5, 'Spanish'),
];
