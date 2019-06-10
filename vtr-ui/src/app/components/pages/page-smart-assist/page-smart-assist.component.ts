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
	public autoScreenLockStatus: boolean[];
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
	isDesktopMachine = true;

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
		this.isDesktopMachine = this.commonService.getLocalStorageValue(LocalStorageKey.DesktopMachine);
		this.autoScreenLockStatus = [false, false, false];
		this.setIntelligentSecurity();
		const machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType);
		this.setIsThinkPad(machineType === 1);
	}

	// invoke HPD related JS bridge calls
	private initSmartAssist() {
		Promise.all([
			this.smartAssist.getAutoLockVisibility(),
			this.smartAssist.getAutoLockStatus(),
			this.smartAssist.getSelectedLockTimer(),
			this.smartAssist.getAutoLockVisibility(),
			this.smartAssist.getAutoLockStatus(),
			this.smartAssist.getHPDStatus(),
			this.smartAssist.getHPDVisibility()
		]).then((responses: any[]) => {

			this.intelligentSecurity.isZeroTouchLockVisible = responses[0];
			this.intelligentSecurity.zeroTouchLockFlag = responses[1];
			this.intelligentSecurity.autoScreenLockTimer = responses[2].toString();
			this.intelligentSecurity.isZeroTouchLoginVisible = responses[3];
			this.intelligentSecurity.zeroTouchLoginFlag = responses[4];
			this.intelligentSecurity.humanPresenceDetectionFlag = responses[5];
			this.intelligentSecurity.isIntelligentSecuritySupported = responses[6];

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

	public onZeroTouchLoginStatusToggle($event) {
		this.intelligentSecurity.zeroTouchLoginFlag = !this.intelligentSecurity.zeroTouchLoginFlag;
		const option = this.intelligentSecurity.zeroTouchLoginFlag ? 'True' : 'False';
		this.smartAssist.setZeroTouchLoginStatus(option)
			.then((isSuccess: boolean) => {
				console.log('onZeroTouchLoginStatusToggle.setZeroTouchLoginStatus', isSuccess, this.intelligentSecurity.zeroTouchLockFlag);
			});
	}

	// this is invoked when auto lock feature is toggled
	public onChangeZeroTouchLockFlag($event) {
		this.intelligentSecurity.zeroTouchLockFlag = !this.intelligentSecurity.zeroTouchLockFlag;
		const option = this.intelligentSecurity.zeroTouchLockFlag ? 'True' : 'False';
		this.smartAssist.setAutoLockStatus(option)
			.then((isSuccess: boolean) => {
				console.log('onChangeZeroTouchLockFlag.setAutoLockStatus', isSuccess, this.intelligentSecurity.zeroTouchLockFlag);
			});
	}

	public setIntelligentSecurity() {
		// service call to fetch Intelligent Security Properties
		this.intelligentSecurity = new IntelligentSecurity(true, 1, true, true, '0', true, false, false, false);
		this.autoScreenLockStatus[this.intelligentSecurity.autoScreenLockTimer] = true;
	}

	public onAutoScreenLockStatusToggle(event: any, value: string) {
		this.intelligentSecurity.autoScreenLockTimer = value;
		this.smartAssist.setSelectedLockTimer(value)
			.then((isSuccess: boolean) => {
				console.log('onAutoScreenLockStatusToggle.setSelectedLockTimer', isSuccess, value);
			});
	}

	public distanceSensitivityStatusToggle(event: ChangeContext) {
		this.intelligentSecurity.distanceSensitivityFlag = !this.intelligentSecurity.distanceSensitivityFlag;
	}

	public setZeroTouchLoginSensitivity(event: ChangeContext) {
		console.log('Human Distance changed', event);
		this.intelligentSecurity.zeroTouchLoginSensitivity = event.value;
		const option = event.value.toString();
		this.smartAssist.setSelectedLockTimer(option)
			.then((isSuccess: boolean) => {
				console.log('onAutoScreenLockStatusToggle.setSelectedLockTimer', isSuccess, option);
			});
	}

	public setIsThinkPad(isThinkPad) {
		// service call to fetch type of device
		this.isThinkPad = isThinkPad;
	}

	public launchPowerAndSleep() {
		this.deviceService.launchUri('ms-settings:powersleep');
	}

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
