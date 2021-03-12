import { Pipe, PipeTransform } from '@angular/core';
import { FormatLocaleDateTimePipe } from '../format-locale-datetime/format-locale-datetime.pipe';
import { TranslateDefaultValueIfNotFoundPipe } from '../translate-default-value-if-not-found/translate-default-value-if-not-found.pipe';

@Pipe({
	name: 'formatIfDateTimeOrTranslateDefault',
})
export class FormatIfDatetimeOrTranslateDefaultPipe implements PipeTransform {
	private dateTimeRegex: RegExp;

	constructor(
		private formatLocaleDateTimePipe: FormatLocaleDateTimePipe,
		private translateDefaultValueIfNotFoundPipe: TranslateDefaultValueIfNotFoundPipe
	) {
		// datetime in format mm/dd/yyyy hh:mm:ss
		this.dateTimeRegex = new RegExp('^\\d{2}/\\d{2}/\\d{4}\\ \\d{2}:\\d{2}:\\d{2}$');
	}

	transform(value: string, defaultValue = ''): any {
		if (this.dateTimeRegex.test(value)) {
			return this.formatLocaleDateTimePipe.transform(value + ' UTC');
		} else {
			return this.translateDefaultValueIfNotFoundPipe.transform(value, defaultValue);
		}
	}
}
