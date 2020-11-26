import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'successClass',
})
export class SuccessClassPipe implements PipeTransform {
	transform(value: boolean): any {
		if (value) {
			return 'd-none';
		} else {
			return '';
		}
	}
}
