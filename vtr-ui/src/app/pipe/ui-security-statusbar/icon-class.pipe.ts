import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'iconClass' })
export class IconClassPipe implements PipeTransform {
	transform(value: string): string {
		switch (value) {
			case 'enabled':
				return 'icon-check';
			case 'installed':
				return 'icon-dot';
			case 'disabled':
				return 'icon-times';
			case 'not-installed':
				return 'icon-times';
			case 'protected':
				return 'icon-check';
			case 'not-protected':
				return 'icon-times';
		}
	}
}
