import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { DurationInputArg1, DurationInputArg2 } from 'moment';
import 'moment-duration-format';

@Pipe({
  name: 'durationFormat',
})
export class DurationFormatPipe implements PipeTransform {

  public transform(
    durationNumber: DurationInputArg1,
    durationType?: DurationInputArg2,
    format?: string,
    trim?: string
  ): string {
    const currentDurationType = durationType || 'minutes';
    format = format || 'D[d]h[h]';
    const time = moment.duration(durationNumber, currentDurationType);
    const currentTrim = trim === undefined ? 'left' : trim;
    return time.format(format, { trim: currentTrim});
  }
}
