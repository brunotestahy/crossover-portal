import * as moment from 'moment';

export class Certification {
  protected static iso8601Format = 'YYYY-MM-DD[T]HH:mm:ss[Z]';

  constructor(
    public id: number,
    public name: string,
    public startDateTime: Date | string,
    public endDateTime: Date | string,
    public markedToDelete: boolean = false
  ) {
    const dateLength = 10;
    if (this.startDateTime) {
      const dateValue = this.startAsDate instanceof Date ?
        this.startAsDate.toISOString() :
        this.startDateTime as string;
      const startDatePart = dateValue.substr(0, dateLength);
      this.startDateTime = moment.utc(startDatePart).format(Certification.iso8601Format);
    }
    if (this.endDateTime) {
      const dateValue = this.endDateTime instanceof Date ?
        this.endDateTime.toISOString() :
        this.endDateTime as string;
      const endDatePart = dateValue.substr(0, dateLength);
      this.endDateTime = moment.utc(endDatePart).format(Certification.iso8601Format);
    }
  }

  public get startAsDate(): Date | string  {
    const isoWithoutTime = 'MMMM DD, YYYY 00:00:00';
    return this.startDateTime ?
      new Date(moment.utc(this.startDateTime).format(isoWithoutTime)) :
      '';
  }

  public get endAsDate(): Date | string {
    const isoWithoutTime = 'MMMM DD, YYYY 00:00:00';
    return this.endDateTime ?
      new Date(moment.utc(this.endDateTime).format(isoWithoutTime)) :
      '';
  }

  public static from(certification: Partial<Certification>): Certification {
    return new Certification(
      certification.id as typeof Certification.prototype.id,
      certification.name as typeof Certification.prototype.name,
      certification.startDateTime as typeof Certification.prototype.startDateTime,
      certification.endDateTime as typeof Certification.prototype.endDateTime
    );
  }

  public static fromArray(certifications: Partial<Certification>[] | undefined): Certification[] {
    return (certifications || []).map(Certification.from);
  }

  public static manageEntries(entries: Certification[], updates: Certification[]): Certification[] {
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
      .map((update, id) => Certification.from(<Partial<Certification>>{ ...update, id }));
  }
}
