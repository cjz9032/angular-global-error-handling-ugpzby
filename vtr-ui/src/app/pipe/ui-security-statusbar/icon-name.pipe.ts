import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'iconName' })
export class IconNamePipe implements PipeTransform {
	transform(value: string): Array<string> {
		switch (value) {
			case 'enabled':
				return ['fas', 'check'];
			case 'installed':
				return ['fas'];
			case 'disabled':
				return ['fas', 'times'];
			case 'not-installed':
				return ['fas', 'times'];
			case 'protected':
				return ['fas', 'check'];
			case 'not-protected':
				return ['fas', 'times'];
		}
	}
}
