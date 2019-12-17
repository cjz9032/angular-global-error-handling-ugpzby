import { Injectable } from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { LoggerService } from './logger/logger.service';

@Injectable({
	providedIn: 'root'
})
export class SettingsService {

	toggleAppFeature = false;
	toggleMarketing = false;
	toggleActionTriggered = false;
	toggleUsageStatistics = false;
	toggleDeviceStatistics = false;

	isMessageSettings = false;
	isDeviceStatisticsSupported = false;

	preferenceSettings: any;
	metricsPreference: any;

	valueToBoolean = [false, true, false];

	constructor(
		private shellService: VantageShellService,
		private loggerService: LoggerService
	) {
		this.preferenceSettings = this.shellService.getPreferenceSettings();
		this.metricsPreference = this.shellService.getMetricPreferencePlugin();
	}

	getPreferenceSettingsValue() {
		if (this.preferenceSettings) {
			try {
				this.preferenceSettings.getMessagingPreference('en').then((messageSettings: any) => {
					if (messageSettings) {
						this.toggleAppFeature = this.getMassageStettingValue(messageSettings, 'AppFeatures');
						this.toggleMarketing = this.getMassageStettingValue(messageSettings, 'Marketing');
						this.toggleActionTriggered = this.getMassageStettingValue(messageSettings, 'ActionTriggered');
						this.isMessageSettings = true;
					}
				}).catch((error) => {
					console.error('getMessagingPreference failed for exception, will hide the messages setting.', error);
					this.isMessageSettings = false;
				});
			} catch (error) {
				this.loggerService.exception('SettingsService.getPreferenceSettingsValue exception', error);
			}
		}
		if (this.metricsPreference) {
			this.metricsPreference.getAppMetricCollectionSetting('en', 'com.lenovo.LDI').then((response) => {
				if (response && response.app && response.app.metricCollectionState === 'On') {
					this.toggleDeviceStatistics = true;
					this.isDeviceStatisticsSupported = true;
				} else if (response && response.app && response.app.metricCollectionState === 'Off') {
					this.toggleDeviceStatistics = false;
					this.isDeviceStatisticsSupported = true;
				} else {
					this.isDeviceStatisticsSupported = false;
				}
			});
		}
	}

	getMassageStettingValue(messageSettings: Array<any>, id: string) {
		return this.valueToBoolean[messageSettings.find(mss => mss.id === id).settingValue];
	}


}
