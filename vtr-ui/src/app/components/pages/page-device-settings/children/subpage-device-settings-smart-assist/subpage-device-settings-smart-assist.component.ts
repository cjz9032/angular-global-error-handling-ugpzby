import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { IntelligentSecurity } from 'src/app/data-models/intellegent-security.model';
import { ChangeContext } from 'ng5-slider';

@Component({
	selector: 'vtr-subpage-device-settings-smart-assist',
	templateUrl: './subpage-device-settings-smart-assist.component.html',
	styleUrls: ['./subpage-device-settings-smart-assist.component.scss']
})
export class SubpageDeviceSettingsSmartAssistComponent implements OnInit {

	// service call to fetch type of device
	public isThinkpad = false;

	public tooltipText = 'device.deviceSettings.smartAssist.intelligentSecurity.autoScreenLock.autoScreenLockTimer.toolTipContent';
	title = 'device.deviceSettings.smartAssist.title';
	public manualRefresh: EventEmitter<void> = new EventEmitter<void>();
	public humanPresenceDetecStatus = new FeatureStatus(false, true);
	public autoIrCameraLoginStatus = new FeatureStatus(false, true);
	public intelligentSecurityProperties: IntelligentSecurity;
	public autoScreenLockTimer = false;
	@Output() distanceChange: EventEmitter<ChangeContext> = new EventEmitter();

	headerMenuItems = [
		{
			title: 'device.deviceSettings.smartAssist.jumpTo.security',
			path: 'security'
		},
		{
			title: 'device.deviceSettings.smartAssist.jumpTo.screen',
			path: 'screen'
		},
		{
			title: 'device.deviceSettings.smartAssist.jumpTo.media',
			path: 'media'
		},
		{
			title: 'device.deviceSettings.smartAssist.jumpTo.voice',
			path: 'voice'
		}
	];

	constructor() { }

	ngOnInit() {
		console.log('subpage-device-setting-display onInit');
		this.getIntelligentSecurityProperties();
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
	public getIntelligentSecurityProperties() {
		// service call to fetch Intelligent Security Properties
		this.intelligentSecurityProperties = new IntelligentSecurity(true,10,true,true,"fast");
	}
	public onAutoScreenLockStatusToggle(event) {
		this.intelligentSecurityProperties.autoScreenLockTimer = event.value;
	}

	public setHumanDistance(event: ChangeContext) {
		console.log('Human Distance changed', event);
		this.intelligentSecurityProperties.humanDistance = event.value;
	}
}
