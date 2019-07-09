import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'daysInterval' })
export class DaysIntervalPipe implements PipeTransform {
	transform(start: Date, end: Date): number {
		const oneDay = 86400000;
		return Math.ceil((start.getTime() - end.getTime()) / oneDay);
	}
}
