import { AbstractControl } from '@angular/forms';

const EMAIL_REGEXP = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export function EmailOrEmpty(control: AbstractControl): { [key: string]: { value: string } } | null {
  return (EMAIL_REGEXP.test(control.value) || control.value === '') ? null : {'email': {value: control.value}};
}
