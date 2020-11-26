import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'dateClass',
})
export class DateClassPipe implements PipeTransform {
	transform(value: Date): any {
		const nowdate = Date.now();
		if (value.valueOf() < nowdate) {
			return 'stopdate';
		}
		return 'date';
	}
}
