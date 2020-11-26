import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'subTransform',
})
export class SubTransformPipe implements PipeTransform {
	transform(value: any): any {
		switch (value) {
			case 'licenseActive':
				return 'security.antivirus.mcafee.license';
			case 'licenseExpired':
				return 'security.antivirus.mcafee.license';
			case 'trialExpired':
				return 'security.antivirus.mcafee.trial';
			case 'trialActive':
				return 'security.antivirus.mcafee.trial';
			case 'trialInactive':
				return 'security.antivirus.mcafee.trial';
		}
	}
}
