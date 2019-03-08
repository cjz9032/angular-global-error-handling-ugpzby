import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'uniqueId'
})
export class UniqueIdPipe implements PipeTransform {

	transform(value: any, args?: any): any {
		// Random number is used to have unique id of each input field
		const randomNumber = Math.floor(new Date().valueOf() * Math.random());

		return value + randomNumber;
	}

}
