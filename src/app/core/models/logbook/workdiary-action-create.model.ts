export interface WorkDiaryActionCreate {
  action: string;
  assignmentId: number;
  comment: string;
  timecards: number[];
}
