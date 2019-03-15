export interface JobSourcingRow {
    jobId: number;
    jobName: string;
    priority?: number | null;
    daysOpen: number | null;
    demand?: number | null;
    total: number;
    lastDay: number;
    last7Days: number;
    quality: number;
    quality1d: number;
    quality7d: number;
    sourcingInstructions?: string;
    jbp: boolean;
    jbpInstructions?: string;
    outbound: boolean;
    outboundInstructions?: string;
}
