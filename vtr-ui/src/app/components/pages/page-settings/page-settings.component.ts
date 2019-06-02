import { Component, OnInit, OnDestroy } from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { MetricService } from 'src/app/services/metric/metric.service';

@Component({
	selector: 'vtr-page-settings',
	templateUrl: './page-settings.component.html',
	styleUrls: ['./page-settings.component.scss']
})
export class PageSettingsComponent implements OnInit, OnDestroy {

	backArrow = '< ';

	toggleAppFeature = false;
	toggleMarketing = false;
	toggleActionTriggered = false;
	toggleUsageStatistics = false;

	disabledAppFeature = true;
	disabledMarketing = true;
	disabledActionTriggered = true;

	valueToBoolean = [false, true, false];

	pageDuration: number;

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
		}
	];
	metrics: any;

	constructor(
		private shellService: VantageShellService,
	) {
		this.preferenceSettings = this.shellService.getPreferenceSettings();
		this.metrics = shellService.getMetrics();
	}

	ngOnInit() {
		this.getAllToggles();

		this.pageDuration = 0;
		setInterval(() => {
			this.pageDuration += 1;
		}, 1000);
	}

	ngOnDestroy() {
		const pageViewMetrics = {
			ItemType: 'PageView',
			PageName: 'Page.Settings',
			PageContext: 'Preference settings page',
			PageDuration: this.pageDuration,
			OnlineStatus: ''
		};
		this.metrics.sendMetrics(pageViewMetrics);
	}

	getAllToggles() {
		if (this.preferenceSettings) {
			this.preferenceSettings.getMessagingPreference('en').then((messageSettings: any) => {
				if (messageSettings) {
					this.toggleAppFeature = this.getMassageStettingValue(messageSettings, 'AppFeatures');
					this.disabledAppFeature = false;
					this.toggleMarketing = this.getMassageStettingValue(messageSettings, 'Marketing');
					this.disabledMarketing = false;
					this.toggleActionTriggered = this.getMassageStettingValue(messageSettings, 'ActionTriggered');
					this.disabledActionTriggered = false;
				}
			});
			if (this.metrics && this.metrics.metricsEnabled) {
				this.toggleUsageStatistics = this.metrics.metricsEnabled;
			}
		}
	}

	getMassageStettingValue(messageSettings: Array<any>, id: string) {
		return this.valueToBoolean[messageSettings.find(mss => mss.id === id).settingValue];
	}

	onToggleOfAppFeature(event: any) {
		this.toggleAppFeature = event.switchValue;
		if (this.preferenceSettings) {
			const categoryList = [{
				id: 'AppFeatures',
				settingValue: event.switchValue ? 1 : 2,
			}];
			this.preferenceSettings.setMessagingPreference(categoryList).then((result: any) => {
				if (!result || result.Result !== 'Success') {
					this.toggleAppFeature = !event.switchValue;
				}
			});
		}
		this.sendSettingMetrics('SettingAppFeatures', event.switchValue);
	}
	onToggleOfMarketing(event: any) {
		this.toggleMarketing = event.switchValue;
		if (this.preferenceSettings) {
			const categoryList = [{
				id: 'Marketing',
				settingValue: event.switchValue ? 1 : 2,
			}];
			this.preferenceSettings.setMessagingPreference(categoryList).then((result: any) => {
				if (!result || result.Result !== 'Success') {
					this.toggleMarketing = !event.switchValue;
				}
			});
		}
		this.sendSettingMetrics('SettingMarketing', event.switchValue);
	}
	onToggleOfActionTriggered(event: any) {
		this.toggleActionTriggered = event.switchValue;
		if (this.preferenceSettings) {
			const categoryList = [{
				id: 'ActionTriggered',
				settingValue: event.switchValue ? 1 : 2,
			}];
			this.preferenceSettings.setMessagingPreference(categoryList).then((result: any) => {
				if (!result || result.Result !== 'Success') {
					this.toggleActionTriggered = !event.switchValue;
				}
			});
		}
		this.sendSettingMetrics('SettingActionTriggered', event.switchValue);
	}
	onToggleOfUsageStatistics(event: any) {
		this.toggleUsageStatistics = event.switchValue;
		if (this.metrics && this.metrics.metricsEnabled) {
			this.metrics.metricsEnabled = event.switchValue;
		} else {
			this.metrics.metricsEnabled = !event.switchValue;
		}
		this.sendSettingMetrics('SettingUsageStatistics', event.switchValue);
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

}
