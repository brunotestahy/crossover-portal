import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

export function DateIsSameOrBeforeValidator(dateTo: AbstractControl): ValidatorFn {
  return (control: AbstractControl): { [key: string]: { value: Date | string } } | null => {
    const from = moment(control.value);
    const to = moment(dateTo.value);
    if (!control.value || !dateTo.value || from.isSameOrAfter(to, 'day')) {
      return null;
    }
    return { 'date-is-before': { value: control.value } };
  };
}
