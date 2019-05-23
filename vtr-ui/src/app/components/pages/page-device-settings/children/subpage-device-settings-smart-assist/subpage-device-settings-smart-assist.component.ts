import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { IntelligentSecurity } from 'src/app/data-models/intellegent-security.model';
import { ChangeContext } from 'ng5-slider';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-subpage-device-settings-smart-assist',
	templateUrl: './subpage-device-settings-smart-assist.component.html',
	styleUrls: ['./subpage-device-settings-smart-assist.component.scss']
})
export class SubpageDeviceSettingsSmartAssistComponent implements OnInit {

	public isThinkpad = false;
	public tooltipText = 'device.deviceSettings.smartAssist.intelligentSecurity.zeroTouchLock.autoScreenLockTimer.toolTipContent';
	title = 'device.deviceSettings.smartAssist.title';
	public manualRefresh: EventEmitter<void> = new EventEmitter<void>();
	public humanPresenceDetecStatus = new FeatureStatus(false, true);
	public zeroTouchLoginStatus = new FeatureStatus(false, true);
	public intelligentSecurity: IntelligentSecurity;
	public intelligentSecurityCopy: IntelligentSecurity;
	public autoScreenLockTimer = false;
	public distanceSensitivityTitle: string;
	public zeroTouchLockTitle: string;
	@Output() distanceChange: EventEmitter<ChangeContext> = new EventEmitter();
	public autoScreenLockStatus: boolean[];
	public options: any;

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

	constructor(public translate: TranslateService) { }
	ngOnInit() {
		console.log('subpage-device-setting-display onInit');
		this.autoScreenLockStatus  = [false, false, false];
		this.setintelligentSecurity();
		this.setIsThinkpad();
	}

	public onCardCollapse(isCollapsed: boolean) {
		if (!isCollapsed) {
			this.manualRefresh.emit();
		}
	}

	public onHumanPresenceDetectStatusToggle($event) {
		this.intelligentSecurity.humanPresenceDetectionFlag = !this.intelligentSecurity.humanPresenceDetectionFlag;
		debugger;
		if (!this.intelligentSecurity.humanPresenceDetectionFlag) {
			this.intelligentSecurityCopy = {...this.intelligentSecurity};
			this.intelligentSecurity.zeroTouchLoginFlag = false;
			this.intelligentSecurity.zeroTouchLockFlag = false;
			this.intelligentSecurity.distanceSensitivityFlag = false;
		}
		else {
			this.intelligentSecurity.zeroTouchLoginFlag = this.intelligentSecurityCopy.zeroTouchLoginFlag;
			this.intelligentSecurity.zeroTouchLockFlag = this.intelligentSecurityCopy.zeroTouchLockFlag;
			this.intelligentSecurity.distanceSensitivityFlag = this.intelligentSecurityCopy.distanceSensitivityFlag;
		}
	}

	public onzeroTouchLoginStatusToggle($event) {
		this.intelligentSecurity.zeroTouchLoginFlag = !this.intelligentSecurity.zeroTouchLoginFlag;
	}

	public onChangezeroTouchLockFlag($event) {
		this.intelligentSecurity.zeroTouchLockFlag = !this.intelligentSecurity.zeroTouchLockFlag;
	}
	public setintelligentSecurity() {
		// service call to fetch Intelligent Security Properties
		this.intelligentSecurity = new IntelligentSecurity(true,true,10,true,true,1);
		this.autoScreenLockStatus[this.intelligentSecurity.autoScreenLockTimer] = true;
	}
	public onAutoScreenLockStatusToggle(event, value) {
		console.log(value);
		this.intelligentSecurity.autoScreenLockTimer = value;
	}
	distanceSensitivityStatusToggle(event: ChangeContext) {
		this.intelligentSecurity.distanceSensitivityFlag = !this.intelligentSecurity.distanceSensitivityFlag;
	}

	public setHumanDistance(event: ChangeContext) {
		console.log('Human Distance changed', event);
		this.intelligentSecurity.humanDistance = event.value;
	}
	public setIsThinkpad() {
		// service call to fetch type of device
		this.isThinkpad = false;
		this.distanceSensitivityTitle = this.isThinkpad ? 'device.deviceSettings.smartAssist.intelligentSecurity.distanceSensitivityAdjusting.title1' :
					'device.deviceSettings.smartAssist.intelligentSecurity.distanceSensitivityAdjusting.title2';
		this.zeroTouchLockTitle = this.isThinkpad? 'device.deviceSettings.smartAssist.intelligentSecurity.zeroTouchLock.title2' :
					'device.deviceSettings.smartAssist.intelligentSecurity.zeroTouchLock.title1';
	}
}