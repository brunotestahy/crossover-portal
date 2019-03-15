import { Manager } from 'app/core/models/manager/manager.model';
import { MetricSetup } from 'app/core/models/metric/metric-setup.model';

export interface TeamOverview {
  id: number;
  name: string;
  metricsSetups: Array<MetricSetup>;
  teamOwner?: Manager;
  watchers?: Array<Manager>;
}
