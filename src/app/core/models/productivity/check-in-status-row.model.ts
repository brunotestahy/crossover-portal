import { CheckInStatus } from 'app/core/models/productivity';

export interface StatusRow {
  status: CheckInStatus;
  total: number;
  [key: string]: CheckInStatus | number;
}
