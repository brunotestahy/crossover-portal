export class TeamMetricInfo {
  constructor(
    public description: string,
    public target: number,
    public hoursLogged: number[] = [],
    public metrics: number[] = [],
    public alignment: number[] = [],
    public focus: number[] = [],
    public intensity: number[] = [],
    public current: {date: Date, value: number}[] =  [],
  ) {
  }
}
