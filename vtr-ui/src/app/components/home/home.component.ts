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
				this.languageService.useLanguage(info);
				this.vantageLaunch(info);
			});
		} else {
			// for browser load english language
			this.languageService.useEnglish();
			this.vantageLaunch(undefined);
		}
	}

	/**
	  * @param info: The machine info object.
	  * @summary will launch the application based on the machine info
	  */
	public vantageLaunch(info: any) {
		try {
			if (info && info.isGaming) {
				this.router.navigate(['/device-gaming']);
			} else {
				this.router.navigate(['/dashboard']);
			}
		} catch (err) {
			this.logger.error(`ERROR in vantageLaunch() of home.component`, err);
		}
	}
}
