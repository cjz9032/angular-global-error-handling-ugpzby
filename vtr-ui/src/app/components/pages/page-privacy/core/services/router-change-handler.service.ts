import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter, share } from 'rxjs/operators';

/**
 * This service need for get current route and subscribe when it changes.
 * It must fire current location when component first time subscribe and then get updates until unsubscribe.
 * @example
 * this.routerChangeHandler.onChange$.subscribe((currentPath) => console.log('currentPath', currentPath));
 */
@Injectable({
	providedIn: 'root'
})
export class RouterChangeHandlerService {
	constructor(private route: Router) {
		this.route.events
			.pipe(
				filter((val) => val instanceof NavigationEnd),
				share(),
			)
			.subscribe((val: NavigationEnd) => {
				this.currentRoute = this.getCurrentRoute(val.urlAfterRedirects);
				this.changeHandler$.next(this.currentRoute);
			});
	}

	private changeHandler$ = new ReplaySubject<string>(1);

	currentRoute = this.getCurrentRoute(this.route.url);

	onChange$ = this.changeHandler$.asObservable();

	private getCurrentRoute(_url: string): string {
		const urlArr: Array<string> = _url.split('/');
		let url: string = urlArr[urlArr.length - 1] || '';
		url = url.split('?')[0];
		return url;
	}
}
