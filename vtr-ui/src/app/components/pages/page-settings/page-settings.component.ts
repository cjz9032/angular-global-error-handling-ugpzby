import { Component, OnInit, OnDestroy } from '@angular/core';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { SettingsService } from 'src/app/services/settings.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { DeviceService } from 'src/app/services/device/device.service';
import { TimerService } from 'src/app/services/timer/timer.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { SelfSelectService, SegmentConst } from 'src/app/services/self-select/self-select.service';
import { BetaService, BetaStatus } from 'src/app/services/beta/beta.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { SelfSelectEvent } from 'src/app/enums/self-select.enum';
import { MenuItem } from 'src/app/enums/menuItem.enum';

@Component({
	selector: 'vtr-page-settings',
	templateUrl: './page-settings.component.html',
	styleUrls: ['./page-settings.component.scss'],
	providers: [TimerService]
})
export class PageSettingsComponent implements OnInit, OnDestroy {

	public segmentConst = SegmentConst;
	backId = 'setting-page-btn-back';

	toggleAppFeature = false;
	toggleMarketing = false;
	toggleActionTriggered = false;
	toggleUsageStatistics = false;
	toggleDeviceStatistics = false;
	toggleBetaProgram = false;

	isMessageSettings = false;
	isToggleUsageStatistics = false;
	isToggleDeviceStatistics = false;
	usageRadioValue = null;
	userSelectionChanged = false;

	valueToBoolean = [false, true, false];

	usageType = null;
	interests = [];
	preferenceSettings: any;
	segmentTag = SegmentConst.Consumer;

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

	betaSettings = [
		{
			leftImageSource: ['fal', 'flask'],
		}
	];
	metrics: any;
	metricsPreference: any;
	notificationSubscription: any;

	constructor(
		private shellService: VantageShellService,
		public configService: ConfigService,
		private settingsService: SettingsService,
		private commonService: CommonService,
		public deviceService: DeviceService,
		public selfSelectService: SelfSelectService,
		private timerService: TimerService,
		private betaService: BetaService,
		private localInfoService: LocalInfoService,
		private loggerService: LoggerService
	) {
		this.preferenceSettings = this.shellService.getPreferenceSettings();
		this.metrics = shellService.getMetrics();
		this.metricsPreference = shellService.getMetricPreferencePlugin();
		shellService.getMetricsPolicy((result) => {
			this.metrics.metricsEnabled = result;
			this.toggleUsageStatistics = this.metrics.metricsEnabled;
		});
	}

	ngOnInit() {
		this.getSegment();
		this.getAllToggles();
		this.timerService.start();
		this.getSelfSelectStatus();
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
	}

	onNotification(response: AppNotification) {
		const { type, payload } = response;
		switch (type) {
			case LocalStorageKey.WelcomeTutorial:
				try {
					this.usageType = this.selfSelectService.usageType;
					this.interests.forEach(item => {
						item.checked = this.selfSelectService.checkedArray && this.selfSelectService.checkedArray.includes(item.label);
					});
					let radioId = '';
					switch (this.usageType) {
						case this.segmentConst.Consumer:
							radioId = 'radioPersonal';
							break;
						case this.segmentConst.SMB:
							radioId = 'radioBusiness';
							break;
						case this.segmentConst.Commercial:
							radioId = 'radioProfessional';
							break;
					}
					if (radioId) {
						document.getElementById(radioId).click();
					}
				} catch (error) { }
				break;
			case SelfSelectEvent.SegmentChange:
				this.getSegment();
				break;
			case SelfSelectEvent.SegmentChange:
				this.getSegment();
				break;
			case SelfSelectEvent.SegmentChange:
				this.getSegment();
				break
			default:
				break;
		}
	}

	segmentChecked(current, expected) {
		return current && current === expected;
	}

	private getSelfSelectStatus() {
		this.selfSelectService.getConfig().then((result) => {
			this.usageType = result.usageType;
			this.interests = result.interests;
		});
		this.userSelectionChanged = false;
	}

	private getSegment() {
		if (this.localInfoService) {
			this.localInfoService.getLocalInfo().then((result) => {
				this.segmentTag = result.Segment;
			}).catch(() => {
				this.segmentTag = SegmentConst.Consumer;
			});
		}
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
		if (this.betaService) {
			this.toggleBetaProgram = this.betaService.getBetaStatus() === BetaStatus.On;
		}
	}
	private getDeviceStatisticsPreference() {
		if (this.metricsPreference) {
			this.metricsPreference.getAppMetricCollectionSetting('en', 'com.lenovo.LDI').then((response) => {
				if (response && response.app && response.app.metricCollectionState === 'On') {
					this.toggleDeviceStatistics = true;
					this.isToggleDeviceStatistics = true;
				} else if (response && response.app && response.app.metricCollectionState === 'Off') {
					this.toggleDeviceStatistics = false;
					this.isToggleDeviceStatistics = true;
				} else {
					this.isToggleDeviceStatistics = false;
				}
			}).catch((error) => {
				console.error('getAppMetricCollectionSetting failed for exception, will hide the device metric setting.', error);
				this.isToggleDeviceStatistics = false;
			});
		}
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
				this.loggerService.exception('PageSettingsComponent.getPreferenceSettingsValue exception', error);
			}
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
			}).catch(() => { });
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
			}).catch(() => { });
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
			}).catch(() => { });
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
			}).catch(() => { });
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

	onToggleOfBetaProgram(event: any) {
		this.toggleBetaProgram = event.switchValue;
		this.sendSettingMetrics('SettingBetaProgram', event.switchValue);
		this.betaService.setBetaStatus(this.toggleBetaProgram ? BetaStatus.On : BetaStatus.Off);
		this.commonService.sendReplayNotification(MenuItem.MenuBetaItemChange, this.toggleBetaProgram);
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
		this.usageType = value;
		this.selfSelectService.usageType = this.usageType;
		this.userSelectionChanged = this.selfSelectService.selectionChanged();
	}

	onInterestToggle($event, value) {
		if ($event.target.checked) {
			this.selfSelectService.checkedArray.push(value);
		} else {
			this.selfSelectService.checkedArray.splice(this.selfSelectService.checkedArray.indexOf(value), 1);
		}
		this.userSelectionChanged = this.selfSelectService.selectionChanged();
	}

	saveUserProfile() {
		this.selfSelectService.saveConfig();
		this.userSelectionChanged = this.selfSelectService.selectionChanged();
		const usageData = {
			ItemType: 'SettingUpdate',
			SettingName: 'UsageType',
			SettingValue: this.deviceService.isGaming ? 'Gaming' : this.selfSelectService.usageType,
			SettingParent: 'Page.Settings'
		};
		this.metrics.sendAsync(usageData);

		const interestMetricValue = {};
		this.selfSelectService.checkedArray.forEach(item => {
			interestMetricValue[item] = true;
		});
		const interestData = {
			ItemType: 'SettingUpdate',
			SettingName: 'Interest',
			SettingValue: interestMetricValue,
			SettingParent: 'Page.Settings'
		};
		this.metrics.sendAsync(interestData);
	}
}
