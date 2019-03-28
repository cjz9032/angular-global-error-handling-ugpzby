import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'dayFormat'
})
export class DayFormatPipe implements PipeTransform {

	transform(date: Date, args?: any): any {
		if (date) {
			const year = date.getFullYear();
			let month: any = date.getMonth() + 1;
			let day: any = date.getDate();
			if (month >= 1 && month <= 9) {
				month = `0${month}`;
			}
			if (day >= 0 && day <= 9) {
				day = `0${day}`;
			}
			const currentdate = day + '/' + month + '/' + year;
			return currentdate;
		}
		return '';

	}
}
