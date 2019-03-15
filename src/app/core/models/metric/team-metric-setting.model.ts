export interface TeamMetricSetting {
    deskSetupId: number;
    id: number;
    jiraId: string;
    jiraSetupId: number;
    manager: { id: number };
    printableName: string;
    salesforceSetupId: number;
    zendeskSetupId: number;
    salesforceId?: string;
    server?: string;
    username?: string;
}
