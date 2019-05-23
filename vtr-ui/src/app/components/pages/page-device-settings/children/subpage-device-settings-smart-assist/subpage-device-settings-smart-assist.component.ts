import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { ChangeContext } from 'ng5-slider';

import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { IntelligentSecurity } from 'src/app/data-models/intellegent-security.model';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { TranslateService } from '@ngx-translate/core';

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
	public intelligentSecurityCopy: IntelligentSecurity;
	public autoScreenLockTimer = false;
	public distanceSensitivityTitle: string;
	public zeroTouchLoginStatus = new FeatureStatus(false, true);
	public zeroTouchLockTitle: string;
	public autoScreenLockStatus: boolean[];
	public options: any;

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
		private logger: LoggerService,
		public translate: TranslateService
	) {
		if (this.smartAssist.isShellAvailable) {
			this.initSmartAssist();
		}
	}

	ngOnInit() {
		this.autoScreenLockStatus = [false, false, false];
		this.setIntelligentSecurity();
		this.setIsThinkPad();
	}

	// invoke HPD related JS bridge calls
	private initSmartAssist() {
		Promise.all([
			this.smartAssist.getAutoLockVisibility(),
			this.smartAssist.getAutoLockStatus(),
			this.smartAssist.getSelectedLockTimer()
		]).then((responses: any[]) => {

			this.intelligentSecurity.isZeroTouchLockVisible = responses[0];
			this.intelligentSecurity.zeroTouchLockFlag = responses[1];
			this.intelligentSecurity.autoScreenLockTimer = responses[2].toString();
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
			this.intelligentSecurityCopy = { ...this.intelligentSecurity };
			this.intelligentSecurity.zeroTouchLoginFlag = false;
			this.intelligentSecurity.zeroTouchLockFlag = false;
			this.intelligentSecurity.distanceSensitivityFlag = false;
		} else {
			this.intelligentSecurity.zeroTouchLoginFlag = this.intelligentSecurityCopy.zeroTouchLoginFlag;
			this.intelligentSecurity.zeroTouchLockFlag = this.intelligentSecurityCopy.zeroTouchLockFlag;
			this.intelligentSecurity.distanceSensitivityFlag = this.intelligentSecurityCopy.distanceSensitivityFlag;
		}
	}

	public onAutoIRCameraLoginStatusToggle($event) {
		this.intelligentSecurity.zeroTouchLockFlag = !this.intelligentSecurity.zeroTouchLockFlag;
	}

	public onZeroTouchLoginStatusToggle($event) {
		this.intelligentSecurity.zeroTouchLoginFlag = !this.intelligentSecurity.zeroTouchLoginFlag;
	}

	// this is invoked when auto lock feature is toggled
	public onChangeZeroTouchLockFlag($event) {
		this.intelligentSecurity.zeroTouchLockFlag = !this.intelligentSecurity.zeroTouchLockFlag;
		this.smartAssist.setAutoLockStatus(this.intelligentSecurity.zeroTouchLockFlag)
			.then((isSuccess: boolean) => {
				console.log('onChangeZeroTouchLockFlag.setAutoLockStatus', isSuccess);
			});
	}
	public setIntelligentSecurity() {
		// service call to fetch Intelligent Security Properties
		this.intelligentSecurity = new IntelligentSecurity(true, 10, true, true, 1, false, false);
		this.autoScreenLockStatus[this.intelligentSecurity.autoScreenLockTimer] = true;
	}
	public onAutoScreenLockStatusToggle(event, value) {
		this.intelligentSecurity.autoScreenLockTimer = value;
		this.intelligentSecurity.zeroTouchLoginFlag = false;
		this.intelligentSecurity.zeroTouchLockFlag = false;
		this.smartAssist.setSelectedLockTimer(value)
			.then((isSuccess: boolean) => {
				console.log('onAutoScreenLockStatusToggle.setSelectedLockTimer', isSuccess);
			});
	}
	distanceSensitivityStatusToggle(event: ChangeContext) {
		this.intelligentSecurity.distanceSensitivityFlag = !this.intelligentSecurity.distanceSensitivityFlag;
	}

	public setHumanDistance(event: ChangeContext) {
		console.log('Human Distance changed', event);
		this.intelligentSecurity.humanDistance = event.value;
	}
	public setIsThinkPad() {
		// service call to fetch type of device
		this.isThinkPad = false;
		this.distanceSensitivityTitle = this.isThinkPad ? 'device.deviceSettings.smartAssist.intelligentSecurity.distanceSensitivityAdjusting.title1' :
			'device.deviceSettings.smartAssist.intelligentSecurity.distanceSensitivityAdjusting.title2';
		this.zeroTouchLockTitle = this.isThinkPad ? 'device.deviceSettings.smartAssist.intelligentSecurity.zeroTouchLock.title2' :
			'device.deviceSettings.smartAssist.intelligentSecurity.zeroTouchLock.title1';
	}

	public launchPowerAndSleep() {
		this.deviceService.launchUri('ms-settings:powersleep');
	}

	public launchFaceEnrollment() {
		this.deviceService.launchUri('ms-settings:signinoptions-launchfaceenrollment');
	}
}
