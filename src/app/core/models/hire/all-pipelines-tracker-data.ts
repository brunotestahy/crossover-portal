
export interface AllPipelinesTrackerData {
  jobTitle: string;
  jobId?: number;
  flowType: string;
  tasks: Record<string, number>;
  count: { [key: string]: string | number };
}
