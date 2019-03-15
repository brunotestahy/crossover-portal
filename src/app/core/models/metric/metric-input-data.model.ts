import { Assignment } from 'app/core/models/assignment/assignment.model';
import { RawMetrics } from 'app/core/models/metric/raw-metrics.model';
import { Team } from 'app/core/models/team/team.model';

export interface MetricInputData {
  team: Team;
  managerId: number;
  metricDescription: string;
  queryOption: number;
  unitsCostMode: string;
  assignments: Assignment[];
  metricsValues: RawMetrics[];
  metricTarget: number;
  lastUpdate?: Date;
  activeTeamMembers: number;
  viewMode?: string;
}
