export class TeamSummaryChartEntry {
  constructor(
    public group: string,
    public xKey?: string | undefined,
    public yKey?: number | string | undefined,
    public score?: number | string | undefined,
    public value?: number | string | undefined,
    public color?: string | undefined
  ) {
  }

  public static from(source: Partial<TeamSummaryChartEntry>): TeamSummaryChartEntry {
    return new TeamSummaryChartEntry(
      source.group || '',
      source.xKey,
      source.yKey,
      source.score,
      source.value,
      source.color
    );
  }
}
