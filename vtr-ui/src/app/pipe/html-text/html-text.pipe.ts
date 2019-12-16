import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'htmlText'
})
export class HtmlTextPipe implements PipeTransform {

	transform(value: any, ...args: any[]): any {
		return value.replace(/<[^>]*>|/g, '');
	}

}
