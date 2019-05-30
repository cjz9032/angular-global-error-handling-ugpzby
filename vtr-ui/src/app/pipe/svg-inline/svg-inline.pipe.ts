import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser'

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
              var type = request.getResponseHeader('Content-Type');
                resovle(request.responseText);
          }
      }
    });
  }

  transform(value: any, args?: any): any {
    if (typeof(value) != 'undefined') {
      return new Promise(resolve=>{
        if(value.substring(value.lastIndexOf('.'))==='.svg'){
          this.getContent(value).then(val=>
            {
              val=`data:image/svg+xml;base64,${btoa(val+"")}`;
              val= this.sanitizer.bypassSecurityTrustResourceUrl(val+"");
              resolve(val);
            });
        }
        else{
          resolve(value);
        }
      });
    }else{
       return Promise.resolve("null");
    }   
  }
}
