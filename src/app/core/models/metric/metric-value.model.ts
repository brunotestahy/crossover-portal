import { States } from 'app/core/models/metric/states.model';

export interface MetricValues {
    assignmentId: number;
    managerName: string;
    name: string;
    stats: States[];
}
