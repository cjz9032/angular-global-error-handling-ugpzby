import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
	name: 'dolbyModesTranslation',
	pure: false
})
export class DolbyModesTranslationPipe implements PipeTransform {
	constructor(private translate: TranslateService) { }

	transform(value: any, args?: any): any {

		let val = value.toString().toLowerCase();
		val = val.substr(val.lastIndexOf('.') + 1);
		return this.translate.instant('device.deviceSettings.audio.audioSmartsettings.dolby.options.' + val);
	}
}
