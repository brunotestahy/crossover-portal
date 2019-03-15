export interface TimeSheet {
  start_date: string;
  end_date: string;
  tracked_minutes: number;
  billed_minutes: number;
  overtime_minutes: number;
  pending_manual_minutes: number;
  approved_manual_minutes: number;
  rejected_manual_minutes: number;
  disputed_minutes: number;
  dispute_resolved_minutes: number;
  meeting_minutes: number;
  manual_minutes: number;
}
