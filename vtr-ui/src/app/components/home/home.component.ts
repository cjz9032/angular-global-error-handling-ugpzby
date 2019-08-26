import { DeviceService } from 'src/app/services/device/device.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { DashboardLocalStorageKey } from 'src/app/enums/dashboard-local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { DeviceInfo } from 'src/app/data-models/common/device-info.model';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { TranslationNotification } from 'src/app/data-models/translation/translation';

@Component({
	selector: 'vtr-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	private deviceInfo: DeviceInfo;
	constructor(
		public deviceService: DeviceService,
		private router: Router,
		private logger: LoggerService,
		private languageService: LanguageService,
		private commonService: CommonService
	) {
	}

	ngOnInit() {
		try {
			this.commonService.notification.subscribe((notification: AppNotification) => {
				this.onNotification(notification);
			});

			if (this.deviceService.isShellAvailable) {
				const cachedDeviceInfo: DeviceInfo = this.commonService.getLocalStorageValue(DashboardLocalStorageKey.DeviceInfo, undefined);

				// if deviceInfo is available then load from cache else invoke JS bridge
				if (cachedDeviceInfo && cachedDeviceInfo.locale) {
					this.deviceInfo = cachedDeviceInfo;
					this.languageService.useLanguageByLocale(cachedDeviceInfo.locale);

				} else {
					// if cache not found or first run
					this.deviceService.getMachineInfo().then(info => {
						this.deviceInfo = { isGamingDevice: info.isGaming, locale: info.locale };
						this.commonService.setLocalStorageValue(DashboardLocalStorageKey.DeviceInfo, this.deviceInfo);
						this.languageService.useLanguageByLocale(info.locale);
					});
				}
			} else {
				// for browser
				this.setLocaleAndDevice(undefined);
			}
		} catch (err) {
			this.logger.error(`ERROR in ngOnInit() of home.component`, err);
		}
	}

	private setLocaleAndDevice(deviceInfo: DeviceInfo) {
		if (deviceInfo) {
			this.languageService.useLanguageByLocale(deviceInfo.locale);
			this.vantageLaunch(deviceInfo.isGamingDevice);
		} else {
			// for browser, load english language
			this.languageService.useLanguage();
			this.vantageLaunch(false);
		}
	}

	private vantageLaunch(isGaming: boolean) {
		try {
			if (isGaming) {
				this.router.navigate(['/device-gaming']);
			} else {
				this.router.navigate(['/dashboard']);
			}
		} catch (err) {
			this.logger.error(`ERROR in vantageLaunch() of home.component`, err);
		}
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case TranslationNotification.TranslationLoaded:
					this.logger.error(`HomeComponent.onNotification`, notification);
					this.vantageLaunch(this.deviceInfo.isGamingDevice);
					break;
				default:
					break;
			}
		}
	}
}
