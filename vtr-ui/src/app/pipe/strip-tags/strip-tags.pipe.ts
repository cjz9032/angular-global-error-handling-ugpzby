import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'stripTags',
})
export class StripTagsPipe implements PipeTransform {
	public transform(value: string): string {
		if (!value) {
			return value;
		}
		if (typeof value !== 'string') {
			return '';
		}
		return value.replace(/(<([^>]+)>)/gi, '');
	}
}
