import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'objectValues',
	pure: false
})
export class ObjectValuesPipe implements PipeTransform {

	transform(obj: Object, args?: any): Array<any> {
		return Object.keys(obj).map((key) => obj[key]);
	}

}
