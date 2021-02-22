import { Injectable } from '@angular/core';
import { Router, NavigationEnd, UrlTree, NavigationCancel } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PageRoute } from 'src/app/data-models/history-manager/page-route-model';
import { Subscription } from 'rxjs';
import { GuardConstants } from '../guard/guard-constants';
import { RoutePath } from 'src/assets/menu/menu';

@Injectable({
	providedIn: 'root',
})
export class HistoryManager {
	history: Array<PageRoute>;
	currentRoute: PageRoute;
	backRoute: PageRoute;
	subscription: Subscription;

	constructor(private router: Router, public guardConstants: GuardConstants) {
		this.history = [];
		this.subscription = this.router.events
			.pipe(
				filter(
					(event) => event instanceof NavigationEnd || event instanceof NavigationCancel
				)
			)
			.subscribe((event: NavigationEnd | NavigationCancel) => {
				if (event instanceof NavigationEnd) {
					if (this.isBack(event.urlAfterRedirects)) {
						this.currentRoute = this.backRoute;
						this.backRoute = null;
					} else {
						const currentNavigation = this.router.getCurrentNavigation();
						const previousNavigation = currentNavigation
							? currentNavigation.previousNavigation
							: null;
						const skipPreviousUrl =
							previousNavigation &&
							previousNavigation.extras &&
							previousNavigation.extras.skipLocationChange;
						const replaceUrl =
							currentNavigation &&
							currentNavigation.extras &&
							currentNavigation.extras.replaceUrl;

						const newPage = new PageRoute(event.url, event.urlAfterRedirects);

						if (
							this.currentRoute &&
							!skipPreviousUrl &&
							!replaceUrl &&
							!this.isSearchRouteDuplicated(newPage)
						) {
							this.history.push(this.currentRoute);
						}

						this.currentRoute = newPage;
					}
				} else if (event instanceof NavigationCancel && this.isBack(event.url)) {
					this.goBack();
				}
			});
	}

	goBack() {
		this.backRoute = this.history.pop();
		if (this.backRoute) {
			this.router.navigateByUrl(this.backRoute.finalPath);
		} else {
			this.router.navigateByUrl('/');
		}
	}

	isSearchRouteDuplicated(newPage: PageRoute): boolean {
		return (
			newPage?.finalPath?.indexOf(`/${RoutePath.search}`) !== -1 &&
			this.currentRoute?.finalPath?.indexOf(`/${RoutePath.search}`) !== -1
		);
	}

	isBack(url: string): boolean {
		if (!this.backRoute) {
			return false;
		}
		return this.backRoute.finalPath === url;
	}
}
