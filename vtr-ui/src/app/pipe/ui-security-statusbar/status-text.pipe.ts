import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusText' })
export class StatusTextPipe implements PipeTransform {
	transform(value: any): string {
		switch (value) {
			case 'enabled':
				return 'common.securityAdvisor.enabled';
			case 'disabled':
				return 'common.securityAdvisor.disabled';
			case 'installed':
				return 'common.securityAdvisor.installed';
			case 'not-installed':
				return 'common.securityAdvisor.notInstalled';
			case 'loading':
				return 'common.securityAdvisor.loading';
			case 'installing':
				return 'common.securityAdvisor.installing';
			case 'protected':
				return 'homeSecurity.ecosystem.protected';
			case 'not-protected':
				return  'homeSecurity.ecosystem.notProtected';
			case 'failedLoad':
				return 'common.ui.failedLoad';
		}
	}
}
