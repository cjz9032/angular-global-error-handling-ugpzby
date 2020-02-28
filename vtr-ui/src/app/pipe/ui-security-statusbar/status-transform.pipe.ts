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
						if (e.reload) {
							e.status = 'failedLoad';
						} else {
							e.status = 'loading';
						}
						break;
					case null:
						if (e.installed) {
							e.status = 'installed';
						} else {
							e.status = 'not-installed';
						}
						break;
				}
			});
			return value;
		}
		return [];
	}

}
