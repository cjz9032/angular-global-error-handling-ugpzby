import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'formatUTCDate'
})
export class FormatUTCDatePipe implements PipeTransform {

	transform(value: any, ...args: any[]): any {
		const date = new Date(value);
		const mm = date.getUTCMonth() + 1; // getMonth() is zero-based
		const dd = date.getUTCDate();

		return [
			date.getUTCFullYear(),
			'/', (mm > 9 ? '' : '0') + mm,
			'/', (dd > 9 ? '' : '0') + dd
		].join('');
	}

}
