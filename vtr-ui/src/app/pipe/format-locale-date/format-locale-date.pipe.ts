import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'formatLocaleDate',
})
export class FormatLocaleDatePipe implements PipeTransform {
	transform(value: any, ...args: any[]): any {
		const date = new Date(value);
		return date.toLocaleDateString();
	}

	transformWithoutYear(value: any, ...args: any[]): any {
		const date = new Date(value);
		return date.toLocaleDateString(undefined, {
			day: '2-digit',
			month: '2-digit',
		});
	}
}
