import { Pipe, PipeTransform } from '@angular/core';
import { Status } from 'src/app/data-models/widgets/status.model';

@Pipe({
	name: 'detailAndIconClass',
})
export class DetailAndIconClassPipe implements PipeTransform {
	transform(value: Status): string {
		const classes = [];
		switch (value.status) {
			case 'enabled':
				classes.push('good');
				break;
			case 'disabled':
				classes.push('bad');
				break;
			case 'partially':
				classes.push('orange');
				break;
			case 'installState':
				classes.push('black');
				break;
			case 'pause':
				classes.push('pause');
				break;
			case 'needAttention':
				classes.push('bad');
				break;
			case 'scanning':
				classes.push('text-blue');
				break;
			case 'loading':
				classes.push('text-gray');
				break;
			case 'loadFailed':
				classes.push('text-dark');
				break;
			default:
				classes.push('text-gray');
				break;
		}
		switch (value.type) {
			case 'system':
				classes.push('system');
				break;
			case 'security':
				classes.push('uppercase');
				break;
			default:
				classes.push('uppercase');
				break;
		}

		switch (value.asLink) {
			case true:
				classes.push('highlight');
				break;
			default:
				break;
		}

		return classes.toString().replace(new RegExp(',', 'gm'), ' ');
	}
}
