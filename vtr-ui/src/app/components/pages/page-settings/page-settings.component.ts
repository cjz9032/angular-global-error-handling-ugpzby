import { Component, OnInit, OnDestroy } from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { SettingsService } from 'src/app/services/settings.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { DeviceService } from 'src/app/services/device/device.service';
import { TimerService } from 'src/app/services/timer/timer.service';
import { SelfSelectService } from 'src/app/services/self-select/self-select.service';

@Component({
	selector: 'vtr-page-settings',
	templateUrl: './page-settings.component.html',
	styleUrls: ['./page-settings.component.scss'],
	providers: [TimerService]
})
export class PageSettingsComponent implements OnInit, OnDestroy {

	backId = 'setting-page-btn-back';

	toggleAppFeature = false;
	toggleMarketing = false;
	toggleActionTriggered = false;
	toggleUsageStatistics = false;
	toggleDeviceStatistics = false;

	isMessageSettings = false;
	isToggleUsageStatistics = false;
	isToggleDeviceStatistics = false;
	usageRadioValue = null;

	valueToBoolean = [false, true, false];


	preferenceSettings: any;

	messageSettings = [
		{
			leftImageSource: ['fal', 'browser'],
		},
		{
			leftImageSource: ['fal', 'gift'],
		},
		{
			leftImageSource: ['fal', 'comment-alt-dots'],
		}
	];

	otherSettings = [
		{
			leftImageSource: ['fal', 'shoe-prints'],
		},
		{
			leftImageSource: ['fal', 'shoe-prints'],
		}
	];

	metrics: any;
	metricsPreference: any;
	checkedArray: string[] = [];
	userProfileEnabled = true;

	constructor(
		private shellService: VantageShellService,
		private settingsService: SettingsService,
		private commonService: CommonService,
		public deviceService: DeviceService,
		public selfSelectService: SelfSelectService,
		private timerService: TimerService
	) {
		this.preferenceSettings = this.shellService.getPreferenceSettings();
		this.metrics = shellService.getMetrics();
		this.metricsPreference = shellService.getMetricPreferencePlugin();
		shellService.getMetricsPolicy((result)=>{
			this.metrics.metricsEnabled = result;
			this.toggleUsageStatistics = this.metrics.metricsEnabled;
		});
	}

	ngOnInit() {
		this.getAllToggles();
		this.timerService.start();
		this.initializeSelfSelectConfig();
	}

	initializeSelfSelectConfig() {
		this.selfSelectService.getConfig().then((config) => {
			if (config && config.segment) {
				this.usageRadioValue = config.segment;
				switch (this.usageRadioValue) {
					case 'personal':
						document.getElementById('radioPersonal').click();
						break;
					case 'business':
						document.getElementById('radioBusiness').click();
						break;
					case 'custom':
						document.getElementById('radioCustom').click();
						break;
				}
			}
			if (config && config.customtags) {
				const checkedTags = config.customtags;
				this.checkedArray = checkedTags.split(',');
				this.selfSelectService.interests.forEach(item => {
					item.checked = checkedTags && checkedTags.includes(item.label);
				});
			}
		}).catch((error) => {
			this.userProfileEnabled = false;
		});
	}

	ngOnDestroy() {
		const pageViewMetrics = {
			ItemType: 'PageView',
			PageName: 'Page.Settings',
			PageContext: 'Preference settings page',
			PageDuration: this.timerService.stop(),
			OnlineStatus: ''
		};
		this.sendMetrics(pageViewMetrics);
	}

	getAllToggles() {
		if (this.settingsService.isMessageSettings) {
			this.toggleAppFeature = this.settingsService.toggleAppFeature;
			this.toggleMarketing = this.settingsService.toggleMarketing;
			this.toggleActionTriggered = this.settingsService.toggleActionTriggered;
			this.isMessageSettings = true;
		} else {
			this.getPreferenceSettingsValue();
		}
		if (this.metrics) {
			this.toggleUsageStatistics = this.metrics.metricsEnabled;
			this.isToggleUsageStatistics = true;
		}
		if (this.settingsService.isDeviceStatisticsSupported) {
			this.toggleDeviceStatistics = this.settingsService.toggleDeviceStatistics;
			this.isToggleDeviceStatistics = this.settingsService.isDeviceStatisticsSupported;
		} else {
			this.getDeviceStatisticsPreference();
		}
	}
	private getDeviceStatisticsPreference() {
		if (this.metricsPreference) {
			this.metricsPreference.getAppMetricCollectionSetting('en', 'com.lenovo.LDI').then((response) => {
				if (response && response.app && response.app.metricCollectionState === 'On') {
					this.toggleDeviceStatistics = true;
					this.isToggleDeviceStatistics = true;
				}
				else if (response && response.app && response.app.metricCollectionState === 'Off') {
					this.toggleDeviceStatistics = false;
					this.isToggleDeviceStatistics = true;
				}
				else {
					this.isToggleDeviceStatistics = false;
				}
			});
		}
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

	onToggleOfAppFeature(event: any) {
		this.toggleAppFeature = event.switchValue;
		this.settingsService.toggleAppFeature = event.switchValue;
		if (this.preferenceSettings) {
			const categoryList = [{
				id: 'AppFeatures',
				settingValue: event.switchValue ? 1 : 2,
			}];
			this.preferenceSettings.setMessagingPreference(categoryList).then((result: any) => {
				if (!result || result.Result !== 'Success') {
					this.toggleAppFeature = !event.switchValue;
					this.settingsService.toggleAppFeature = !event.switchValue;
				}
			});
		}
		this.sendSettingMetrics('SettingAppFeatures', event.switchValue);
	}
	onToggleOfMarketing(event: any) {
		this.toggleMarketing = event.switchValue;
		this.settingsService.toggleMarketing = event.switchValue;
		if (this.preferenceSettings) {
			const categoryList = [{
				id: 'Marketing',
				settingValue: event.switchValue ? 1 : 2,
			}];
			this.preferenceSettings.setMessagingPreference(categoryList).then((result: any) => {
				if (!result || result.Result !== 'Success') {
					this.toggleMarketing = !event.switchValue;
					this.settingsService.toggleMarketing = !event.switchValue;
				}
			});
		}
		this.sendSettingMetrics('SettingMarketing', event.switchValue);
	}
	onToggleOfActionTriggered(event: any) {
		this.toggleActionTriggered = event.switchValue;
		this.settingsService.toggleActionTriggered = event.switchValue;
		if (this.preferenceSettings) {
			const categoryList = [{
				id: 'ActionTriggered',
				settingValue: event.switchValue ? 1 : 2,
			}];
			this.preferenceSettings.setMessagingPreference(categoryList).then((result: any) => {
				if (!result || result.Result !== 'Success') {
					this.toggleActionTriggered = !event.switchValue;
					this.settingsService.toggleActionTriggered = !event.switchValue;
				}
			});
		}
		this.sendSettingMetrics('SettingActionTriggered', event.switchValue);
	}

	onToggleOfDeviceMetricStatistics(event: any) {
		this.toggleDeviceStatistics = event.switchValue;
		this.settingsService.toggleDeviceStatistics = event.switchValue;
		const expectedMetricCollectionState = this.toggleDeviceStatistics ? 'On' : 'Off';
		if (this.metricsPreference) {
			this.metricsPreference.setAppMetricCollectionSettings('en', 'com.lenovo.LDI', this.toggleDeviceStatistics).then((result: any) => {
				if (!result || !result.app || result.app.metricCollectionState !== expectedMetricCollectionState) {
					this.toggleDeviceStatistics = !event.switchValue;
					this.settingsService.toggleDeviceStatistics = !event.switchValue;
				}
			});
		}
		this.sendSettingMetrics('SettingDeviceStatistics', event.switchValue);
	}

	onToggleOfUsageStatistics(event: any) {
		this.toggleUsageStatistics = event.switchValue;
		this.settingsService.toggleUsageStatistics = event.switchValue;
		if (this.metrics) {
			this.metrics.metricsEnabled = event.switchValue;
		} else {
			this.toggleUsageStatistics = !event.switchValue;
			this.settingsService.toggleUsageStatistics = !event.switchValue;
		}
		const settingUpdateMetrics = {
			ItemType: 'SettingUpdate',
			SettingName: 'Accept Privacy Policy',
			SettingValue: event.switchValue ? 'Enabled' : 'Disabled',
			SettingParent: 'Page.Settings'
		};
		if (this.metrics && this.metrics.sendAsyncEx) {
			this.metrics.sendAsyncEx(settingUpdateMetrics, { forced: true });
		}
		this.commonService.setLocalStorageValue(LocalStorageKey.UserDeterminePrivacy, true);
	}

	sendMetrics(data: any) {
		if (this.metrics && this.metrics.sendAsync) {
			this.metrics.sendAsync(data);
		}
	}

	sendSettingMetrics(name: string, value: boolean) {
		const settingUpdateMetrics = {
			ItemType: 'SettingUpdate',
			SettingName: name,
			SettingValue: value ? 'Enabled' : 'Disabled',
			SettingParent: 'Page.Settings'
		};
		this.sendMetrics(settingUpdateMetrics);
	}

	onKeyPress($event) {
		if ($event.keyCode === 13) {
			$event.target.click();
		}
	}

	saveUsageType(value) {
		this.usageRadioValue = value;
	}

	toggle($event, value) {
		if ($event.target.checked) {
			this.checkedArray.push(value);
		} else {
			this.checkedArray.splice(this.checkedArray.indexOf(value), 1);
		}
	}

	saveUserProfile() {
		const config = {
			customtags: this.checkedArray.join(','),
			segment: this.usageRadioValue
		}
		this.selfSelectService.updateConfig(config);

		const usageData = {
			ItemType: 'FeatureClick',
			ItemName: 'UsageType',
			ItemValue: this.usageRadioValue,
			ItemParent: 'Page.Settings'
		};
		this.metrics.sendAsync(usageData);

		const interestMetricValue = {};
		this.checkedArray.forEach(item => {
			interestMetricValue[item] = true;
		});
		const interestData = {
			ItemType: 'FeatureClick',
			ItemName: 'Interest',
			ItemValue: interestMetricValue,
			ItemParent: 'Page.Settings'
		};
		this.metrics.sendAsync(interestData);
	}

}
