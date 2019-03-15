import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToString',
})
export class EnumToStringPipe implements PipeTransform {

  public transform(enumItem: string, dontCapitalize?: boolean, capitalizeFirst?: boolean, dontChangeInputCase?: boolean): string {
    if (dontChangeInputCase) {
      return enumItem.trim().split(/[_\s]+/g).join(' ');
    } else {
      const parts = enumItem.trim().toLowerCase().split(/[_\s]+/g);
      if (!dontCapitalize) {
        for (let i = 0; i < parts.length; i++) {
          if (parts[i].length > 0) {
            parts[i] = parts[i][0].toUpperCase() + parts[i].substring(1);
          }
        }
      }
      if (capitalizeFirst) {
        if (parts[0] && parts[0].length > 0) {
          parts[0] = parts[0][0].toUpperCase() + parts[0].substring(1);
        }
      }
      return parts.join(' ');
    }
  }

}
