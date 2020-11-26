import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'removeSpace',
})
export class RemoveSpacePipe implements PipeTransform {
	transform(value: string, args?: any): any {
		if (value && value.length > 0) {
			return value.replace(/\s/g, '');
		}
		return '';
	}
}
