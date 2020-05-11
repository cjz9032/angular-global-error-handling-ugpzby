import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'formatUTCDate'
})
export class FormatUTCDatePipe implements PipeTransform {

	transform(value: any, ...args: any[]): any {
		const date = new Date(value);
		return date.toLocaleDateString();
	}

}
