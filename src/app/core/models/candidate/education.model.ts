import * as moment from 'moment';

export class Education {
  protected static iso8601Format = 'YYYY-MM-DD[T]HH:mm:ss[Z]';
  protected static iso8601YearFormat = `%(year)s-01-01T00:00:00Z`;

  constructor(
    public id: number,
    public school: string,
    public startDate: string,
    public endDate: string,
    public degree: string,
    public markedToDelete?: boolean
  ) {
    const dateLength = 10;
    if (this.startDate) {
      const startDatePart = this.startDate.substr(0, dateLength);
      this.startDate = moment.utc(startDatePart).format(Education.iso8601Format);
    }
    if (this.endDate) {
      const endDatePart = this.endDate.substr(0, dateLength);
      this.endDate = moment.utc(endDatePart).format(Education.iso8601Format);
    }
  }

  public static from(education: Partial<Education>): Education {
    return new Education(
      education.id as typeof Education.prototype.id,
      education.school as typeof Education.prototype.school,
      education.startDate as typeof Education.prototype.startDate,
      education.endDate as typeof Education.prototype.endDate,
      education.degree as typeof Education.prototype.degree
    );
  }

  public static getYearRange(maxYear: number): string[] {
    const minYear = 1940; // as per legacy UI
    const dataRange = [] as string[];
    for (let year = maxYear; year > minYear; year--) {
      dataRange.push(sprintf(Education.iso8601YearFormat, { year }));
    }
    return dataRange;
  }

  public static fromArray(educations: Partial<Education>[] | undefined): Education[] {
    return (educations || []).map(Education.from);
  }

  public static manageEntries(entries: Education[], updates: Education[]): Education[] {
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
      .map((update, id) => Education.from(<Partial<Education>>{ ...update, id }));
  }

  public get startYear(): string {
    return this.startDate ?
      moment.utc(this.startDate).format('YYYY') :
      '';
  }

  public get endYear(): string {
    return this.endDate ?
      moment.utc(this.endDate).format('YYYY') :
      '';
  }
}
