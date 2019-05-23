import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { ChangeContext } from 'ng5-slider';

import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { IntelligentSecurity } from 'src/app/data-models/intellegent-security.model';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
	selector: 'vtr-subpage-device-settings-smart-assist',
	templateUrl: './subpage-device-settings-smart-assist.component.html',
	styleUrls: ['./subpage-device-settings-smart-assist.component.scss']
})
export class SubpageDeviceSettingsSmartAssistComponent implements OnInit {

	@Output() distanceChange: EventEmitter<ChangeContext> = new EventEmitter();
	public manualRefresh: EventEmitter<void> = new EventEmitter<void>();
	public isThinkPad = false;
	public tooltipText = 'device.deviceSettings.smartAssist.intelligentSecurity.autoScreenLock.autoScreenLockTimer.toolTipContent';
	title = 'device.deviceSettings.smartAssist.title';
	public humanPresenceDetectStatus = new FeatureStatus(false, true);
	public autoIrCameraLoginStatus = new FeatureStatus(false, true);
	public intelligentSecurity: IntelligentSecurity;
	public autoScreenLockTimer = false;
	public distanceSensitivityTitle: string;
	public zeroTouchLoginStatus = new FeatureStatus(false, true);
	public autoScreenLockStatus: boolean[];

	headerMenuItems = [
		{
			title: 'device.deviceSettings.smartAssist.jumpTo.security',
			path: 'security'
		},
		// enable this when UI is completed for that section
		// {
		// 	title: 'device.deviceSettings.smartAssist.jumpTo.screen',
		// 	path: 'screen'
		// },
		// {
		// 	title: 'device.deviceSettings.smartAssist.jumpTo.media',
		// 	path: 'media'
		// },
		// {
		// 	title: 'device.deviceSettings.smartAssist.jumpTo.voice',
		// 	path: 'voice'
		// }
	];

	constructor(
		private smartAssist: SmartAssistService,
		private deviceService: DeviceService,
		private logger: LoggerService
	) {
		if (this.smartAssist.isShellAvailable) {
			this.initSmartAssist();
		}
	}

	ngOnInit() {
		console.log('subpage-device-setting-display onInit');
		this.autoScreenLockStatus = [false, false, false];
		this.setintelligentSecurity();
		this.setIsThinkpad();
	}

	// invoke HPD related JS bridge calls
	private initSmartAssist() {
		Promise.all([
			this.smartAssist.getAutoLockVisibility,
			this.smartAssist.getAutoLockStatus,
			this.smartAssist.getSelectedLockTimer
		]).then((responses: any[]) => {

			// this.intelligentSecurity.isAutoScreenLockChecked = responses[1];
			console.log('initSmartAssist.Promise.all()', responses);
		}).catch(error => {
			this.logger.error('error in initSmartAssist.Promise.all()', error);
		});
	}

	public onCardCollapse(isCollapsed: boolean) {
		if (!isCollapsed) {
			this.manualRefresh.emit();
		}
	}

	public onHumanPresenceDetectStatusToggle($event) {
		this.intelligentSecurity.humanPresenceDetectionFlag = !this.intelligentSecurity.humanPresenceDetectionFlag;
		if (!this.intelligentSecurity.humanPresenceDetectionFlag) {
			this.intelligentSecurity.zeroTouchLockFlag = false;
			this.intelligentSecurity.zeroTouchLoginFlag = false;
		}
	}

	public onAutoIRCameraLoginStatusToggle($event) {
		this.intelligentSecurity.zeroTouchLockFlag = !this.intelligentSecurity.zeroTouchLockFlag;
	}

	public onChangeAutoScreenLockFlag($event) {
		this.intelligentSecurity.zeroTouchLockFlag = !this.intelligentSecurity.zeroTouchLockFlag;
		this.smartAssist.setAutoLockStatus(this.intelligentSecurity.zeroTouchLockFlag)
			.then((isSuccess: boolean) => {

			});
	}

	public onzeroTouchLoginStatusToggle($event) {
		this.intelligentSecurity.zeroTouchLoginFlag = !this.intelligentSecurity.zeroTouchLoginFlag;
	}

	public onChangezeroTouchLockFlag($event) {
		this.intelligentSecurity.zeroTouchLockFlag = !this.intelligentSecurity.zeroTouchLockFlag;
	}
	public setintelligentSecurity() {
		// service call to fetch Intelligent Security Properties
		this.intelligentSecurity = new IntelligentSecurity(true, 10, true, true, 1);
		this.autoScreenLockStatus[this.intelligentSecurity.autoScreenLockTimer] = true;
	}
	public onAutoScreenLockStatusToggle(event, value) {
		this.intelligentSecurity.autoScreenLockTimer = event.value;
		this.intelligentSecurity.zeroTouchLoginFlag = false;
		this.intelligentSecurity.zeroTouchLockFlag = false;
		this.smartAssist.setSelectedLockTimer(event.value.toString())
			.then((isSuccess: boolean) => {

			});
	}

	public setHumanDistance(event: ChangeContext) {
		console.log('Human Distance changed', event);
		this.intelligentSecurity.humanDistance = event.value;
	}
	public setIsThinkpad() {
		// service call to fetch type of device
		this.isThinkPad = true;
		this.distanceSensitivityTitle = this.isThinkPad ? 'device.deviceSettings.smartAssist.intelligentSecurity.distanceSensitivityAdjusting.title1' :
			'device.deviceSettings.smartAssist.intelligentSecurity.distanceSensitivityAdjusting.title2';
	}

	public launchPowerAndSleep() {
		this.deviceService.launchUri('ms-settings:powersleep');
	}

	public launchFaceEnrollment() {
		this.deviceService.launchUri('ms-settings:signinoptions-launchfaceenrollment');
	}
}
