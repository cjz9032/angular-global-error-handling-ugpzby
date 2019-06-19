import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'cursorType'
})
export class CursorTypePipe implements PipeTransform {

	transform(value): any {
		if (value.text === 'homeSecurity.inTrial') {
			return 'badge-item-click';
		} else {
			return  value.status === 'disabled' ? 'badge-item-click' : 'badge-item';
		}
	}

}
