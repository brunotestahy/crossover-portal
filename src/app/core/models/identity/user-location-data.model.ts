import { Country } from 'app/core/models/country';
import { Timezone } from 'app/core/models/timezone';

export interface UserLocationData {
  country?: Partial<Country>;
  timeZone?: Timezone;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  zip?: string;
}
