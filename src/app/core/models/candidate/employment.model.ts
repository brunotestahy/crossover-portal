import * as moment from 'moment';

import { Country } from 'app/core/models/country';

export class Employment {
  public static dateFormat = 'MMM YYYY';
  public static roles = [
    'Intern',
    'Individual Contributor',
    'Lead',
    'Manager',
    'Executive',
    'Owner',
  ];

  constructor(
    public id: number,
    public company: string,
    public city: string,
    public country: Partial<Country>,
    public title: string,
    public role: string,
    public startDate: Date | string,
    public endDate: Date | string,
    public current: boolean,
    public description: string,
    public markedToDelete: boolean = false
  ) {
  }

  public get formattedStartDate(): string {
    return this.startDate ?
      moment(this.startDate).format(Employment.dateFormat) :
      '';
  }
  public get formattedEndDate(): string {
    /* istanbul ignore else */
    if (this.startDate && this.current) {
      return 'Current';
    }
    return this.endDate ?
      moment(this.endDate).format(Employment.dateFormat) :
      '';
  }

  public static from(source: Partial<Employment>): Employment {
    return new Employment(
      source.id as typeof Employment.prototype.id,
      source.company as typeof Employment.prototype.company,
      source.city as typeof Employment.prototype.city,
      source.country as typeof Employment.prototype.country,
      source.title as typeof Employment.prototype.title,
      source.role as typeof Employment.prototype.role,
      source.startDate as typeof Employment.prototype.startDate,
      source.endDate as typeof Employment.prototype.endDate,
      source.current as typeof Employment.prototype.current,
      source.description as typeof Employment.prototype.description
    );
  }

  public static fromArray(employments: Partial<Employment>[] | undefined): Employment[] {
    return (employments || []).map(Employment.from);
  }

  public static manageEntries(entries: Employment[], updates: Employment[]): Employment[] {
    const markedToDelete = (updates || [])
      .filter(item => item.markedToDelete);
    const nonDeletedEntries = (entries || []).filter(entry =>
      markedToDelete.find(item => item.id === entry.id) === undefined
    );
    const nonDeletedUpdates = (updates || [])
      .filter(update =>
        markedToDelete.find(item => item.id === update.id) === undefined
      );
    return nonDeletedEntries
      .filter(
        entry => nonDeletedUpdates
          .findIndex(update => update.id === entry.id) === -1
      )
      .concat(nonDeletedUpdates)
      .map((update, id) => {
        if (update.startDate instanceof Date) {
          update.startDate = moment(update.startDate).format('YYYY-MM-DD');
        }
        if (update.endDate instanceof Date) {
          update.endDate = moment(update.endDate).format('YYYY-MM-DD');
        }
        return Employment.from(<Partial<Employment>>{ ...update, id });
      });
  }
}
