import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dolbyModesTranslation'
})
export class DolbyModesTranslationPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let val = value.toString();
    switch(val) {
      case "Dynamic":
        return "DYNAMIC";
      case "Movie":
        return "MOVIE";
      case "Music":
        return "Music";
      case "Games":
        return "Games";
      case "Voip":
        return "VOICE";
    }
  }

}
