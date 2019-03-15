import { Country } from 'app/core/models/country';

export interface EntityInfo {
  name?: string;
  country?: Partial<Country>;
  countryId?: number;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
}
