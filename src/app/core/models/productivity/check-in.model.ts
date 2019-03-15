export interface CheckIn {
  id: number | null;
  date: string;
  status: string;
  unblocked: boolean;
  assignmentId: number;
  blockageStatus?: string;
  comment?: string | null;
}
