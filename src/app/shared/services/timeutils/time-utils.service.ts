import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';

@Injectable()
export class TimeUtilsService {

  private readonly MILLISECONDS_PER_MINUTE = 60000;

  constructor() { }

  public getUtc(date?: Date, offset: number = 0): Date {
    const currentDate = this.getDate(date);

    offset += currentDate.getTimezoneOffset() * this.MILLISECONDS_PER_MINUTE;

    const time = currentDate.getTime() + offset;
    return new Date(time);
  }

  private getMoment(date?: Date): Moment {
    if (date) {
      return moment(date);
    }
    return moment();
  }

  private getDate(date?: Date): Date {
    return this.getMoment(date).toDate();
  }
}
