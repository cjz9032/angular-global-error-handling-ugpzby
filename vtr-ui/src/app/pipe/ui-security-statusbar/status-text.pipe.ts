import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusText' })
export class StatusTextPipe implements PipeTransform {
	transform(value: any): string {
		switch (value) {
			case 'enabled':
				return 'common.security-advisor.enabled';
			case 'disabled':
				return 'common.security-advisor.disabled';
			case 'installed':
				return 'common.security-advisor.installed';
			case 'not-installed':
				return 'common.security-advisor.not-installed';
		}
	}
}
