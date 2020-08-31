import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
	name: 'sanitize'
})
export class SanitizePipe implements PipeTransform {

	constructor(protected sanitizer: DomSanitizer) { }

	public transform(value: any, type: string): string | SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
		switch (type) {
			case 'html':
				return this.sanitizer.bypassSecurityTrustHtml(
					this.sanitizer.sanitize(SecurityContext.HTML, value)
				);
			case 'style':
				return this.sanitizer.bypassSecurityTrustStyle(
					this.sanitizer.sanitize(SecurityContext.STYLE, value)
				);
			case 'url':
				return this.sanitizer.bypassSecurityTrustUrl(
					this.sanitizer.sanitize(SecurityContext.URL, value)
				);
			case 'resourceUrl':
				return this.sanitizer.bypassSecurityTrustResourceUrl(value);
			default:
				throw new Error(`Invalid safe type specified: ${type}`);
		}
	}
}
