import { EnvironmentTimezone } from 'app/core/models/identity';

const UTC_MINUS_3_OFFSET = 180;
const UTC_PLUS_2_OFFSET = -120;

export const USER_BEHIND_UTC_TIMEZONE =
  new EnvironmentTimezone(UTC_MINUS_3_OFFSET);
export const USER_AHEAD_UTC_TIMEZONE =
  new EnvironmentTimezone(UTC_PLUS_2_OFFSET);
