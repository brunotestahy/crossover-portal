import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'propertyFilter',
})
export class PropertyFilterPipe implements PipeTransform {
  // tslint:disable-next-line:no-any
  transform(items: { [key: string]: any }[], property: string, filter: any, ignoreCase: boolean = true): Object[] {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    if (ignoreCase) {
      return items.filter(
        item =>
          item[property]
            .toString()
            .toLowerCase()
            .indexOf(filter.toString().toLowerCase()) !== -1
      );
    } else {
      return items.filter(item => item[property].toString().indexOf(filter.toString()) !== -1);
    }
  }
}
