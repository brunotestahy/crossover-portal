import { Timezone } from 'app/core/models/timezone';

export class Country {
  constructor(
    public id: number,
    public timezones: Timezone[],
    public name: string,
    public code: string,
    public allowed: boolean,
    public zipFormat?: string
  ) {
  }

  public static from(country: Partial<Country>): Country {
    return new Country(
      country.id as typeof Country.prototype.id,
      (country.timezones || []).map(Timezone.from) as typeof Country.prototype.timezones,
      country.name as typeof Country.prototype.name,
      country.code as typeof Country.prototype.code,
      country.allowed as typeof Country.prototype.allowed,
      country.zipFormat as typeof Country.prototype.zipFormat
    );
  }

  public static findById(list: Country[], id: number): Country | undefined {
    return (list || []).find(country => country.id === id);
  }
}
