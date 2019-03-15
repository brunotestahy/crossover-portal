import { Section, WeekPlannedAct } from 'app/core/models/productivity';

export interface TeamActivitiesAverage {
  alignmentScoreAvg?: number;
  focusScoreAvg?: number;
  intensityScoreAvg?: number;
  periodLongAvg?: number;
  totalTrackedTimeAvg?: number;
  weekPlanedTotalLong?: number;
  groupsSummaryAvg?: Section[];
  overWeekPlannedActs?: WeekPlannedAct[];
}
