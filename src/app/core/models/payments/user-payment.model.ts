export interface UserPayment {
  amount: number;
  disputedHours: number;
  manualHours: number;
  paidHours: number;
  periodEndDate: string;
  periodStartDate: string;
  platform: string;
  status: string;
  team: string;
  weeklyHourLimit: number;
  workedHours: number;
}
