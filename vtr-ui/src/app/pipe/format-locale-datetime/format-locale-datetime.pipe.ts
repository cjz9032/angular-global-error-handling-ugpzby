import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'formatLocaleDateTime',
})
export class FormatLocaleDateTimePipe implements PipeTransform {
	transform(value: any, ...args: any[]): any {
		const date = new Date(value);
		return date.toLocaleString();
	}
}
