import { Injectable } from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root'
})
export class SettingsService {

	toggleAppFeature = false;
	toggleMarketing = false;
	toggleActionTriggered = false;
	toggleUsageStatistics = false;

	isMessageSettings = false;

	preferenceSettings: any;

	valueToBoolean = [false, true, false];

	constructor(
		private shellService: VantageShellService,
	) {
		this.preferenceSettings = this.shellService.getPreferenceSettings();
	}

	getPreferenceSettingsValue() {
		if (this.preferenceSettings) {
			this.preferenceSettings.getMessagingPreference('en').then((messageSettings: any) => {
				if (messageSettings) {
					this.toggleAppFeature = this.getMassageStettingValue(messageSettings, 'AppFeatures');
					this.toggleMarketing = this.getMassageStettingValue(messageSettings, 'Marketing');
					this.toggleActionTriggered = this.getMassageStettingValue(messageSettings, 'ActionTriggered');
					this.isMessageSettings = true;
				}
			});
		}
	}

	getMassageStettingValue(messageSettings: Array<any>, id: string) {
		return this.valueToBoolean[messageSettings.find(mss => mss.id === id).settingValue];
	}


}
