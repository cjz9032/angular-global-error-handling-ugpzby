import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
	name: 'separatePascalCase',
	pure: true,
})
export class SeparatePascalCasePipe implements PipeTransform {
	constructor(private translate: TranslateService) {}
	transform(value: any, args?: any): any {
		// let pascalCaseString = value.match(/[A-Z][a-z]+|[0-9]+/g).join(' ');
		return this.translate.instant(
			'device.deviceSettings.audio.microphone.optimize.options.' + value
		);
	}
}
