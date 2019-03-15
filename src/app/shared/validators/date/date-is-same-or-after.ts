import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

export function DateIsSameOrAfterValidator(dateFrom: AbstractControl): ValidatorFn {
  return (control: AbstractControl): { [key: string]: { value: Date | string } } | null => {
    const from = moment(dateFrom.value);
    const to = moment(control.value);
    if (!control.value || !dateFrom.value || from.isSameOrAfter(to, 'day')) {
      return null;
    }
    return { 'date-is-after': { value: control.value } };
  };
}
