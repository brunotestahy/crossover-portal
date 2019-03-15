import { Country } from 'app/core/models/country';

export interface PersonalInfo {
  title?: string;
  primaryCitizenship?: Partial<Country>;
  country?: Partial<Country>;
  state?: string;
  address1?: string;
  address2?: string;
  city?: string;
  zip?: string;
  secondaryCitizenship?: Partial<Country>;
  tertiaryCitizenship?: Partial<Country>;
  primaryCitizenshipId?: number;
  countryId?: number;
  secondaryCitizenshipId?: number;
  tertiaryCitizenshipId?: number;
}
