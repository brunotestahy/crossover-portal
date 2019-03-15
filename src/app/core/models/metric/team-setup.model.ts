export interface TeamSetup {
  active?: boolean;
  doneCriteria?: string;
  advancedQuery?: string;
  currentTeamMetric?: boolean;
  customFieldId?: number;
  customQuery?: string;
  host?: string;
  id?: number;
  metricComputation?: string;
  metricName?: string;
  metricTarget?: number;
  projects?: string | string[];
  password?: string;
  type?: string;
  username?: string;
  spreadsheetAccess?: string;
  worksheetName?: string;
}
