import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
	name: 'htmlText'
})
export class HtmlTextPipe implements PipeTransform {

	constructor( private sanitizer: DomSanitizer ){}

	transform(value: any, ...args: any[]): any {
		const div = document.createElement('div');
		div.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, value).toString();
		return div.innerText;
	}
}
