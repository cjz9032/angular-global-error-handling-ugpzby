import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dolbyModesTranslation'
})
export class DolbyModesTranslationPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    let val = value.toString().toLowerCase();

    val=val.substr(val.lastIndexOf(".")+1)

    console.log('+++++++++++++++++++++++',val);




    switch(val) {
      case "dynamic":
        return "DYNAMIC";
      case "movie":
        return "MOVIE";
      case "music":
        return "MUSIC";
      case "game":
        return "GAME";
      case "voice":
        return "VOICE";
    }
  }
}
