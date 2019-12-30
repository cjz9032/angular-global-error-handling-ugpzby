import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'htmlText'
})
export class HtmlTextPipe implements PipeTransform {

	transform(value: any, ...args: any[]): any {
		let text = value;
		const div = document.createElement('div');
		div.innerHTML = value;
		if (div && div.innerText) {
			text = div.innerText;
		}
		return text;
	}

}
