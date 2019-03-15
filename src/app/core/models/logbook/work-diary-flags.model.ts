export interface WorkDiaryFlags {
  isMeeting: boolean;
  isOutlook: boolean;
  isIdle: boolean;
  isManual: boolean;
  isApproved: boolean;
  isRejected: boolean;
  isDisputed: boolean;
  isDisputeResolved: boolean;
  expanded: boolean;
  calculatedIntensityScore: number;
  localDate: Date;
}
