import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'joinClass',
})
export class JoinclassPipe implements PipeTransform {
	transform(value: boolean): any {
		if (value) {
			return 'joinfailed';
		} else {
			return '';
		}
	}
}
