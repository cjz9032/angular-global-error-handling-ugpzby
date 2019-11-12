import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

	transform(value: any, ...args: any[]): any {
		const date = new Date(value);
		const mm = date.getMonth() + 1; // getMonth() is zero-based
		const dd = date.getDate();

		return [
			date.getFullYear(),
			'/', (mm > 9 ? '' : '0') + mm,
			'/', (dd > 9 ? '' : '0') + dd
		].join('');
	}

}
