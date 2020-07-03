import {
	Component,
	OnInit
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import CommonMetricsModel from 'src/app/data-models/common/common-metrics.model';
import { CommonMetricsService } from 'src/app/services/common-metrics/common-metrics.service';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { DropDownInterval } from '../../../../data-models/common/drop-down-interval.model';




@Component({
	selector: 'vtr-active-protection-system',
	templateUrl: './active-protection-system.component.html',
	styleUrls: ['./active-protection-system.component.scss']
})
export class ActiveProtectionSystemComponent implements OnInit {
	advancedToggle: boolean; // for advanced section toggle
	advanceAvailable: boolean; // show / hide advanced section
	apsStatus: boolean;
	apsSensitivity: number;
	repeatShock: boolean;
	manualSnooze: boolean;
	manualSnoozeTime: number;
	selectedSnoozeTime: number;
	penCapability: boolean;
	touchCapability: boolean;
	pSensorCapability: boolean;
	public intervals: DropDownInterval[];
	advanceSettingsHideId = 'activeProtectionSystem_advanced_settings_toggle_hide';
	advanceSettingsShowId = 'activeProtectionSystem_advanced_settings_toggle_show';
	advanceSettings = 'activeProtectionSystem_advanced_advanced_settings';
	advanceSettingsCaption = 'activeProtectionSystem-advanced-settings-desc';
	timeOut = 100;
	public metricsParent = CommonMetricsModel.ParentDeviceSettings;
	// public taskBarDimmerValue: number;

	constructor(
		private smartAssist: SmartAssistService
		, private translate: TranslateService
		, private commonMetricsService: CommonMetricsService) { }


	private populateIntervals() {
		const seconds = this.translate.instant('device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.seconds'); // 'seconds';
		const minute = this.translate.instant('device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.minute'); // 'minute';
		const minutes = this.translate.instant('device.deviceSettings.displayCamera.display.oledPowerSettings.dropDown.minutes');  // 'minutes';

		this.intervals = [{
			name: '30',
			value: 0.5,
			placeholder: seconds,
			text: `30 ${seconds}`,
			metricsValue: `30 seconds`
		},
		{
			name: '1',
			value: 1,
			placeholder: minute,
			text: `1 ${minute}`,
			metricsValue: `1 minute`
		},
		{
			name: '2',
			value: 2,
			placeholder: minutes,
			text: `2 ${minutes}`,
			metricsValue: `2 minutes`
		},
		{
			name: '3',
			value: 3,
			placeholder: minutes,
			text: `3 ${minutes}`,
			metricsValue: `3 minutes`
		}
		];
	}

	focusElement(elementId) {
		setTimeout(() => {
			const focusElement = document.getElementById(`${elementId}`) as HTMLElement;
			if (focusElement) {
				focusElement.focus()
			}
		}, this.timeOut);
	}

	toggleAdvanced($event: Event) {

		this.advancedToggle = !this.advancedToggle;
		// if ($event.type === 'click') {
		if (this.advancedToggle) {
			this.focusElement(this.advanceSettings);

		}

		if (!this.advancedToggle) {
			this.focusElement(this.advanceSettingsShowId);

		}

		// }

	}

	ngOnInit() {
		this.advancedToggle = false;
		this.populateIntervals();
		this.initAPS(); // get Default or set APS values
		this.checkAdvance(); // checking advanced features
	}
	initAPS() {
		this.smartAssist
			.getAPSMode()
			.then(res => {
				res ? this.apsStatus = true : this.apsStatus = false;
				// console.log('APS IS SET---------------------------------', res);
				this.smartAssist
					.getAPSSensitivityLevel()
					.then(sensitivityLevel => {
						switch (sensitivityLevel) {
							case 0: {
								this.apsSensitivity = 100;
								break;
							}
							case 1: {
								this.apsSensitivity = 50;
								break;
							}
							case 2: {
								this.apsSensitivity = 0;
								break;
							}
						}
					});
				this.smartAssist
					.getAutoDisableSetting()
					.then(autoDisableSetting => {
						this.repeatShock = autoDisableSetting;
					});
				this.smartAssist
					.getSnoozeSetting()
					.then(snoozeSetting => {
						this.manualSnooze = snoozeSetting;
						this.smartAssist
							.getSnoozeTime()
							.then(snoozeTime => {
								this.selectedSnoozeTime = this.manualSnoozeTime = +(snoozeTime);
							});
					});
			})
			.catch(err => { });
	}
	// APS Advanced
	checkAdvance() {
		Promise
			.all([this.smartAssist.getPenCapability(), this.smartAssist.getTouchCapability(), this.smartAssist.getPSensorCapability()])
			.then((res: any[]) => {
				// console.log('APS Advanced Status --------------------------------- ', res);
				(res[0] || res[1] || res[2]) ? this.advanceAvailable = true : this.advanceAvailable = false;
				res[0] ? this.penCapability = true : this.penCapability = false;
				res[1] ? this.touchCapability = true : this.touchCapability = false;
				res[2] ? this.pSensorCapability = true : this.pSensorCapability = false;
			})
			.catch(error => { });
	}

	// APS FUNCTIONS
	setAPSMode(event = null) {
		const value = !this.apsStatus;
		this.apsStatus = !this.apsStatus;
		this.smartAssist
			.setAPSMode(value)
			.then(res => { });

		// send metrics
		this.commonMetricsService.sendMetrics(value, 'activeProtectionSystem', CommonMetricsModel.ParentDeviceSettings);
	}

	setAPSSensitivityLevel($event: number) {
		this.apsSensitivity = $event
		let value: number;
		switch ($event) {
			case 0: {
				value = 2;
				break;
			}
			case 50: {
				value = 1;
				break;
			}
			case 100: {
				value = 0;
				break;
			}
		}
		this.smartAssist
			.setAPSSensitivityLevel(value)
			.then(res => { });
	}

	setAutoDisableSetting(event) {
		this.repeatShock = event
		this.smartAssist
			.setAutoDisableSetting(event)
			.then(res => { });
		this.commonMetricsService.sendMetrics(event, 'cb.aps-auto-disable', CommonMetricsModel.ParentDeviceSettings);
	}

	setSnoozeSetting(event) {
		const value = !this.manualSnooze;
		this.manualSnooze = !this.manualSnooze;
		this.smartAssist
			.setSnoozeSetting(value)
			.then(res => {
				this.smartAssist
					.getSnoozeTime()
					.then(time => {
						this.manualSnoozeTime = +(time);
					});
			});

		this.commonMetricsService.sendMetrics(value, 'cb.aps-manual-override', CommonMetricsModel.ParentDeviceSettings);
	}

	setSnoozeTime(event: DropDownInterval) {
		this.selectedSnoozeTime = event.value;
		this.smartAssist
			.setSnoozeTime(event.value.toString())
			.then(res => {
				this.smartAssist
					.getSnoozeTime()
					.then(time => {
						this.manualSnoozeTime = +(time);
					});
			});
	}

	suspendNow() {
		let timeInSec;
		switch (this.selectedSnoozeTime) {
			case 0.5:
				timeInSec = '30';
				break;
			case 1:
				timeInSec = '60';
				break;
			case 2:
				timeInSec = '120';
				break;
			case 3:
				timeInSec = '180';
				break;
		}
		this.smartAssist
			.sendSnoozeCommand(timeInSec)
			.then(res => { });
	}

	// Advanced APS Functions

}
