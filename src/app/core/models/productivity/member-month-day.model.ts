import { CheckInStatus } from 'app/core/models/productivity';

export interface MemberMonthDay {
  day: number;
  status: CheckInStatus | undefined;
  state: string | undefined;
}
