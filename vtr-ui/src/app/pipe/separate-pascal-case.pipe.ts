import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'separatePascalCase'
})
export class SeparatePascalCasePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let pascalCaseString = value.match(/[A-Z][a-z]+|[0-9]+/g).join(' ');
    return pascalCaseString.toLowerCase();
  }

}
