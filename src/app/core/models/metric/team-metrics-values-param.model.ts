export interface TeamMetricValuesParam {
    teamId: number;
    from: string;
    to: string;
    costInclusive: boolean;
    refresh?: boolean;
    type?: string;
    managerId?: number;
}
