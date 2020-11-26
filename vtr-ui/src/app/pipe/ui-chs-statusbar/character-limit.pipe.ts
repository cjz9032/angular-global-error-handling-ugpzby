import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'characterLimit',
})
export class CharacterLimitPipe implements PipeTransform {
	transform(value: string, length: number): any {
		return value.length <= length ? value : value.substring(0, length - 3) + '...';
	}
}
