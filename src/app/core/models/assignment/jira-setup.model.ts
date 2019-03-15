export interface JiraSetup {
  id: number;
  host: string;
  username: string;
  doneCriteria: string;
  active: boolean;
  advancedQuery: string;
  metricName: string;
  metricTarget: number;
  type: string;
  metricComputation: string;
  currentTeamMetric: boolean;
  errorCount: number;
  spreadsheetAccess: string;
  metricUpdatedOn: string;
}
