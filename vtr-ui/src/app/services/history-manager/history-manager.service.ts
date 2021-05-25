import { ContainerAppSendMessageType } from '../communication/app-message-type';
import { ContainerAppSendHandler } from '../communication/container-app-send.handler';
import { subAppConfigList } from 'src/sub-app-config/sub-app-config';
import { ISubAppConfig } from 'src/sub-app-config/sub-app-config-base';
import { Injectable } from '@angular/core';
import { Router, NavigationEnd, UrlTree, NavigationCancel } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PageRoute } from 'src/app/data-models/history-manager/page-route-model';
import { Subscription } from 'rxjs';
import { GuardConstants } from '../guard/guard-constants';
import { RoutePath } from 'src/assets/menu/menu';
import { Location } from '@angular/common';

@Injectable({
	providedIn: 'root',
})
export class HistoryManager {
	currentSubAppConfig: ISubAppConfig;
	backSubAppConfig: ISubAppConfig;
	history: Array<PageRoute>;
	currentRoute: PageRoute;
	backRoute: PageRoute;
	subscription: Subscription;

	constructor(
		private containerAppSendHandler: ContainerAppSendHandler,
		private router: Router,
		public guardConstants: GuardConstants,
		private location: Location
	) {
		this.history = [];
		this.location.onUrlChange((url: string, state: any) => {
			if (state) {
				return;
			}

			const path = url?.substring(url?.indexOf('/'));

			if (path && this.currentRoute?.finalPath.startsWith(path)) {
				this.currentRoute = new PageRoute(path);
			}
		});
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
						this.currentSubAppConfig = this.backSubAppConfig;
						this.backRoute = null;
						this.backSubAppConfig = undefined;
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
						const newSubAppConfig = subAppConfigList.find((subAppConfig) => {
							for (const entryUrl of subAppConfig.entryUrls) {
								if (newPage.finalPath.includes(entryUrl)) {
									return true;
								}
							}
						});
						if (
							this.currentSubAppConfig !== undefined &&
							this.currentSubAppConfig !== newSubAppConfig
						) {
							this.containerAppSendHandler.handle(
								this.currentSubAppConfig,
								ContainerAppSendMessageType.goToTransitionPage,
								null
							);
						}

						if (
							this.currentRoute &&
							!skipPreviousUrl &&
							!replaceUrl &&
							!this.isSearchRouteDuplicated(newPage)
						) {
							this.history.push(this.currentRoute);
						}

						this.currentRoute = newPage;
						this.currentSubAppConfig = newSubAppConfig;
					}
				} else if (event instanceof NavigationCancel && this.isBack(event.url)) {
					this.goBack();
				}
			});
	}

	goBack() {
		this.backRoute = this.history.pop();
		if (this.backRoute) {
			this.backSubAppConfig = subAppConfigList.find((subAppConfig) => {
				for (const entryUrl of subAppConfig.entryUrls) {
					if (this.backRoute.finalPath.includes(entryUrl)) {
						return true;
					}
				}
			});
			if (
				this.currentSubAppConfig !== undefined &&
				this.currentSubAppConfig !== this.backSubAppConfig
			) {
				this.containerAppSendHandler.handle(
					this.currentSubAppConfig,
					ContainerAppSendMessageType.goToTransitionPage,
					null
				);
			}
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
