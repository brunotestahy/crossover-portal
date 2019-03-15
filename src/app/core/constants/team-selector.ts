export const ALL_MANAGERS_ID = -1;
export const ALL_DIRECT_REPORT = 'All Direct Reports';

export const isDirectReportsTeam = (value: number | string) =>
  (typeof(value) === 'number' && value === ALL_MANAGERS_ID) ||
  (typeof(value) === 'string' && value === ALL_DIRECT_REPORT) ||
  (typeof(value) === 'string' && value === ALL_MANAGERS_ID.toString());

export const isAllManagers = (value: string | number | undefined) =>
  (typeof(value) === 'string' && value === ALL_MANAGERS_ID.toString()) ||
  (typeof(value) === 'number' && value === ALL_MANAGERS_ID) ;
