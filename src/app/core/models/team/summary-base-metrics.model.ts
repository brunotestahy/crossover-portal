import { ProductivitySummary } from 'app/core/models/productivity/productivity-summary.model';

export class SummaryBaseMetrics {
  constructor(
    public intensity: number[] = [],
    public focus: number[] = [],
    public alignment: number[] = [],
    public metric: number[] = [],
    public loggedHours: number[] = []
  ) {
  }

  public static fromProductivitySummary(
    summary: ProductivitySummary,
    chunkSize: number
  ): SummaryBaseMetrics {
    return new this(
      this.getReverseSlice(summary.intensityScoreAvg, chunkSize),
      this.getReverseSlice(summary.focusScoreAvg, chunkSize),
      this.getReverseSlice(summary.activityMetricsAvg, chunkSize),
      this.getReverseSlice(summary.metricsStatsAvg, chunkSize),
      this.getReverseSlice(summary.weeklyHoursAvg, chunkSize)
    );
  }

  private static getReverseSlice<T>(input: T[], size: number): T[] {
    return input.slice().reverse().slice(0, size);
  }
}
