export interface Payment {
  amount: number;
  companyName: string;
  dailyHours: string[];
  description: string;
  dfcUserId: number;
  disputedHours: number;
  email: string;
  hours: number;
  id: number;
  manualHours: number;
  partnerFullName: string;
  partnerRate: number;
  platform: string;
  status: string;
  teamName: string;
  type: string;
  unit: string;
  weeklyHoursLimit: number;
}
