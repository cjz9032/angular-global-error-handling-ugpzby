import { Pipe, PipeTransform } from '@angular/core';

@Pipe({	name: 'wifiClass' })
export class WifiClassPipe implements PipeTransform {
	transform(value: any): any {
		let className;
		if (value && value.length !== 0) {
			value.forEach(item => {
				if (item.title === 'common.securityAdvisor.wifi' && item.status === 0) {
					className = 'wifiStatus-no-border-bottom';
				} else {
					className = '';
				}
			});
		}
		return className;
	}
}
