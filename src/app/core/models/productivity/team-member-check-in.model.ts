import { CheckIn } from 'app/core/models/productivity';

export interface TeamMemberCheckIn {
  checkin: CheckIn | undefined;
  date: string;
  photoUrl: string | undefined;
  fullName: string | undefined;
}
