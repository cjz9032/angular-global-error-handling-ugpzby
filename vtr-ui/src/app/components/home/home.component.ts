import { DeviceService } from 'src/app/services/device/device.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LanguageService } from 'src/app/services/language/language.service';

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
		private languageService: LanguageService
	) {
	}

	ngOnInit() {
		if (this.deviceService.isShellAvailable) {
			this.deviceService.getMachineInfo().then(info => {
				this.languageService.useLanguageByLocale(info.locale);
				this.vantageLaunch(info);
			});
		} else {
			// for browser, load english language
			this.languageService.useLanguage();
			this.vantageLaunch(undefined);
		}
	}

	/**
	 * will launch the application based on the machine info
	 * @param info: The machine info object.
	 */
	public vantageLaunch(info: any) {
		try {
			const routeParam = { isMachineInfoLoaded: true };
			if (info && info.isGaming) {
				this.router.navigate(['/device-gaming', routeParam]);
			} else {
				this.router.navigate(['/dashboard', routeParam]);
			}
		} catch (err) {
			this.logger.error(`ERROR in vantageLaunch() of home.component`, err);
		}
	}
}
