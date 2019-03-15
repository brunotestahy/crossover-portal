export interface MetricSetup {
  active: boolean;
  advancedQuery?: string;
  createdOn?: string;
  currentTeamMetric: boolean;
  customFieldId?: string;
  customQuery?: string;
  doneCriteria?: string;
  encodedPassword?: Array<string>;
  errorCount?: number;
  host?: string;
  id?: number;
  metricComputation?: string;
  metricName?: string;
  metricTarget?: number;
  metricUpdatedOn?: string;
  password?: string;
  projects?: string;
  spreadsheetAccess?: string;
  type?: string;
  username?: string;
  worksheetName?: string;
}
