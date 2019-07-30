import { DeviceService } from 'src/app/services/device/device.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core/';
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
		private translate: TranslateService,
		private logger: LoggerService,
		private translation: LanguageService
	) {
	}

	ngOnInit() {
		if (this.deviceService.isShellAvailable) {
			this.deviceService.getMachineInfo().then(info => {
				const isGaming = info.isGaming;
				// MVP2 - Gaming don't need multi-language support in MVP2
				if (isGaming) {
					this.translate.use('en');
				} else {
					this.translation.useLanguage(info);
				}
				this.vantageLaunch(info);
			});
		} else {
			this.translate.use('en');
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
