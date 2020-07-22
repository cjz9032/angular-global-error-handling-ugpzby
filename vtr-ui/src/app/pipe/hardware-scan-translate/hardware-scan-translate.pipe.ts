import { Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Pipe({
	name: 'hardwareScanTranslate'
})
export class HardwareScanTranslatePipe implements PipeTransform {

	constructor(private translatePipe: TranslatePipe) {	}

	transform(value: string, defaultValue = ''): string {
		const translated = this.translatePipe.transform(value);
		return translated ? translated : defaultValue;
	}
}
