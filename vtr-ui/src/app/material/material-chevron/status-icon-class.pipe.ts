import { Pipe, PipeTransform } from '@angular/core';
import { StatusIconType } from './material-status-icon/material-status-icon.component';

@Pipe({
	name: 'statusIconClass',
})
export class StatusIconClassPipe implements PipeTransform {
	transform(value: StatusIconType): string {
		switch (value) {
			case 'enabled':
				return 'good';
			case 'disabled':
				return 'bad';
			case 'partially':
				return 'orange';
			case 'installState':
				return 'black';
			case 'pause':
				return 'pause';
			case 'needAttention':
				return 'bad';
			case 'scanning':
				return 'text-blue';
			case 'loading':
				return 'text-dark';
			default:
				return 'text-dark';
		}
	}
}
