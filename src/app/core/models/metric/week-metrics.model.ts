export interface WeekMetrics {
  ticketsResolved: number | string;
  hoursWorked: number;
  weekSalary: number;
  startDate: string;
  assignmentId?: number;
  activeWeek?: boolean;
  queryUsed?: string;
  cost: number;
  isLastWeek?: boolean;
  date?: Date;
  id?: number | null;
  assignmentHistoryId?: number;
  type?: string;
  teamSize?: number;
}
