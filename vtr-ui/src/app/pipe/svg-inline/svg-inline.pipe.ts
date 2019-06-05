import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser'
import {Observable}         from "rxjs";
import {Observer}           from "rxjs";

@Pipe({
  name: 'svgInline'
})
export class SvgInlinePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  getContent(url){
    return new Promise(resovle=>{
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.send(null);
      request.onreadystatechange = function () {
          if (request.readyState === 4 && request.status === 200) {
                resovle(request.responseText);
          }
      }
    });
  }

  transform(value: any, args?: any): any {
    if (typeof(value) != 'undefined') {
      return new Observable(observer => {
        observer.next("");
        if(value.substring(value.lastIndexOf('.'))==='.svg'){
          this.getContent(value).then(val=>
            {
              val=`data:image/svg+xml;base64,${btoa(val+"")}`;
              val= this.sanitizer.bypassSecurityTrustResourceUrl(val+"");
              observer.next(val);
            });
        }
        else{
          observer.next(value);
        }
    });
    }else{
       return Promise.resolve("null");
    }   
  }
}
