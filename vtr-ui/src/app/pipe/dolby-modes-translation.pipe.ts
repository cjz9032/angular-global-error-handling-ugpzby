import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dolbyModesTranslation',
  pure: false
})
export class DolbyModesTranslationPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    let val = value.toString().toLowerCase();

    val=val.substr(val.lastIndexOf(".")+1)

    console.log('+++++++++++++++++++++++',val);

    return val;
  }
}
