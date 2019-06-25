import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'cursorType'
})
export class CursorTypePipe implements PipeTransform {

	transform(value): any {
		if (value.text === 'homeSecurity.inTrial') {
			return '';
		} else {
			return  value.status === 'disabled' ? '' : 'badge-item';
		}
	}

}
