import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'formatLocaleDate'
})
export class FormatLocaleDatePipe implements PipeTransform {

	transform(value: any, ...args: any[]): any {
		const date = new Date(value);
		return date.toLocaleDateString();
	}

}
