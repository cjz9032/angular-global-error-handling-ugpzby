import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusText' })
export class StatusTextPipe implements PipeTransform {
	transform(value: any): string {
		if (value) {
			return value.replace(/-/g, ' ').toUpperCase();
		}
		return '';
	}
}
