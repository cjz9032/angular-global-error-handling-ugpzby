import { DeviceService } from 'src/app/services/device/device.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DeviceInfo } from 'src/app/data-models/common/device-info.model';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { TranslationNotification } from 'src/app/data-models/translation/translation';
import { Subscription, EMPTY } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

@Component({
	selector: 'vtr-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
	private subscription: Subscription;
	private redirectToUrl: string;

	constructor(
		public deviceService: DeviceService,
		private router: Router,
		private logger: LoggerService,
		private languageService: LanguageService,
		private commonService: CommonService,
		private localCacheService: LocalCacheService,
		private route: ActivatedRoute
	) {
		this.route.queryParams
			.pipe(filter(params => params.redirectTo))
			.subscribe((param) => {
				this.logger.debug('HomeComponent: redirect url', param);
				this.redirectToUrl = param.redirectTo;
			});
	}

	ngOnInit() {
		this.logger.info(`HomeComponent.ngOnInit`);
		try {
			this.subscription = this.commonService.notification.subscribe((notification: AppNotification) => {
				this.onNotification(notification);
			});

			if (this.deviceService.isShellAvailable) {
				const isLanguageLoaded = this.languageService.isLanguageLoaded;
				this.logger.info(`HomeComponent.ngOnInit is language loaded ${isLanguageLoaded}`);
				if (isLanguageLoaded) {
					this.redirectToPage();
				}
				if (!this.redirectToUrl && isLanguageLoaded) {
					this.redirectToDashBoard();
				}
			} else {
				// for browser
				this.languageService.useLanguage();
				this.vantageLaunch(false);
			}
		} catch (error) {
			this.logger.error(`HomeComponent.ngOnInit`, error.message);
			return EMPTY;
		}

	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	private vantageLaunch(isGaming: boolean) {
		this.logger.info(`HomeComponent.vantageLaunch isGamingDevice: `, isGaming);
		this.route.queryParams.subscribe(params => {
			try {
				this.router.navigate(isGaming ? ['/device-gaming'] : ['/dashboard'], {
					queryParams: params
				});
			} catch (error) {
				this.logger.error(`HomeComponent.vantageLaunch`, error.message);
				return EMPTY;
			}
		});
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case TranslationNotification.TranslationLoaded:
					if (this.redirectToUrl) {
						this.logger.info(`HomeComponent.onNotification redirecting to`, this.redirectToUrl);
						this.redirectToPage();
					} else {
						this.logger.info(`HomeComponent.onNotification`, notification);
						this.redirectToDashBoard();
					}
					break;
				default:
					break;
			}
		}
	}

	private redirectToDashBoard() {
		const cachedDeviceInfo: DeviceInfo = this.localCacheService.getLocalCacheValue(LocalStorageKey.DeviceInfo, undefined);
		if (cachedDeviceInfo) {
			this.vantageLaunch(cachedDeviceInfo.isGamingDevice);
		} else {
			this.deviceService.getMachineInfo().then((machineInfo) => {
				if (machineInfo) {
					this.vantageLaunch(machineInfo.isGaming);
				} else {
					this.vantageLaunch(false);
				}
			});
		}
	}

	private redirectToPage() {
		if (this.redirectToUrl) {
			window.history.replaceState([], '', '');
			this.router.navigateByUrl(this.redirectToUrl);
		}
	}
}
