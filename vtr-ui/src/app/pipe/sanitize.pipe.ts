import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; //sahinul-25Jun2019 for VAN-5719

@Pipe({
	name: 'sanitize'
})
export class SanitizePipe implements PipeTransform {

	constructor(protected sanitizer: DomSanitizer) { }

	public transform(value: any, type: string): string | SafeHtml {
		switch (type) {
			case 'html':
				return this.sanitizer.sanitize(SecurityContext.HTML, value);
			case 'style':
				return this.sanitizer.sanitize(SecurityContext.STYLE, value);
			case 'script':
				return this.sanitizer.sanitize(SecurityContext.SCRIPT, value);
			case 'url':
				return this.sanitizer.sanitize(SecurityContext.URL, value);
			case 'resourceUrl':
				return this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, value);
			case 'bypasshtml':	
				//sahinul-25Jun2019 for VAN-5719
				return this.sanitizer.bypassSecurityTrustHtml(value);
			default:
				throw new Error(`Invalid safe type specified: ${type}`);
		}
	}
}

