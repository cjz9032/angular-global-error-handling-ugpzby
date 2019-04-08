import { Pipe, PipeTransform } from '@angular/core';

@Pipe({	name: 'wifiClass' })
export class WifiClassPipe implements PipeTransform {
	transform(value: any): any {
		let className;
		if (value && value.length !== 0) {
			value.forEach(item => {
				if (item.path === 'security/wifi-security' && item.status === 0 && !item.circle) {
					className = 'wifiStatus-no-border-bottom';
				} else {
					className = '';
				}
			});
		}
		return className;
	}
}
