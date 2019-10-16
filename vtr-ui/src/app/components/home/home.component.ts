import { DeviceService } from 'src/app/services/device/device.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { DashboardLocalStorageKey } from 'src/app/enums/dashboard-local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { DeviceInfo } from 'src/app/data-models/common/device-info.model';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { TranslationNotification } from 'src/app/data-models/translation/translation';
import { Subscription } from 'rxjs/internal/Subscription';
import { EMPTY } from 'rxjs/internal/observable/empty';


@Component({
	selector: 'vtr-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
	// private deviceInfo: DeviceInfo;
	private subscription: Subscription;
	constructor(
		public deviceService: DeviceService,
		private router: Router,
		private logger: LoggerService,
		private languageService: LanguageService,
		private commonService: CommonService
	) {
	}

	ngOnInit() {
		this.logger.info(`HomeComponent.ngOnInit`);

		try {
			this.subscription = this.commonService.notification.subscribe((notification: AppNotification) => {
				this.onNotification(notification);
			});

			if (this.deviceService.isShellAvailable) {
				this.deviceService.getMachineInfo().then((value: any) => {
					if (!this.languageService.isLanguageLoaded) {
						this.languageService.useLanguageByLocale(value.locale);
						const cachedDeviceInfo: DeviceInfo = { isGamingDevice: value.isGaming, locale: value.locale };
						// // update DeviceInfo values in case user switched language
						this.commonService.setLocalStorageValue(DashboardLocalStorageKey.DeviceInfo, cachedDeviceInfo);
					}
				});
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
		this.logger.info(`HomeComponent.vantageLaunch `, isGaming);
		try {
			if (isGaming) {
				this.router.navigate(['/device-gaming']);
			} else {
				this.router.navigate(['/dashboard']);
			}
		} catch (error) {
			this.logger.error(`HomeComponent.vantageLaunch`, error.message);
			return EMPTY;
		}
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case TranslationNotification.TranslationLoaded:
					this.logger.info(`HomeComponent.onNotification`, notification);
					const cachedDeviceInfo: DeviceInfo = this.commonService.getLocalStorageValue(DashboardLocalStorageKey.DeviceInfo, undefined);
					this.vantageLaunch(cachedDeviceInfo.isGamingDevice);
					break;
				default:
					break;
			}
		}
	}
}
