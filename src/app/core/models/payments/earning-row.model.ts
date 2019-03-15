export interface EarningsRow {
  team: string;
  paymentPlatform: string;
  loggedHours: number;
  manual: number;
  disputed: number;
  paymentHours: number;
  weeklyLimit: number;
  netPayment: number;
  paymentStatus: string;
  paymentWeekStartDate: string;
}
