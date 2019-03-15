export interface WeekStats {
  ticketsResolved: number;
  cost: number;
  teamSize: number;
  startDate: string;
  unitPerAssignment: number;
  costPerUnit: number;
  queryUsed?: string;
  activeWeek?: boolean;
  isLastWeek?: boolean;
}
