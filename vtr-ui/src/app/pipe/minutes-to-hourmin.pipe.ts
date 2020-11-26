import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
	name: 'minutesToHourmin',
})
export class MinutesToHourminPipe implements PipeTransform {
	constructor(private translate: TranslateService) {}

	transform(value: any, args?: any): any {
		const totalMin = value;
		const hours = Math.trunc(totalMin / 60);
		const minutes = Math.trunc(totalMin % 60);
		if (value === undefined) {
			return undefined;
		}
		/* if (Number.isNaN(minutes)) {
			return "0 minutes";
		}

		const hoursStr = hours > 0 && hours < 2 ? 'hour' : 'hours';
		const minutesStr = minutes > 0 && minutes < 2 ? 'minute' : 'minutes'; */
		if (Number.isNaN(minutes)) {
			return '0 ' + this.getTranslation('device.deviceSettings.batteryGauge.minutes');
		}

		const hoursStr =
			hours > 0 && hours < 2
				? this.getTranslation('device.deviceSettings.batteryGauge.hour')
				: this.getTranslation('device.deviceSettings.batteryGauge.hours');

		const minutesStr =
			minutes > 0 && minutes < 2
				? this.getTranslation('device.deviceSettings.batteryGauge.minute')
				: this.getTranslation('device.deviceSettings.batteryGauge.minutes');

		if (hours === 0) {
			return `${minutes} ${minutesStr}`;
		}
		return `${hours} ${hoursStr} ${minutes} ${minutesStr}`;
	}

	getTranslation(text: string) {
		let translation;
		this.translate.get(text).subscribe((res: string) => {
			translation = res;
		});
		return translation;
	}
}
