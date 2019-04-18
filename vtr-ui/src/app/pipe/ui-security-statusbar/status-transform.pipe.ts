import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'statusTransform'
})
export class StatusTransformPipe implements PipeTransform {

	transform(value: Array<any>): any {
		if (value.length > 0) {
			value.forEach(e => {
				switch (e.status) {
					case true:
						e.status = 'enabled';
						break;
					case false:
						e.status = 'disabled';
						break;
					case undefined:
						e.status = 'loading';
				}
			});
			return value;
		}
		return [];
	}

}
