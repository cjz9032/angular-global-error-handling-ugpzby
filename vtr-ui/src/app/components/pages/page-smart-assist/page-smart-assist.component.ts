import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { ChangeContext } from 'ng5-slider';

import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { IntelligentSecurity } from 'src/app/data-models/intellegent-security.model';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { QaService } from 'src/app/services/qa/qa.service';

@Component({
	selector: 'vtr-page-smart-assist',
	templateUrl: './page-smart-assist.component.html',
	styleUrls: ['./page-smart-assist.component.scss']
})
export class PageSmartAssistComponent implements OnInit {

	title = 'Smart Assist';
	back = 'BACK';
	backarrow = '< ';
	parentPath = 'device';
	@Output() distanceChange: EventEmitter<ChangeContext> = new EventEmitter();
	public manualRefresh: EventEmitter<void> = new EventEmitter<void>();
	public isThinkPad = true;
	public tooltipText = 'device.smartAssist.intelligentSecurity.zeroTouchLock.autoScreenLockTimer.toolTipContent';
	// title = 'device.smartAssist.title';
	public humanPresenceDetectStatus = new FeatureStatus(false, true);
	public autoIrCameraLoginStatus = new FeatureStatus(false, true);
	public intelligentSecurity: IntelligentSecurity;
	public intelligentSecurityCopy: IntelligentSecurity;
	public autoScreenLockTimer = false;
	public zeroTouchLoginStatus = new FeatureStatus(false, true);
	public zeroTouchLockTitle: string;
	public options: any;
	public keepMyDisplay: boolean;

	headerMenuItems = [
		{
			title: 'device.smartAssist.jumpTo.security',
			path: 'security'
		},
		{
			title: 'device.smartAssist.jumpTo.screen',
			path: 'screen'
		},
		{
			title: 'device.smartAssist.jumpTo.media',
			path: 'media'
		},
		// enable this when UI is completed for that section
		// {
		// 	title: 'device.smartAssist.jumpTo.voice',
		// 	path: 'voice'
		// }
	];

	cardContentPositionA: any = {};

	constructor(
		private smartAssist: SmartAssistService,
		private deviceService: DeviceService,
		public qaService: QaService,
		private cmsService: CMSService,
		private logger: LoggerService,
		private commonService: CommonService
	) {
		if (this.smartAssist.isShellAvailable) {
			this.initSmartAssist();
		}
		this.fetchCMSArticles();
	}

	ngOnInit() {
		this.setIntelligentSecurity();
		const machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType);
		this.setIsThinkPad(machineType === 1);
	}

	private setIntelligentSecurity() {
		// service call to fetch Intelligent Security Properties
		// this.intelligentSecurity = new IntelligentSecurity(true, 1, true, true, '0', true, false, false, false);
		this.intelligentSecurity = new IntelligentSecurity();
		this.intelligentSecurity.isHPDEnabled = true;
		this.intelligentSecurity.zeroTouchLoginDistance = 1;
		this.intelligentSecurity.isZeroTouchLoginEnabled = true;
		this.intelligentSecurity.isZeroTouchLockEnabled = true;
		this.intelligentSecurity.autoScreenLockTimer = '0';
		this.intelligentSecurity.isZeroTouchLockVisible = true;
		this.intelligentSecurity.isZeroTouchLoginAdjustEnabled = false;
		this.intelligentSecurity.isZeroTouchLoginVisible = false;
		this.intelligentSecurity.isIntelligentSecuritySupported = false;
	}

	// invoke HPD related JS bridge calls
	private initSmartAssist() {
		Promise.all([
			this.smartAssist.getZeroTouchLockVisibility(),
			this.smartAssist.getZeroTouchLockStatus(),
			this.smartAssist.getSelectedLockTimer(),
			this.smartAssist.getZeroTouchLoginVisibility(),
			this.smartAssist.getZeroTouchLoginStatus(),
			this.smartAssist.getHPDStatus(),
			this.smartAssist.getHPDVisibilityInIdeaPad(),
			this.smartAssist.getZeroTouchLoginDistance(),
			this.smartAssist.getZeroTouchLoginAdjustVisibility(),
			this.smartAssist.getZeroTouchLoginAdjustStatus()
		]).then((responses: any[]) => {

			this.intelligentSecurity.isZeroTouchLockVisible = responses[0];
			this.intelligentSecurity.isZeroTouchLockEnabled = responses[1];
			this.intelligentSecurity.autoScreenLockTimer = responses[2].toString();
			this.intelligentSecurity.isZeroTouchLoginVisible = responses[3];
			this.intelligentSecurity.isZeroTouchLoginEnabled = responses[4];
			this.intelligentSecurity.isHPDEnabled = responses[5];
			this.intelligentSecurity.isIntelligentSecuritySupported = responses[6];
			this.intelligentSecurity.zeroTouchLoginDistance = responses[7];
			this.intelligentSecurity.isDistanceSensitivityVisible = responses[8];
			this.intelligentSecurity.isZeroTouchLoginAdjustEnabled = responses[9];
			console.log('initSmartAssist.Promise.all()', responses, this.intelligentSecurity);
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
		this.intelligentSecurity.isHPDEnabled = !this.intelligentSecurity.isHPDEnabled;
		if (!this.intelligentSecurity.isHPDEnabled) {
			this.intelligentSecurityCopy = { ...this.intelligentSecurity };
			this.intelligentSecurity.isZeroTouchLoginEnabled = false;
			this.intelligentSecurity.isZeroTouchLockEnabled = false;
			this.intelligentSecurity.isZeroTouchLoginAdjustEnabled = false;
		} else {
			this.intelligentSecurity.isZeroTouchLoginEnabled = this.intelligentSecurityCopy.isZeroTouchLoginEnabled;
			this.intelligentSecurity.isZeroTouchLockEnabled = this.intelligentSecurityCopy.isZeroTouchLockEnabled;
			this.intelligentSecurity.isZeroTouchLoginAdjustEnabled = this.intelligentSecurityCopy.isZeroTouchLoginAdjustEnabled;
		}
	}

	public onZeroTouchLoginStatusToggle(event: any) {
		this.intelligentSecurity.isZeroTouchLoginEnabled = event.switchValue;
		this.smartAssist.setZeroTouchLoginStatus(this.intelligentSecurity.isZeroTouchLoginEnabled)
			.then((isSuccess: boolean) => {
				console.log('onZeroTouchLoginStatusToggle.setZeroTouchLoginStatus', isSuccess, this.intelligentSecurity.isZeroTouchLoginEnabled);
			});
	}

	public setZeroTouchLoginSensitivity(event: ChangeContext) {
		console.log('setZeroTouchLoginSensitivity', event);
		this.intelligentSecurity.zeroTouchLoginDistance = event.value;
		this.smartAssist.setZeroTouchLoginDistance(event.value)
			.then((isSuccess: boolean) => {
				console.log('setZeroTouchLoginSensitivity.setSelectedLockTimer', isSuccess, event.value);
			});
	}

	// this is invoked when auto lock feature is toggled
	public onZeroTouchLockStatusToggle(event: any) {
		this.intelligentSecurity.isZeroTouchLockEnabled = event.switchValue;
		this.smartAssist.setZeroTouchLockStatus(this.intelligentSecurity.isZeroTouchLockEnabled)
			.then((isSuccess: boolean) => {
				console.log('onChangeZeroTouchLockFlag.setAutoLockStatus', isSuccess, this.intelligentSecurity.isZeroTouchLockEnabled);
			});
	}

	public onZeroTouchLockTimerChange(event: any, value: string) {
		this.intelligentSecurity.autoScreenLockTimer = value;
		this.smartAssist.setSelectedLockTimer(value)
			.then((isSuccess: boolean) => {
				console.log('onZeroTouchLockTimerChange.setSelectedLockTimer', isSuccess, value);
			});
	}

	public onDistanceSensitivityAdjustToggle(event: any) {
		this.intelligentSecurity.isZeroTouchLoginAdjustEnabled = event.switchValue;
		this.smartAssist.setZeroTouchLoginAdjustStatus(this.intelligentSecurity.isZeroTouchLoginAdjustEnabled)
			.then((isSuccess: boolean) => {
				console.log('onDistanceSensitivityAdjustToggle.setZeroTouchLoginAdjustStatus', isSuccess, this.intelligentSecurity.isZeroTouchLoginAdjustEnabled);
			});
	}



	private setIsThinkPad(isThinkPad) {
		// service call to fetch type of device
		this.isThinkPad = isThinkPad;
	}

	// public launchPowerAndSleep() {
	// 	this.deviceService.launchUri('ms-settings:powersleep');
	// }

	public launchFaceEnrollment() {
		this.deviceService.launchUri('ms-settings:signinoptions-launchfaceenrollment');
	}

	public displayDim(event) {
		this.keepMyDisplay = !this.keepMyDisplay;
	}

	hideMediaSetting($event) {
		this.headerMenuItems.splice(2, 1);
	}

	fetchCMSArticles() {
		const queryOptions = {
			'Page': 'device-settings',
			'Lang': 'EN',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'Lenovo'
		};

		this.cmsService.fetchCMSContent(queryOptions).then(
			(response: any) => {
				const cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];
				if (cardContentPositionA) {
					this.cardContentPositionA = cardContentPositionA;
					if (this.cardContentPositionA.BrandName) {
						this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
					}
				}
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}

	public onResetDefaultSettings($event) {
		this.smartAssist.resetHPDSetting()
			.then((isSuccess: boolean) => {
				console.log('onResetDefaultSettings.resetHPDSetting', isSuccess);
			});
	}
}
