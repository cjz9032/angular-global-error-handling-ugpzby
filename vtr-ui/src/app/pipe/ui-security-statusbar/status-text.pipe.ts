import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusText' })
export class StatusTextPipe implements PipeTransform {
	transform(value: string): string {
		return value.replace(/-/g, ' ');
	}
}