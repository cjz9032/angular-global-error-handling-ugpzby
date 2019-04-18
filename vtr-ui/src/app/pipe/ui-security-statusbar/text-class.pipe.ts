import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'textClass' })
export class TextClassPipe implements PipeTransform {
	transform(value: string): string {
		switch (value) {
			case 'enabled':
				return 'badge-success';
			case 'installed':
				return 'badge-primary';
			case 'disabled':
				return 'badge-danger';
			case 'not-installed':
				return 'badge-danger';
			case 'loading':
				return 'badge-secondary';
		}
	}
}