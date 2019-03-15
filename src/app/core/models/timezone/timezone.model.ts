import { Country } from 'app/core/models/country';

export class Timezone {
  constructor(
    public id: number,
    public name: string,
    public offset: number,
    public standardOffset: number,
    public hourlyOffset: string,
    public countries?: Country[]
  ) {
  }

  public static from(timezone: Partial<Timezone>): Timezone {
    return new Timezone(
      timezone.id as typeof Timezone.prototype.id,
      timezone.name as typeof Timezone.prototype.name,
      timezone.offset as typeof Timezone.prototype.offset,
      timezone.standardOffset as typeof Timezone.prototype.standardOffset,
      timezone.hourlyOffset as typeof Timezone.prototype.hourlyOffset,
      (timezone.countries || []) as typeof Timezone.prototype.countries
    );
  }

  public static findById(list: Timezone[], id: number): Timezone | undefined {
    return (list || []).find(timezone => timezone.id === id);
  }
}
