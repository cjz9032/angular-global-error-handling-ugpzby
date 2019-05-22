import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { ChangeContext } from 'ng5-slider';

import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { IntelligentSecurity } from 'src/app/data-models/intellegent-security.model';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';

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
	public intelligentSecurityProperties: IntelligentSecurity;
	public autoScreenLockTimer = false;
	public distanceSensitivityTitle: string;

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
		private deviceService: DeviceService
	) { }

	ngOnInit() {
		console.log('subpage-device-setting-display onInit');
		this.setIntelligentSecurityProperties();
		this.setIsThinkpad();
	}

	public onCardCollapse(isCollapsed: boolean) {
		if (!isCollapsed) {
			this.manualRefresh.emit();
		}
	}

	public onHumanPresenceDetectStatusToggle($event) {
		this.intelligentSecurityProperties.humanPresenceDetectionFlag = !this.intelligentSecurityProperties.humanPresenceDetectionFlag;
		if (!this.intelligentSecurityProperties.humanPresenceDetectionFlag) {
			this.intelligentSecurityProperties.autoIRLoginFlag = false;
			this.intelligentSecurityProperties.autoScreenLockFlag = false;
		}
	}

	public onAutoIRCameraLoginStatusToggle($event) {
		this.intelligentSecurityProperties.autoIRLoginFlag = !this.intelligentSecurityProperties.autoIRLoginFlag;
	}

	public onChangeAutoScreenLockFlag($event) {
		this.intelligentSecurityProperties.autoScreenLockFlag = !this.intelligentSecurityProperties.autoScreenLockFlag;
	}
	public setIntelligentSecurityProperties() {
		// service call to fetch Intelligent Security Properties
		this.intelligentSecurityProperties = new IntelligentSecurity(true, 10, true, true, 'fast');
	}
	public onAutoScreenLockStatusToggle(event) {
		this.intelligentSecurityProperties.autoScreenLockTimer = event.value;
	}

	public setHumanDistance(event: ChangeContext) {
		console.log('Human Distance changed', event);
		this.intelligentSecurityProperties.humanDistance = event.value;
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
