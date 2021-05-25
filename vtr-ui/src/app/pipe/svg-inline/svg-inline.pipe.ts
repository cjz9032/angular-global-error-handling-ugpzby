import { Pipe, PipeTransform, OnDestroy, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from 'src/app/services/common/common.service';
import { Observable } from 'rxjs/internal/Observable';

declare var window;

@Pipe({
	name: 'svgInline',
})
export class SvgInlinePipe implements PipeTransform, OnDestroy {
	constructor(private sanitizer: DomSanitizer, private commonService: CommonService) {}

	ngOnDestroy(): void {}

	getContent(url) {
		return new Promise((resovle) => {
			url = this.sanitizer.sanitize(SecurityContext.URL, url);
			const request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.send(null);
			request.onreadystatechange = () => {
				if (request.readyState === 4 && request.status === 200) {
					resovle(request.responseText);
				}
			};
		});
	}

	transform(value: any, args?: any): any {
		if (typeof value !== 'undefined') {
			if (
				value.substring(value.lastIndexOf('.')) === '.svg' &&
				!window.location.origin.includes('127.0.0.1')
			) {
				return new Observable((observer) => {
					observer.next('');
					this.getContent(value).then((val) => {
						val = `data:image/svg+xml;base64,${btoa(val + '')}`;
						val = this.sanitizer
							.sanitize(SecurityContext.URL, val)
							.replace('unsafe:', '');
						val = this.sanitizer.bypassSecurityTrustResourceUrl(val + '');
						observer.next(val);
						observer.complete();
					});
				});
			} else {
				return new Observable((observer) => {
					observer.next(value);
					observer.complete();
				});
			}
		} else {
			return Promise.resolve('null');
		}
	}
}
