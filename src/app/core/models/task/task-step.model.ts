export interface TaskStep {
  candidateProvidesTrackerPassword: number;
  candidateProvidesResidenceInfo: number;
  candidateSetsUpPayoneer: number;
  candidateSetsUpPaychex: number;
  candidateStartsBackgroundCheck: number;
  [key: string]: number;
}
