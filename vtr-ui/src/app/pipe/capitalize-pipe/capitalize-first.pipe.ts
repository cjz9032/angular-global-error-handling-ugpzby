import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'capitalizeFirst',
	pure: true,
})
export class CapitalizeFirstPipe implements PipeTransform {
	transform(value: any, args?: any): any {
		if (value === null || value.length === 0) {
			return '';
		}
		return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
	}
}
