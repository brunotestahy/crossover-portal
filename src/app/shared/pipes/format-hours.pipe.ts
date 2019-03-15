import { Pipe, PipeTransform } from '@angular/core';

// default format 'h:mm' : 1.5 -> '1:30', 2.33 -> '2:20'
// support format 'hh:mm': 1.5 -> '01:30', 2.33 -> '02:20'

@Pipe({
  name: 'formatHours',
})
export class FormatHoursPipe implements PipeTransform {

  public transform(input: number, format?: string): string {
    let mn = false;
    if (input < -0.1) {
      input = Math.abs(input);
      mn = true;
    }
    const isPadZero = format && format === 'hh:mm';
    const minutes = Math.round(input * 60);
    const h = Math.floor(minutes / 60);
    const hh = (h < 10 ? '0' : '') + h;
    const m = minutes % 60;
    const mm = (m < 10 ? '0' : '') + m;
    if (isNaN(minutes)) {
      return '-';
    }
    return (mn ? '-' : '') + (isPadZero ? hh : h) + ':' + mm;
  }
}
