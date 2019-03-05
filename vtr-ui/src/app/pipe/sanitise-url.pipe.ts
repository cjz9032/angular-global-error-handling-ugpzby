import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
	name: 'sanitiseUrl'
})
export class SanitiseUrlPipe implements PipeTransform {

	constructor(private sanitizer: DomSanitizer) { }
	/** Fix issue with unsafe when opening link from angular 7
	 * https://stackoverflow.com/questions/37432609/how-to-avoid-adding-prefix-unsafe-to-link-by-angular2
	 * */
	transform(value: any, args?: any): any {
		return this.sanitizer.bypassSecurityTrustUrl(value);
	}

}
