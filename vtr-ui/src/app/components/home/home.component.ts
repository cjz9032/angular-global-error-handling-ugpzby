import { DeviceService } from 'src/app/services/device/device.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { DashboardLocalStorageKey } from 'src/app/enums/dashboard-local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { DeviceInfo } from 'src/app/data-models/common/device-info.model';

@Component({
	selector: 'vtr-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

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
			if (this.deviceService.isShellAvailable) {
				const cachedDeviceInfo: DeviceInfo = this.commonService.getLocalStorageValue(DashboardLocalStorageKey.DeviceInfo, undefined);

				// if deviceInfo is available then load from cache else invoke JS bridge
				if (cachedDeviceInfo && cachedDeviceInfo.locale) {
					this.setLocaleAndDevice(cachedDeviceInfo);
				} else {
					this.deviceService.getMachineInfo().then(info => {
						const deviceInfo: DeviceInfo = { isGamingDevice: info.isGaming, locale: info.locale };
						this.commonService.setLocalStorageValue(DashboardLocalStorageKey.DeviceInfo, deviceInfo);
						this.setLocaleAndDevice(deviceInfo);
					});
				}
			} else {
				// for browser
				this.setLocaleAndDevice(undefined);
			}
		} catch (error) {
			this.logger.error(`ERROR in ngOnInit() of home.component`, error.message);
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

	public vantageLaunch(isGaming: boolean) {
		try {
			if (isGaming) {
				this.router.navigate(['/device-gaming']);
			} else {
				this.router.navigate(['/dashboard']);
			}
		} catch (error) {
			this.logger.error(`ERROR in vantageLaunch() of home.component`, error.message);
		}
	}
}
