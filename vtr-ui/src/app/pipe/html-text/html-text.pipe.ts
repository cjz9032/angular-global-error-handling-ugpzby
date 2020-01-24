import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'htmlText'
})
export class HtmlTextPipe implements PipeTransform {

	transform(value: any, ...args: any[]): any {
		const div = document.createElement('div');
		div.innerHTML = value;
		return div.innerText;
	}

}
